$(function () {
  var socket = new io.Socket();
  socket.on('connect', function(){});
  socket.on('message', function(data){
    if ('message' in data) {
      printMessage(data.message);
    } else if ('buffer' in data) {
      $("#chatlog").html("");
      $(data.buffer).each(function () {
        printMessage(this);
      });
    }
  });
  socket.on('disconnect', function(){});
  socket.connect();

  function printMessage(message) {
    $("#chatlog").append("<div><b>" + message.userId + ":</b> " + message.text + "</div>");
  }

  $("#message-form").submit(function () {
    socket.send({message: $("#message").val()});
    printMessage({userId: "You", text: $("#message").val()});
    return false;
  });
});
