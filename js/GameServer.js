var mysql = require('mysql');
var http = require('http');
var fs = require('fs');

//Everyone must use own port > 8000
// Must Match client side port setting
var port = 8948;

// Login to MySQL
var con = mysql.createConnection({
    host: "localhost",
    user: "lucaccioni",
    password: "S217041",
    database: "lucaccioni"
});
con.connect(function(err) {
    	if (err) throw err;
});

console.log("stuff");

// Set up the node.js Web server
var server = http.createServer(function(req, res) {
  var url = req.url;
  // If no path, get the index.html
  if (url == "/") url = "/index.html";
  // get the file extension (needed for Content-Type)
  var ext = url.split('.').pop();
  console.log(url + "  :  " + ext);
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
  fs.readFile('.' + url, 'utf-8', function(error, content) {
  res.setHeader("Content-Type", mimeType);
  res.end(content);
  });
});

// Set up socket.io communication
var io = require('socket.io').listen(server);

var player;

// When a client connects, we note it in the console
io.sockets.on('connection', function(socket) {
  	// watch for message from client (JSON)
  	socket.on('message', function(message) {
  		if(message.operation == 'move'){
  			player = message.avatar;
  			if(message.moveKey == 'A'){
  				sendQueryResults('L');
			}else if(message.moveKey == 'D'){
				sendQueryResults('R');
			}else if(message.moveKey == 'W'){
				sendQueryResults('Up');
			}
		}
	});
});

// Perform search, send results to caller
function sendQueryResults(query,socket) {
	//console.log(query);
    con.query(query, function (err, result, fields) {
		if (err) throw err;
		
		socket.emit('message', {
    		operation: 'movement',
    		direction: query //sends the direction of movement
    	});
	});
}
server.listen(port);
console.log("Listening on port: "+port);