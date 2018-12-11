var socket = io.connect('http://cslab.kenyon.edu:'+port);
var port = 8437;

var keyStroke;

var leftHits = 0;
var rightHits = 0;
var countDown = 100;

$(document).ready(function () {
    // this is an event handler for a message on socket.io from the server side.
    // For this program it will produce an animation based on the server's output
    socket.on('message', function(message) {
		keyStroke = message.output;
		console.log(keyStroke);
		
		switch(keyStroke){
		   
			case 'A': // A
		   	
				ball.velocity.x = -5;
				break;
			
			case 'D': // D
						
				ball.velocity.x = 5;
				break;
			
			case 'W': // W
				if(ball.velocity.y == 0){
					ball.velocity.y = -6;
					break;
				}
		};
		
		
	});
	timer();
	var time = countDown;
	$("#timer").append(time);
	$("#counterR").append(rightHits);
	$("#counterL").append(leftHits);
});

//times the match
function timer(){ 	
				
	$('#timer').text(countDown);
		
   	setTimeout(function () {
					
		countDown--;   
		console.log(countDown);
			
			
      	if (countDown > 0){  //while user still has time, call the function recursively until they run out or answer a question          
        	timer();              
      	}
      	else{
      		countDown = 0;
      	}
			
   	}, 1000);
}

var width = window.innerWidth;
var height = window.innerHeight;

//physics variables
var floorFriction = 10;
var gravity = 10;
// px / second^2
var collisionDamper = 1;
// full energy loss

function updateBall(frame) {
    var timeDiff = frame.timeDiff;
    //var stage = ball.getStage();
    //var height = stage.getHeight();
    //var width = stage.getWidth();
    var x = ball.getX();
    var y = ball.getY();
    //var radius = ball.getRadius();

    tween.reverse();

    // physics variables
    
    var speedIncrementFromGravityEachFrame = gravity * timeDiff / 1000;
    
    
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
    	console.log("hit right wall");
    	rightHits++;
    	$("#counterR").empty()
		$("#counterR").append(rightHits);
    	console.log(rightHits);
        x = width - radius;
        ball.velocity.x *= -1;
        ball.velocity.x *= (1 - collisionDamper);
    }

    // left wall condition
    if(x < radius) {
    	console.log("hit left wall");
    	leftHits++;
    	$("#counterL").empty();
    	$("#counterL").append(leftHits);
    	console.log(leftHits);
        x = radius;
        ball.velocity.x *= -1;
        ball.velocity.x *= (1 - collisionDamper);
    }
    
    $(window).keypress(function(e) { // On Keypress, adjust position variables and redraw the circle
		switch(e.keyCode){
		   
			case 97: // A
		   	
				ball.velocity.x = -5;
				break;
			
			case 100: // D
						
				ball.velocity.x = 5;
				break;
			
			case 119: // W
				if(ball.velocity.y == 0){
					ball.velocity.y = -6;
					break;
				}
		};
	});

    ball.setPosition({x:x, y:y});

    /*
     * if the ball comes into contact with the
     * curve, then bounce it in the direction of the
     * curve's surface normal
    */
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

var tween = new Konva.Tween({
    node: ball,
    fill: 'red',
    duration: 0.3,
    easing: Konva.Easings.EaseOut
});
    
anim = new Konva.Animation(function(frame) {
    updateBall(frame);
}, ballLayer);

anim.start();