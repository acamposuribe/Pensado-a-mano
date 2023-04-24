// MESSY CODE BY ALEJANDRO - (RAT)CHITECT (@RATCHITECT), RATCHITECT.TEZ, RATCHITECT.ETH
// P5.JS LIBRARY LICENSE: https://p5js.org/copyright.html

// SVG THINGS
let svg_final;
let svgBuffers = [];

let polygon;

function setup () {
        // CANVAS AND SEEDS
        mainCanvas = createCanvas(canvas.width, canvas.height); angleMode(DEGREES), rectMode(CENTER), noiseSeed(fxrand() * 999999); pixelDensity(pDensity), randomSeed(fxrand()*99999);
        // CANVAS TEXTURE BUFFER for Firefox Bug
        if (firefoxAgent) {
            canvas_texture = createGraphics(canvas.width, canvas.height);
            canvas_texture.pixelDensity(pDensity);
        } else {
            mainCanvas.id('principal'); 
        }

        // CREATE FLOW FIELD
        createField(ffType)
        // BACKGROUND
        background(colors[palette][1]);

        // PLOT LAYERS
        svg_final = createGraphics(canvas.width,canvas.height,SVG);

        // INITIALISE GLOBAL BRUSHES
        gridLines = new LineStyle("2B"), borderLines = new LineStyle("HB");

        // DRAW BORDER
        drawBorder();

        // RESIZE AND LOADING
        let myp5 = new p5(sketch);

        let polygons = [];

        for (let i = 0; i < 5; i++) {
            polygons.push(new Polygon([[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)],[random(w1,w2),random(h1,h2)]]))
        }

        /*
        for (let p of polygons) {
            let angle = random(0,180)
            if (random() < 0.3) {
                p.hatch("around",random(15,40),angle,gridLines,pickedColors[int(random(2,8))],1)
            } else {
                p.hatch("inside",random(15,40),angle,gridLines,pickedColors[int(random(2,8))],1)
            }
        }
        */

        test_plot = new Plot("curve")
        test_plot.addSegment(0,300,1)
        test_plot.addSegment(90,300,1)
        test_plot.addSegment(180,300,1)
        test_plot.addSegment(270,300,1)
        test_plot.endPlot(360)

        //gridLines.plot(test_plot,1000,1000,2,pickedColors[int(random(2,8))],1)

        //test_plot.genPol(1000,1000,2).hatch("around",random(15,30),random(0,180),gridLines,pickedColors[int(random(2,8))],1)
        //test_plot.genPol(1500,1500,3).hatch("around",random(15,30),random(0,180),gridLines,pickedColors[int(random(2,8))],1)

        let polygons2 = [];
        for (let i = 0; i < 5; i++) {
            polygons2.push(test_plot.genPol(random(w1,w2),random(h1,h2),random(1,3)))
        }

        hatch = new Hatch(10,random(0,180),polygons2,true)
        hatch.rainbowHatch(gridLines);
}

let l; // loading phases

let LL = 0;

function draw () {

    loaded = 4;
    
    
    if (firefoxAgent) {
        canvas_texture.image(lienzo,0,0);
    }

    frameRate(10)
    noLoop();
}

function mouseClicked() {
    noLoop();
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
        save(svg_final,"TEST-" + fxhash)
    }   
}

function drawBorder() {
    borderLines.line((w1-random(15,25)),h1,(w2+random(15,25)),h1,colors[palette][2],0.6,"straight");
    borderLines.line(w1,(h1-random(15,25)),w1,(h2+random(15,25)),colors[palette][2],0.6,"straight");
    borderLines.line(w2,(h1-random(15,25)),w2,(h2+random(15,25)),colors[palette][2],0.6,"straight");
    borderLines.line((w2+random(15,25)),h2,(w1-random(15,25)),h2,colors[palette][2],0.6,"straight");
}