/*****定义myrtc类*******/

// 支持webSocket
var WebSocketServer = require('ws').Server;
// 引入UUID，用于生成唯一标识符
var UUID = require('node-uuid');
var events = require('events');
var util = require('util');
// 定义错误事件
var errCb = function(rtc){
	return function(error){
		if(error){
			rtc.emit("error", error);
		}
	};
};

/*********************************定义myRTC类 开始************************************/
function myRTC(){
	// 所有链接
	this.sockets = [];
	// 房间列表：对应的房间里存放在房间中的链接
	this.rooms = {};

	// 测试事件
	this.on('__say_hello', function(data, socket){
		socket.send(JSON.stringify({
			"data": "This is websocket! Your data is: " + data
		}));

		socket.send(JSON.stringify({
			"eventName": "_say_hello",
			"data": "websocket data"
		}));
	});
	// 定义新链接加入时的事件
	this.on('__join', function(data, socket){
		console.log("socket num: " + this.sockets.length);

		var ids = [],
			room = data.room || "__dafault",	// 房间名
			curSocket,							// 当前socket
			curRoom;							// 当前房间

		// 在房间列表中根据房间名找房间，如果没找到则新建空房间
		curRoom = this.rooms[room] = this.rooms[room] || [];
		// 遍历同房间中其它链接
		for(var i = 0; i < curRoom.length; i++){
			curSocket = curRoom[i];
			if(curSocket.id == socket.id){
				continue;
			}
			// 同房间中其他人的ID
			ids.push(curSocket.id);
			// 给其它链接通知：新链接进入
			curSocket.send(JSON.stringify({
				"eventName": "_new_peer",
				"data": {
					"socketId": socket.id
				}
			}), errCb);
		}

		// 将房间名加入到当前socket的room属性中
		socket.room = room;
		curRoom.push(socket);
		// 告知当前socket房间中其它链接的ID，和自己的ID
		socket.send(JSON.stringify({
			"eventName": "_peers",
			"data": {
				"connections": ids,
				"you": socket.id
			}
		}), errCb);

		console.log("新用户" + socket.id + "加入房间" + room);
	});
	// 发送ICE候选到其他客户端
	this.on("__ice_candidate", function(data, socket){
		var soc = this.getSocket(data.socketId);

		if(soc){
			soc.send(JSON.stringify({
                "eventName": "_ice_candidate",
                "data": {
                    "label": data.label,
                    "candidate": data.candidate,
                    "socketId": socket.id
                }
            }), errCb);
			console.log("接收到来自" + socket.id + "的ICE Candidate");
		}
	});
	// 定义向socketId对应PeerConnection发送Offer类型信令事件
	this.on("__offer", function(data, socket){
		var soc = this.getSocket(data.socketId);

		if(soc){
			soc.send(JSON.stringify({
				"eventName": "_offer",
				"data": {
					"sdp": data.sdp,
					"socketId": socket.id // socketId -> 发送方的ID
				}
			}), errCb);
			console.log("接收到来自" + socket.id + "的Offer");
		}
	});
	// 对发出offer信令的socket回应answer信令
	this.on("__answer", function(data, socket){
		var soc = this.getSocket(data.socketId);
		if (soc) {
			soc.send(JSON.stringify({
				"eventName": "_answer",
				"data": {
					"sdp": data.sdp,
					"socketId": socket.id // socketId -> 接收方的ID
				}
			}), errCb);
			console.log("接收到来自" + socket.id + "的Answer");
		}
	});
}
// myRTC继承event的事件处理
util.inherits(myRTC, events.EventEmitter);

/************************myRTC类方法*************/

/**
 * 加入新链接
 * @param {[type]} socket [添加的socket]
 */
myRTC.prototype.addSocket = function(socket){
	this.sockets.push(socket);
};
/**
 * 移除链接
 * @param  {[type]} socket [要移除的socket]
 */
myRTC.prototype.removeSocket = function(socket){
	// 获取要删除链接在链接列表中的位置
	var i = this.sockets.indexOf(socket);
	// 获取要删除链接的房间名
	var room = socket.room;
	// 在链接列表中删除当前链接
	this.sockets.splice(i, 1);
	if(room){
		// 获取要删除链接在所在房间中的位置
		i = this.rooms[room].indexOf(socket);
		// 在链接所在房间中删除将删除链接
		this.rooms[room].splice(i, 1);
		// 删除后房间中已经没有链接了
		if(this.rooms[room].length === 0){
			// 销毁这个房间
			delete this.rooms[room];
		}
	}
};
/**
 * 根据ID查找对应的socket
 * @param  {[type]} id [socket ID]
 * @return {[type]}    [空 或 socket]
 */
myRTC.prototype.getSocket = function(id){
	var curSocket;

	if(!this.sockets) return;
	for(var i = 0; i < this.sockets.length; i++){
		curSocket = this.sockets[i];
		if(id === curSocket.id){
			return curSocket;
		}
	}
	return;
};
/**
 * 定义myRTC初始化函数
 * @param  {[type]} socket [description]
 */
myRTC.prototype.init = function(socket){
	var that = this;
	// 随机生成socket的唯一ID
	socket.id = UUID.v4();
	that.addSocket(socket);
	// 为新链接绑定事件处理器
	socket.on('message', function(data){
		var json = JSON.parse(data);
		if(json.eventName){
			that.emit(json.eventName, json.data, socket);
		}else{
			console.log("接收到来自" + socket.id + "的新消息：" + data);
		}

	});
	// 定义链接关闭事件
	socket.on('close', function(){
		var room = socket.room;	// 获取将要关闭的socket所在的房间名
		var curRoom;
		if(!!room){
			curRoom = that.rooms[room];  // 在房间列表中根据房间名找到当前房间

			// 遍历当前房间中所有socket
			for(var i = 0; i < curRoom.length; i++){
				// 排除自己
				if(curRoom[i].id == socket.id){
					continue;
				}
				// 告知其它socket，此链接已断开
				curRoom[i].send(JSON.stringify({
					"eventName": "_remove_peer",
					"data": {
						"socketId": socket.id
					}
				}), errCb);
			}
		}
		// 移除此链接
		that.removeSocket(socket);

		console.log(socket.id + "用户离开");
	});
};
/*********************************定义myRTC类 结束************************************/

/************************************************************************/

// 给myrtc模块扩展listen方法
module.exports.listen = function(server){
	var myRTCServer;
	// server是端口号
	if(typeof server === 'number'){
		// 实例化websock服务，绑定端口号为server
		myRTCServer = new WebSocketServer({
			port: server
		});
	}else{
		// 实例化websock服务，绑定到已打开的server上
		myRTCServer = new WebSocketServer({
			server: server
		});
	}

	myRTCServer.rtc = new myRTC();  // 创建myRTC实例对象
	errCb = errCb(myRTCServer.rtc);
	myRTCServer.on('connection', function(socket){
		// myRTC实例对象初始化
		this.rtc.init(socket);
	});

	return myRTCServer;
}