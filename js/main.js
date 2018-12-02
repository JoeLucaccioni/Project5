$(document).ready(function(){
	
	drawCircle();
	
	var deltaX = 0;
	var deltaY = 0;
	
	$(window).keypress(function(e) { // On Keypress, adjust position variables and redraw the circle
	  //console.log(e.keyCode); // used for checking keyCodes
	  switch(e.keyCode){
		   
		case 97: // A
		   	
			deltaX -= 5;
			//console.log(deltaX);
			drawCircle();
			break;
			
		case 100: // D
						
			deltaX += 5;
			//console.log(deltaX);
			drawCircle();
			break;
			
		case 115: // W
			
			deltaY += 5;
			drawCircle();
			break;
			
		case 119: // S
			
			deltaY -= 5;
			drawCircle();
			break;
	   }
	});
	
	function drawCircle(){
		var width = window.innerWidth;
		var height = window.innerHeight;
    
		var stage = new Konva.Stage({
			container: 'game',
			width: width,
			height: height
		});

		var layer = new Konva.Layer();

		var circle = new Konva.Circle({
			x: (stage.getWidth() / 2) + deltaX, // Position is starting position + change in position
			y: (stage.getHeight() / 2) + deltaY,
			radius: 70,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 4
		});
		
		//console.log(circle.x); //doesn't return an integer

		// add the shape to the layer
		layer.add(circle);

		// add the layer to the stage
		stage.add(layer);
	}
});