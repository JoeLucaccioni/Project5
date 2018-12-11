var port=8437;
var socket = io.connect('http://cslab.kenyon.edu:'+port+'/test-namespace');

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
			
		//case 32: // 'space'
			
			//input='space';
			//console.log(input);
			//break;
	   }
	   socket.emit('message', {
    	operation: 'input',
    	input: input
    });
	   
	    
});
	   

	