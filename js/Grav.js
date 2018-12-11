var width = window.innerWidth;
var height = window.innerHeight - 40;
var leftHits = 0;
var rightHits = 0;
var countDown = 100;

//controls the display of the timer and counters;
$(document).ready(function () {
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

//detects and handles collision
function handleCollision() {
	var targetRect = pillar.getClientRect();
	var mover = ball.getClientRect();
    var x = ball.getX();
    var y = ball.getY();
	
	if(intersect(mover, targetRect)){
		console.log("collision");
    	ball.velocity.x *= 0;
    	ball.velocity.y *= 0;
    }
    ball.setPosition({x:x, y:y});
}

//detects an intersection, returns true if there is.
function intersect(r1, r2) {
	return !(
                r2.x > r1.x + r1.width ||
                r2.x + r2.width < r1.x ||
                r2.y > r1.y + r1.height ||
                r2.y + r2.height < r1.y
            );
}

function updateBall(frame) {
    var timeDiff = frame.timeDiff;
    var stage = ball.getStage();
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

    ball.setPosition({x:x, y:y});
    
    handleCollision();
}

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var ballLayer = new Konva.Layer();
var radius = 40;
var anim;
var pillarLayer = new Konva.Layer();

// create ball
var ball = new Konva.Circle({
    x: 190,
    y: 500,
    radius: radius,
    fill: 'blue',
    opacity: 0.8
});

//obstacle
var pillar = new Konva.Rect({
	x: 250,
	y: 680,
	width: 30,
	height:80,
	fill: 'black'
});

// custom property
ball.velocity = {
    x: 0,
    y: 0
};

pillarLayer.add(pillar);
ballLayer.add(ball);
stage.add(ballLayer, pillarLayer);
    
anim = new Konva.Animation(function(frame) {
    updateBall(frame);
}, ballLayer);

anim.start();