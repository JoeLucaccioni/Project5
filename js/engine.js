var http = require('http');
var fs = require('fs');
var users=0;
var port=8437;
var countDown = 100;
var rscore=0;
var lscore=0;

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
		if(message.operation == 'join'){
			users++;
			if(users==2)
			{
				timer();
			}
			socket.emit('message', {
				operation: 'userNumber',
				userNumber: users
			});
		}else if(message.operation == 'input' && users >= 2){
			console.log(message.user);
			socket.emit('message', {
				operation: 'movement',
				output: message.input,
				userNumber: message.user
			});
			socket.broadcast.emit('message', {
				operation: 'movement',
				output: message.input,
				userNumber: message.user
			});
			//console.log('input '+ message.input);
			//console.log('userNumber '+message.userNumber);
	   	}else if(message.operation == 'victory'){
	   		//console.log(message.victor);
			if(message.victor == 'L'){
				lscore++;
			}
			if(message.victor == 'R'){
				rscore++;
			}
	   		socket.emit('message', {
				operation: 'attack',
				hit: message.victor,
				rscore: rscore,
				lscore: lscore
	   		});
	   		socket.broadcast.emit('message', {
				operation: 'attack',
				hit: message.victor,
				rscore: rscore,
				lscore: lscore
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
	});

	socket.on('message', function(message){ // Input event handler
		if(message.operation=='input'){
			socket.emit('message', {
				operation: 'movement',
				output: message.input,
				userNumber: message.userNumber
			});
			socket.broadcast.emit('message', {
				operation: 'movement',
				output: message.input,
				userNumber: message.userNumber
			});
		};

	});
	
	function timer(){ 	

		//console.log(countDown);
				
		socket.emit('message', {
			operation: 'timer',
			timer: countDown
		});
	
		socket.broadcast.emit('message', {
			operation: 'timer',
			timer: countDown
		});
		
   		setTimeout(function () {
					
			countDown--;   
			//console.log(countDown);
			
			
      		if (countDown >= 0){  //while user still has time, call the function recursively until they run out or answer a question          
        		timer();              
      		}	
   		}, 1000);
	}

});
server.listen(port);
console.log("Listening on port: "+port);