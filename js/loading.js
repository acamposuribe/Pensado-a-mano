let loaded = 3;
let pixel = 1, canvas_texture;
let warning = 0;
let loadingScreen;

// LOADING SCREEN
let sketch = function(p) {
    let message, message1;
    switch (drawMode) {
        case "Imitation":
            message = "Type: FREEHAND"
            message1 = "1. Draw " + maxDrawings + " FREE SHAPES";
        break;
        case "Repetition":
            message = "Type: TILES"
            message1 = "1. Design the TILE";
        break;
        case "Learning":
            message = "Type: TEACH"
            message1 = "1. Draw a CENTERED SHAPE";
        break;
        case "Rotation":
            message = "Type: ROTATE"
            message1 = "1. Design the SECTOR";
        break;
    }
    let message2 = '3. Paste Clipboard on Params Field';
    let message3 = "TRY AGAIN";
    let message4 = "RELEASE!!"
    let message5 = "DRAWING"
    let message6 = "2. Press C on your keyboard"
    let message7 = "Seed nr. " + $fx.getParam("seed_rand");

    p.setup = function() {        
        cargando = p.createCanvas(newW, newH);
        p.pixelDensity(pDensity)
        cargando.id('carga');
        p.rectMode(p.CENTER);
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
        if (firefoxAgent) {p.image(canvas_texture,0,0,newW,newH)} else {p.image(mainCanvas,0,0,newW,newH)}
        
        // Size Texts
        let mult = 2;
        p.textSize(110*pixel*mult)

        p.push();
        p.textAlign(p.CENTER,p.CENTER);
        p.translate(newW/2,newH/2)
        if (warning == 1) {
            p.fill(pickedColors[rande(2,7)]);
            p.rect(0,0,p.textWidth(message4)+25*pixel*mult,70*pixel*mult)
            p.fill(pickedColors[1]);
            p.text(message4,0,0);
        }
        if (copy < 10) {
            p.fill(pickedColors[2]);
            p.rect(0,0,p.textWidth(message5)+25*pixel*mult,70*pixel*mult)
            p.fill(pickedColors[1]);
            p.text(message5,0,0);
        }
        p.pop();

        if (loaded == 3) {
            p.push();
            p.translate(newW/2,newH/2)
            p.textAlign(p.CENTER,p.CENTER);
            if ($fx.getParam("draw_string").slice(0, 5) !== "false") {
                p.fill(pickedColors[2]);
                p.rect(0,0,p.textWidth(message3)+25*pixel*mult,70*pixel*mult)
                p.fill(pickedColors[1]);
                p.text(message3,0,0);
            }
            p.pop();

            mult = 0.68;
            p.textSize(60*pixel*mult)

            p.push();
            p.textAlign(p.LEFT,p.CENTER);
            p.fill(pickedColors[2]);
            p.rect(w1*pixel+70*pixel*mult + (p.textWidth(message7)+20*pixel*mult)/2,h2*pixel-420*pixel*mult,p.textWidth(message7)+40*pixel*mult,70*pixel*mult)
            p.rect(w1*pixel+70*pixel*mult + (p.textWidth(message)+20*pixel*mult)/2,h2*pixel-340*pixel*mult,p.textWidth(message)+40*pixel*mult,70*pixel*mult)
            p.rect(w1*pixel+70*pixel*mult + (p.textWidth(message1)+20*pixel*mult)/2,h2*pixel-260*pixel*mult,p.textWidth(message1)+40*pixel*mult,70*pixel*mult)
            p.rect(w1*pixel+70*pixel*mult + (p.textWidth(message6)+20*pixel*mult)/2,h2*pixel-180*pixel*mult,p.textWidth(message6)+40*pixel*mult,70*pixel*mult)
            p.rect(w1*pixel+70*pixel*mult + (p.textWidth(message2)+20*pixel*mult)/2,h2*pixel-100*pixel*mult,p.textWidth(message2)+40*pixel*mult,70*pixel*mult)
            p.fill(pickedColors[1]);
            p.text(message7,w1*pixel+70*pixel*mult,h2*pixel-420*pixel*mult);
            p.text(message,w1*pixel+70*pixel*mult,h2*pixel-340*pixel*mult);
            p.text(message1,w1*pixel+70*pixel*mult,h2*pixel-260*pixel*mult);
            p.text(message6,w1*pixel+70*pixel*mult,h2*pixel-180*pixel*mult);
            p.text(message2,w1*pixel+70*pixel*mult,h2*pixel-100*pixel*mult);
            p.pop();
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
                    let dist = (w2-w1)/1.5*pixel
                    p.line(newW/2,newH/2,newW/2+dist*cos(-90),newH/2+dist*sin(-90))
                    p.line(newW/2,newH/2,newW/2+dist*cos(-90-360/polarNr),newH/2+dist*sin(-90-360/polarNr))
                break;
                case "Imitation":
                    
                break;
            }
            p.pop();
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