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
    	if(message.operation = 'animation'){
			keyStroke = message.output;
			console.log(keyStroke);
		}else if (message.operation = 'coordinates'){
			ball.setPosition({x: message.x, y: message.y})
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