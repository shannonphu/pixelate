tool.maxDistance = 50;

// Listen for 'drawRect' events
// created by other users
io.on( 'drawRect', function( data ) {

    // Draw the circle using the data sent
    // from another user
    drawRect( data.x, data.y, data.color );
    
})

// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
function randomColor() {
    return {
        red: Math.random(),
        green: Math.random(),
        blue: Math.random(),
        alpha: ( Math.random() * 0.5 ) + 0.05
    };
}

// every time the user drags their mouse
// this function will be executed
function onMouseDrag(event) {
    // Take the click/touch position as the centre of our circle
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;

    // The faster the movement, the bigger the circle
    var delta = event.delta.length / 3;

    // Generate our random color
    var color = randomColor();
    // Draw the circle 
    drawRect( x, y, delta, color );

    // Pass the data for this circle to other current users
    emitRect( x, y, color );
} 
 
function drawRect( x, y, delta, color ) {
    var dimension = 6;
    var halfDim = dimension / 2;
    // Render the rectangle with Paper.js
    // var circle = new Path.Circle( new Point( x, y ), radius );
    var rect = new Rectangle(new Point(x - halfDim, y - halfDim), new Point(x + delta, y + delta));
    var path = new Path.Rectangle(rect);
    path.fillColor = randomColor();
    //path.selected = true;
} 
 
// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function emitRect( x, y, color ) {

    // Each Socket.IO connection has a unique session id
    var sessionId = io.id;
  
    // An object to describe the circle's draw data
    var data = {
        x: x,
        y: y,
        //radius: radius,
        color: color
    };

    // send a 'drawCircle' event with data and sessionId to the server
    io.emit( 'drawRect', data, sessionId )

}