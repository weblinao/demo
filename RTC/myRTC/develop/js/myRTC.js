"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    // 绑定事件函数
    EventEmitter.prototype.on = function (eventName, callback) {
        this.events[eventName] = this.events[eventName] || [];
        // 将事件添加到对应事件名的事件函数列表里
        this.events[eventName].push(callback);
    };
    // 触发事件函数
    EventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var events = this.events[eventName];
        if (!events) {
            return;
        }
        // 触发事件名对应的所有事件函数
        for (var i = 0; i < events.length; i++) {
            events[i].apply(null, args);
        }
    };
    return EventEmitter;
}());
/*****************************定义事件处理器类 结束*****************************/
// RTC相关环境
// 兼容浏览器的PeerConnection写法
var PeerConnection = (window.PeerConnection || window.RTCPeerConnection || window.webkitPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
// 兼容浏览器的getUserMedia写法
var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
var nativeRTCIceCandidate = (window.RTCIceCandidate || window.mozRTCIceCandidate);
// order is very important: "RTCSessionDescription" defined in Nighly but useless
var nativeRTCSessionDescription = (window.RTCSessionDescription || window.mozRTCSessionDescription);
// this.moz = !!navigator.mozGetUserMedia;
var iceServer = {
    "iceServers": [{
            // "url": "stun:stun.l.google.com:19302"	// url已弃用，改为urls
            // "urls": "stun:stun.freeswitch.org"  // 这个地址失效了
            "urls": ["stun:stun.l.google.com:19302"]
            // "urls": ["stun:stun.xten.com"]
            // "urls": ["stun:stun.ekiga.net"]
            // "urls": ["stun:stun.ideasip.com"]
        }, {
            "urls": "turn:192.168.152.128:3478",
            "username": 'test',
            "credential": 'test'
        }]
};
// this.packetSize = 1000;
if (!!navigator.mediaDevices.getUserMedia) {
    getUserMedia = "NMG"; // => navigator.mediaDevices.getUserMedia
}
/*****************************定义RTC类 开始***********************************/
// 继承事件处理器，提供事件绑定和触发功能
var myRTC = /** @class */ (function (_super) {
    __extends(myRTC, _super);
    // 构建函数
    function myRTC() {
        var _this = 
        // 构建父类
        _super.call(this) || this;
        // 本地media stream
        _this.localMediaStream = null;
        //本地WebSocket连接
        _this.socket = null;
        // 所在房间
        _this.room = "";
        // 所有与本地相连的socket的ID
        _this.connections = null;
        // 本地的socket的ID，由服务器创建
        _this.me = null;
        //初始时需要构建链接的数目
        _this.numStreams = 0;
        //初始时已经连接的数目
        _this.initializedStreams = 0;
        //保存所有与本地相连的peer connection， 键为socket id，值为PeerConnection类型
        _this.peerConnections = {};
        //保存所有的data channel，键为socket id，值通过PeerConnection实例的createChannel创建
        _this.dataChannels = {};
        return _this;
    }
    /****************************流处理部分**************************/
    /**
     * 创建本地流
     * @param {any}    options      [音频，视频选项]
     * @param {string} eventSuccess [成功事件]
     * @param {string} eventFailed  [失败事件]
     */
    myRTC.prototype.createLocalStream = function (options, eventSuccess, eventFailed) {
        var _this = this;
        options.video = !!options.video;
        options.audio = !!options.audio;
        if (getUserMedia == "NMG") {
            // 需构建Stream++
            this.numStreams++;
            // this.gerUserMedia(options)  // 'getUserMedia' called on an object that does not implement interface MediaDevices.
            navigator.mediaDevices.getUserMedia(options)
                .then(function (stream) {
                _this.localMediaStream = stream;
                // 已构建Stream++
                _this.initializedStreams++;
                _this.emit(eventSuccess, stream);
                // 需构建链接数目 === 已链接数目  准备完成
                if (_this.initializedStreams === _this.numStreams) {
                    // 触发ready事件
                    _this.emit("ready");
                }
            })["catch"](function (err) {
                console.log(err);
                _this.emit(eventFailed, err);
            });
        }
        else if (getUserMedia) {
            this.numStreams++;
            getUserMedia.call(navigator, options, 
            // 创建本地流成功
            function (stream) {
                _this.localMediaStream = stream;
                _this.initializedStreams++;
                _this.emit(eventSuccess, stream);
                if (_this.initializedStreams === _this.numStreams) {
                    // 触发ready事件
                    _this.emit("ready");
                }
            }, function (err) {
                _this.emit(eventFailed, err);
            });
        }
        else {
            alert('WebRTC is not yet supported in this browser.');
        }
    };
    /**
     * 将流绑定到指定的video标签上
     * @param {any}    stream [流]
     * @param {string} domId  [元素ID]
     */
    myRTC.prototype.attachStream = function (stream, domId) {
        var ele = document.getElementById(domId);
        if (!!ele && ele.nodeName == "VIDEO") {
            if (ele.srcObject == null) {
                ele.srcObject = stream;
            }
            else {
                // 这个方法正在被废弃，能不用就不用
                ele.src = this.URL.createObjectURL(stream);
            }
            ele.play();
            console.log("正在播放来自" + domId + "的视频" + stream);
        }
        else {
            alert("attache stream failed!");
            console.log("Attache Stream Failed: Can't find element or element is not video");
        }
    };
    /**
     * 将本地流添加到所有的PeerConnection实例中
     */
    myRTC.prototype.addStreams = function () {
        var _this = this;
        var _loop_1 = function (connection) {
            var pc = this_1.peerConnections[connection];
            // addStream方法好像要被废弃了，等会再想办法
            // this.peerConnections[connection].addStream(this.localMediaStream);
            if (typeof pc.addTrack == "function") {
                this_1.localMediaStream.getTracks().forEach(function (track) {
                    // 暂时怀疑是stream没有传过去
                    pc.addTrack(track, _this.localMediaStream);
                    console.log("stream1:" + _this.localMediaStream);
                });
            }
            else {
                pc.addStream(this_1.localMediaStream);
            }
        };
        var this_1 = this;
        for (var connection in this.peerConnections) {
            _loop_1(connection);
        }
    };
    /****************************服务器链接部分***********************/
    /**
     * 本地链接信道
     * 信道为websocket
     * @param {string} serverUrl [服务器地址]
     * @param {string} room      [房间号]
     */
    myRTC.prototype.connect = function (serverUrl, room) {
        var _this = this;
        var socket;
        // 创建socket
        socket = this.socket = new WebSocket(serverUrl);
        // websocket打开
        socket.onopen = function () {
            // 发送数据
            socket.send(JSON.stringify({
                "eventName": "__join",
                "data": {
                    "room": room // 带上房间名
                }
            }));
            console.log("socket opened");
        };
        // 接受到websocket传来的信息
        socket.onmessage = function (msg) {
            var json = JSON.parse(msg.data);
            // 有事件名，则执行对应的事件，若没有则打印内容
            if (json.eventName) {
                _this.emit(json.eventName, json.data, socket);
            }
            else {
                console.log("received a message: " + json.data);
            }
        };
        // 链接到websocket失败
        socket.onerror = function (err) {
            alert("connect to websocket failed!");
            console.log(err);
        };
        // websocket通道关闭
        socket.onclose = function () {
            // 关闭本地媒体流
            // this.localMediaStream.stop();
            var tracks = _this.localMediaStream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            for (var pc in _this.peerConnections) {
                // 关闭所有的PeerConnection
                _this.closePeerConnection(pc);
            }
            _this.peerConnections = {};
            _this.dataChannels = {};
            _this.connections = [];
            alert('websocket closed');
        };
        // 绑定事件：成功加入当前房间
        this.on("_peers", function (data) {
            // 保存其它链接的ID
            _this.connections = data.connections;
            // 保存自己的ID
            _this.me = data.you;
            // 触发链接成功事件
            _this.emit("connected", socket);
        });
        // 绑定事件：接收ICE候选
        this.on("_ice_candidate", function (data) {
            var candidate = new nativeRTCIceCandidate(data);
            var pc = _this.peerConnections[data.socketId];
            // 将新接收到的候选者传递给浏览器的ICE代理
            pc.addIceCandidate(candidate);
            console.log("接收到来自" + data.socketId + "的ICE代理");
        });
        // 绑定事件：有新链接加入当前房间
        this.on("_new_peer", function (data) {
            // 保存新链接ID到链接列表
            _this.connections.push(data.socketId);
            // 创建与新链接的PeerConnection
            var pc = _this.createPeerConnection(data.socketId);
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
        this.on("_remove_peer", function (data) {
            _this.closePeerConnection(_this.peerConnections[data.socketId]);
            delete _this.peerConnections[data.socketId];
            delete _this.dataChannels[data.socketId];
            // 触发移除用户事件
            _this.emit("remove_peer", data.socketId);
        });
        // 绑定事件：接受到offer信令
        this.on("_offer", function (data) {
            _this.receiveOffer(data.socketId, data.sdp);
        });
        // 绑定事件：接受到answer信令
        this.on("_answer", function (data) {
            _this.receiveAnswer(data.socketId, data.sdp);
        });
        // 本地流创建成功，准备完成
        this.on("ready", function () {
            // 创建与所有链接的PeerConnection
            _this.createPeerConnections();
            // 将本地流添加到所有的PeerConnection实例中
            _this.addStreams();
            // 为所有PeerConnection创建DataChannel
            _this.addDataChannels();
            // 向所有PeerConnection发送Offer类型信令   终于开始了
            _this.sendOffers();
            // this.addStreams();
            console.log("Ready");
        });
    };
    /****************************点对点连接部分***********************/
    /**
     * [createPeerConnection description]
     * @param {string} socketId [description]
     */
    myRTC.prototype.createPeerConnection = function (socketId) {
        var _this = this;
        // 创建PeerConnection实例
        var pc = new PeerConnection(iceServer);
        // 将当期peerconnection实例存入对应ID的peerConntions数组中去
        this.peerConnections[socketId] = pc;
        // 发送ICE候选到其他客户端
        pc.onicecandidate = function (event) {
            if (event.candidate) {
                _this.socket.send(JSON.stringify({
                    "eventName": "__ice_candidate",
                    "data": {
                        "label": event.candidate.sdpMLineIndex,
                        "candidate": event.candidate.candidate,
                        "socketId": socketId
                    }
                }));
            }
        };
        console.dir(pc);
        // peerConnection打开
        pc.onopen = function () {
            console.log("与" + socketId + "的PeerConnection已连接");
        };
        pc.oniceconnectionstatechange = function (event) {
            console.log("ICE state change event: " + event);
        };
        // 检测到媒体流链接到本地
        // pc.onaddstream = (event) => {
        if (pc.ontrack == null) {
            pc.ontrack = function (event) {
                console.dir(event);
                console.log("接收到来自" + socketId + "的媒体流" + event.streams);
                console.log(1111, event.streams);
                console.log("event.streams[0]:", event.streams[0]);
                _this.emit('pc_add_stream', event.streams[0], socketId, pc);
                // console.log('ontrack : ' + event.stream);
            };
        }
        else {
            pc.onaddstream = function (event) {
                console.log("接收到来自" + socketId + "的媒体流");
                _this.emit('pc_add_stream', event.stream, socketId, pc);
            };
        }
        // ???
        pc.ondatachannel = function (event) {
            _this.addDataChannel(socketId, event.channel);
            // this.emit('pc_add_data_channel', event.channel, socketId, pc);
        };
        // 返回当前PeerConnection实例对象
        return pc;
    };
    /**
     * 创建与其他用户的PeerConnection
     */
    myRTC.prototype.createPeerConnections = function () {
        for (var i = 0; i < this.connections.length; i++) {
            // 为当前所有链接创建PeerConnection
            this.createPeerConnection(this.connections[i]);
        }
    };
    // 关闭指定PeerConnection的链接
    myRTC.prototype.closePeerConnection = function (pc) {
        if (!pc)
            return;
        pc.close();
    };
    /****************************数据通道连接部分***********************/
    /**
     * 为所有PeerConnection创建DataChannel
     */
    myRTC.prototype.addDataChannels = function () {
        for (var connection in this.peerConnections) {
            this.createDateChannel4Pc(connection);
        }
    };
    /**
     * 为对应的PeerConnection创建对应的DataChannel
     * @param {string} 		   socketId [socketId]
     * @param {any = ""}          label [datachannel的标签]
     */
    myRTC.prototype.createDateChannel4Pc = function (socketId, label) {
        label = label || "";
        // 根据ID找到对应的PeerConnection
        var pc = this.peerConnections[socketId], channel;
        try {
            // 在对应的PeerConnection实例上创建Data Channel
            channel = pc.createDataChannel(label);
        }
        catch (err) {
            alert("create data channel failed!");
            console.log("failed reason: " + err);
        }
        console.log('create data channel success');
        return this.addDataChannel(socketId, channel);
    };
    /**
     * 为Data Channel绑定相应的事件回调函数
     * @param {string} socketId [socketId]
     * @param {any}    channel  [要绑定事件的channel]
     */
    myRTC.prototype.addDataChannel = function (socketId, channel) {
        var _this = this;
        // channel通道打开
        channel.onopen = function () {
            console.log("data channel to " + socketId + " opened");
        };
        // channel通道关闭
        channel.onclose = function (event) {
            delete _this.dataChannels[socketId];
            console.log("data channel to " + socketId + " closed");
        };
        // channel接收到消息
        channel.onmessage = function (msg) {
            console.log("data channel onmessage");
            var json = JSON.parse(msg.data);
            // 有事件名，则执行对应的事件，若没有则打印内容
            if (json.type === '__event') {
                _this.emit(json.eventName, channel, socketId, json.data);
            }
            else {
                console.log("Received a message from " + socketId + " : " + json.data);
            }
        };
        channel.onerror = function (err) {
            console.log("an error happened on channel: " + err);
        };
        this.dataChannels[socketId] = channel;
        return channel;
    };
    /**
     * 发送消息
     * @param {string} message  [消息]
     * @param {string} socketId [socketId]
     */
    myRTC.prototype.sendMessage = function (message, socketId) {
        if (this.dataChannels[socketId].readyState.toLowerCase() == 'open') {
            this.dataChannels[socketId].send(JSON.stringify({
                "type": '__msg',
                "data": message
            }));
            console.log("Send a message to " + socketId + " ； " + message);
        }
        else {
            alert("DataChannel to " + socketId + " not opened!");
        }
    };
    /**
     * 广播消息
     * @param {string} message [消息]
     */
    myRTC.prototype.broadcast = function (message) {
        for (var socketId in this.dataChannels) {
            this.sendMessage(message, socketId);
        }
    };
    /****************************信令交换部分***********************/
    /**
     * 向所有PeerConnection发送Offer类型信令
     */
    myRTC.prototype.sendOffers = function () {
        var _this = this;
        var pc;
        // let that = this;
        var pcCreateOfferCbGen = function (pc, socketId) {
            return function (session_desc) {
                //设置本地sdp，完成设置后onicecandidate事件会调用。
                pc.setLocalDescription(session_desc);
                //将offer发送给对方
                _this.socket.send(JSON.stringify({
                    "eventName": "__offer",
                    "data": {
                        "sdp": session_desc,
                        "socketId": socketId // socketId -> 接收方的ID
                    }
                }));
                console.log("send offer to " + socketId + " success");
            };
        }, pcCreateOfferErrorCb = function (err) {
            console.log("pc create offer failed: " + err);
        };
        // 给所有PeerConnection发送信令
        for (var i = 0; i < this.connections.length; i++) {
            pc = this.peerConnections[this.connections[i]];
            pc.createOffer().then(pcCreateOfferCbGen(pc, this.connections[i]))["catch"](pcCreateOfferErrorCb);
        }
    };
    /**
     * 接收到Offer类型信令后作为回应返回answer类型信令
     * @param {string} socketId [socketId]
     * @param {any}    sdp      [offer]
     */
    myRTC.prototype.receiveOffer = function (socketId, sdp) {
        console.log("received offer from " + socketId);
        // socketId -> 发送方的ID    
        var pc = this.peerConnections[socketId];
        if (!!pc) {
            this.sendAnswer(socketId, sdp);
        }
        else {
            console.log("用户" + socketId + "不存在");
        }
    };
    /**
     * 发送answer类型信令
     * @param {string} socketId [socketId]
     * @param {any}    sdp      [offer]
     */
    myRTC.prototype.sendAnswer = function (socketId, sdp) {
        var _this = this;
        var pc = this.peerConnections[socketId];
        //设置接收到的远端offer
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp))
            .then(function () {
            // 将本地的媒体流发送给新链接
            // addStream方法好像要被废弃了，等会再想办法
            if (typeof pc.addTrack == "function") {
                _this.localMediaStream.getTracks().forEach(function (track) {
                    // 暂时怀疑是stream没有传过去
                    pc.addTrack(track, _this.localMediaStream);
                    console.log("Send answer stream1:" + _this.localMediaStream);
                });
            }
            else {
                pc.addStream(_this.localMediaStream);
            }
        });
        //创建answer并发送给对方。
        pc.createAnswer()
            .then(function (session_desc) {
            pc.setLocalDescription(session_desc);
            // console.log("sending offer to " + socketId + " success");
            // 触发服务端answer事件
            _this.socket.send(JSON.stringify({
                "eventName": "__answer",
                "data": {
                    "socketId": socketId,
                    "sdp": session_desc
                }
            }));
            console.log("send answer to " + socketId + " success");
        })["catch"](function (err) {
            console.log("pc create answer failed: " + err);
        });
    };
    /**
     * 接收answer信令 将对方的session描述写入PeerConnection中
     * @param {string} socketId [description]
     * @param {any}    sdp      [description]
     */
    myRTC.prototype.receiveAnswer = function (socketId, sdp) {
        var _this = this;
        console.log("received answer from " + socketId);
        var pc = this.peerConnections[socketId];
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp))
            .then(function () {
            // 将本地的媒体流发送给新链接
            // addStream方法好像要被废弃了，等会再想办法
            if (typeof pc.addTrack == "function") {
                _this.localMediaStream.getTracks().forEach(function (track) {
                    // 暂时怀疑是stream没有传过去
                    pc.addTrack(track, _this.localMediaStream);
                    console.log("Receive answer stream1:" + _this.localMediaStream);
                });
            }
            else {
                pc.addStream(_this.localMediaStream);
            }
        });
    };
    return myRTC;
}(EventEmitter));
