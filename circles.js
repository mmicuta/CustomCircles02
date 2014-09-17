window.onload = function(){
	var paper = new Raphael(document.getElementById('paperCanvas'), 500, 300);
	var circle = paper.circle(200,100,50);
	circle.attr({'fill': '#00aeef', 'stroke': '#00aeef'});
}