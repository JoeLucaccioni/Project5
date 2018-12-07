var port=8463;
var socket = io.connect('http://cslab.kenyon.edu:'+port);

$(window).keypress(function(e) { // On Keypress, adjust position variables and redraw the circle
	  //console.log(e.keyCode); // used for checking keyCodes
	  switch(e.keyCode){
		   
		case 97: // A
		   	
			socket.emit(input,{
			operation: "movement",
			stroke: A,
			});
			break;
			
		case 100: // D
						
			socket.emit('D');
			break;
			
		case 115: // W
			
			socket.emit('W');
			break;
			
		case 119: // S
			
			socket.emit('S');
			break;
	   }
	   
	    
	}
	   
	});