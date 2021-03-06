var port=8437;
var socket = io.connect('http://cslab.kenyon.edu:'+port);

var serverOutput;
var userNumber;
var leftHits = 0;
var rightHits = 0;
var time = 100;


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
			
		case 119: // W
			
			input='W';
			//console.log(input);
			break;
			
		case 32: // space
			
			input='_';
			//console.log(input);
			break;
	   }
	   //console.log(userNumber);
	   socket.emit('message', {
	   	operation: 'input',
		input: input,
		user: userNumber
	   });
	   
	});
	
	
	
	socket.on('message', function(message) { //Event Handler for parsing server messages and moving the ball
		  
		if (message.operation == 'userNumber') {
			userNumber = message.userNumber;
			console.log(userNumber);
		}	
		if(message.operation == 'timer'){
			$('#timer').text(message.timer);
			if(message.timer <= 0)
				winnerCheck();
		}
		if(message.operation == 'movement'){
			if(message.userNumber == 1){
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
						}
						break;
						
					case '_': // space
						//Only swing sword if it is not currently being swung
						if(swordA.swing==0){
				
							swordA.swing++;
					  		var angularSpeed = 500; //speed sword swings
					    	swordA.angle=0;
					    
					   		//start down swing
    						var swordSwing = new Konva.Animation(function(frame) {
       						var angleDiff = frame.timeDiff * angularSpeed / 1000;
       						swordA.angle+=angleDiff;
       							if (swordA.angle>60) {
       						  		angularSpeed=-500;
       						  	}
       						  	if (swordA.angle<0) {
       						 	swordSwing.stop();	
       						  	}
      						  	swordA.rotate(angleDiff);
        					}, swordLayer);
							swordSwing.start();
						
						swordA.setRotation(sword_a);
						swordA.swing=0;
					}	
					break;			
				};
			}
			if(message.userNumber == 2){
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
						}
						break;
					case '_': //spacebar
						//Only swing sword if it is not currently being swung
						if(swordB.swing == 0){
				
							swordB.swing++;
					  		var angularSpeed = -500; //speed sword swings
					    	swordB.angle = 0;
					    
					   		//start down swing
    						var swordSwing = new Konva.Animation(function(frame) {
       						var angleDiff = frame.timeDiff * angularSpeed / 1000;
       						swordB.angle += angleDiff;
       							if (swordB.angle < -60) {
       						  		angularSpeed = 500;
       						  	}
       						  	if (swordB.angle > 0) {
       						 	swordSwing.stop();	
       						  	}
      						  	swordB.rotate(angleDiff);
        					}, swordLayer);
							swordSwing.start();
						
						swordB.setRotation(-sword_a);
						swordB.swing = 0;
					}	
					break;	
				};
			}
		}
		if(message.operation == 'attack'){
			console.log("player was hit");
			console.log(message.hit);
			if(message.hit == 'R'){	
				rctA.setPosition({x:190, y:500});
    			rctB.setPosition({x:width-190, y:500});	
				rightHits++;
    			$("#counterR").empty()
				$("#counterR").append(message.rscore);
			}else if(message.hit == 'L'){
				rctA.setPosition({x:190, y:500});
    			rctB.setPosition({x:width-190, y:500});	
				leftHits++;
				$("#counterL").empty()
				$("#counterL").append(message.lscore);
			}
		}
		if(message.operation == 'Complete'){
			console.log(message.winner);
			alert(message.winner);
		}
	});
	
	$("#counterR").append(rightHits);
	$("#counterL").append(leftHits);
});

//detects and handles collisions of swords and bodies
function handleCollision() {
	var targetRectA = swordA.getClientRect();
	var targetRectB = swordB.getClientRect();
	var moverA = rctA.getClientRect();
	var moverB = rctB.getClientRect();
    var xA = rctA.getX();
    var yA = rctA.getY();
	var xB = rctB.getX();
	var yB = rctB.getY();
	
	if(userNumber == 2){
		if(intersect(moverA, targetRectB)){
    		console.log("right player lands hit");
    		victory('R');
    	}
    }
    if(userNumber == 1){
    	if(intersect(moverB, targetRectA)){
    		console.log("left player lands hit");
    		victory('L');
    	}
    }
    if(intersect(moverA, moverB)){
		console.log("collision");
    	rctA.velocity.x *= 0;
    	rctA.velocity.y *= 0;
    	rctA.setPosition({x:xA+1, y:yA});
    	rctB.velocity.x *= 0;
    	rctB.velocity.y *= 0;
    	rctB.setPosition({x:xB-1, y:yB});
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

function winnerCheck(){
	if(leftHits > rightHits){
		socket.emit('message', {
			operation: 'winner',
			winner: 'Blue wins'
		});
	}else if(rightHits > leftHits){
		socket.emit('message', {
			operation: 'winner',
			winner: 'Red wins'
		});
	}else if(rightHits == leftHits){
		socket.emit('message', {
			operation: 'winner',
			winner: 'Draw'
		});
	}
}

var width = 1400;
var height = 750;
	
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
	
	if(yB < radius) {
        yB = radius;
        rctB.velocity.y *= -1;
        rctB.velocity.y *= (1 - collisionDamper);
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
	//for the second ball as well
	if(rctB.velocity.x != 0) {
    	if(rctB.velocity.x > 0.1) {
                rctB.velocity.x -= floorFrictionSpeedReduction;
        }
        else if(rctB.velocity.x < -0.1) {
            rctB.velocity.x += floorFrictionSpeedReduction;
        }
        else {
            rctB.velocity.x = 0;
        }
    }

    // right wall condition
    if(xA > (width - radius)) {
        xA = width - radius;
        rctA.velocity.x *= -1;
        rctA.velocity.x *= (1 - collisionDamper);
    }
	
	if(xB > (width - radius)) {
        xB = width - radius;
        rctB.velocity.x *= -1;
        rctB.velocity.x *= (1 - collisionDamper);
    }

    // left wall condition
    if(xA < radius) {
        xA = radius;
        rctA.velocity.x *= -1;
        rctA.velocity.x *= (1 - collisionDamper);
    }
	
	if(xB < radius) {
        xB = radius;
        rctB.velocity.x *= -1;
        rctB.velocity.x *= (1 - collisionDamper);
    }
	
	//Sets the x,y postion of the ball
    rctA.setPosition({x:xA, y:yA});
    rctB.setPosition({x:xB, y:yB});
    
    //Sets the x,y postion of the sword based on the movement of the ball
    swordA.setPosition({x:(xA+25), y:yA+25});
    swordB.setPosition({x:(xB+10), y:yB+25});

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

// create rectA
var rctA = new Konva.Rect({
    x: 190,
    y: 500,
    width: radius,
    height: radius,
    fill: 'blue',
    opacity: 0.8
});


// create rectB
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
	fill: 'blue',
	offset: {
            x: 0,
            y: sword_h
        }
});
swordA.swing = 0;

// create swordB
var swordB = new Konva.Rect({
	x: width-240,
	y: 500,
	width: sword_w,
	height: sword_h,
	rotation: -sword_a,
	fill: 'red',
	offset: {
            x: 0,
            y: sword_h
        }
});
swordB.swing = 0;

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
