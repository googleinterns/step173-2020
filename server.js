var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = process.env.PORT || 8081;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, './ubg/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './ubg/build', 'index.html'));
});

io.on('connection', function (socket) {

    socket.on('joinSocketRoom', (roomId, uid) => {
        socket.join(roomId);
        socket.to(roomId).emit('newUser', socket.id, uid);
    });

    socket.on('sendOffer', (offer, socketId, uid) => {
        io.to(socketId).emit('receiveOffer', offer, socket.id, uid);
    })

    socket.on('sendAnswer', (answer, socketId) => {
        io.to(socketId).emit('receiveAnswer', answer, socket.id);
    })

    socket.on('newICE', (candidate, socketId) => {
        io.to(socketId).emit('receiveICE', candidate, socket.id);
    });

    socket.on('leaveSocketRoom', (roomId) => {
        io.to(roomId).emit('userLeft', socket.id);
        socket.leave(roomId);
    });

    socket.on('connectionFailed', (socketId) => {
        io.to(socketId).emit('connectionFailed', socket.id);
    });

    socket.on('reloadConnection', (socketId) => {
        io.to(socketId).emit('userLeft', socket.id);
        io.to(socketId).emit('reloadingConnection', socket.id);
        if (socketId > socket.id) {
            io.to(socketId).emit('createNewConnection', socket.id);
        } else {
            io.to(socket.id).emit('createNewConnection', socketId);
        }
    })

});
