
var http = require('http');
var fs = require('fs');

var io = require('socket.io').listen(server);

var port = 8437;

console.log("engine started successfully on port "+port);

var server = http.createServer(function(req, res) {
  var url = req.url;
  console.log(url);
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
  fs.readFile('..' + url, 'utf-8', function(error, content) {
  res.setHeader("Content-Type", mimeType);
  res.end(content);
  });
});



//listen for and log connections
io.sockets.on('connection', function(socket) {
	
	console.log("connection!");
	
	socket.on('message', function(message) {
		
		sendOutput(message.input,socket)
	
	});
});
		
		
		
		


//for processing and sending keystrokes
function sendOutput(output,socket) {
	//console.log(output);
    con.output(output, function (err, result, fields) { //not sure what's going on here
		if (err) throw err;
		var results = [];
		//Object.keys(result).forEach(function(key) {
			//var row = result[key];
			//results.push(row);
			//console.log(row.First+" "+row.Last+", Phone:"+row.Phone+"  ["+row.Type+"]");	    	
	});
	
	socket.emit('message', {
    	operation: 'animation',
    	animation: output
    });
};

server.listen(port);
console.log("Listening on port: "+port);
