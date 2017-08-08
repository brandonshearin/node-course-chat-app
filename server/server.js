const path = require('path');
var express = require('express');
var socketIO = require('socket.io');
var http = require('http');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', function(socket){
	console.log('new user connected');

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'welcome to the chatroom',
		createdAt: new Date().getTime()
	});
	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'new user joined!',
		createdAt: new Date().getTime()
	});

	socket.on('createMessage', (message) => {
		console.log('new message', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		//  	createdAt: new Date().getTime()
		// });
	});


	socket.on('disconnect', function(){
		console.log('user was disconnected')
	});
});

app.use(express.static(publicPath));

































server.listen(port, () => {
	console.log(`started up at port ${port}`);
});


