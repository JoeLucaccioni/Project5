var port=8437;
var socket = io.connect('http://cslab.kenyon.edu:'+port);

var serverOutput;

$(document).ready(function () {
	
	$(window).keypress(function(e) { // On Keypress, update input and emit it to the server
	  //console.log(e.keyCode); // used for checking keyCodes
	  
	  var input;
	  switch(e.keyCode){
		  
		
		   
		case 97: // A
		   	
			input='A';
			//console.log(input);
			break;
			
		case 100: // D
						
			input='D';
			//console.log(input);
			break;
			
		case 115: // S
			
			input='S';
			//console.log(input);
			break;
			
		case 119: // W
			
			input='W';
			//console.log(input);
			break;
	   }
	   //console.log(input);
	   socket.emit('message', {
		input: input
	   });
	   
	});
	
socket.on('message', function(message) { //Event Handler for parsing server messages and moving the ball
		
		serverOutput=message.output;
		//console.log(serverOutput);
		
		switch(serverOutput){
		   
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
	
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	//physics variables
	var floorFriction = 10;
	var gravity = 10;
	// px / second^2
	var collisionDamper = 1;
	// full energy loss
	
	var leftHits = 0;
	var rightHits = 0;
	
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
	
		//Sets the x,y postion of the ball
    ball.setPosition({x:x, y:y});
    
    //Sets the x,y postion of the sword based on the movement of the ball
    sword.setPosition({x:(x+50), y:y-20});

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

//declaring ball variables
var ballLayer = new Konva.Layer();
var radius = 20;
var anim;

//declaring sword variables
var swordLayer = new Konva.Layer();
var sword_w=2;  //sword width
var sword_h=30; //sword height
var sword_a=35; //sword angle

// create ball
var ball = new Konva.Circle({
    x: 190,
    y: 500,
    radius: radius,
    fill: 'blue',
    draggable: true,
    opacity: 0.8
});

// create sword
var sword = new Konva.Rect({
	x: 240,
	y: 500,
	width: sword_w,
	height: sword_h,
	rotation: sword_a,
	fill: 'blue'
});

// custom property
ball.velocity = {
    x: 0,
    y: 0
};

swordLayer.add(sword);
ballLayer.add(ball);
stage.add(ballLayer, swordLayer);

var tween = new Konva.Tween({
    node: ball,
    fill: 'red',
    duration: 0.3,
    easing: Konva.Easings.EaseOut
});
  
//Animation that moves ball    
anim = new Konva.Animation(function(frame) {
    updateBall(frame);
}, ballLayer);

anim.start();

//Animation that moves sword
anim2 = new Konva.Animation(function(frame) {
    updateBall(frame);
}, swordLayer);

anim2.start();
	
});