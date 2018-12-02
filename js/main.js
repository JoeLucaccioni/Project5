$(document).ready(function(){
	
	konvaTest();
	
	$(window).keypress(function(e) {
		
		var deltaX = 0;
		var deltaY = 0;
	
	
	   switch(e.keyCode){
		   
		   case 97:
		   
			console.log('A');
			
			deltaX -= 2;
			console.log(deltaX);
			
			break;
			
			case 100:
			
			console.log('D');
			
			deltaY += 2;
			console.log(deltaY);
			
			break;
		   
	   }
	   
	   //console.log(key);
	   /* if(key === 97)
	   {
		   console.log('A');
		   
	   }
	   
	   if(key === 100)
	   {
		   console.log('D');
	   } */
    });
	
	function aPress(){
	
		
	
	}
		
	function konvaTest(){
		var width = window.innerWidth;
		var height = window.innerHeight;
    
		var stage = new Konva.Stage({
			container: 'game',
			width: width,
			height: height
		});

		var layer = new Konva.Layer();

		var circle = new Konva.Circle({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			//console.log(x);
			radius: 70,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 4
		});

		// add the shape to the layer
		layer.add(circle);

		// add the layer to the stage
		stage.add(layer);
	}
});