// UI Controls
$(function() {
	$( "#slider" ).slider({
		value: 10,
		min: 5,
		max: 20,
		step: 1,
		slide: function(){
			//document.getElementById("test").innerText=$("#slider").slider("value");
			n = $("#slider").slider("value");
			circles();
		},
		change: function(event, ui){
			//var n = $("#slider").slider("value");
			//circles();
		}
	});
});

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


n = 10;
//fadeIncrement = 0.08;
fadeIncrement = 0.08;

// Install paper.js event handlers
paper.install(window);

//Functions
function circles() {
	// Reference canvas element
	var canvas = document.getElementById("canvas01"); 

	// Clear previous canvas
	paper.clear(canvas);

	// Define canvas dimensions based on view window width and height
	//var canvasHeight = $(window).innerHeight()-250;
	//var canvasWidth = $(window).innerWidth();
	//var canvasWidth = canvasHeight * (3/5);
	var canvasWidth = $(".canvascontainer").innerWidth();
	var canvasHeight = canvasWidth * 1.618;

	// Define height and width divisions by screen proportions
	if (canvasHeight >= canvasWidth) {
		var nw = n;
		var gw = canvasWidth/n;
		var nh = Math.floor(canvasHeight/gw);
		var h3 = canvasHeight-(nh*gw);
		var w3 = 0;
	} else {
		var nh = n;
		var gw = canvasHeight/n;
		var nw = Math.floor(canvasWidth/gw);
		var w3 = canvasWidth-(nw*gw);
		var h3 = 0;
	}

	var h1 = canvasHeight;
	var w1 = canvasWidth;
	var h2 = canvasHeight - gw;
	var w2 = canvasWidth - gw;
	var radius = (0.85*gw)/2;

	// Adjust canvas size to window size and centre it
	canvas.height = h1;
	canvas.width = w1;
	canvas.style.margin = "0 auto";


	// Setup Paper.js project
	paper.setup(canvas);

	// Canvas specific functions
	// Switch state and fill of object
	function switchState(input, delay) {
		stepCount = 1/fadeIncrement;
		fadeDelay = Math.floor(delay * (stepCount*(1/60)) * 1000)/2;
		//fadeDelay = delay * (stepCount*(1/60)) * 1000;
		setTimeout(function(){
			if (input.state === 0) {
				input.fadeToggle = 2;
				input.state = 1;
				input.strokeWidth = 0.5;
			} else {
				input.fadeToggle = 1;
				input.state = 0;
				input.strokeWidth = 0.5;
			}
		}, fadeDelay);
	}

	// Switch border style
	function switchStroke(input) {
		if (input.borderState === 1) {
			input.strokeColor = 0;
			input.borderState = 0;
		} else if (input.borderState === 0) {
			input.strokeColor = 1;
			input.borderState = 1;
		}
	}

	// Change opacity of object based on its colour
	function fadeFill(input) {
		if (input.state === 0) {
			input.fillColor.lightness = 0.2;
		} else {
			input.fillColor.lightness = 0.8;
		}
	}

	// Change opacity of object based on its colour
	function scaleStroke(input) {
		if (input.state === 0) {
			input.strokeWidth = 2;
		} else {
			input.strokeWidth = 0.1;
		}
	}

	// Invert fill of all circles
	function invertFill(input) {
		for (var i = 0; i < input.children.length; i++) {
			switchState(input.children[i],0);
		}
	}

	// Clear fill to all white
	function clearFill(input) {
		for (var i = 0; i < input.children.length; i++) {
			if (input.children[i].state != 1) {
				switchState(input.children[i]);
			}
		}
	}

	// Clear fill to all white
	function randomFill(input) {
		for (var i = 0; i < input.children.length; i++) {
			if (Math.random()<0.5) {
				switchState(input.children[i]);
			}
		}
	}




	// Choose a random next direction for the switchState pathway to move to
	function randomPath(oldX, oldY, oldAdds) {

		possiblePaths = [[1,0],[-1,0],[0,1],[0,-1]]
		shuffleArray(possiblePaths);

		newXAdd = [];
		newYAdd = [];
		invalidCircle = 1;
		
		for (var z = 0; z < 4; z++) {
			newPath = possiblePaths[z];
			newX = oldX + newPath[0];
			newY = oldY + newPath[1];

			if (newX < 0) {
				continue;
			} else if (newX >= nw) {
				continue;
			} else if (newY < 0) {
				continue;
			} else if (newY >= nh) {
				continue;
			}

			newCoords = [newX,newY];
			checkIndex = -1
			testVal = []
			testVal2 = []

			for (var zz = 0; zz < oldAdds.length; zz++) {
				checkAdd = []
				checkAddX = oldAdds[zz].address_x
				checkAddY = oldAdds[zz].address_y
				testVal.push([checkAddX,checkAddY] + " ")
				if ((newX == checkAddX)&&(newY == checkAddY)) {
					checkIndex = 0
					continue
				}
			}


			testVal2.push([newX,newY] + " ")

			//checkIndex = oldAdds.indexOf(newCoords);

			if (checkIndex === -1) {
				newXAdd = newX;
				newYAdd = newY;
				invalidCircle = 0;
				break;
			} else {
				invalidCircle = 1;
			}
		}

	//	document.getElementById("test").innerText=testVal;
	//	document.getElementById("test2").innerText=testVal2;
	//	document.getElementById("test3").innerText=checkAdd;

	}


	// Create automata pathway from selected circle
	function automataPathway(input) {

		var oldAddresses = []
		var possibleAddresses = []
		var firstAddress = [input.address_x,input.address_y];
		oldX = input.address_x
		oldY = input.address_y
		var firstAddressCoords = {address_x:oldX, address_y:oldY}
		oldAddresses.push(firstAddressCoords);
		switchState(input, 0);

		for (var k = 0; k < (Math.min(nw,nh)/2); k++){

			if (k < 2) {

				negXAdd = input.address_x - k;
				posXAdd = input.address_x + k;
				negYAdd = input.address_y - k;
				posYAdd = input.address_y + k;

				if (negXAdd < 0) {
					continue;
				} else if (negXAdd >= nw) {
					continue;
				} else if (posXAdd < 0) {
					continue;
				} else if (posXAdd >= nw) {
					continue;
				} else if (negYAdd < 0) {
					continue;
				} else if (negYAdd >= nh) {
					continue;
				} else if (posYAdd < 0) {
					continue;
				} else if (posYAdd >= nh) {
					continue;
				}

				negX = project.getItem({
					address_x: negXAdd,
					address_y: oldY
				})

				posX = project.getItem({
					address_x: posXAdd,
					address_y: oldY
				})

				negY = project.getItem({
					address_x: oldX,
					address_y: negYAdd
				})		

				posY = project.getItem({
					address_x: oldX,
					address_y: posYAdd
				}) 

				negXCoords = {address_x:negXAdd, address_y:oldY}
				posXCoords = {address_x:posXAdd, address_y:oldY}
				negYCoords = {address_x:oldX, address_y:negYAdd}
				posYCoords = {address_x:oldX, address_y:posYAdd}

				oldAddresses.push(negXCoords);
				oldAddresses.push(posXCoords);
				oldAddresses.push(negYCoords);
				oldAddresses.push(posYCoords);

				automata(negX, k/2);
				automata(posX, k/2);
				automata(negY, k/2);
				automata(posY, k/2);

			} else {

				randomPath(negX.address_x, negX.address_y, oldAddresses);
				if (invalidCircle === 0) {
					negX = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(negX, k/2);			
				}


				randomPath(posX.address_x, posX.address_y, oldAddresses);
				if (invalidCircle === 0) {
					posX = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(posX, k/2);
				}

				randomPath(negY.address_x, negY.address_y, oldAddresses);
				if (invalidCircle === 0) {
					negY = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(negY, k/2);
				}

				randomPath(posY.address_x, posY.address_y, oldAddresses);
				if (invalidCircle === 0) {
					posY = project.getItem({
						address_x: newXAdd,
						address_y: newYAdd
					})
					newCoords = {address_x:newXAdd, address_y:newYAdd}
					oldAddresses.push(newCoords);
					automata(posY, k/2);
				}

			}

		//	document.getElementById("test").innerText=oldAddresses[0].address_x;
		//	document.getElementById("test2").innerText=oldAddresses[0].address_y;

		}	
	};

	// Cellular Automata function, switch circle state based on neighbours
	function automata(input, delay) {
			var count = 0;
			var neighbours = [];
			for (var i = -1; i <= 2; i++) {
				for (var j = -1; j <= 2; j++) {
					var x = input.address_x + i;
					var y = input.address_y + j;

					// Check against boundary conditions, stop process when adjacent to edges.
					if (x < 0) {
						continue;
					} else if (x >= nw) {
						continue;
					} else if (y < 0) {
						continue;
					} else if (y >= nh) {
						continue;
					}

					var neighbour = project.getItem({address_x: x, address_y: y})
					var value = neighbour.state;
					count += value;
					neighbours.push(neighbour);
				}
			}	

			switchState(input, delay);
	}	

	// Record if the mouse is clicked
	mouse = 1;
	$("#canvas01").mousedown(function(){
		mouse = 0;
	});
	$("#canvas01").mouseup(function(){
		mouse = 1;
	});



	// Create centroid point coordinates
	var centroidsArray = []
	for (var i = 0; i <= nw-1; i++) {
		for (var j = 0; j <= nh-1; j++) {
			var centroid = new paper.Point({state:0});
			centroid.x = ((w1-w2)/2)+gw*i+(w3/2);
			centroid.y = ((h1-h2)/2)+gw*j+(h3/2);
			centroid.address_x = i;
			centroid.address_y = j;
			centroidsArray.push(centroid);
		}
	};

	// Draw circles from point coordinates and radius
	circleGroup = new Group();
	circleGroup.borderState = 1;

	for (var i = 0; i < centroidsArray.length; i++) {
		var centroid = centroidsArray[i]
		var circle = []
		circle = new paper.Path.Circle(new paper.Point(centroid.x, centroid.y), radius);
		circle.state = centroidsArray[i].state;
		circle.activated = 0;
		circle.address_x = centroidsArray[i].address_x;
		circle.address_y = centroidsArray[i].address_y;
		circle.fadeToggle = 0;
		circle.fillColor = {hue: 0, saturation: 0, lightness: 0};
		circle.strokeColor = {hue: 0, saturation: 0, lightness: 0};
		circle.strokeWidth = 0.5;
		if (circle.state === 0) {
		} else {
			circle.fillColor.lightness = 1;
			circle.state = 1;
		}
		circleGroup.addChild(circle);
		circleGroup.borderState = 1;


		// Mouse event based behaviour
		circle.onMouseEnter = function(){		
			scaleStroke(this);
		//	document.getElementById("test").innerText=[this.address_x,this.address_y];
		}

		circle.onMouseLeave = function(){		
			if (mouse === 0) {
				switchState(this,0);
				this.strokeWidth = 0.5;
			} else if (this.state === 0) {
				this.strokeWidth = 0.5;
			} else {
				this.strokeWidth = 0.5;
			}
		}		

		circle.onClick = function(){
			automataPathway(this);
		}

		view.onFrame = function(event){

			// Gradual fade using onFrame functionality
			function fadeTo(increment, delay) {
				eventStart = event.count;
				eventDelta = eventStart

				stepCount = 1/increment;
				fadeStart = (delay * stepCount) + eventStart;
				stepSize = [];

				//document.getElementById("test").innerText=delay;
				
				//document.getElementById("test").innerText=fadeStart;

				if (event.count >= fadeStart) {
					stepSize = 0;
				} else {
					stepSize = increment;
				}

				//timeInterval = delay * ((1/fadeIncrement) * (1/60)) * 1000;
				//document.getElementById("test").innerText=timeInterval;
				for (var i = 0; i < circleGroup.children.length; i++) {
					fadeValue = circleGroup.children[i].fillColor.lightness;
					if ((circleGroup.children[i].fadeToggle === 1) && (fadeValue >= 0)) {
						circleGroup.children[i].fillColor.lightness -= stepSize;
					} else if ((circleGroup.children[i].fadeToggle === 2) && (fadeValue <= 1)) {
						circleGroup.children[i].fillColor.lightness += stepSize;
					} else {
						circleGroup.children[i].fadeToggle = 0;
					}
				}
			}
			fadeTo(fadeIncrement);
		}

	};

	$("#bdr").click(function() {
		switchStroke(circleGroup);
	});

	$("#inv").click(function() {
		invertFill(circleGroup);
	});

	$("#clr").click(function() {
		clearFill(circleGroup);
	});

	$("#rnd").click(function() {
		randomFill(circleGroup);
	});

	paper.view.draw();



};



//Setup SVG Canvas
$(document).ready(function() {

	circles();

	

});

//Resize canvas to match window size
$(window).resize(function() {
	circles();
});