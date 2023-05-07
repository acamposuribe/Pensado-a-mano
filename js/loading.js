let loaded = 3;
let pixel = 1, canvas_texture;

let loadingScreen;

// LOADING SCREEN
let sketch = function(p) {

    // IMITATION
    let message1 = "1. DRAW " + maxDrawings + " SHAPES";
    let message2 = '2. PASTE CLIPBOARD ON PARAMS FIELD';
    // REPETITION
    if (drawMode == "Repetition") {
        message1 = "1. DRAW YOUR TILE";
        message2 = '2. PASTE CLIPBOARD ON PARAMS FIELD';
    } else if (drawMode == "Learning") {
        message1 = "1. TEACH ME A SHAPE";
        message2 = '2. PASTE CLIPBOARD ON PARAMS FIELD';
    }

    let message3 = "WRONG STRING. TRY AGAIN";

    p.setup = function() {        
        cargando = p.createCanvas(newW, newH);
        p.pixelDensity(pDensity)
        cargando.id('carga');
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER,p.CENTER);
        p.textFont("Courier"), p.noStroke();
        p.clear();
    };
    p.draw = function() {
        pixel = newW/canvas.width;
        if (resize) {
            p.resizeCanvas(Math.floor(newW), Math.floor(newH));
            resize = false;
        }
        p.clear();
        p.frameRate(20)
        if (firefoxAgent) {
            p.image(canvas_texture,0,0,newW,newH)
        } else {
            p.image(mainCanvas,0,0,newW,newH)
        }
        p.translate(newW/2,newH/2)

        if (loaded == 3) {

            let mult = 0.75;

            p.textSize(60*pixel*mult)

            if ($fx.getParam("draw_string").slice(0, 5) !== "false") {
                p.fill(pickedColors[rande(2,7)]);
                p.rect(0,-120*pixel*mult,p.textWidth(message3)+25*pixel*mult,70*pixel*mult)
                p.fill(pickedColors[1]);
                p.text(message3,0,-120*pixel*mult);
            }
            p.fill(pickedColors[2]);
            p.rect(0,-40*pixel*mult,p.textWidth(message1)+25*pixel*mult,70*pixel*mult)
            p.rect(0,40*pixel*mult,p.textWidth(message2)+25*pixel*mult,70*pixel*mult)
            p.fill(pickedColors[1]);
            p.text(message1,0,-40*pixel*mult);
            p.text(message2,0,40*pixel*mult);
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