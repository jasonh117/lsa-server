var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

// io.on('connection', function(socket) {
//   socket.on('chat message', function(msg) {
//     io.emit('chat message', msg);
//   });
// });

http.listen(port, function() {
  console.log('socketio listeing on *:' + port);
});

module.exports = io;
