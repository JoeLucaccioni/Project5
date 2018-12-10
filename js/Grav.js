var width = window.innerWidth;
var height = window.innerHeight;

//detects and handles collision
function handleCollision() {
	var targetRect = pillar.getClientRect();
	var mover = ball.getClientRect();
    var x = ball.getX();
    var y = ball.getY();
	
	if(intersect(mover, targetRect)){
		console.log("collision");
    	ball.velocity.x *= -1;
    	ball.velocity.y *= -1;
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
        ball.velocity.x *= -1;
        ball.velocity.x *= (1 - collisionDamper);
    }

    // left wall condition
    if(x < radius) {
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
    
    handleCollision();
}

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var ballLayer = new Konva.Layer();
var radius = 20;
var anim;
var pillarLayer = new Konva.Layer();
var swordLayer = new Konva.Layer();

// create ball
var ball = new Konva.Circle({
    x: 190,
    y: 500,
    radius: radius,
    fill: 'blue',
    opacity: 0.8
});

// create sword
var sword = new Konva.Rect({
	x: 200,
	y: 500,
	width: 3,
	height:30,
	fill: 'blue'
});

//obstacle
var pillar = new Konva.Rect({
	x: 250,
	y: 740,
	width: 20,
	height:50,
	fill: 'black'
});

// custom property
ball.velocity = {
    x: 0,
    y: 0
};

pillarLayer.add(pillar);
ballLayer.add(ball);
swordLayer.add(sword)
stage.add(ballLayer, pillarLayer);
    
anim = new Konva.Animation(function(frame) {
    updateBall(frame);
}, ballLayer);

anim.start();