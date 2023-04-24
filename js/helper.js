// CANVAS SIZE and MARGINS
    
    // Standard PixelDensity
    let pDensity = 2;
    // Get "res" from URL for HQ Canvas
    if (new URLSearchParams(window.location.search).get('pixelDensity')) {pDensity = parseFloat(new URLSearchParams(window.location.search).get('pixelDensity'));}

    // Define Canvas Size in mm
    let canvas = {
        width: 2100,
        height: 2100,
    }
    canvas.prop = canvas.height/canvas.width;

    // Margins
    let marg = weightedRand({0.07: 40, 0.09: 20, 0.12: 1000, 0: 20});
    let margin = (canvas.width * marg); 
    let w1 = margin, w2 = (canvas.width - margin), h1 = margin, h2 = (canvas.height - margin);

// AUXILIARY RAND FUNCTIONS
function rand(e, r) {return mapRange(fxrand(), 0, 1, e, r)}
function rande(e, r) {return Math.floor(mapRange(fxrand(), 0, 1, e, r))}
function weightedRand(e) {
    var r, a, n = [];
    for (r in e)
        for (a = 0; a < 10 * e[r]; a++)
            n.push(r);
        return n[Math.floor(fxrand() * n.length)]
}
function createNCarray (n) {
    colorArray = []
    for (i=0;i<6;i++) {
        if (n+i > 7) {colorArray.push(n+i-6)}
        else {colorArray.push(n+i)}
    }
    return colorArray;
}

function mapRange (value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}

// SHUFFLE ARRAY
function shuffler(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(fxrand() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// OCCURRENCE
function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

// DETECT BROWSER
let isFirefox;
let userAgentString = navigator.userAgent;
let chromeAgent = userAgentString.indexOf("Chrome") > -1;
let safariAgent = userAgentString.indexOf("Safari") > -1;
let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
if ((chromeAgent) && (safariAgent)) safariAgent = false;

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersectar(point1,point2,point3,point4,boundary) {

    var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y, x3 = point3.x, y3 = point3.y, x4 = point4.x, y4 = point4.y;

    // Check if none of the lines are of length 0
      if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
          return false
      }
      denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  
    // Lines are parallel
      if (denominator === 0) {
          return false
      }
  
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
  
    // is the intersection along the segments
      if (ub < 0 || ub > 1) {
          return false
      }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

      if (x.between(boundary.w1-1,boundary.w2+1) && y.between(boundary.h1-1,boundary.h2+1)) {
        return {x: x,y: y}
      } else { return false }

  }


Number.prototype.between = function(a, b) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return this >= min && this <= max;
  };