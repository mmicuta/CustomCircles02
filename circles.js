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
	var canvasHeight = $(window).innerHeight();
	var canvasWidth = $(window).innerWidth();

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
			} else {
				input.fadeToggle = 1;
				input.state = 0;
			}
		}, fadeDelay);
	}

	// Switch border style
	function switchStroke(input) {
		if (input.borderState === 0) {
			input.strokeColor = 1;
			input.borderState = 1;
		} else {
			input.strokeColor = 0;
			input.borderState = 0;
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



	// Choose a random next direction for the switchState pathway to move to
	function randomPath(oldX, oldY, oldAdds) {

		possiblePaths = [[1,0],[-1,0],[0,1],[0,-1]]
		shuffleArray(possiblePaths);
		
		for (var z = 0; z < 12; z++) {
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

			checkIndex = oldAdds.indexOf(newCoords);

			if (checkIndex == -1) {
				newXAdd = newX;
				newYAdd = newY;
				break;
			} else {
				newXAdd = 0;
				newYAdd = 0;
			}

		}

		document.getElementById("test").innerText=checkIndex;

	}


	// Create automata pathway from selected circle
	function automataPathway(input) {

		var oldAddresses = []
		var possibleAddresses = []
		var firstAddress = [input.address_x,input.address_y];
		oldAddresses.push(firstAddress);
		switchState(input, 0);

		for (var k = 0; k < 4; k++){

			oldX = input.address_x
			oldY = input.address_y
			

			if (k < 2) {

				negXAdd = input.address_x - k;
				posXAdd = input.address_x + k;
				negYAdd = input.address_y - k;
				posYAdd = input.address_y + k;

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

				oldAddresses.push([negXAdd,oldY]);
				oldAddresses.push([posXAdd,oldY]);
				oldAddresses.push([oldX,negYAdd]);
				oldAddresses.push([oldX,posYAdd]);

			} else {

				randomPath(negX.address_x, negX.address_y, oldAddresses);
				negX = project.getItem({
					address_x: newXAdd,
					address_y: newYAdd
				})
				oldAddresses.push([newXAdd,newYAdd]);

				randomPath(posX.address_x, posX.address_y, oldAddresses);
				posX = project.getItem({
					address_x: newXAdd,
					address_y: newYAdd
				})
				oldAddresses.push([newXAdd,newYAdd]);

				randomPath(negY.address_x, negY.address_y, oldAddresses);
				negY = project.getItem({
					address_x: newXAdd,
					address_y: newYAdd
				})
				oldAddresses.push([newXAdd,newYAdd]);

				randomPath(posY.address_x, posY.address_y, oldAddresses);
				posY = project.getItem({
					address_x: newXAdd,
					address_y: newYAdd
				})
				oldAddresses.push([newXAdd,newYAdd]);

			}

			automata(negX, k);
			automata(posX, k);
			automata(negY, k);
			automata(posY, k);

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
	circleGroup.strokeWidth = 1;


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
		if (circle.state === 0) {
		} else {
			circle.fillColor.lightness = 1;
			circle.state = 1;
		}
		circleGroup.addChild(circle);


		// Mouse event based behaviour
		circle.onMouseEnter = function(event){		
			fadeFill(this);
		}

		circle.onMouseLeave = function(event){		
			if (mouse === 0) {
				switchState(this,0);
			} else if (this.state === 0) {
				this.fillColor.lightness = 0;
			} else {
				this.fillColor.lightness = 1;
			}
		}		

		circle.onClick = function(event){
			automataPathway(this);
		}

		circle.onDoubleClick = function(event){
			switchStroke(circleGroup);
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


