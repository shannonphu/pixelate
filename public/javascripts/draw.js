tool.maxDistance = 50;

// Listen for 'drawRect' events
// created by other users
io.on( 'drawRect', function( data ) {

    // Draw the circle using the data sent
    // from another user
    drawRect( data.x, data.y, data.delta, data.color );
    
})

// Globals
var allRects = [];
var numDrawn = 0;

// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
function randomColor() {
    return {
        red: Math.random(),
        green: Math.random(),
        blue: Math.random(),
        alpha: ( Math.random() * 0.5 ) + 0.1
    };
}

 // Returns a random number between min (inclusive) and max (exclusive)
 // Note: Math.random() returns a float between 0 and 1
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function signedNumber (range) {
    var smallerDelta = Math.round(getRandomArbitrary(0, range));
    var sign = smallerDelta % 2 ? -1 : 1;
    smallerDelta *= sign;
    return smallerDelta;
}

// every time the user drags their mouse
// this function will be executed
function onMouseDrag(event) {
    // Take the click/touch position as the centre of our circle
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;

    // The faster the movement, the bigger the circle
    var delta = event.delta.length / 10;

    // Generate our random color for central square
    var color = randomColor();
    // Draw the rectangle 
    drawRect( x, y, delta, color );

    // Draw surrounding squares
    for (var i = 0; i < 5; i++) {
        var a = signedNumber(10);
        var b = signedNumber(10);
        var surroundColor = randomColor();
        drawRect( x + a, y + b, delta, surroundColor );
        emitRect ( x + a, y + b, delta, surroundColor );
    };

    // Pass the data for this circle to other current users
    emitRect( x, y, delta, color );
} 
 
function drawRect( x, y, delta, color ) {
    var dimension = 6;
    var halfDim = dimension / 2;
    // Render the rectangle with Paper.js
    var rect = new Rectangle(new Point(x - halfDim, y - halfDim), new Point(x + delta, y + delta));
    var path = new Path.Rectangle(rect);
    path.fillColor = randomColor();

    allRects.push(path);
    numDrawn++;
} 
 
// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function emitRect( x, y, delta, color ) {

    // Each Socket.IO connection has a unique session id
    var sessionId = io.id;
  
    // An object to describe the circle's draw data
    var data = {
        x: x,
        y: y,
        delta: delta,
        color: color
    };

    // send a 'drawRect' event with data and sessionId to the server
    io.emit( 'drawRect', data, sessionId )

}

// paper.js tutorial on animation

// The amount of circles we want to make:
var count = 50;

// Create a symbol, which we will use to place instances of later:

var rectangle = new Shape.Rectangle({
    from: [0, 0],
    to: [5, 5],
    fillColor: 'white'
});

var symbol = new Symbol(rectangle);

// Place the instances of the symbol:
for (var i = 0; i < count; i++) {
    // The center position is a random point in the view:
    var center = Point.random() * view.size;
    var placedSymbol = symbol.place(center);
    placedSymbol.scale(i / count);
};

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
    // Run through the active layer's children list and change
    // the position of the placed symbols:

    var numRectsDrawn = 0;
    if ( allRects.length != null ) {
        numRectsDrawn = allRects.length;
    }

    for (var i = 0; i < count + numRectsDrawn; i++) {
        var item = project.activeLayer.children[i];
        var drawnRect = allRects[i];

        // Move the item 1/20th of its width to the right. This way
        // larger circles move faster than smaller circles:
        item.position.x += item.bounds.width / 20;
        if (typeof drawnRect != 'undefined') {
            drawnRect.position.x += drawnRect.bounds.width / 20; 
            if (drawnRect.bounds.left > view.size.width) {
                drawnRect.position.x = -drawnRect.bounds.width;
            }
        };

        // If the item has left the view on the right, move it back
        // to the left:
        if (item.bounds.left > view.size.width) {
            item.position.x = -item.bounds.width;
        }
    }
}