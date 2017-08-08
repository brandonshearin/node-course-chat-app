const path = require('path');
var express = require('express');
var socketIO = require('socket.io');
var http = require('http');
var {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', function(socket){
	console.log('new user connected');

	socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user joined'));

	socket.on('createMessage', (message, callback) => {
		console.log('new message', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('this is from the server');
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


