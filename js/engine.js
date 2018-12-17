var http = require('http');
var fs = require('fs');
var users=0;
var port=8437;

var server = http.createServer(function(req, res) {
  var url = req.url;
  //console.log(url);
  // If no path, get the index.html
  if (url == "/") url = "/index.html";
  // get the file extension (needed for Content-Type)
  var ext = url.split('.').pop();
  //console.log(url + "  :  " + ext);
  // convert file type to correct Content-Type
  var mimeType = 'text/html'; // default
  switch (ext) {
    case 'css':
      mimeType = 'text/css';
      break;
    case 'png':
      mimeType = 'text/png';
      break;
    case 'jpg':
      mimeType = 'text/jpeg';
      break;
    case 'js':
      mimeType = 'application/javascript';
      break;
  }
  // Send the requested file
  fs.readFile('..' + url, 'utf-8', function(error, content) {
  res.setHeader("Content-Type", mimeType);
  res.end(content);
  });
});

console.log("Loaded index file");
// Loading socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) { // Connection event handler
    console.log('A client is connected!');
	
	socket.on('message', function(message){
		if(message.operation=='join')
		{
			users++;
			socket.emit('message', {
				operation: 'userNumber',
				userNumber: users
			});
		}
	});
	socket.on('message', function(message){ // Input event handler
		//console.log(message.input);
		socket.emit('message', {
		output: message.input
	   });
	   socket.broadcast.emit('message', {
		output: message.input
	   });
	});
});
server.listen(port);
console.log("Listening on port: "+port);