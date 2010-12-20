
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'node.js chat'
    }
  });
});

// Socket.IO
var socket = io.listen(app);
var buffer = [];
socket.on('connection', function(client) {
  client.send({buffer: buffer});
  
  client.on('message', function(data) {
    if ('message' in data) {
      var msg = {userId: client.sessionId, text: data.message};
      buffer.push(msg);
      client.broadcast({message: msg});
    }
  });
  
  client.on('disconnect', function() {});
});



// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
