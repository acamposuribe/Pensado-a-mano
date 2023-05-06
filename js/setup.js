// MESSY CODE BY ALEJANDRO - @ratchitect
// P5.JS LIBRARY LICENSE: https://p5js.org/copyright.html

// SVG THINGS
let svg_final;
let svgBuffers = [];

let polygon;

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

        // GET HAND-DRAWN ELEMENTS
        checkSegments();

        // HAND-DRAWN SEED
        handBuffer = new p5(hand);
        // RESIZE AND LOADING
        loadingScreen = new p5(sketch);

        // CREATE FLOW FIELD
        createField(ffSel)
        // BACKGROUND
        background(colors[palette][1]);

        // PLOT LAYERS
        svg_final = createGraphics(canvas.width,canvas.height,SVG);

        // INITIALISE GLOBAL BRUSHES
        gridLines = new LineStyle("2B"), borderLines = new LineStyle("HB");
        thinLines = new LineStyle("HB")

        // DRAW BORDER
        drawBorder();

        if (isDeep) {
            let polygons = [];
            for (let i = 0; i < 5; i++) {polygons.push(new Polygon([[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)]]))}
            hatch2 = new Hatch(25,random(0,180),polygons,true)
            hatch2.rainbowHatch(thinLines);
        }

        if (drawn) {
            drawPolygons()
        }
}

let l; // loading phases

let LL = 0;

function draw () {  
    
    if (firefoxAgent) {
        canvas_texture.image(lienzo,0,0);
    }

    createDoodle()

    //frameRate(10)
    //noLoop();
}

function keyReleased () {
    if (keyCode === 83) {
        for (let g of svgBuffers) {
            let layerBuffer = createGraphics(canvas.width, canvas.height,SVG);
            for (let b of g) {
                layerBuffer.image(b,0,0)
            }
            svg_final.image(layerBuffer,0,0)
        }
        save(svg_final,"TEST-" + $fx.hash)
    }   
}

function drawBorder() {
    borderLines.line((w1-random(15,25)),h1,(w2+random(15,25)),h1,colors[palette][2],0.6,"straight");
    borderLines.line(w1,(h1-random(15,25)),w1,(h2+random(15,25)),colors[palette][2],0.6,"straight");
    borderLines.line(w2,(h1-random(15,25)),w2,(h2+random(15,25)),colors[palette][2],0.6,"straight");
    borderLines.line((w2+random(15,25)),h2,(w1-random(15,25)),h2,colors[palette][2],0.6,"straight");
}

// DRAW HATCH with TRAITS

function drawPolygons () {
    let polygons3 = []
    for (let mp of mousePlots) {
        polygons3.push(mp[0].genPol(mp[1].x,mp[1].y,1))
    }
    let hatch3 = new Hatch(12,random(0,180),polygons3,true)
    hatch3.rainbowHatch(gridLines);
 }