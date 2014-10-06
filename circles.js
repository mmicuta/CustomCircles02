// UI Controls
$(function() {
	$( "#slider" ).slider({
		value: 5,
		min: 3,
		max: 50,
		step: 1,
		slide: function(){
			//document.getElementById("test").innerText=$("#slider").slider("value");
			circles01();
		},
		change: function(event, ui){
			//var n = $("#slider").slider("value");
			//circles01();
		}
	});
	//var n = $("#slider").slider("value");
});


//Functions
function circles01() {
	// Set up canvas and paper.js project
	var canvas = document.getElementById("canvas01"); 
	paper.setup(canvas);

	// Declare input variables
	var n = $("#slider").slider("value");

	//canvasHeight = $(window).height();
	//canvasWidth = $(window).width();
	canvasHeight = window.innerHeight;
	canvasWidth = window.innerWidth;
	//canvasWidth = $(canvas).outerWidth();


	// Define height and width divisions by screen proportions
	if (canvasHeight <= canvasWidth) {
		var nw = n;
		var gw = canvasWidth/n;
		var nh = canvasHeight/gw;
	} else {
		var nh = n;
		var gw = canvasHeight/n;
		var nw = canvasWidth/gw;
	}


	var h1 = canvasHeight;
	var w1 = canvasWidth;
	var h2 = canvasHeight - gw;
	var w2 =canvasWidth - gw;

	var radius = (0.618*gw)/2;

	var testData = []

	// Adjust canvas size to window size and centre it
	canvas.height = h2;
	canvas.width = w2;

	// Create centroid point coordinates
	var centroidsArray = []
	for (var i = 0; i <= n; i++) {
		for (var j = 0; j <= n; j++) {
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
		if (centroidsArray[i].state = Math.floor(Math.random()*2)) {
			circle.fillColor = "black"
		} else {
			circle.strokecolor = "black";
			circle.strokewidth = 1
		}
	};

	paper.view.draw();

	//document.getElementById("test").innerText=$("#slider").slider("value");
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

