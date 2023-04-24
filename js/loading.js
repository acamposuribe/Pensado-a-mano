let phaseCom=0, phaseMax, phase = 0, loaded=2, frameStart = [], traits = false;
let pixelLoad = 1, canvas_texture;

// LOADING SCREEN
let sketch = function(p) {
    let message1 = "DOUBLE CLICK FOR AUDIO MODE";
    let message2 = 'WAIT 5 SECONDS FOR SILENT MODE';
    let message3 = 'LOADING';
    function setLineDash(list) {
        p.drawingContext.setLineDash(list);
    }
    p.setup = function() {        
        cargando = p.createCanvas(newW, newH);
        p.pixelDensity(pDensity)
        cargando.id('carga');
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER,p.CENTER);
        p.textFont("Courier"), p.textSize(12*pixelLoad), p.noStroke();
        p.clear();
    };
    p.draw = function() {
        if (resize) {
            p.resizeCanvas(Math.floor(newW), Math.floor(newH));
            resize = false;
            pixelLoad = newW/canvas.width;
        }
        p.clear();

        if (firefoxAgent) {
            p.image(canvas_texture,0,0,newW,newH)
        } else {
            p.image(mainCanvas,0,0,newW,newH)
        }
        p.translate(newW/2,newH/2)
        if (loaded < 3) {
            let colorin = color(colors[palette][1])
            if(phase <= 2) {colorin.setAlpha(200)} 
            else if (phase == 3) {colorin.setAlpha(170)} 
            else {colorin.setAlpha(140)}
            p.background(colorin);
            // LOADING ANIMATION SPIRAL
            p.noFill();
            setLineDash([1,2.5])
            p.stroke(colors[palette][2]);
            p.strokeWeight(0.7*pixelLoad);
            let currentAngle = map(phaseCom,0,phaseMax,0,90,true) + (phase-1) * 90;
            let coolor = 2;
            p.beginShape();
            for (let i = 60; i < 420; i++) {
                let radius, angle;
                radius = (10 + i*0.35)*pixelLoad;
                angle = 2*i;
                leng = 15*pixelLoad;
                let x = radius * cos(angle);
                let y = radius * sin(angle);
                let x2 = (leng+radius) * cos(angle);
                let y2 = (leng+radius) * sin(angle);
                if(i<currentAngle+60 && i%2 == 0){
                    p.push();
                    p.strokeWeight(1.2*pixelLoad);
                    p.stroke(colors[palette][coolor]);
                    p.line(x,y,x2,y2)
                    p.pop();
                    coolor++
                    if (coolor == 8) { coolor = 2}
                }
                p.vertex(x, y);
            }
            p.endShape();
            p.noStroke();
            // LOADING LABEL
            p.fill(colors[palette][2]);
            p.rect(0,0,p.textWidth(message3)+5*pixelLoad,15*pixelLoad)
            p.fill(colors[palette][1]);
            p.text(message3,0,0);
        }
        if (loaded == 3) {
            p.fill(colors[palette][2]);
            p.rect(0,-8*pixelLoad,p.textWidth(message1)+5*pixelLoad,15*pixelLoad)
            p.rect(0,8*pixelLoad,p.textWidth(message2)+5*pixelLoad,15*pixelLoad)
            p.fill(colors[palette][1]);
            p.text(message1,0,-8*pixelLoad);
            p.text(message2,0,8*pixelLoad);
        }
    };
};

let newW, newH;
let resize = false;

if(window.innerHeight <= window.innerWidth*canvas.prop) {
    newH = window.innerHeight;
    newW = (newH/canvas.prop);
} else {
    newW = window.innerWidth;
    newH = (newW*canvas.prop);
}

function windowResized() {
    if(window.innerHeight <= window.innerWidth*canvas.prop) {
        newH = window.innerHeight;
        newW = (newH/canvas.prop);
    } else {
        newW = window.innerWidth;
        newH = (newW*canvas.prop);
    }
    resize = true;
}