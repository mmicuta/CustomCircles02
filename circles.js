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



<<<<<<< HEAD
n = 5;
=======
n = 10;
>>>>>>> _Cellular-Automata-Test-1

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
	function switchState(input) {
		if (input.state === 0) {
			//input.fillColor = "black";
			input.fadeToggle = 2;
			input.state = 1;
		} else {
			//input.fillColor = "white";
			input.fadeToggle = 1;
			input.state = 0;
		}
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

	// Gradual fade using onFrame functionality
	function fadeTo(increment) {
		for (var i = 0; i < circleGroup.children.length; i++) {
			fadeValue = circleGroup.children[i].fillColor.lightness;
			if ((circleGroup.children[i].fadeToggle === 1) && (fadeValue >= 0)) {
				circleGroup.children[i].fillColor.lightness -= increment;
			} else if ((circleGroup.children[i].fadeToggle === 2) && (fadeValue <= 1)) {
				circleGroup.children[i].fillColor.lightness += increment;
			} else {
				circleGroup.children[i].fadeToggle = 0;
			}
		}
	}

	// Cellular Automata function, switch circle state based on neighbours
	function automata(input) {
			var count = 0;
			var neighbours = [];
			for (var i = -1; i <= 2; i++) {
				for (var j = -1; j <= 2; j++) {
					var x = input.address_x + i;
					var y = input.address_y + j;

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
				switchState(input)
				//input.activated = 1
			} else if (count <= neighbours.length/2 && input.state == 0) {
				switchState(input)
				//input.activated = 2
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
			//circle.fillColor = "black";
			//circle.fillColor.lightness = 1;
		} else {
			//circle.fillColor = "black";
			circle.fillColor.lightness = 1;
			circle.state = 1;
		}
		circleGroup.addChild(circle);


		// Mouse event based behaviour
		circle.onMouseEnter = function(event){		
			//if (mouse === 0) {
			//	switchState(this);
			//} else {
			//	fadeFill(this);
				//document.getElementById("test").innerText=this.fadeToggle;
			//}	
			//document.getElementById("test").innerText=(this.address_x + ", " + this.address_y);
			fadeFill(this);
		}

		circle.onMouseLeave = function(event){		
			//if (this.state === 0) {
			//	this.fillColor.lightness = 0;
			//} else {
			//	this.fillColor.lightness = 1;
			//}


			if (mouse === 0) {
				switchState(this);
			} else if (this.state === 0) {
				this.fillColor.lightness = 0;
			} else {
				this.fillColor.lightness = 1;
			}
		}		

		circle.onClick = function(event){
			for (var k = -2; k < 4; k++){
				var x = this.address_x + k;
				var y = this.address_y;

				var newCircle = project.getItem({
					address_x: x,
					address_y: y
				})

				if (x < 0) {
					continue;
				} else if (x >= nw) {
					continue;
				} else {
					automata(newCircle);
				}
			}

			for (var k = -2; k < 4; k++){
				var x = this.address_x;
				var y = this.address_y + k;

				var newCircle = project.getItem({
					address_x: x,
					address_y: y
				})

				if (y < 0) {
					continue;
				} else if (y >= nh) {
					continue;
				} else {
					automata(newCircle);
				}
				
			}
			//document.getElementById("test").innerText=newCircle.address_x;
			//switchState(this);
		}

		circle.onDoubleClick = function(event){
			switchStroke(circleGroup);
		}

		//circleGroup.fillColor = "red";
		//circleGroup.fillColor.hue += 1;

		view.onFrame = function(event){


			//for (var i = 0; i < circleGroup.children.length; i++){
				//circleGroup.children[i].fillColor.lightness -= .01;
			//}
			fadeTo(0.02);
			//circleGroup.fillColor.hue += 1;
			//circleGroup.children[2].hue += .1;

		//	this.scale += 1;
			//document.getElementById("test").innerText=event.time;
			//document.getElementById("test").innerText=circleGroup.children.length;
			//fadeTo(fadeToggle);
			//circleGroup.lightness += .01;
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


