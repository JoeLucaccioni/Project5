var port=8437;
var socket = io.connect('http://cslab.kenyon.edu:'+port);

var serverOutput;
var userNumber;
var leftHits = 0;
var rightHits = 0;
var countDown = 100;


$(document).ready(function () {
	
	socket.emit('message', { //establish communication with server
	    operation: "join"
	});
	
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
	   //console.log(userNumber);
	   socket.emit('message', {
	   	operation: 'input',
		userNumber: userNumber,
		input: input 
	   });
	   
	});
	
	
	
	socket.on('message', function(message) { //Event Handler for parsing server messages and moving the ball
		  
		if (message.operation == 'userNumber') {
			userNumber=message.userNumber;
			//console.log(userNumber);
		}
		
		if(message.operation = 'movement'){
			
			if(message.userNumber==1){
				
				serverOutput=message.output;
				
				switch(serverOutput){
		   
					case 'A': // A
		   	
						rctA.velocity.x = -5;
						break;
			
					case 'D': // D
						
						rctA.velocity.x = 5;
						break;
			
					case 'W': // W
						if(rctA.velocity.y == 0){
							rctA.velocity.y = -6;
							break;
						}
				};
			}
		}
		
		if(message.operation = 'movement'){
			
			console.log(message.userNumer);
			
			if(message.userNumber==2){
				
				serverOutput=message.output;
				
				switch(serverOutput){
		   
					case 'A': // A
		   	
						rctB.velocity.x = -5;
						break;
			
					case 'D': // D
						
						rctB.velocity.x = 5;
						break;
			
					case 'W': // W
						if(rctB.velocity.y == 0){
							rctB.velocity.y = -6;
							break;
						}
				};
			}
		}
		
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
		//console.log(countDown);
			
			
      	if (countDown > 0){  //while user still has time, call the function recursively until they run out or answer a question          
        	timer();              
      	}
      	else{
      		countDown = 0;
      	}
			
   	}, 1000);
}

//detects and handles collisions of swords and bodies
function handleCollision() {
	var targetRectA = swordA.getClientRect();
	var targetRectB = swordB.getClientRect();
	var moverA = rctA.getClientRect();
	var moverB = rctB.getClientRect();
    var xA = rctA.getX();
    var yA = rctA.getY();
	
	if(intersect(moverA, targetRectB)){
    	//rctA.velocity.x *= 0;
    	//rctA.velocity.y *= 0;
    	console.log("right player lands hit");
    	rightHits++;
    	$("#counterR").empty()
		$("#counterR").append(rightHits);
    }
    if(intersect(moverB, targetRectA)){
    	//rctA.velocity.x *= 0;
    	//rctA.velocity.y *= 0;
    	console.log("left player lands hit");
    	leftHits++;
    	$("#counterL").empty()
		$("#counterL").append(leftHits);
    }
    if(intersect(moverA, moverB)){
		console.log("collision");
    	rctA.velocity.x *= 0;
    	rctA.velocity.y *= 0;
    	rctA.setPosition({x:xA-1, y:yA});
    }
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

function victory(victor){
	socket.emit('message', {
		operation: 'victory',
		victor: victor
	   });
}
	
var width = window.innerWidth;
var height = window.innerHeight-30;
	
//physics variables
var floorFriction = 10;
var gravity = 10;
// px / second^2
var collisionDamper = 1;
// full energy loss
	
var leftHits = 0;
var rightHits = 0;
	
function updateRect(frame) {
    var timeDiff = frame.timeDiff;
    //var stage = ball.getStage();
    //var height = stage.getHeight();
    //var width = stage.getWidth();
    var xA = rctA.getX();
    var yA = rctA.getY();
    var xB = rctB.getX();
    var yB = rctB.getY();
    //var radius = ball.getRadius();

    // physics variables
    var speedIncrementFromGravityEachFrame = gravity * timeDiff / 1000;
    // px / second^2
    var floorFrictionSpeedReduction = floorFriction * timeDiff / 1000;

    // gravity
    rctA.velocity.y += speedIncrementFromGravityEachFrame;
    xA += rctA.velocity.x;
    yA += rctA.velocity.y;
    rctB.velocity.y += speedIncrementFromGravityEachFrame;
    xB += rctB.velocity.x;
    yB += rctB.velocity.y;

    // ceiling condition
    if(yA < radius) {
        yA = radius;
        rctA.velocity.y *= -1;
        rctA.velocity.y *= (1 - collisionDamper);
    }

    // floor condition
    if(yA > (height - radius)) {
        yA = height - radius;
        rctA.velocity.y *= -1;
        rctA.velocity.y *= (1 - collisionDamper);
    }
    if(yB > (height - radius)) {
        yB = height - radius;
        rctB.velocity.y *= -1;
        rctB.velocity.y *= (1 - collisionDamper);
    }
    
    // floor friction
    if(rctA.velocity.x != 0) {
    	if(rctA.velocity.x > 0.1) {
                rctA.velocity.x -= floorFrictionSpeedReduction;
        }
        else if(rctA.velocity.x < -0.1) {
            rctA.velocity.x += floorFrictionSpeedReduction;
        }
        else {
            rctA.velocity.x = 0;
        }
    }

    // right wall condition
    if(xA > (width - radius)) {
        xA = width - radius;
        rctA.velocity.x *= -1;
        rctA.velocity.x *= (1 - collisionDamper);
    }

    // left wall condition
    if(xA < radius) {
    	/*console.log("hit left wall");
    	leftHits++;
    	$("#counterL").empty();
    	$("#counterL").append(leftHits);
    	console.log(leftHits);*/
        xA = radius;
        rctA.velocity.x *= -1;
        rctA.velocity.x *= (1 - collisionDamper);
    }
	
	//Sets the x,y postion of the ball
    rctA.setPosition({x:xA, y:yA});
    rctB.setPosition({x:xB, y:yB});
    
    //Sets the x,y postion of the sword based on the movement of the ball
    swordA.setPosition({x:(xA+65), y:yA-30});
    swordB.setPosition({x:(xB-30), y:yB-30});

	//detects collision between swords and balls
	handleCollision();
}

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

//declaring ball variables
var rctLayer = new Konva.Layer();
var radius = 40;
var anim;

//declaring sword variables
var swordLayer = new Konva.Layer();
var sword_w=4;  //sword width
var sword_h=70; //sword height
var sword_a=35; //sword angle

// create ballA
var rctA = new Konva.Rect({
    x: 190,
    y: 500,
    width: radius,
    height: radius,
    fill: 'blue',
    opacity: 0.8
});


// create ballB
var rctB = new Konva.Rect({
    x: width-190,
    y: 500,
    width: radius,
    height: radius,
    fill: 'red',
    opacity: 0.8
});

// create swordA
var swordA = new Konva.Rect({
	x: 240,
	y: 500,
	width: sword_w,
	height: sword_h,
	rotation: sword_a,
	fill: 'blue'
});

// create swordB
var swordB = new Konva.Rect({
	x: width-240,
	y: 500,
	width: sword_w,
	height: sword_h,
	rotation: -sword_a,
	fill: 'red'
});

// custom property
rctA.velocity = {
    x: 0,
    y: 0
};

// custom property
rctB.velocity = {
    x: 0,
    y: 0
};

swordLayer.add(swordA, swordB);
rctLayer.add(rctA, rctB);
stage.add(rctLayer, swordLayer);

/*var tween = new Konva.Tween({
    node: ball,
    fill: 'red',
    duration: 0.3,
    easing: Konva.Easings.EaseOut
});*/
  
//Animation that moves ball    
anim = new Konva.Animation(function(frame) {
    updateRect(frame);
}, rctLayer);

anim.start();

//Animation that moves sword
anim2 = new Konva.Animation(function(frame) {
    updateRect(frame);
}, swordLayer);

anim2.start();