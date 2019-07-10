"use strict"
/**
 * 运行流程：
 * 首先ClientA和ClientB均通过双向通信方式如WebSocket连接到Signaling Server上；
 * ClientA在本地首先通GetMedia访问本地的media接口和数据，并创建PeerConnection对象，调用其AddStream方法把本地的Media添加到PeerConnection对象中。对于ClientA而言，既可以在与Signaling Server建立连接之前就创建并初始化PeerConnection，也可以在建立Signaling Server连接之后创建并初始化PeerConnection；ClientB既可以在上图的1阶段也可以在2阶段做同样的事情，访问自己的本地接口并创建自己的PeerConnection对象。
 * 通信由ClientA发起，所以ClientA调用PeerConnection的CreateOffer接口创建自己的SDP offer，然后把这个SDP Offer信息通过Signaling Server通道中转发给ClientB；
 * ClientB收到Signaling Server中转过来的ClientA的SDP信息也就是offer后，调用CreateAnswer创建自己的SDP信息也就是answer，然后把这个answer同样通过Signaling server转发给ClientA；
 * ClientA收到转发的answer消息以后，两个peers就做好了建立连接并获取对方media streaming的准备；
 * ClientA通过自己PeerConnection创建时传递的参数等待来自于ICE server的通信，获取自己的candidate，当candidate available的时候会自动回掉PeerConnection的OnIceCandidate；
 * ClientA通过Signling Server发送自己的Candidate给ClientB，ClientB依据同样的逻辑把自己的Candidate通过Signaling Server中转发给ClientA；
 * 至此ClientA和ClientB均已经接收到对方的Candidate，通过PeerConnection建立连接。至此P2P通道建立。	
 * 
 */
/*****************************定义事件处理器类 开始*****************************/
class EventEmitter {
	events: any;
	constructor(){
		this.events = {};
	}
	// 绑定事件函数
	on(eventName: string, callback: any){
		this.events[eventName] = this.events[eventName] || [];
		// 将事件添加到对应事件名的事件函数列表里
		this.events[eventName].push(callback);
	}
	// 触发事件函数
	emit(eventName: string, ...args: any[]){
		let events: any[] = this.events[eventName];
		if(!events){
			return;
		}
		// 触发事件名对应的所有事件函数
		for(let i = 0; i < events.length; i++){
			events[i].apply(null, args);
		}
	}
}
/*****************************定义事件处理器类 结束*****************************/

// RTC相关环境
// 兼容浏览器的PeerConnection写法
let PeerConnection = (window.PeerConnection || window.RTCPeerConnection || window.webkitPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);

// 兼容浏览器的getUserMedia写法
let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
let nativeRTCIceCandidate = (window.RTCIceCandidate || window.mozRTCIceCandidate);
// order is very important: "RTCSessionDescription" defined in Nighly but useless
let nativeRTCSessionDescription = (window.RTCSessionDescription || window.mozRTCSessionDescription); 
// this.moz = !!navigator.mozGetUserMedia;
let iceServer = {
    "iceServers": [{
        // "url": "stun:stun.l.google.com:19302"	// url已弃用，改为urls
        // "urls": "stun:stun.freeswitch.org"  // 这个地址失效了
		"urls": ["stun:stun.l.google.com:19302"]
        // "urls": ["stun:stun.xten.com"]
        // "urls": ["stun:stun.ekiga.net"]
        // "urls": ["stun:stun.ideasip.com"]
    },{
    	"urls": "turn:192.168.152.128:3478",
    	"username": 'test',
    	"credential": 'test'
    }]
};
// this.packetSize = 1000;

if(!!navigator.mediaDevices.getUserMedia){
	getUserMedia = "NMG"; // => navigator.mediaDevices.getUserMedia
}

/*****************************定义RTC类 开始***********************************/
// 继承事件处理器，提供事件绑定和触发功能
class myRTC extends EventEmitter {
	// 本地media stream
	localMediaStream = null;
	//本地WebSocket连接
    socket: any = null;
    // 所在房间
    room: string = "";
    // 所有与本地相连的socket的ID
    connections: string[] = null;
    // 本地的socket的ID，由服务器创建
    me: string = null;
    //初始时需要构建链接的数目
    numStreams: number = 0;
    //初始时已经连接的数目
    initializedStreams: number = 0;
    //保存所有与本地相连的peer connection， 键为socket id，值为PeerConnection类型
    peerConnections: any = {};
    //保存所有的data channel，键为socket id，值通过PeerConnection实例的createChannel创建
    dataChannels:any = {};

	// 构建函数
	constructor(){
		// 构建父类
		super();
	}

	/****************************流处理部分**************************/

	/**
	 * 创建本地流
	 * @param {any}    options      [音频，视频选项]
	 * @param {string} eventSuccess [成功事件]
	 * @param {string} eventFailed  [失败事件]
	 */
	createLocalStream(options: any, eventSuccess: string, eventFailed?: string){
		options.video = !!options.video;
        options.audio = !!options.audio;
       
        if(getUserMedia == "NMG"){
        	// 需构建Stream++
        	this.numStreams++;
        	// this.gerUserMedia(options)  // 'getUserMedia' called on an object that does not implement interface MediaDevices.
        	navigator.mediaDevices.getUserMedia(options)
        	.then((stream) => {
        		this.localMediaStream = stream;
        		// 已构建Stream++
        		this.initializedStreams++;
        		this.emit(eventSuccess, stream);
        		// 需构建链接数目 === 已链接数目  准备完成
        		if(this.initializedStreams === this.numStreams){
        			// 触发ready事件
        			this.emit("ready");
        		}
        	})
        	.catch((err) => {
        		console.log(err);
        		this.emit(eventFailed, err);
        	})
        }else if(getUserMedia){
        	this.numStreams++;
        	getUserMedia.call(navigator, options, 
        		// 创建本地流成功
        		(stream) => {
        			this.localMediaStream = stream;
        			this.initializedStreams++;
        			this.emit(eventSuccess, stream);
        			if(this.initializedStreams === this.numStreams){
	        			// 触发ready事件
	        			this.emit("ready");
	        		}
        		},
        		(err) => {
        			this.emit(eventFailed, err);
        		}
        	)
        }else{
        	alert('WebRTC is not yet supported in this browser.');
        }
	}
	/**
	 * 将流绑定到指定的video标签上
	 * @param {any}    stream [流]
	 * @param {string} domId  [元素ID]
	 */
	attachStream(stream: any, domId: string){
		let ele = document.getElementById(domId);
		if(!!ele && ele.nodeName == "VIDEO"){
			if(ele.srcObject == null){
		        ele.srcObject = stream;
		    }else{
		        // 这个方法正在被废弃，能不用就不用
		      	ele.src = this.URL.createObjectURL(stream);
		    }
		    ele.play();
		    console.log("正在播放来自"+ domId +"的视频" + stream);
		}else{
			alert("attache stream failed!");
			console.log("Attache Stream Failed: Can't find element or element is not video");
		}
	}
	/**
	 * 将本地流添加到所有的PeerConnection实例中
	 */
	addStreams(){
		for(let connection in this.peerConnections){
			let pc = this.peerConnections[connection];
			// addStream方法好像要被废弃了，等会再想办法
			// this.peerConnections[connection].addStream(this.localMediaStream);
			if(typeof pc.addTrack == "function"){
            	this.localMediaStream.getTracks().forEach(track => {
            		// 暂时怀疑是stream没有传过去
	            	pc.addTrack(track, this.localMediaStream);
	            	console.log("stream1:" + this.localMediaStream);
	            })
            }else{
            	pc.addStream(this.localMediaStream);
            }
		}
	}

	/****************************服务器链接部分***********************/

	/**
	 * 本地链接信道
	 * 信道为websocket
	 * @param {string} serverUrl [服务器地址]
	 * @param {string} room      [房间号]
	 */
	connect(serverUrl: string, room: string){
		let socket;
		// 创建socket
		socket = this.socket = new WebSocket(serverUrl);
		// websocket打开
		socket.onopen = () => {
			// 发送数据
			socket.send(JSON.stringify({
				"eventName": "__join",		// 要触发的服务端事件
				"data": {
					"room": room			// 带上房间名
				} 
			}));

			console.log("socket opened");
		}
		// 接受到websocket传来的信息
		socket.onmessage = (msg) => {
			let json = JSON.parse(msg.data);
			// 有事件名，则执行对应的事件，若没有则打印内容
			if(json.eventName){
				this.emit(json.eventName, json.data, socket);
			}else{
				console.log("received a message: " + json.data);
			}
		}

		// 链接到websocket失败
		socket.onerror = (err) => {
			alert("connect to websocket failed!");
			console.log(err);
		}
		// websocket通道关闭
		socket.onclose = () => {
			// 关闭本地媒体流
			// this.localMediaStream.stop();
			let tracks = this.localMediaStream.getTracks();
			tracks.forEach((track) => {
				track.stop();
			});

			for(let pc in this.peerConnections){
				// 关闭所有的PeerConnection
				this.closePeerConnection(pc);
			}
			this.peerConnections = {};
			this.dataChannels = {};
			this.connections = [];

			alert('websocket closed');
		}

		// 绑定事件：成功加入当前房间
		this.on("_peers", (data) => {
			// 保存其它链接的ID
			this.connections = data.connections;
			// 保存自己的ID
			this.me = data.you;
			// 触发链接成功事件
			this.emit("connected", socket);
		});
		// 绑定事件：接收ICE候选
		this.on("_ice_candidate", (data) => {
			let candidate = new nativeRTCIceCandidate(data);
			let pc = this.peerConnections[data.socketId];
			// 将新接收到的候选者传递给浏览器的ICE代理
			pc.addIceCandidate(candidate);
			console.log("接收到来自"+ data.socketId + "的ICE代理");
		});
		// 绑定事件：有新链接加入当前房间
		this.on("_new_peer", (data) => {
			// 保存新链接ID到链接列表
			this.connections.push(data.socketId);
			// 创建与新链接的PeerConnection
			let pc = this.createPeerConnection(data.socketId);
			// 这里不用sendOffer，因为新链接会主动发offer给所有链接，当其在设置远程描述时会将本地媒体流发送给新链接
            // // 将本地的媒体流发送给新链接
            // // addStream方法好像要被废弃了，等会再想办法
            // if(typeof pc.addTrack == "function"){
            // 	this.localMediaStream.getTracks().forEach(track => {
            // 		// 暂时怀疑是stream没有传过去
	           //  	pc.addTrack(track, this.localMediaStream);
	           //  	console.log("stream1:" + this.localMediaStream);
	           //  })
            // }else{
            // 	pc.addStream(this.localMediaStream);
            // }

            console.log("新用户：" + data.socketId + "加入聊天");
		});
		// 绑定事件：用户离开
		this.on("_remove_peer", (data) => {
			this.closePeerConnection(this.peerConnections[data.socketId]);
			delete this.peerConnections[data.socketId];
			delete this.dataChannels[data.socketId];
			
			// 触发移除用户事件
			this.emit("remove_peer", data.socketId);
		})
		// 绑定事件：接受到offer信令
		this.on("_offer", (data) => {
			this.receiveOffer(data.socketId, data.sdp);
		});
		// 绑定事件：接受到answer信令
		this.on("_answer", (data) => {
			this.receiveAnswer(data.socketId, data.sdp);
		})
		// 本地流创建成功，准备完成
		this.on("ready", () => {
			// 创建与所有链接的PeerConnection
			this.createPeerConnections();
			// 将本地流添加到所有的PeerConnection实例中
			this.addStreams();
			// 为所有PeerConnection创建DataChannel
			this.addDataChannels();
			// 向所有PeerConnection发送Offer类型信令   终于开始了
			this.sendOffers();
			// this.addStreams();
			console.log("Ready");
		});
	}


	/****************************点对点连接部分***********************/

	/**
	 * [createPeerConnection description]
	 * @param {string} socketId [description]
	 */
	createPeerConnection(socketId: string){
		// 创建PeerConnection实例
		let pc = new PeerConnection(iceServer);
		// 将当期peerconnection实例存入对应ID的peerConntions数组中去
		this.peerConnections[socketId] = pc;
		// 发送ICE候选到其他客户端
		pc.onicecandidate = (event) => {
			if(event.candidate){
				this.socket.send(JSON.stringify({
					"eventName": "__ice_candidate",		// 触发服务端事件ice候选
					"data": {
						"label": event.candidate.sdpMLineIndex,
                        "candidate": event.candidate.candidate,
                        "socketId": socketId
					}
				}))
			}
		}
		console.dir(pc);
		// peerConnection打开
		pc.onopen = () => {
			console.log("与" + socketId + "的PeerConnection已连接");
		};
		pc.oniceconnectionstatechange = (event) => {
			console.log("ICE state change event: " + event);
		};
		// 检测到媒体流链接到本地
		// pc.onaddstream = (event) => {
		if(pc.ontrack == null){
			pc.ontrack = (event) => {
				console.dir(event);
				console.log("接收到来自" + socketId + "的媒体流" + event.streams);
				console.log(1111, event.streams);
				console.log("event.streams[0]:", event.streams[0]);
				this.emit('pc_add_stream', event.streams[0], socketId, pc);
				// console.log('ontrack : ' + event.stream);
			};
		}else{
			pc.onaddstream = (event) => {
				console.log("接收到来自" + socketId + "的媒体流");
				this.emit('pc_add_stream', event.stream, socketId, pc);
			};
		}
		
		// ???
		pc.ondatachannel = (event) => {
			this.addDataChannel(socketId, event.channel);
            // this.emit('pc_add_data_channel', event.channel, socketId, pc);
		}
		// 返回当前PeerConnection实例对象
		return pc;
	}
	/**
	 * 创建与其他用户的PeerConnection
	 */
	createPeerConnections(){
		for(let i=0; i< this.connections.length; i++){
			// 为当前所有链接创建PeerConnection
			this.createPeerConnection(this.connections[i]);
		}
	}
	// 关闭指定PeerConnection的链接
	closePeerConnection(pc: any){
		if(!pc) return;
		pc.close();
	}

	/****************************数据通道连接部分***********************/

	/**
	 * 为所有PeerConnection创建DataChannel
	 */
	addDataChannels(){
		for(let connection in this.peerConnections){
			this.createDateChannel4Pc(connection);
		}
	}
	/**
	 * 为对应的PeerConnection创建对应的DataChannel
	 * @param {string} 		   socketId [socketId]
	 * @param {any = ""}          label [datachannel的标签]
	 */
	createDateChannel4Pc(socketId: string, label?: any){
		label = label || "";
		// 根据ID找到对应的PeerConnection
		let pc = this.peerConnections[socketId],
			channel;

		try{
			// 在对应的PeerConnection实例上创建Data Channel
			channel = pc.createDataChannel(label);
		}catch(err){
			alert("create data channel failed!");
			console.log("failed reason: " + err);
		}
		console.log('create data channel success');

		return this.addDataChannel(socketId, channel);
	}
	/**
	 * 为Data Channel绑定相应的事件回调函数
	 * @param {string} socketId [socketId]
	 * @param {any}    channel  [要绑定事件的channel]
	 */
	addDataChannel(socketId: string, channel: any){
		// channel通道打开
		channel.onopen = () => {
			console.log("data channel to " + socketId + " opened");
		};
		// channel通道关闭
		channel.onclose = (event) => {
			delete this.dataChannels[socketId];
			console.log("data channel to " + socketId + " closed");
		};
		// channel接收到消息
		channel.onmessage = (msg) => {
			console.log("data channel onmessage");
			let json = JSON.parse(msg.data);
			// 有事件名，则执行对应的事件，若没有则打印内容
			if(json.type === '__event'){
				this.emit(json.eventName, channel, socketId, json.data);
			}else{
				console.log("Received a message from " + socketId + " : " + json.data);
			}
		};

		channel.onerror = (err) => {
			console.log("an error happened on channel: " + err);
		}

		this.dataChannels[socketId] = channel;
		return channel;
	}
	/**
	 * 发送消息
	 * @param {string} message  [消息]
	 * @param {string} socketId [socketId]
	 */
	sendMessage(message: string, socketId: string){
		if(this.dataChannels[socketId].readyState.toLowerCase() == 'open'){
			this.dataChannels[socketId].send(JSON.stringify({
				"type": '__msg',
				"data": message
			}));
			console.log("Send a message to " + socketId + " ； " + message);
		}else{
			alert("DataChannel to " + socketId + " not opened!");
		}
	}
	/**
	 * 广播消息
	 * @param {string} message [消息]
	 */
	broadcast(message: string){
		for(let socketId in this.dataChannels){
			this.sendMessage(message, socketId);
		}
	}

	/****************************信令交换部分***********************/

	/**
	 * 向所有PeerConnection发送Offer类型信令
	 */
	sendOffers(){
		let pc;
		// let that = this;
		let pcCreateOfferCbGen = (pc: any, socketId: string) => {
			return (session_desc) => {
				//设置本地sdp，完成设置后onicecandidate事件会调用。
				pc.setLocalDescription(session_desc);
				//将offer发送给对方
				this.socket.send(JSON.stringify({
					"eventName": "__offer",
					"data": {
						"sdp": session_desc,
						"socketId": socketId  // socketId -> 接收方的ID
					}
				}));

				console.log("send offer to "+ socketId + " success");
			};
		},
		pcCreateOfferErrorCb = (err) => {
			console.log("pc create offer failed: " + err);
		};
		// 给所有PeerConnection发送信令
		for(let i = 0; i < this.connections.length; i++){
			pc = this.peerConnections[this.connections[i]];
			pc.createOffer().then(
				pcCreateOfferCbGen(pc, this.connections[i])
			).catch(pcCreateOfferErrorCb)
		}
	}
	/**
	 * 接收到Offer类型信令后作为回应返回answer类型信令
	 * @param {string} socketId [socketId]
	 * @param {any}    sdp      [offer]
	 */
	receiveOffer(socketId: string, sdp: any){
		console.log("received offer from "+ socketId);
		// socketId -> 发送方的ID    
		let pc = this.peerConnections[socketId];
		if(!!pc){
			this.sendAnswer(socketId, sdp);
		}else{
			console.log("用户" + socketId + "不存在");
		}
	}
	/**
	 * 发送answer类型信令
	 * @param {string} socketId [socketId]
	 * @param {any}    sdp      [offer]
	 */
	sendAnswer(socketId: string, sdp: any){
		let pc = this.peerConnections[socketId];
		//设置接收到的远端offer
		pc.setRemoteDescription(new nativeRTCSessionDescription(sdp))
		.then(() => {
			// 将本地的媒体流发送给新链接
            // addStream方法好像要被废弃了，等会再想办法
            if(typeof pc.addTrack == "function"){
            	this.localMediaStream.getTracks().forEach(track => {
            		// 暂时怀疑是stream没有传过去
	            	pc.addTrack(track, this.localMediaStream);
	            	console.log("Send answer stream1:" + this.localMediaStream);
	            })
            }else{
            	pc.addStream(this.localMediaStream);
            }
		});
		//创建answer并发送给对方。
		pc.createAnswer()
		  .then((session_desc)  => {
			pc.setLocalDescription(session_desc);
			// console.log("sending offer to " + socketId + " success");
			// 触发服务端answer事件
			this.socket.send(JSON.stringify({
                "eventName": "__answer",
                "data": {
                    "socketId": socketId, // socketId -> 发送方的ID
                    "sdp": session_desc
                }
            }));

            console.log("send answer to "+ socketId + " success");
		  })
		  .catch((err) => {
		  	console.log("pc create answer failed: " +err);
		  });
	}
	/**
	 * 接收answer信令 将对方的session描述写入PeerConnection中
	 * @param {string} socketId [description]
	 * @param {any}    sdp      [description]
	 */
	receiveAnswer(socketId: string, sdp: any){
		console.log("received answer from "+ socketId);
		let pc = this.peerConnections[socketId];
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp))
        .then(() => {
        	// 将本地的媒体流发送给新链接
            // addStream方法好像要被废弃了，等会再想办法
            if(typeof pc.addTrack == "function"){
            	this.localMediaStream.getTracks().forEach(track => {
            		// 暂时怀疑是stream没有传过去
	            	pc.addTrack(track, this.localMediaStream);
	            	console.log("Receive answer stream1:" + this.localMediaStream);
	            })
            }else{
            	pc.addStream(this.localMediaStream);
            }
        });
	}
}

/*****************************定义RTC类 结束************************************/


//test
// var ee = new myRTC();
// ee.on('test', function(){
// 	console.log("test");
// })

// ee.emit("test");