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



n = 15;
fadeIncrement = 0.1;

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
		fadeDelay = Math.floor(delay * (stepCount*(1/60)) * 1000);
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
			if (count >= neighbours.length/2 && input.state == 1) {
				switchState(input, delay)
			} else if (count <= neighbours.length/2 && input.state == 0) {
				switchState(input, delay)
			}
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
			stepDuration = (1/fadeIncrement) * (1/60) * 1000;
			for (var k = 0; k < 5; k++){
				// Calculate time required for one circle to fade;
				//document.getElementById("test").innerText=stepDuration;
				//setTimeout(function(){},1000);
				//if (k > 0) {
				//	setTimeout(function(){},1000);
				//}

				k1 = k;
				k2 = -k;

				// Create automata along +ve x axis
				var x1 = this.address_x + k1;
				var y1 = this.address_y;
				
				var newCircle1 = project.getItem({
					address_x: x1,
					address_y: y1
				})

				if (x1 < 0) {
					continue;
				} else if (x1 >= nw) {
					continue;
				} else {
					automata(newCircle1,k);
				}

				// Create automata along -ve x axis
				var x2 = this.address_x + k2;
				var y2 = this.address_y;
				
				var newCircle2 = project.getItem({
					address_x: x2,
					address_y: y2
				})

				if (x2 < 0) {
					continue;
				} else if (x1 >= nw) {
					continue;
				} else {
					automata(newCircle2,k);
				}

				// Create automata along +ve y axis
				var x3 = this.address_x;
				var y3 = this.address_y + k1;

				var newCircle3 = project.getItem({
					address_x: x3,
					address_y: y3
				})

				if (y3 < 0) {
					continue;
				} else if (y2 >= nh) {
					continue;
				} else {
					automata(newCircle3,k);
				}

				// Create automata along -ve y axis
				var x4 = this.address_x;
				var y4 = this.address_y + k2;

				var newCircle4 = project.getItem({
					address_x: x4,
					address_y: y4
				})

				if (y4 < 0) {
					continue;
				} else if (y4 >= nh) {
					continue;
				} else {
					automata(newCircle4,k);
				}
			}

			//document.getElementById("test").innerText=newCircle.address_x;
			//switchState(this);
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


