class LineStyle {
    constructor (type) {
        this.type = type;
        let color_svg;
        switch (this.type) { // Global Parameters for the brushes
            case "pen":
                // weight, vibration, definition, quality, opacity, step_length
                this.params = [4,1,0.5,8,255,3]
                color_svg = [255,0,0]
            break;
            case "rotring":
                this.params = [3,1,0.8,15,255,3]
                color_svg = [255,255,0]
            break;
            case "2B":
                this.params = [5,7,0.3,10,255,4]
                color_svg = [0,255,0]
            break;
            case "HB":
                this.params = [4,4,0.5,4,180,3]
                color_svg = [0,255,255]
            break;
            case "2H":
                this.params = [3.5,3,0.3,2,150,4]
                color_svg = [0,0,255]
            break;
            case "cpencil":
                this.params = [5,5,0.9,10,120,2]
                color_svg = [255,0,255]
            break;
            case "charcoal":
                this.params = [8,25,0.75,300,140,0.5]
                color_svg = [0,0,0]
            break;
            case "marker":
                this.params = [25,3,0.5,4,60,5]
                this.marker = true;
                color_svg = [255,255,0]
            break;
            case "spray":
                this.params = [2,90,0.5,90,190,8]
                this.spray = true;
                color_svg = [100,100,100]
            break;
        }      
        this.weight = this.params[0], this.vibration = this.params[1], this.def = this.params[2], this.quality = this.params[3], this.opacity = this.params[4], this.step_length = this.params[5];   
        
        // SVG THINGS
        this.buffers = []
        for (let m = 0; m < 6; m++) {
            this.buffers[m] = createGraphics(canvas.width, canvas.height,SVG);
            this.buffers[m].stroke(color_svg)
            this.buffers[m].strokeWeight(this.params[0])
            this.buffers[m].noFill()
        }
        svgBuffers.push(this.buffers)
    }
    brushvariation () {
        switch (this.type) {
            case "pen":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.3,0.8,rand(3.5,5)];
            break;
            case "rotring":
                this.param = [rand(0.45,0.55),rand(0.7,0.8),1.1,0.9,rand(3.5,5)];
            break;
            case "2H": case "2B": case "HB":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.2,0.9,rand(3.5,5)];
            break;
            case "cpencil":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.2,0.9,rand(3.5,5)];
            break;
            case "charcoal":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.3,0.8,rand(3.5,5)];
            break;
            case "marker":
                this.param = [rand(0.45,0.55),rand(0.85,0.9),1,0.75,rand(3,6)];
            break;
            case "spray":
                this.param = [rand(0.45,0.55),rand(0.85,0.9),0.3,1.2,rand(5,7)];
            break;
        }
        this.a = this.param[0], this.b = this.param[1], this.m1 = this.param[2], this.m2 = this.param[3], this.c = this.param[4];
        this.adj = 1,this.adj2=1; 
        stroke(this.color), fill(this.color);
        if (this.marker) {
            this.adj = this.strokeWeight, this.adj2 = 0.9*this.strokeWeight;
            this.randMark = rand(0.1,0.3), this.randMark2 = rand(0.7,0.9);
        } else {noStroke();}
    }
    pickBuffer() {
        this.buffer = this.buffers[this.color_index];
    }
    plot (_plot,_x,_y,_scale,_color,_strokeWeight) { 
        push();

        // PARAMS
        this.strokeWeight = _strokeWeight, this.color = color(_color), this.distance = 0, this.color.setAlpha(this.opacity);
        this.brushvariation();
        this.color_index = pickedColors.indexOf(_color)-2
        this.pickBuffer()

        // PLOT LINE
        this.buffer.beginShape()
            // GEOMETRY PARAMS
            
            this.length = _plot.length, this.linepoint = new Pos(_x + _plot.adjust[0],_y + _plot.adjust[1]);
            this.step = this.step_length/this.strokeWeight*sq(this.adj2)
            let numsteps = Math.round(_plot.length/this.step)*_scale;

            for (let steps = 0; steps < numsteps; steps++) {
                this.brush(); // PAINT TIP
                this.linepoint.plotTo(_plot,this.step,this.step,_scale)
            }
        this.buffer.endShape()

        // COLORMIX
        if (this.marker) {paintColor(this.color,0.4);}
        pop();
    }
    line (_x,_y,_par1,_par2,_color,_strokeWeight,_type = "straight") { 
        push();

        // PARAMS
        this.strokeWeight = _strokeWeight, this.color = color(_color), this.distance = 0, this.color.setAlpha(this.opacity);
        this.brushvariation();
        this.color_index = pickedColors.indexOf(_color)-2
        this.pickBuffer()

        // START LINE
        this.buffer.beginShape()
                // Straight Lines
                if (_type == "straight") {
                    this.length = dist(_par1,_par2,_x,_y), this.dir = atan(-(_par2-_y)/(_par1-_x)), this.linepoint = new Pos(_x,_y), this.straight = true;
                    if ((_par1-_x) < 0) {
                        this.dir = 180 + this.dir
                    }
                } 
                // FieldLines
                else if (_type == "field") {
                    this.length = _par1, this.dir = _par2, this.linepoint = new Pos(_x,_y), this.straight = false; 
                }
            this.step = this.step_length/this.strokeWeight*sq(this.adj2)  
            let numsteps = Math.round(this.length / this.step);     
            for (let steps = 0; steps < numsteps; steps++) {
                this.brush() // PAINT TIP
                this.linepoint.moveTo(this.step,this.dir,this.step,this.straight)
            }
        this.buffer.endShape()

        // Marker ColorMix (mixbox)
        if (this.marker) {paintColor(this.color,0.4,"marker");}
        pop();
    }
    brush() {
        this.buffer.vertex(this.linepoint.x,this.linepoint.y)

        if (this.spray) { // SPRAY TYPE BRUSHES
            this.vibr = (this.strokeWeight*this.vibration*this.pressureSimulation(0.5,0.9,3,0.2,1))+this.vibration/5*randomGaussian();
            let strokeWii = rand(0.9*this.weight,1.1*this.weight);
            for (this.j = 0; this.j < this.quality; this.j++) {
                this.randSp = rand(0.9,1.1);
                this.randX = rand(this.randSp*-this.vibr, this.randSp*this.vibr);
                this.randY = rand(-1, 1) * sqrt(sq(this.randSp*this.vibr) - this.randX * this.randX);
                circle(this.linepoint.x + this.randX, this.linepoint.y + this.randY,strokeWii);
            }
        } else if (this.marker) { // MARKER TYPE BRUSHES
            maskBuffer.push();
            maskBuffer.fill(0,255,0,100);
            maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.strokeWeight*this.weight*this.pressureSimulation(this.a,this.b,5,this.m1,this.m2));
            this.markerOpacity(0,this.randMark,"inicio");
            this.markerOpacity(this.randMark2,1,"final");
            for (this.j = 0; this.j < rande(1,4); this.j++) {
                this.markerOpacity(this.j*0.25+rand(0.05,0.30),this.j*0.25+rand(0.25,0.40));
            }
            maskBuffer.pop();
        }
        else { // REST OF BRUSHES
            this.vibr = this.strokeWeight*this.vibration*(this.def+(1-this.def)*this.pressureSimulation(0.5,0.9,5,0.2,1)*randomGaussian());
            if (rand(0,this.quality)>0.4) {
                circle(this.linepoint.x+0.7*rand(-this.vibr,this.vibr),this.linepoint.y+rand(-this.vibr,this.vibr),rand(0.9*this.weight,1.1*this.weight)*this.pressureSimulation(this.a,this.b,5,this.m1,this.m2));
            }
        }
    }
    markerOpacity(a,b,where) {
        this.distance = this.linepoint.plotted;
        if (this.distance < b*this.length && this.distance > a*this.length) {
            if (where == "inicio") {this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,0,1));} else if (where == "final") {this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,1,0));}else {this.opacity2 = this.opacity*(1-Math.abs(map(this.distance,a*this.length,b*this.length,-1,1)));}
            maskBuffer.push();
            maskBuffer.fill(0,0,255,this.opacity2);
            maskBuffer.circle(this.linepoint.x+rand(-this.vibration,this.vibration),this.linepoint.y+rand(-this.vibration,this.vibration),this.strokeWeight*this.weight)
            if (this.distance <= rand(0.01,0.015)*this.length || this.distance >= rand(0.985,0.99)*this.length) {
                maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.strokeWeight*this.weight)
            }
            maskBuffer.pop();
        }        
    }
    pressureSimulation (a,b,c,m1,m2) {
        this.distance = this.linepoint.plotted;
        this.graph = (1/(1+pow(Math.abs((this.distance-a*this.length)/(b*this.length/2)),2*c)));
        return map(this.graph,0,1,m1,m2);
    }
}

class Hatch {
    constructor (dist, angle, polygons, full = true) {
        this.dots = []

        if (full) {
            if (!Array.isArray(polygons)) {polygons = [polygons]}
            polygons.push(new Polygon([[w1,h1],[w2,h1],[w2,h2],[w1,h2]]))
        }
        if (angle <= 90 && angle >= 0) {this.startY = 0} else {this.startY = canvas.height}
        let boundary = {w1: 0,w2: canvas.width,h1: 0,h2: canvas.height}
        let ventana = new Polygon([[0,0],[canvas.width,0],[canvas.width,canvas.height],[0,canvas.height]])
        let i = 0;
        let linea = {
            point1 : {x: 0,               y:this.startY},
            point2 : {x: 0+1*cos(-angle), y:this.startY+1*sin(-angle)}
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
                point1 : {x: 0+dist*i*cos(-angle+90),               y:this.startY+dist*i*sin(-angle+90)},
                point2 : {x: 0+dist*i*cos(-angle+90)+1*cos(-angle), y:this.startY+dist*i*sin(-angle+90)+1*sin(-angle)}
            }
        }
    }
    rainbowHatch (brush) {
        for (let dd of this.dots) {
            let index = 2;
            for (let i = 0; i < dd.length-1; i++) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,pickedColors[index],1)
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
                if (i % 2 == 0) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,color,weight)
                }
            }
        }
    }
    isolate (brush, color, weight) {
        for (let dd of this.dots) {
            for (let i = 0; i < dd.length-1; i++) {
                if (i % 2 == 0) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,color,weight)
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
    border (brush,weight,color) {
        push();
        for (let s of this.sides) {
            brush.line(s[0].x,s[0].y,s[1].x,s[1].y,color,weight,"straight")
        }
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
    hatch (type,dist,angle,brush,color,weight) {
        switch (type) {
            case "around":
                this.hatch = new Hatch(dist,angle,this,true)
                this.hatch.isolate(brush,color,weight);
            break;
            case "inside":
                this.hatch = new Hatch(dist,angle,this,false)
                this.hatch.hatch(brush,color,weight);
            break;
        }
    }
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Return FALSE if the lines don't intersect
function intersectar(point1,point2,point3,point4,boundary) {
    var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y, x3 = point3.x, y3 = point3.y, x4 = point4.x, y4 = point4.y;
      if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
          return false
      }
      denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
      if (denominator === 0) {
          return false
      }
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
      if (ub < 0 || ub > 1) {
          return false
      }
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
      if (x.between(boundary.w1-1,boundary.w2+1) && y.between(boundary.h1-1,boundary.h2+1)) {
        return {x: x,y: y}
      } else { return false }
  }

Number.prototype.between = function(a, b) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return this >= min && this <= max;
  };


class Plot {
    constructor (_type) {
        this.segments = [];
        this.angles = [];
        this.outer = [];
        this.adjust = [0,0]
        this.type = _type;
        this.dir = 0;
    }
    addSegment (_a = 0,_length = 0,_out = 1) {
        if (this.angles.length > 0) {
            this.angles.splice(-1)
        }
        this.angles.push(_a);
        this.segments.push(_length);
        this.outer.push(_out);
        this.length =  this.segments.reduce((partialSum, a) => partialSum + a, 0);
        this.angles.push(_a)
    }
    endPlot (_a = 0) {
        this.angles.splice(-1)
        this.angles.push(_a);
    }
    center (_adj_x, _adj_y) {
        this.adjust = [_adj_x,_adj_y];
    }
    rotate (_angle) {
        this.dir = _angle;
    }
    angle (_d) {
        if (_d > this.length) { return 0; }
        this.calcIndex(_d);
        switch (this.type) {
            case "curve":
                return map(_d-this.suma,0,this.segments[this.index],this.angles[this.index],this.angles[this.index+1],true) + this.dir;
            case "truncated":
                return this.angles[this.index] + this.dir;
        }
    }
    border (_d) {
        if (_d > this.length) { return false; }
        this.calcIndex(_d);
        if (this.outer[this.index] == 1) {
            return true;
        } else { return false;}
    }
    calcIndex(_d) {
        this.index = -1;
        let d = 0; this.suma = 0;
        while (d <= _d) {
            this.suma = d
            d += this.segments[this.index+1]
            this.index++;
        }
    }
    genPol (_x,_y,_scale) {
        let vertices = []
            let linepoint = new Pos(_x + this.adjust[0],_y + this.adjust[1]);
            let numsteps = Math.round(this.length/step_length)*_scale;
            for (let steps = 0; steps < numsteps; steps++) {
                vertices.push([linepoint.x,linepoint.y])
                linepoint.plotTo(this,step_length,step_length,_scale)
            }
        this.polygon = new Polygon(vertices)
        return this.polygon;
    }
}