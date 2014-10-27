// UI Controls
$(function() {
	$( "#slider" ).slider({
		value: 5,
		min: 5,
		max: 30,
		step: 1,
		slide: function(){
			//document.getElementById("test").innerText=$("#slider").slider("value");
			circles();
		},
		change: function(event, ui){
			//var n = $("#slider").slider("value");
			//circles();
		}
	});
	//var n = $("#slider").slider("value");
});

// Install paper.js event handlers
paper.install(window);

//Functions
function circles() {
	// Set up canvas and dimension based on window size
	var canvas = document.getElementById("canvas01"); 
	
	// Declare input variables
	var n = $("#slider").slider("value");

	canvasHeight = $(window).innerHeight();
	canvasWidth = $(window).innerWidth();

	// Define height and width divisions by screen proportions
	if (canvasHeight >= canvasWidth) {
		var nw = n;
		var gw = canvasWidth/n;
		var nh = Math.floor(canvasHeight/gw);
		canvasHeight = nh*gw;
	} else {
		var nh = n;
		var gw = canvasHeight/n;
		var nw = Math.floor(canvasWidth/gw);
		canvasWidth = nw*gw;
	}

	var h1 = canvasHeight;
	var w1 = canvasWidth;
	var h2 = canvasHeight - gw;
	var w2 = canvasWidth - gw;

	//var radius = (0.618*gw)/2;
	var radius = (0.8*gw)/2;


	// Adjust canvas size to window size and centre it
	canvas.height = h1;
	canvas.width = w1;
	canvas.style.margin = "0 auto";

	// Setup Paper.js project
	paper.setup(canvas);

	// Create centroid point coordinates
	var centroidsArray = []
	for (var i = 0; i <= nw-1; i++) {
		for (var j = 0; j <= nh-1; j++) {
			var centroid = new paper.Point({state:1});
			centroid.x = ((w1-w2)/2)+gw*i;
			centroid.y = ((h1-h2)/2)+gw*j;
			centroidsArray.push(centroid);
		}
	};

	// Draw circles from point coordinates and radius
	for (var i = 0; i < centroidsArray.length; i++) {
		var centroid = centroidsArray[i]
		var circle = []
		circle = new paper.Path.Circle(new paper.Point(centroid.x, centroid.y), radius);
		circle.state = centroidsArray[i].state;
		//circle.fillColor = "black";
		//circle.strokeColor = "black";
		//circle.strokeWidth = 1;
		//if (circle.state = Math.floor(Math.random()*2)) {
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
				this.fillColor = "hsla(0,0%,50%,1)";
			};

		circle.onMouseLeave = function(event){
			if (circle.state = 0) {
				this.fillColor = "white";
				circle.state = 1;
			} else {
				this.fillColor = "black";
				circle.state = 0;
			}
		};			
	};

	//var size = view.size;
	//document.getElementById("test").innerText=size;

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