//By: Joe Lucaccioni
// Based off code By: Jim Skon
// THis code using Socket.io to talk to a Node.js programm running on the server.
// The port used for this MUST match the port used on the server side, and must note be a port
// used by anyone else.
var port='8948' // Must match port used on server, port>8000
var operation;	// operation
var selectid;
var recIndex
var socket = io.connect('http://cslab.kenyon.edu:'+port);
var rows;
var url = [];

var player = 'p1'; //identifies if player one or two (left or right)

var width = window.innerWidth;
var height = window.innerHeight;

console.log("work");

$(document).ready(function () {
	console.log("work");
    // this is an event handler for a message on socket.io from the server side.
    // For this program is will be a reponse to a request from this page for an action
    socket.on('message', function(message) {
	// 'rows' message contains a set of matching rows from the database to be displayed
	// This is a response to a query
  		if (message.operation == 'movement') {
	   		processResults(message.direction);
  		} 
    });
});

function processResults(var moving){
	if(moving == 'L'){
		ball.velocity.x = -5;
		console.log("moving L");
	}else if(moving == 'R')
		ball.velocity.x = 5;
	else if(moving == 'Up')
		ball.velocity.y = -6;
}

function updateBall(frame) {
    var timeDiff = frame.timeDiff;
    var stage = ball.getStage();
    var height = stage.getHeight();
    var width = stage.getWidth();
    var x = ball.getX();
    var y = ball.getY();
    var radius = ball.getRadius();
    // physics variables
    var gravity = 10;
    // px / second^2
    var speedIncrementFromGravityEachFrame = gravity * timeDiff / 1000;
    var collisionDamper = 1;
    // full energy loss
    var floorFriction = 10;
    // px / second^2
    var floorFrictionSpeedReduction = floorFriction * timeDiff / 1000;

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
        x = width - radius;
        ball.velocity.x *= 0;
    }

    // left wall condition
    if(x < radius) {
        x = radius;
        ball.velocity.x *= 0;
    }
    
    $(window).keypress(function(e) { // On Keypress, adjust position variables and redraw the circle
		switch(e.keyCode){
		   
			case 97: // A
		   		movement('A');
			
			case 100: // D
				movement('D');
			
			case 119: // W
				if(ball.velocity.y == 0)
					movement('W');
		};
	});

    ball.setPosition({x:x, y:y});
}

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var ballLayer = new Konva.Layer();
var radius = 20;
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

function movement(var keystroke){
	socket.emit('message', {
		operation: 'move',
		moveKey: keystroke,
		avatar: player
	});
	console.log("movement key: " keystoke)
}