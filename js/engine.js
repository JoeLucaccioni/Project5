var http = require('http');
var fs = require('fs');
var users=0;
var port=8438;

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
		if(message.operation=='join'){
			users++;
			socket.emit('message', {
				operation: 'userNumber',
				userNumber: users
			});
<<<<<<< HEAD
		}else if(message.operation == 'input'){
			socket.emit('message', {
				operation: 'movement',
				output: message.input,
				userNumber: users
			});
			socket.broadcast.emit('message', {
				operation: 'movement',
				output: message.input,
				userNumber: users
			});
			console.log('input '+ message.input);
			console.log('userNumber '+message.userNumber);
	   	}else if(message.operation == 'victory'){
	   		console.log(message.victor);
	   		socket.emit('message', {
				operation: 'attack',
				hit: message.victor
	   		});
	   		socket.broadcast.emit('message', {
				operation: 'attack',
				hit: message.victor
	   		});
	   	}else if(message.operation == 'winner'){
	   		socket.emit('message', {
	   			operation: 'Complete',
	   			winner: message.winner
	   		});
	   		socket.broadcast.emit('message', {
	   			operation: 'Complete',
	   			winner: message.winner
	   		});
	   	}
=======
		}
	});
	socket.on('message', function(message){ // Input event handler
		if(message.operation=='input'){
			socket.emit('message', {
			operation: 'movement',
			output: message.input,
			userNumber: users
			});
			socket.broadcast.emit('message', {
			operation: 'movement',
			output: message.input,
			userNumber: users
			});
			console.log('input '+ message.input);
			console.log('userNumber '+message.userNumber);
		};
>>>>>>> d7f4923b03f2013137c9392a9bafc581fe955fca
	});
	
});
server.listen(port);
console.log("Listening on port: "+port);