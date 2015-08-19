tool.maxDistance = 10;

function onMouseDrag(event) {
	var circle = new Path.Circle({
		center: event.middlePoint,
		radius: event.delta.length / 2
	});
	circle.fillColor = 'black';
}