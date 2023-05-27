let mousePlot, drawn = false, drawing = false, origin, start, end, segments = [], drawNumber = 0, mouseX1, mouseY1, pixelX, pixelY, show = false, finished = false, copy = 11, handBuffer, mousePlots = [];

function checkSegments() {
    if ($fx.getParam("draw_string").slice(0, 5) == "drawn") {
        segments = $fx.getParam("draw_string").slice(5);
        segments = atob(segments)
        let segmentos = segments.split(",");
        mousePlot = new Plot("curve")
        let origin;
        let o = 0;
        for (let i = 1; i < segmentos.length; i+=2) {
            if (o >= 1) {
                if (i % 2 !== 0) {
                    // Angles
                    let angle = segmentos[i-1]
                    let dist = segmentos[i]
                    if (dist == "x") {
                        mousePlot.endPlot(parseFloat(angle))
                        mousePlots.push([mousePlot,origin])
                        mousePlot = new Plot("curve")
                        o = -1;
                    } else {
                        mousePlot.addSegment(parseFloat(angle),parseFloat(dist))
                    }            
                }
            } else {
                origin = {x: parseFloat(segmentos[i-1]), y: parseFloat(segmentos[i])}
            }
            o++
        }
        loaded = 4;
        drawn = true;
        copy = 0;
    } else {
        loaded = 3
    }
}

function mousePressed () {
    if (!drawn) {
        // WHEN CLICK - START
        origin = {x:mouseX1,y:mouseY1}

        if (drawMode == "Learning") {
            origin = {x:canvas.width/2,y:canvas.height/2}
        }
        start = {x:mouseX1,y:mouseY1}
        // Initiate Doodle
        segments[drawNumber] = [];
        segments[drawNumber].push([origin.x,origin.y])
        drawing = true;
    }
    return false;
}

function mouseDragged() {
    if (!drawn && warning == 0) {
        if (mouseIsPressed) {
            loaded = 4;
            // WHILE CLICKED - Store values in Array
            let distance = int(dist(mouseX1,mouseY1,start.x,start.y))
            let res = 100;
            if(!drawn && drawMode !== "Imitation") { res = 25 }
            if (distance >= res) {
                let angle = int(atan(-(mouseY1-start.y)/(mouseX1-start.x)))
                if ((mouseX1-start.x) < 0) {angle += 180;}
                segments[drawNumber].push([angle,distance])
                start.x = mouseX1
                start.y = mouseY1
            }
            if (btoa(segments[drawNumber]).length >= 1800 && !warning) {
                warning = 1;
            }
        }
    }
    return false;
}

function checkDrawing()
 {
    pixelX = newW/canvas.width;
    pixelY = newH/canvas.height;
    mouseX1 = handBuffer.mouseX/pixelX
    mouseY1 =  handBuffer.mouseY/pixelY
    if (!drawn && btoa(segments[drawNumber]).length >= 1800 && !warning) {
        drawNumber = maxDrawings;
        finishDrawing()
    }
    if (drawNumber >= maxDrawings) {
        // Copy Contents to Clipboard
        copyToClipboard("drawn" + btoa(segments))
        drawn = true;
        if (copy == 11) {
            copy = 0;
        }
    }
 }

function mouseReleased() {
    if (warning == 1) {
        warning = false;
    }
    finishDrawing()
    return false;
}

function finishDrawing () {
    if (!drawn) {
        // WHEN RELEASED - FINISH
        let angle = int(atan(-(mouseY1-start.y)/(mouseX1-start.x)))
        segments[drawNumber].push([angle,"x"])

        // Create Plot
        mousePlot = new Plot("curve")
        for (let i = 1; i < segments[drawNumber].length - 1; i++) {
            mousePlot.addSegment(segments[drawNumber][i][0],segments[drawNumber][i][1])
        }
        mousePlot.endPlot(segments[drawNumber][segments[drawNumber].length-1][0])

        // Push Plot
        mousePlots.push([mousePlot,origin])

        // Stop Drawing
        drawNumber++;
        drawing = false;
    }
}

function copyToClipboard (str) {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
 }

 // DRAWN SHAPES
let hand = function(p) {
    p.setup = function() {        
        handBuffer = p.createCanvas(newW, newH);
        p.pixelDensity(pDensity)
        handBuffer.id('mano');
    };
    p.draw = function() {
        pixel = newW/canvas.width;
        if (drawing && !drawn) {
            p.strokeWeight(2)
            p.stroke(0)
            p.circle(handBuffer.mouseX,handBuffer.mouseY,2,2)
        }
        else if (drawn) {
            p.clear();
        }
    };
};