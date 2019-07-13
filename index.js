var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var swal = require('sweetalert2');
var bodyParser = require('body-parser');

var nicks = {};


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  if (nicks[req.connection.remoteAddress] != undefined) {
    res.redirect("/chat");
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

app.post('/users/nick', function(req, res) {
  if (req.body.nick != undefined && req.body.nick.trim() != "") {
    if (nicks[req.connection.remoteAddress] == undefined && checkNick(req.body.nick)) {
      nicks[req.connection.remoteAddress] = req.body.nick;
      res.status(200).json({
        status: 'ok'
      });
    } else {
      res.status(200).json({
        status: 'already_has_nick'
      });
    }
  } else {
    res.status(200).json({
      status: 'invalid_nick'
    });
  }
});

app.get('/chat', function(req, res) {
  if (nicks[req.connection.remoteAddress] == undefined) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + '/chat.html');
  }
});

io.on('connection', function(socket) {
  console.log('a user connected');
  io.emit('chat message', nicks[socket.handshake.address] + ' entrou!');
  socket.on('disconnect', function() {
    console.log('user disconnected');
    io.emit('chat message', nicks[socket.handshake.address] + ' saiu!');
  });
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    io.emit('chat message', nicks[socket.handshake.address] + ": " + msg);
  });
});

app.listen(5000, function() {
  console.log('listening on *:5000');
});

function checkNick(nick) {
  for (const [key, value] of Object.entries(nicks)) {
    if (value == nick) {
      return false;
    }
  }
  return true;
}
