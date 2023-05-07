
let mousePlot, drawn = false, drawing = false;
let origin, start, end, segments = [];
let drawNumber = 0;
let mouseX1, mouseY1;
let pixelX, pixelY;

let handBuffer;

let mousePlots = [];

function checkSegments() {
    if ($fx.getParam("draw_string").slice(0, 5) == "drawn") {
        segments = $fx.getParam("draw_string").slice(5);
        drawn = true;
        segments = atob(segments)
        segments = segments.split(",");
        mousePlot = new Plot("curve")
        let origin;
        let o = 0;
        for (let i = 1; i < segments.length; i+=2) {
            if (o >= 1) {
                if (i % 2 !== 0) {
                    // Angles
                    let angle = segments[i-1]
                    let dist = segments[i]
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
                origin = {x: parseFloat(segments[i-1]), y: parseFloat(segments[i])}
            }
            o++
        }
        loaded = 4;
    } else {
        loaded = 3
    }
}

function mousePressed () {
    if (!drawn) {
        console.log("Start")
        // WHEN CLICK - START
        origin = {x:mouseX1,y:mouseY1}
        start = {x:mouseX1,y:mouseY1}

        // Initiate Doodle
        segments[drawNumber] = [];

        segments[drawNumber].push([origin.x,origin.y])

        drawing = true;
    }
}

function mouseDragged() {
    if (!drawn) {
        if (mouseIsPressed) {
            loaded = 4;
            // WHILE CLICKED - Store values in Array
            let distance = int(dist(mouseX1,mouseY1,start.x,start.y))

            let res = 100;
            if(!drawn && drawMode !== "Imitation") { res = 25 }

            if (distance >= res) {
                console.log("Drawing")
                let angle = int(atan(-(mouseY1-start.y)/(mouseX1-start.x)))
                if ((mouseX1-start.x) < 0) {angle += 180;}
                segments[drawNumber].push([angle,distance])
                start.x = mouseX1
                start.y = mouseY1
            }
        }
    }
}

function checkDrawing()
 {
    pixelX = newW/canvas.width;
    pixelY = newH/canvas.height;
    mouseX1 = handBuffer.mouseX/pixelX
    mouseY1 =  handBuffer.mouseY/pixelY

    if (!drawn && btoa(segments[drawNumber]).length >= 1900) {
        finishDrawing()
        drawn = true;
        showHatch()
    }
    if (drawNumber >= maxDrawings) {
        drawn = true;
    }
 }

function mouseReleased() {
    finishDrawing()
}

function finishDrawing () {
    if (!drawn) {
        // WHEN RELEASED - FINISH
        console.log("End")
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

        // Copy Contents to Clipboard
        copyToClipboard("drawn" + btoa(segments))

        // Show Result
        if (drawNumber == maxDrawings) {
            showHatch()
        }
    }
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

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
            p.stroke(pickedColors[2])
            p.circle(handBuffer.mouseX,handBuffer.mouseY,2,2)
        }
        else if (drawn) {
            p.clear();
        }
        if(!drawn && drawMode == "Repetition") {
            p.push();
            p.noFill()
            p.stroke(255,0,0)
            p.strokeWeight(10*pixel)
            p.rectMode(p.CORNERS);
            p.rect(w1*pixel,h1*pixel,w1*pixel+(w2-w1)/tileNr*pixel,h1*pixel+(h2-h1)/tileNr*pixel)
            p.pop();
        }
    };
};