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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./ubg/build", "index.html"));
});

io.on('connection', function (socket) {
    console.log('connected to socket');
    io.to(socket.id).emit("youJoined");

    socket.on("joinSocketRoom", (roomId, uid) => {
        io.to(socket.id).emit("youJoinedRoom");
        socket.join(roomId);
        console.log("joined room " + roomId);
        socket.to(roomId).emit('newUser', socket.id, uid);
    });

    socket.on("sendOffer", (offer, socketId, uid) => {
        console.log('sendOffer');
        io.to(socketId).emit("receiveOffer", offer, socket.id, uid);
    })

    socket.on("sendAnswer", (answer, socketId) => {
        console.log('sendAnswer');
        io.to(socketId).emit("receiveAnswer", answer, socket.id);
    })

    socket.on("newICE", (candidate, socketId) => {
      console.log('newIce');
        io.to(socketId).emit("receiveICE", candidate, socket.id);
    });

    socket.on("leaveSocketRoom", (roomId) => {
      console.log('leave room');
        io.to(roomId).emit("userLeft", socket.id);
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});