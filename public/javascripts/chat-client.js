$(function () {
  var socket = new io.Socket();
  socket.on('connect', function(){});
  socket.on('message', function(data){});
  socket.on('disconnect', function(){});

  socket.connect();

});
