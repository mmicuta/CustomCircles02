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



n = 10;

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
			input.fillColor = "black";
			input.state = 1;
		} else {
			input.fillColor = "white";
			input.state = 0;
		}
	}

	// Change opacity of object based on its colour
	function fadeFill(input) {
		if (input.state === 0) {
			input.fillColor = "hsla(0,0%,80%,1)";
		} else {
			input.fillColor = "hsla(0,0%,20%,1)";
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
			var centroid = new paper.Point({state:1});
			centroid.x = ((w1-w2)/2)+gw*i+(w3/2);
			centroid.y = ((h1-h2)/2)+gw*j+(h3/2);
			centroid.address_x = i;
			centroid.address_y = j;
			centroidsArray.push(centroid);
		}
	};

	// Draw circles from point coordinates and radius
	for (var i = 0; i < centroidsArray.length; i++) {
		var centroid = centroidsArray[i]
		var circle = []
		circle = new paper.Path.Circle(new paper.Point(centroid.x, centroid.y), radius);
		circle.state = centroidsArray[i].state;
		circle.address_x = centroidsArray[i].address_x;
		circle.address_y = centroidsArray[i].address_y;
		if (circle.state = 0) {
			circle.fillColor = "black";
			circle.strokeColor = "black";
			circle.strokeWidth = 1;
			circle.state = 1;
		} else {
			circle.fillColor = "white";
			circle.strokeColor = "black";
			circle.strokeWidth = 1;
			circle.state = 0;
		}


		circle.onMouseEnter = function(event){		
			if (mouse === 0) {
				switchState(this);
			} else {
				fadeFill(this);
			}	
		}

		circle.onMouseLeave = function(event){		
			if (this.state === 0) {
				this.fillColor = "white";
			} else {
				this.fillColor = "black";
			}
		}		

		circle.onClick = function(event){
			var indexX = this.address_x;
			var indexY = this.address_y;

			//circleAddress = this.address_x + "," + this.address_y;
			//document.getElementById("test").innerText=circleAddress;

			switchState(this);
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


