let phaseCom=0, phaseMax, phase = 0, loaded=2, frameStart = [], traits = false;
let pixelLoad = 1, canvas_texture;

let loadingScreen;

// LOADING SCREEN
let sketch = function(p) {
    let message1 = "DRAW A MAX. OF " + maxDrawings + " SHAPES";
    let message2 = 'WHEN DONE, PASTE CLIPBOARD ON PARAMS FIELD';
    p.setup = function() {        
        cargando = p.createCanvas(newW, newH);
        p.pixelDensity(pDensity)
        cargando.id('carga');
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER,p.CENTER);
        p.textFont("Courier"), p.textSize(20*pixelLoad), p.noStroke();
        p.clear();
    };
    p.draw = function() {
        pixelLoad = newW/canvas.width;
        if (resize) {
            p.resizeCanvas(Math.floor(newW), Math.floor(newH));
            resize = false;
            
        }
        p.clear();
        if (firefoxAgent) {
            p.image(canvas_texture,0,0,newW,newH)
        } else {
            p.image(mainCanvas,0,0,newW,newH)
        }
        p.translate(newW/2,newH/2)

        if (loaded == 3) {
            p.fill(colors[palette][2]);
            p.rect(0,-30*pixelLoad,p.textWidth(message1)+25*pixelLoad,40*pixelLoad)
            p.rect(0,30*pixelLoad,p.textWidth(message2)+25*pixelLoad,40*pixelLoad)
            p.fill(colors[palette][1]);
            p.text(message1,0,-30*pixelLoad);
            p.text(message2,0,30*pixelLoad);
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