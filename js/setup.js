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

        for (let p of polygons) {
            let angle = random(0,180)
            if (random() < 0.3) {
                let h = new Hatch(random(15,40),angle,p,true)
                h.isolate(gridLines,pickedColors[int(random(2,8))],1);
            } else {
                let h = new Hatch(random(15,40),angle,p,true)
                h.hatch(gridLines,pickedColors[int(random(2,8))],1);
            }
        }

        //hatch = new Hatch(10,random(0,180),polygons,true)
        //hatch.rainbowHatch(gridLines);
}

let l; // loading phases

let LL = 0;

function draw () {

    loaded = 4;
    
    if (firefoxAgent) {
        canvas_texture.image(lienzo,0,0);
    }

    frameRate(20)
    noLoop();
}

function mouseClicked() {
    noLoop();
}

function punto (x,y) {
    return {x:x,y:y}
}

class Hatch {
    constructor (dist, angle, polygons, full = true) {
        this.dots = []

        if (full) {
            if (Array.isArray(polygons)) {
                polygons.push(new Polygon([[w1,h1],[w2,h1],[w2,h2],[w1,h2]]))
            } else {
                polygons = [polygons]
                polygons.push(new Polygon([[w1,h1],[w2,h1],[w2,h2],[w1,h2]]))
            }
        }

        this.empiezax = w1
        if (angle <= 90 && angle >= 0) {this.empiezay = h1} else {this.empiezay = h2}

        let boundary = {w1: w1,w2: w2,h1: h1,h2: h2,}
        let ventana = new Polygon([[w1,h1],[w2,h1],[w2,h2],[w1,h2]])
        let i = 0;
        let linea = {
            point1 : {x: this.empiezax,               y:this.empiezay},
            point2 : {x: this.empiezax+1*cos(-angle), y:this.empiezay+1*sin(-angle)}
        }
        while (ventana.intersect(linea).length > 0) {            
            let tempArray = [];
            if (Array.isArray(polygons)) {
                for (let p of polygons) {
                    tempArray.push(p.intersect(linea,boundary))
                }
            } else {
                tempArray.push(polygons.intersect(linea,boundary))
            }            
            this.dots[i] = []
            tempArray = tempArray.flat();
            tempArray.sort(function(a,b) {
                if( a.x == b.x) return a.y-b.y;
                return a.x-b.x;
            });
            this.dots[i] = this.dots[i].concat(tempArray)
            i++
            linea = {
                point1 : {x: this.empiezax+dist*i*cos(-angle+90),               y:this.empiezay+dist*i*sin(-angle+90)},
                point2 : {x: this.empiezax+dist*i*cos(-angle+90)+1*cos(-angle), y:this.empiezay+dist*i*sin(-angle+90)+1*sin(-angle)}
            }
        }
    }
    rainbowHath (brush) {
        for (let dd of this.dots) {
            let index = 2;
            for (let i = 0; i < dd.length-1; i++) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,pickedColors[index],1,"straight")
                index++;
                if (index == 8) {
                    index = 2;
                }
            }
        }
    }
    hatch (brush,color,weight) {
        for (let dd of this.dots) {
            for (let i = 0; i < dd.length-1; i++) {
                if (i % 2 == 1) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,color,weight,"straight")
                }
            }
        }
    }
    isolate (brush, color, weight) {
        for (let dd of this.dots) {
            for (let i = 0; i < dd.length-1; i++) {
                if (i % 2 == 0) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,color,weight,"straight")
                }
            }
        }
    }
}

class Polygon {
    constructor (array) {
        this.vertices = [];
        this.sides = [];
        for (let a of array) {
            this.vertices.push({x:a[0],y:a[1]})
        }
        for (let i = 0; i < this.vertices.length; i++) {
            if (i < this.vertices.length-1) {
                this.sides[i] = [this.vertices[i],this.vertices[i+1]]
            } else {
                this.sides[i] = [this.vertices[i],this.vertices[0]]
            }
        }
    }
    draw (weight,color) {
        push();
        stroke(color)
        strokeWeight(weight)
        noFill();
        beginShape();
        for (let v of this.vertices) {
            vertex(v.x,v.y)
        }
        endShape(CLOSE)
        pop();
    }
    intersect (line,boundary) {
        if (typeof boundary == "undefined") {
            boundary = {
                w1: 0,
                w2: canvas.width,
                h1: 0,
                h2: canvas.height,
            }
        }
        let points = []
        for (let s of this.sides) {
            let intersection = intersectar(line.point1,line.point2,s[0],s[1],boundary)
            if (intersection !== false) {
                points.push(intersection)
            }
        }
        return points;
    }
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
    borderLines.line((w1-random(15,25)),h2,(w2+random(15,25)),h2,colors[palette][2],0.6,"straight");
}