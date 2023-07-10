//////////////////////////////////////////////////
// DEFINE PARAMS
$fx.params([
    {
        id: "seed_rand",
        name: "Page",
        type: "number",
        default: 1,
        options: {
            min: 1,
            max: 20,
            step: 1,
        },
    },
    {
      id: "draw_string",
      name: "-",
      type: "string",
      default: "",
      options: {
        minLength: 300,
        maxLength: 1900,
      },
      update: "code-driven",
    },
])
// PARAMS FIX for "mint what you see"
for (let i = 0; i < $fx.getParam("seed_rand"); i++) {
    $fx.randminter()
}
document.title = "Pensado a mano #" + $fx.iteration;

//////////////////////////////////////////////////
// SET CANVAS SIZE
// width, height, pixelDensity, margins %s and probability
C.setSize(2100,2600,1,{0.07: 30, 0.12: 30});

//////////////////////////////////////////////////
// PROJECT TRAITS
const T = {
    // PICK FUNCTION
    p(array) {
        let obj = {};
        for (let i = 0; i < array.length; i++) {obj[i] = array[i][1]}
        return array[parseInt(R.weightedRand(obj))][0];
    },
    // PALETTES
    palette: parseInt(R.weightedRand({
        0: 50,     // Blac Ivoire
        1: 50,      // Outremer Gris
        2: 50,     // Duende
        3: 50,     // Le Rubis
    })),
    colors: [
        // Nombre,                  color1,     color2,          color3,        color4,         color5,         color6,        color7       drawMode8
        ["Cirque",                  "#fffceb",  "#2c695a",      "#4ad6af",      "#7facc6",      "#4e93cc",      "#f6684f",      "#ffd300",  2], // Learning
        ["Enfantines",              "#e2e7dc",  "#7b4800",      "#002185",      "#003c32",      "#fcd300",      "#ff2702",      "#6b9404",  0], // Imitation
        ["Duende",                  "#f5f3e9",  "#473b2b",      "#7f90bc",      "#d94129",      "#fcd300",      "#262521",      "#faf8eb",  3], // Rotation
        ["Sans Lunettes",           "#ffe6d4",  "#6c2b3b",      "#c76282",      "#445e87",      "#003c32",      "#e0b411",      "#c8491b",  1], // Repetition (tile)
    ],
    pickColor () {
        this.gridColor = this.colors[this.palette][2];
        this.pickedColors = this.colors[this.palette]
    },
    // BRUSH
    brushNames: [
        ["charcoal", 30],
        ["cpencil", 15],
        ["pen", 30],
        ["2B", 15]
    ],
    pickBrush() {
        this.brushName = this.p(this.brushNames)
    },
    // FLOWFIELD
    ffTypes: [
        ["Windy",10],
        ["Nasty",8],
        ["Tilted",15],
        ["Zigzag",15],
        ["Wavy",20],
        ["Scales",0],
        ["Wobbly",15],
        ["Honest",30]
    ],
    pickFF () {
        this.ffType = this.p(this.ffTypes);
    },
    // DRAWING MODE
    drawModes: [
        ["Imitation",[60,20,15]],
        ["Repetition",[50,0,50]],
        ["Learning",[50,0,0]],
        ["Rotation",[50,0,20]],
    ],
    pickDM() {
        this.drawSel = this.pickedColors[8]
        this.drawMode = this.drawModes[this.drawSel][0]
    },
    tileNr: R.rande(2,4),
    dNr: R.rande(3,7),
    polarNr: R.rande(3,10),
    // HATCHING MODE
    pickHM() {
        this.hatchModes = [
            ["Spectrum",this.drawModes[this.drawSel][1][0]],
            ["Nest",this.drawModes[this.drawSel][1][1]],
            ["In and Around",this.drawModes[this.drawSel][1][2]],
        ]
        this.hatchMode = this.p(this.hatchModes)
    },
    // SHOW LINE?
    showLine: R.rande(0,2),
    // DEPTH
    pickD() {
        (this.hatchMode == "Spectrum" && this.brushName !== "charcoal") ? this.isDeep = true : this.isDeep = false;
    },
    // MAX DOODLES
    pickMD() {
        (this.drawMode == "Imitation") ? this.maxDrawings = parseInt(R.weightedRand({3: 30,4: 40,5: 10})) : this.maxDrawings = 1;
    },
    pickAll() {
        this.pickColor(),this.pickBrush(),this.pickFF(),this.pickDM(),this.pickHM(),this.pickD(),this.pickMD();
    }
};
T.pickAll();
// DEFINE FEATURES
$fx.features({
    'Type': T.drawMode,
    'Hatch Mode': T.hatchMode,
    'Brush': T.brushName,
})

//////////////////////////////////////////////////
// Instanced P5 Canvas where we will show the shape while drawing and from which we will get the Mouse Coordinates
const handBuffer = function(p) {
    p.setup = function() {        
        let hand = p.createCanvas(floor(C.fitWidth), floor(C.fitHeight));
        hand.id('drawingCanvas');
    };
    p.draw = function() {
        C.mouseX = int(p.mouseX / C.fitMult);
        C.mouseY = int(p.mouseY / C.fitMult);
        if (Sketch.isDrawing && !Sketch.isDrawn && !Sketch.isAboveLimit) {
            p.strokeWeight(2)
            p.stroke(0)
            p.circle(p.mouseX,p.mouseY,2)
        }
        else if (Sketch.isDrawn) {
            p.clear();
        }
    };
    p.windowResized = function() {
        p.resizeCanvas(floor(C.fitWidth), floor(C.fitHeight));
    };
}

// Instanced P5 Canvas where we will show loading messages and other things
const loadingBuffer = function(p) {
    let message, message1;
    switch (T.drawMode) {
        case "Imitation":
            message = "Type: FREEHAND"
            message1 = "Draw " + T.maxDrawings + " FREE SHAPES";
        break;
        case "Repetition":
            message = "Type: TILES"
            message1 = "Design the TILE";
        break;
        case "Learning":
            message = "Type: TEACH"
            message1 = "Draw a CENTERED SHAPE";
        break;
        case "Rotation":
            message = "Type: ROTATE"
            message1 = "Design the SECTOR";
        break;
    }
    let message5 = "DRAWING";
    p.setup = function() {        
        let load = p.createCanvas(floor(C.fitWidth), floor(C.fitHeight));
        load.id('loadingCanvas');
        p.textFont("Courier"), p.noStroke(), p.rectMode(p.CENTER);
    };
    p.draw = function() {
        p.clear(), p.textSize(10/C.fitMult), p.textAlign(p.CENTER,p.CENTER);
        if ($fx.context === "minting") {
            p.push();
            p.translate(p.width/2,p.height/2)
            if (Sketch.isAboveLimit) {
                p.fill(0)
                p.text("RELEASE!",0,0);
            }
            if (Sketch.generating) {
                p.fill(T.pickedColors[2]), p.rect(0,0,p.textWidth(message5)+50*C.fitMult,140*C.fitMult)
                p.fill(T.pickedColors[1]), p.text(message5,0,0);
            }
            p.pop();

            if (!Sketch.isDrawn && !Sketch.isDrawing) {
                p.push();
                p.textSize(40*C.fitMult)
                p.textAlign(p.LEFT,p.CENTER);
                p.fill(T.pickedColors[2]);
                p.rect( (C.w1+40) * C.fitMult + (p.textWidth(message)+15*C.fitMult)/2,  (C.h2-90) * C.fitMult,p.textWidth(message)+30*C.fitMult,40*C.fitMult)
                p.rect( (C.w1+40) * C.fitMult + (p.textWidth(message1)+15*C.fitMult)/2, (C.h2-50) * C.fitMult,p.textWidth(message1)+30*C.fitMult,40*C.fitMult)
                p.fill(T.pickedColors[1]);
                p.text(message,(C.w1+40) * C.fitMult,(C.h2-90) * C.fitMult);
                p.text(message1,(C.w1+40) * C.fitMult,(C.h2-50) * C.fitMult);
                p.pop();
            }
            if(!Sketch.isDrawn) {
                p.push();
                p.noFill()
                p.stroke(255,0,0)
                p.strokeWeight(8 * C.fitMult)
                switch (T.drawMode) {
                    case "Repetition":
                        p.rectMode(p.CORNERS);
                        p.rect(C.w1*C.fitMult,C.h1*C.fitMult,C.w1*C.fitMult+(C.w2-C.w1)/T.tileNr*C.fitMult,C.h1*C.fitMult+(C.h2-C.h1)/T.tileNr*C.fitMult)
                    break;
                    case "Learning":
                        p.line(p.width/2,p.height/2-200*C.fitMult,p.width/2,p.height/2+200*C.fitMult)
                        p.line(p.width/2-200*C.fitMult,p.height/2,p.width/2+200*C.fitMult,p.height/2)
                    break;
                    case "Rotation":
                        let dist = (C.w2-C.w1)/1.5*C.fitMult
                        p.line(p.width/2,p.height/2,p.width/2+dist*cos(-90),p.height/2+dist*sin(-90))
                        p.line(p.width/2,p.height/2,p.width/2+dist*cos(-90-360/T.polarNr),p.height/2+dist*sin(-90-360/T.polarNr))
                    break;
                }
                p.pop();
            }
  
        } else if (!C.loaded) {
            p.push(), p.translate(p.width/2,p.height/2), p.fill(0), p.text("Loading...",0,0), p.pop();
        } else if (C.loaded) {p.noLoop()}
    };
    p.windowResized = function() {
        p.resizeCanvas(floor(C.fitWidth), floor(C.fitHeight));
    };
}

//////////////////////////////////////////////////
// MOUSE FUNCTIONS
    // When CLICKED
    function mousePressed () {
        Sketch.startDoodle();
        return null;
    }
    // While MOVING
    function mouseDragged() {
        Sketch.recordDoodle();
        return null;
    }
    // When RELEASED
    function mouseReleased () {
        Sketch.finishDoodle();
        return null;
    }

// KEYBOARD FUNCTIONS
function keyReleased() {
    // IF USER PRESSES "C", logs data to Console
    if (keyCode === 67) {
        console.log(Sketch.encodedData)
    // Save with "S"
    } else if (keyCode === 83) {
        // Save Image
        save(C.main, "Pensado_a_mano-" + $fx.hash, 'png');
    // Save Plot with "P"
    } else if (keyCode === 80) {
        for (let g of S.buffers) {
            let layerBuffer = createGraphics(C.width, C.height,SVG);
            for (let b of g) {
                layerBuffer.image(b,0,0)
            }
            S.final.image(layerBuffer,0,0)
        }
        // Save SVG
        save(S.final,"Pensado_a_mano-" + $fx.hash)
    }
    return null;
}

//////////////////////////////////////////////////
// BASIC p5 FUNCTIONS

function windowResized () {
    C.resize();
}

function setup () {

    // CreateCanvas
    C.createCanvas('mainCanvas');

    // Minting Interface
    if ($fx.context === "minting") {
        // Create Independent Canvas for Drawing
        C.handBuffer = new p5(handBuffer)
    }
    // Create Independent Canvas for Loading and Messages
    C.loadingBuffer = new p5(loadingBuffer)

    // SVG STUFF
    S.final = createGraphics(C.width,C.height,SVG);

    // Helps my brain
    angleMode(DEGREES)

    // Create FlowField
    FF.create(T.ffType)

    background(T.pickedColors[1]);

    // Create global brushes
    B.gridLines = new LineStyle(T.brushName,true)
    B.borderLines = new LineStyle("HB",false);
    B.thinLines = new LineStyle("HB");

    // Draw borders
    B.drawBorders(B.borderLines,T.pickedColors[2],0.6)
}

function draw() {
    // If drawing data already exists, we decode it
    Sketch.decodeDrawing()

    // If Sketch data exists, show the drawing
    if (Sketch.generating) Sketch.nn++
    if (($fx.context == "minting" && Sketch.isDrawn && Sketch.nn > 1) || ($fx.context !== "minting" && Sketch.isDrawn)) {
        Sketch.generating = false, Mano.show(), $fx.preview(), C.loaded = true, noLoop();
    }
}

//////////////////////////////////////////////////
// PROJECT SPECIFIC FUNCTIONS, VARIABLES, AND CLASSES
const B = {
    drawBorders (brush,color,weight) {
        brush.line((C.w1-R.rande(15,25)),C.h1,(C.w2+R.rande(15,25)),C.h1,color,weight,"straight");
        brush.line(C.w1,(C.h1-R.rande(15,25)),C.w1,(C.h2+R.rande(15,25)),color,weight,"straight");
        brush.line(C.w2,(C.h1-R.rande(15,25)),C.w2,(C.h2+R.rande(15,25)),color,weight,"straight");
        brush.line((C.w2+R.rande(15,25)),C.h2,(C.w1-R.rande(15,25)),C.h2,color,weight,"straight");
    }
};

//////////////////////////////////////////////////
// THIS IS WHERE WE CREATE AND DECODE WITH HAND-DRAWING DATA
const Sketch = {
    nn: 0,
    isDrawn: false,
    isDrawing: false,
    isAboveLimit: false,
    maxDoodles: T.maxDrawings,
    currentDoodle: 0,
    doodles_data: [],
    encodedData: null,
    doodles: [],
    generating: false,
    calcAngle() {
        let angle = int(atan(-(C.mouseY-this.temp.y)/(C.mouseX-this.temp.x)));
        if (C.mouseX-this.temp.x < 0) angle += 180;
        return angle;
    },
    startDoodle() {
        // If it is not drawn and not above char limit
        if (!this.isDrawn && !this.isAboveLimit) {
            // Initiate Doodle Data with Origin
            this.doodles_data.push(C.mouseX,C.mouseY);

            // Store first point on a temp object that will change
            this.temp = {x:C.mouseX,y:C.mouseY};

            // Start Drawing
            this.isDrawing = true;
        }
    },
    recordDoodle() {
        // If it is not drawn and not above char limit
        if (!this.isDrawn && !this.isAboveLimit) {
            if(mouseIsPressed) {
                // Calculate distance between current mouse coordinates and temporal coordinates
                let distance = int(dist(C.mouseX,C.mouseY,this.temp.x,this.temp.y));
                // Set Resolution
                let res = 100;
                if(T.drawMode !== "Imitation") { res = 25 }
                // If the mouse has travelled enough distance, we store a new segment
                if (distance >= res) {
                    // Calculate angle in Degrees
                    let angle = this.calcAngle()
                    // Push info to data
                    this.doodles_data.push(angle,distance);
                    // Set new temporal coordinates
                    this.temp.x = C.mouseX;
                    this.temp.y = C.mouseY;
                }
                // If the data is above our params char limit, we stop drawing
                if ((this.doodles_data.toString()).length >= 1850) {
                    this.isAboveLimit = true;
                    this.finishDoodle();
                }
            }
        }
    },
    finishDoodle() {
        // If it is not drawn already
        if (!this.isDrawn) {
            // Calculate and push last angle with 'x' as closing character
            let angle = this.calcAngle();
            this.doodles_data.push(angle,'x');
            // Stop Drawing and iterate doodlenumber
            this.currentDoodle++
            this.isDrawing = false;
            // Encode and store data
            this.encodedData = this.doodles_data;
        }
        // If number of max nr. of doodles has been reached, finish capturing
        if (this.currentDoodle >= this.maxDoodles || this.aboveLimit) {
            this.isDrawn = true;
            Sketch.generating = true;
            this.isAboveLimit = false;
            $fx.emit("params:update", {
                draw_string: this.encodedData.toString(),
            })
        }
    },
    decodeDrawing() {
        // Check if param exists and add data to doodle object
        if ($fx.context !== "minting") {
            this.isDrawn = true;
            this.encodedData = $fx.getParam("draw_string")
        }
        if (this.isDrawn) {
            // Remove check and decode base64
            let segments = this.encodedData.toString()  
            // We split the info as an array
            segments = segments.split(",")
            // This code goes through the data string and extracts origin, angles and segments
            let new_doodle = true;
            let num_doodle = 0;
            for (let i = 1; i < segments.length; i+=2) {
                if (new_doodle) {
                    this.doodles[num_doodle] = {
                        origin: {x: parseFloat(segments[i-1]), y: parseFloat(segments[i])},
                        angles: [],
                        segments: [],
                        plot: new Plot("curve"),
                      };
                    new_doodle = false;
                } else {
                    let angle = segments[i-1]
                    let dist = segments[i]
                    if (dist == "x") {
                        this.doodles[num_doodle].angles.push(parseFloat(angle))
                        this.doodles[num_doodle].plot.endPlot(parseFloat(angle))
                        num_doodle++
                        new_doodle = true
                    } else {
                        this.doodles[num_doodle].angles.push(parseFloat(angle))
                        this.doodles[num_doodle].segments.push(parseFloat(dist))
                        this.doodles[num_doodle].plot.addSegment(parseFloat(angle),parseFloat(dist))
                    }
                }
            }
        }
    },
}

//////////////////////////////////////////////////
// THIS IS WHERE WE SHOW CREATED DRAWING
const Mano = {
    seed: R.rand(),
    show() {
        randomSeed(this.seed*5523)
        // DRAW BASE LAYER if NEEDED
        let angle1 = random(0,180);
        if (T.isDeep) {
            let polygons = [];
            for (let i = 0; i < 5; i++) {polygons.push(new Polygon([[random(C.w1,C.w2),random(C.h1,C.h2)],[random(C.w1,C.w2),random(C.h1,C.h2)],[random(C.w1,C.w2),random(C.h1,C.h2)],[random(C.w1,C.w2),random(C.h1,C.h2)]]))}
            let hatch2 = new Hatch(25,angle1,polygons,true)
            hatch2.rainbowHatch(B.thinLines,0.7,T.pickedColors);
        }

        // CREATE POLYGONS
        let polygons3 = []
        switch(T.drawMode) {
            case "Imitation":
                for (let D of Sketch.doodles) {
                    polygons3.push(D.plot.genPol(D.origin.x,D.origin.y,1))
                }
            break;
            case "Repetition":
                for (let D of Sketch.doodles) {
                    for (let i = 0; i < T.tileNr; i++) {
                    for (let j = 0; j < T.tileNr; j++) {
                        let pol = D.plot.genPol(D.origin.x + ( (C.w2-C.w1) / T.tileNr ) * i,D.origin.y + ( (C.h2-C.h1) / T.tileNr ) * j,1)
                        polygons3.push(pol)
                    }                
                    }
                }
            break;
            case "Learning":
                for (let D of Sketch.doodles) {
                    for (let i = 0; i < T.dNr; i++) {
                        let pol = D.plot.genPol((D.origin.x - C.width/2) + random(C.w1+200,C.w2-200),(D.origin.y - C.height/2) + random(C.h1+200,C.h2-200),random(0.5,2))
                        polygons3.push(pol)
                    }
                }
            break;
            case "Rotation" :
                for (let D of Sketch.doodles) {
                    let aa = 360/T.polarNr;
                    for (let i = 0; i < T.polarNr; i++) {
                        let vector = createVector(D.origin.x-C.width/2,D.origin.y-C.height/2)
                        vector.rotate(i*aa)
                        let newOrigin = [C.width/2+vector.x,C.height/2+vector.y]
                        D.plot.rotate(-i*aa)
                        let pol = D.plot.genPol(newOrigin[0],newOrigin[1],1)
                        polygons3.push(pol)
                        if (T.showLine == 1 && random() < 0.05) {
                            B.thinLines.plot(D.plot,newOrigin[0],newOrigin[1],1,T.pickedColors[int(random(2,7))],1)
                        }
                    }
                }
            break;
        }
        
        // HATCH STUFF
        randomSeed(this.seed*99987)
        // Random colors in order
        let colores = [], o = 0;
        for (let p of polygons3) {
            colores.push(T.pickedColors[int(random(2,7))])
        }
        // Hatch stuff
        switch(T.hatchMode) {
            case "In and Around":
                // Type 1 (inside and around)
                let ar = int(random(1,3))
                for (let p of polygons3) {
                    if (ar > 0 && random() < 0.5) {
                        p.hatch("around",random(12,25),random(0,180),B.gridLines,colores[o],1);
                        ar--
                    } else {
                        p.hatch("inside",random(12,25),random(0,180),B.gridLines,colores[o],1);
                    }
                    o++;
                }
            break;
            case "Spectrum":
                let angle2 = random(0,180);
                while (abs(angle1-angle2) < 30) {
                    angle2 = random(0,180)
                }
                let hatch3 = new Hatch(random(12,18),angle2,polygons3,true)
                hatch3.rainbowHatch(B.gridLines,1,T.pickedColors);
            break;
            case "Nest":
                for (let p of polygons3) {
                    p.hatch("around",random(12,25),random(0,180),B.gridLines,colores[o],1);
                    o++;
                }
            break;
        }
        this.noise();
    },
    noise() {
        loadPixels();
            let d = pixelDensity();
            for (c=1;c<pixels.length/4;c+= 4) {
                let ruido = random(-1,1)*20
                for (let i = 0; i < d; i++) {
                    for (let j = 0; j < d; j++) {
                        pixels[4*c-4+4*i+C.width*j] += ruido;
                        pixels[4*c-3+4*i+C.width*j] += ruido;
                        pixels[4*c-2+4*i+C.width*j] += ruido;
                    }
                }
            }
        updatePixels();
    }
}