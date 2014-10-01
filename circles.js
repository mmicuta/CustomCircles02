// UI Controls
$(function() {
	$( "#slider" ).slider({
		value: 5,
		min: 1,
		max: 50,
		step: 1,
		slide: function(){
			document.getElementById("test").innerText=$("#slider").slider("value");
			circles01();
		},
		change: function(event, ui){
			//var n = $("#slider").slider("value");
			//circles01();
		}
	});
	var n = $("#slider").slider("value");
});


//var n = 3;

//Functions
function circles01() {
	// Set up canvas and paper.js project
	var canvas = document.getElementById("canvas01"); 
	paper.setup(canvas);

	// Declare input variables
	var n = $("#slider").slider("value");

	viewportHeight = $(window).height()
	viewportWidth = $(window).width()

	var h1 = viewportHeight*0.9;
	var w1 = 0.7072*h1;
	//var h2 = 0.618*h1;
	var h2 = 0.4*h1;
	var w2 = h2;

	var hInt = h2/n;
	var wInt = hInt;

	var radius = (0.618*hInt)/2;

	var testData = []

	// Adjust canvas size to window size and centre it
	canvas.height = h1;
	canvas.width = w1;
	canvas.style.position = "absolute";
	canvas.setAttribute("width", w1);
	canvas.setAttribute("height", h1);
	canvas.style.top = (viewportHeight - h1) / 2 + "px";
	canvas.style.left = (viewportWidth - w1) / 2 + "px";

	// Create centroid point coordinates
	var centroidsArray = []
	for (var i = 0; i <= n; i++) {
		for (var j = 0; j <= n; j++) {
			var centroid = new paper.Point({state:1});
			centroid.x = ((w1-w2)/2)+wInt*i;
			centroid.y = ((h1-h2)/2)+hInt*j;
			centroidsArray.push(centroid);
		}
	};

	// Draw circles from point coordinates and radius
	for (var i = 0; i < centroidsArray.length; i++) {
		var centroid = centroidsArray[i]
		var circle = []
		circle = new paper.Path.Circle(new paper.Point(centroid.x, centroid.y), radius);
		if (centroidsArray[i].state = Math.floor(Math.random()*2)) {
			circle.fillColor = "black"
		}
	};

	paper.view.draw();

	document.getElementById("test").innerText=$("#slider").slider("value");
};

//Setup SVG Canvas
$(document).ready(function() {
	circles01();
});

//Resize canvas to match window size
$(window).resize(function() {
	circles01();
});

//Data

