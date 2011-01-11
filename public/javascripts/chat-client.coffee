$ ->
  socket = new io.Socket();
  socket.on 'connect', ->
  socket.on 'message', (data) ->
    console.log(data)
    if data.message
      printMessage(data.message);
    else if data.buffer
      $("#chatlog").html("");
      $(data.buffer).each ->
        printMessage(this);
    
  socket.on 'disconnect', ->
  socket.connect();

  printMessage = (message) ->
    console.log "Got message", message
    $("#chatlog").append("<div><b>" + message.userId + ":</b> " + message.text + "</div>");

  $("#message-form").submit ->
    socket.send({message: $("#message").val()});
    printMessage({userId: "You", text: $("#message").val()});
    false
