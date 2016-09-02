var express = require('express');
var app = express();

app.use("/", express.static(__dirname ));

var server = require('http').Server(app);
var io = require('socket.io')(server);
var users = names = {};
server.listen('3000');

app.get('/',function (request, response) {
	// response.sendFile(__dirname +'/index.html');
	response.sendFile('/index.html', { root: __dirname });
});

function sfLog(message) {
	var d = new Date();
	var time = '['+ d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ']';
	console.log(time + ' ' + message);
}

sfLog('sf.Chat server is running...');

io.on('connection',function (socket) {
	socket.on('join',function (user) {
		sfLog("A user has joined.");
		socket.userId = user[1];
		socket.userName = user[2];
		users[user[1]] = socket;
		names[user[1]] = {
			'name' : user[2],
			'socketId' : socket.id,
		};

		function updateNames() {
			io.emit('chat.'+user[0],names);
		}

		updateNames();

		socket.on('chat',function(payload) {
			console.log(payload);
			io.emit('chat.'+payload[0],payload);
		});

		socket.on('disconnect',function () {
			if(!socket.name) return;

			delete users[user[1]];
			delete names[user[1]];
			updateNames();
		})	
	})
});