// MESSY CODE BY ALEJANDRO - @ratchitect
// P5.JS LIBRARY LICENSE: https://p5js.org/copyright.html

let seed = rand(0,1);

// DEFINE PARAMS
$fx.params([
    {
      id: "draw_string",
      name: "PASTE CLIPBOARD HERE",
      type: "string",
      default: "false",
      options: {
        minLength: 300,
        maxLength: 2000,
      },
    },
  ])

function setup () {
        // CANVAS AND SEEDS
        mainCanvas = createCanvas(canvas.width, canvas.height); angleMode(DEGREES), rectMode(CENTER), noiseSeed($fx.rand() * 999999); pixelDensity(pDensity), randomSeed($fx.rand()*99999);
        // CANVAS TEXTURE BUFFER for Firefox Bug
        if (firefoxAgent) {
            canvas_texture = createGraphics(canvas.width, canvas.height);
            canvas_texture.pixelDensity(pDensity);
        } else {
            mainCanvas.id('principal'); 
        }

        // HAND-DRAWN SEED
        handBuffer = new p5(hand);
        // RESIZE AND LOADING
        loadingScreen = new p5(sketch);
        // PLOT LAYERS
        svg_final = createGraphics(canvas.width,canvas.height,SVG);

        // CREATE FLOW FIELD
        createField(ffSel)
        // BACKGROUND
        background(pickedColors[1]);

        // GET HAND-DRAWN ELEMENTS
        checkSegments();

        // INITIALISE GLOBAL BRUSHES
        gridLines = new LineStyle("2B"), borderLines = new LineStyle("HB");
        thinLines = new LineStyle("HB")

        // DRAW BORDER
        drawBorder();

        // DRAW HATCHES IF EXISTING
        if (drawn) {
            showHatch()
        }
}

function draw () {  
    if (firefoxAgent) {canvas_texture.image(lienzo,0,0);}
    checkDrawing()
}

function drawBorder() {
    borderLines.line((w1-random(15,25)),h1,(w2+random(15,25)),h1,pickedColors[2],0.6,"straight");
    borderLines.line(w1,(h1-random(15,25)),w1,(h2+random(15,25)),pickedColors[2],0.6,"straight");
    borderLines.line(w2,(h1-random(15,25)),w2,(h2+random(15,25)),pickedColors[2],0.6,"straight");
    borderLines.line((w2+random(15,25)),h2,(w1-random(15,25)),h2,pickedColors[2],0.6,"straight");
}

// DRAW HATCH with TRAITS
function showHatch () {

    // TIPOS DE HATCH
    randomSeed(seed*5523)

    // DRAW BASE LAYER if NEEDED
    if (isDeep) {
        let polygons = [];
        for (let i = 0; i < 5; i++) {polygons.push(new Polygon([[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)]]))}
        hatch2 = new Hatch(25,random(0,180),polygons,true)
        hatch2.rainbowHatch(thinLines,0.7);
    }

    let polygons3 = []
    switch(drawMode) {
        case "Imitation":
            for (let mp of mousePlots) {
                polygons3.push(mp[0].genPol(mp[1].x,mp[1].y,1))
            }
        break;
        case "Repetition":
            for (let mp of mousePlots) {
                for (let i = 0; i < tileNr; i++) {
                for (let j = 0; j < tileNr; j++) {
                    let pol = mp[0].genPol(mp[1].x + ( (w2-w1) / tileNr ) * i,mp[1].y + ( (h2-h1) / tileNr ) * j,1)
                    polygons3.push(pol)
                }                
                }
            }
        break;
        case "Learning":
            for (let mp of mousePlots) {
                for (let i = 0; i < dNr; i++) {
                    let pol = mp[0].genPol(random(w1+200,w2-200),random(h1+200,h2-200),random(0.5,2))
                    polygons3.push(pol)
                }
            }
        break;
    }

    // TIPOS DE HATCH
    randomSeed(seed*99987)

    switch(hatchMode) {
        case "In and Around":
            // Type 1 (inside and around)
            let ar = rande(1,3)
            for (let p of polygons3) {
                if (ar > 0 && random() < 0.5) {
                    p.hatch("around",random(12,25),random(0,180),gridLines,pickedColors[int(random(2,7))],1);
                    ar--
                } else {
                    p.hatch("inside",random(12,25),random(0,180),gridLines,pickedColors[int(random(2,7))],1);
                }
            }
        break;
        case "Spectrum":
            let hatch3 = new Hatch(random(12,18),random(0,180),polygons3,true)
            hatch3.rainbowHatch(gridLines);
        break;
        case "Fill":
            for (let p of polygons3) {
                p.hatch("inside",random(12,25),random(0,180),gridLines,pickedColors[int(random(2,7))],1);
            }
        break;
        case "Nest":
            for (let p of polygons3) {
                p.hatch("around",random(12,25),random(0,180),gridLines,pickedColors[int(random(2,7))],1);
            }
        break;
    }
    drawNoise();
 }

 function drawNoise () {
    loadPixels();
        let d = pixelDensity();
        for (c=1;c<pixels.length/4;c+= 4) {
            let ruido = random(-1,1)*20
            for (let i = 0; i < d; i++) {
                for (let j = 0; j < d; j++) {
                    pixels[4*c-4+4*i+canvas.width*j] += ruido;
                    pixels[4*c-3+4*i+canvas.width*j] += ruido;
                    pixels[4*c-2+4*i+canvas.width*j] += ruido;
                }
            }
        }
    updatePixels();
 }

 function keyReleased () {
    if (keyCode === 83) {
        // Save Image
        save(mainCanvas, "fx(drawn)-" + $fx.hash, 'png');
    } else if (keyCode === 80) {
        for (let g of svgBuffers) {
            let layerBuffer = createGraphics(canvas.width, canvas.height,SVG);
            for (let b of g) {
                layerBuffer.image(b,0,0)
            }
            svg_final.image(layerBuffer,0,0)
        }
        // Save SVG
        save(svg_final,"fx(drawn)-" + $fx.hash)
    }
}