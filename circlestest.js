// UI Controls
$(function() {
	$( "#slider" ).slider({
		value: 5,
		min: 5,
		max: 30,
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
	var canvas = [];
	canvas = document.getElementById("canvas01"); 
	//var canvas = Raphael(document.getElementById("canvas01"),w2,h2); 
	//canvas.clear();
	//paper.clear();
	//paper.setup(canvas);

	// Declare input variables
	var n = $("#slider").slider("value");

	canvasHeight = $(document).height();
	canvasWidth = $(document).width();
	//canvasHeight = window.innerHeight;
	//canvasWidth = window.innerWidth;
	//canvasWidth = $(canvas).outerWidth();




	// Define height and width divisions by screen proportions
	if (canvasHeight >= canvasWidth) {
		var nw = n;
		var gw = canvasWidth/n;
		var nh = Math.floor(canvasHeight/gw)
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

	var testData = []

	// Adjust canvas size to window size and centre it
	canvas.height = h2;
	canvas.width = w2;
	canvas.style.margin = "0 auto";

	

	// Create centroid point coordinates
	var centroidsArray = []
	for (var i = 0; i <= nw-2; i++) {
		for (var j = 0; j <= nh-2; j++) {
			var centroid = new Object({state:1});
			centroid.x = ((w1-w2)/2)+gw*i;
			centroid.y = ((h1-h2)/2)+gw*j;
			centroidsArray.push(centroid);
		}
	};


	var paper = Raphael(document.getElementById("canvas01"),w2,h2);	

	// Draw circles from point coordinates and radius
	var circlesGrid = []
	for (var i = 0; i < centroidsArray.length; i++) {
		var centroid = centroidsArray[i]
		var circle = []
		circle = paper.circle(centroid.x, centroid.y, radius).attr({fill: "#ffffff"});


		//circle.fillColor = "black";
		//if (centroidsArray[i].state = Math.floor(Math.random()*2)) {
		//	circle.fillColor = "black"
		//} else {
		//	circle.strokecolor = "black";
		//	circle.strokewidth = 1
	};

	//UI Effects
	//Mouse Hover Effect

	

	//paper.view.draw();

	//document.getElementById("test").innerText=$("#slider").slider("value");
	//document.getElementById("test").innerText=centroidsArray.length;
};



//Setup SVG Canvas
$(document).ready(function() {
	circles01();
});

//Resize canvas to match window size
$(window).resize(function() {
	circles01();
	paper.clear();
});

//Data

