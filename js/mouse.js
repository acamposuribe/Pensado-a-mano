
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

        if (drawMode == "Learning") {
            origin = {x:canvas.width/2,y:canvas.height/2}
        }

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
        if(!drawn) {
            p.push();
            p.noFill()
            p.stroke(255,0,0)
            p.strokeWeight(8*pixel)
            
            switch (drawMode) {
                case "Repetition":
                    p.rectMode(p.CORNERS);
                    p.rect(w1*pixel,h1*pixel,w1*pixel+(w2-w1)/tileNr*pixel,h1*pixel+(h2-h1)/tileNr*pixel)
                break;
                case "Learning":
                    p.line(newW/2,newH/2-200*pixel,newW/2,newH/2+200*pixel)
                    p.line(newW/2-200*pixel,newH/2,newW/2+200*pixel,newH/2)
                break;
                case "Rotation":
                    let dist = (w2-w1)/4
                    p.line(newW/2,newH/2,newW/2+dist*cos(-90),newH/2+dist*sin(-90))
                    p.line(newW/2,newH/2,newW/2+dist*cos(-90-360/polarNr),newH/2+dist*sin(-90-360/polarNr))
                break;
                case "Imitation":
                    for (let i = 0; i <= 8; i++) {
                        for (let j = 0; j <= 8; j++) { 
                            let xp = (w1 + i * (w2-w1) / 8) * pixel
                            let xy = (w1 + j * (h2-h1) / 8) * pixel
                            p.strokeWeight(1*pixel)
                            p.line(xp,xy-10*pixel,xp,xy+10*pixel)
                            p.line(xp-10*pixel,xy,xp+10*pixel,xy)
                        }
                    }
                break;
            }
            p.pop();
        }
    };
};