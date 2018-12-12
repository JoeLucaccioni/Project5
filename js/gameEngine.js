
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
	});
	
	socket.emit('message', {
    	operation: 'animation',
    	animation: output
    });
};


//next part creates a model of what the client side is seeing. Line 80-216
var width = 1500;
var height = 750;

//physics variables
var floorFriction = 10;
var gravity = 10;
// px / second^2
var collisionDamper = 1;
// full energy loss
var ballX, ballY;

function updateBall(frame) {
    var timeDiff = frame.timeDiff;
    var stage = ball.getStage();
    var x = ball.getX();
    ballX = x;
    var y = ball.getY();
    ballY = y;
    var radius = ball.getRadius();
    // physics variables
    var gravity = 10;
    
    var speedIncrementFromGravityEachFrame = gravity * timeDiff / 1000;
    var collisionDamper = 1;
    // full energy loss
    var floorFriction = 10;
    // px / second^2
    var floorFrictionSpeedReduction = floorFriction * 1.25 * timeDiff / 1000;

    // gravity
    ball.velocity.y += speedIncrementFromGravityEachFrame;
    x += ball.velocity.x;
    y += ball.velocity.y;

    // ceiling condition
    if(y < radius) {
        y = radius;
        ball.velocity.y *= -1;
        ball.velocity.y *= (1 - collisionDamper);
    }

    // floor condition
    if(y > (height - radius)) {
        y = height - radius;
        ball.velocity.y *= -1;
        ball.velocity.y *= (1 - collisionDamper);
    }
    
    // floor friction
    if(ball.velocity.x != 0) {
    	if(ball.velocity.x > 0.1) {
                ball.velocity.x -= floorFrictionSpeedReduction;
        }
        else if(ball.velocity.x < -0.1) {
            ball.velocity.x += floorFrictionSpeedReduction;
        }
        else {
            ball.velocity.x = 0;
        }
    }

    // right wall condition
    if(x > (width - radius)) {
    	/*console.log("hit right wall");
    	rightHits++;
    	$("#counterR").empty()
		$("#counterR").append(rightHits);
    	console.log(rightHits);*/
        x = width - radius;
        ball.velocity.x *= -1;
        ball.velocity.x *= (1 - collisionDamper);
    }

    // left wall condition
    if(x < radius) {
    	/*console.log("hit left wall");
    	leftHits++;
    	$("#counterL").empty();
    	$("#counterL").append(leftHits);
    	console.log(leftHits);*/
        x = radius;
        ball.velocity.x *= -1;
        ball.velocity.x *= (1 - collisionDamper);
    }
    
    $(window).keypress(function(e) { // On Keypress, adjust position variables and redraw the circle
		switch(e.keyCode){
		   
			case 97: // A
		   	
				ball.velocity.x = -7;
				break;
			
			case 100: // D
						
				ball.velocity.x = 7;
				break;
			
			case 119: // W
				if(ball.velocity.y == 0){
					ball.velocity.y = -9;
					break;
				}
		};
	});
}

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var ballLayer = new Konva.Layer();
var radius = 40;
var anim;

// create ball
var ball = new Konva.Circle({
    x: 190,
    y: 500,
    radius: radius,
    fill: 'blue',
    draggable: true,
    opacity: 0.8
});

// custom property
ball.velocity = {
    x: 0,
    y: 0
};

ballLayer.add(ball);
stage.add(ballLayer);
    
anim = new Konva.Animation(function(frame) {
    updateBall(frame);
}, ballLayer);

anim.start();

frameRate();

function frameRate(){
	setTimeout(frameRate, 40);
	sendCoordinates(ballX, ballY);
}

function sendCoordinates(x, y){
	//console.log(output);
    con.output(output, function (err, result, fields) { //not sure what's going on here
		if (err) throw err;
		var results = [];	    	
	});
	
	socket.emit('message', {
    	operation: 'coordinates',
    	x: x,
    	y: y
    });
};

server.listen(port);
console.log("Listening on port: "+port);
