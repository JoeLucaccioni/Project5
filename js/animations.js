var socket = io.connect('http://cslab.kenyon.edu:'+port);
var port = 8437;

$(document).ready(function () {
    // this is an event handler for a message on socket.io from the server side.
    // For this program it will produce an animation based on the server's output
    socket.on('message', function(message) {
		console.log(message.output);
	});
});