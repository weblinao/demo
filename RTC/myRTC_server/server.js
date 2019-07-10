var express = require('express');
var app = express();
var server = require('http').createServer(app);
var myRTC = require('./myrtc.js').listen(server);
var path = require("path");

var port = process.env.PORT || 3000;
server.listen(port);

console.log(port);