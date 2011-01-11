
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');
var fs = require('fs');
var coffee = require('coffee-script');

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

app.get('/javascripts/:script.coffee', function (req, res) {
  fs.readFile('./public/javascripts/'+ req.params.script + '.coffee', 'utf-8', function (err, data) {
    if (err) {
      res.writeHead(500);
      res.end(err.message);
    } else {
      try {
        var script = coffee.compile(data);
        res.contentType('text/javascript');
        res.writeHead(200);
        res.end(script);
      } catch (e) {
        res.writeHead(500);
        res.end(e.message);
      }
    }
  });
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
