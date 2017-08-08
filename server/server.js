const path = require('path');
var express = require('express');
var socketIO = require('socket.io');
var http = require('http');
var {generateMessage, generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
var {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection', function(socket){
	console.log('new user connected');

	socket.on('join', (params, callback) => {
		if(!isRealString(params.name) || !isRealString(params.room)){
			return callback('name and room name are required');
		}

		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
		callback();
	});

	socket.on('createMessage', (message, callback) => {
		console.log('new message', message);
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
	});

	socket.on('disconnect', function(){
		var user = users.removeUser(socket.id);

		if(user){
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
	});
});



































server.listen(port, () => {
	console.log(`started up at port ${port}`);
});


