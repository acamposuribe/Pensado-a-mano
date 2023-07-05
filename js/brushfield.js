const FF = {
    create (a) {
        this.R = parseFloat(C.width*0.01), this.left_x = parseFloat(C.width * -0.5), this.top_y = parseFloat(C.height * -0.5), this.bottom_y = parseFloat(C.height * 1.5), this.num_columns = Math.round((parseFloat(C.width * 1.5) - parseFloat(C.width * -0.5)) / parseFloat(C.width*0.01)), this.num_rows = Math.round((parseFloat(C.height * 1.5) - parseFloat(C.height * -0.5)) / parseFloat(C.width*0.01)), this.flow_field = [], this.step_length = Math.min(C.width,C.height) / 1000;
        let angleRange, truncate, baseSize, baseAngle;
        switch (a) {
            case "Windy":
                angleRange = R.rande(-25,-15);
                if (R.rande(0,100)%2 == 0) {angleRange=angleRange*-1}
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {               
                        var scaled_x = parseFloat((column) * 0.02);
                        var scaled_y = parseFloat((row) * 0.02);
                        var noise_val = noise(parseFloat(scaled_x.toFixed(3)), parseFloat(scaled_y.toFixed(3)))
                        var angle = map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                        this.flow_field[column][row] = 3*angle;
                    }
                }
            break;
            case "Nasty":
                angleRange = R.rande(-25,-15);
                if (R.rande(0,100)%2 == 0) {angleRange=angleRange*-1}
                truncate = R.rande(5,10);
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {               
                        var scaled_x = parseFloat((column) * 0.02);
                        var scaled_y = parseFloat((row) * 0.02);
                        var noise_val = noise(parseFloat(scaled_x.toFixed(3)), parseFloat(scaled_y.toFixed(3)))
                        var angle = map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                        var angle = round(angle/truncate)*truncate;
                        this.flow_field[column][row] = 4*angle;
                    }
                }
            break;
            case "Tilted":
                angleRange = R.rande(-45,-25);
                if (R.rande(0,100)%2 == 0) {angleRange=angleRange*-1}
                var dif = angleRange;
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    var angle = 0;
                    for (row=0;row<this.num_rows;row++) {               
                        this.flow_field[column][row] = angle;
                        angle = angle + dif;
                        dif = -1*dif;
                    }
                }
            break;
            case "Zigzag":
                angleRange = R.rande(-30,-15);
                if (R.rande(0,100)%2 == 0) {angleRange=angleRange*-1}
                var dif = angleRange;
                var angle = 0;
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {               
                        this.flow_field[column][row] = angle;
                        angle = angle + dif;
                        dif = -1*dif;
                    }
                    angle = angle + dif;
                    dif = -1*dif;
                }
            break;
            case "Wavy":
                let sinrange = R.rande(10,15);
                let cosrange = R.rande(3,6);
                baseAngle = R.rande(20,35);
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {               
                        angle = sin (sinrange*column)*(baseAngle*cos(row*cosrange)) + R.rande(-3,3);
                        this.flow_field[column][row] = angle;
                    }
                }
            break;
            case "Scales":
                baseSize = R.rand(0.3,0.8)
                baseAngle = R.rande(20,45);
                for (column=0;column<nthis.um_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {       
                        addition = R.rande(row/65,row/35)        
                        angle = baseAngle*cos(baseSize*column*row)+addition;
                        this.flow_field[column][row] = angle;
                    }
                }
            break;
            case "Wobbly":
                baseSize = R.rand(0.3,0.8)
                baseAngle = R.rande(18,26);
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {       
                        addition = R.rande(15,20)        
                        angle = baseAngle*sin(baseSize*row*column+addition);
                        this.flow_field[column][row] = 1.1*angle;
                    }
                }
            break;
            case "Honest":
                for (column=0;column<this.num_columns;column++){
                    this.flow_field.push([0]);
                    for (row=0;row<this.num_rows;row++) {               
                        this.flow_field[column][row] = 0;
                    }
                }
            break;
        }
    }
}

// CURRENT POSITION in the FLOW FIELD
class Pos {
    constructor (x,y) {
        this.x = (x);
        this.y = (y);
        this.update(this.x,this.y);
        this.plotted = 0;
    }
    update (x,y) {
        this.x = x;
        this.y = y;
        this.x_offset = this.x-FF.left_x;
        this.y_offset = this.y-FF.top_y;
        this.column_index = Math.round(this.x_offset / FF.R);
        this.row_index = Math.round(this.y_offset / FF.R);
    }
    reset() {
        this.plotted = 0;
    }
    isIn() { // This will check if current position is inside field
        return ((this.column_index >= 0 && this.row_index >= 0) && (this.column_index < FF.num_columns && this.row_index < FF.num_rows))
    }
    isInCanvas() {
        return (this.x >= -0.05*C.width && this.x <= 1.05*C.width) && (this.y >= -0.05*C.width && this.y <= 1.05*C.width)
    }
    angle () { // This will return the flow field angle for current position
        if (this.isIn()) {
            this.grid_angle = FF.flow_field[this.column_index][this.row_index];
        } else {this.grid_angle = 0;}
        return (this.grid_angle);
    }
    moveTo (_length,_dir,_step_length,straight) {
        if (typeof _step_length == 'undefined') {
            _step_length = FF.step_length;
        }
        this.num_steps = _length/_step_length;
        if (this.isIn()) {
            let a = cos(this.angle()-_dir)
            let b = sin(this.angle()-_dir)
            if (straight) {
                a = cos(-_dir)
                b = sin(-_dir)
            }
            for (this.i=0;this.i<this.num_steps;this.i++) {
                this.update(this.x,this.y);   
                this.x_step = (_step_length * a);
                this.y_step = (_step_length * b);
                this.x = (this.x+this.x_step);
                this.y = (this.y+this.y_step);
                this.plotted = this.plotted+_step_length;
            }
        } else {
            this.plotted = this.plotted+_step_length;
        }
        this.update(this.x,this.y);
    }
    plotTo (_plot,_length,_step_length,_scale) {
        if (typeof _step_length == 'undefined') {
            _step_length = FF.step_length;
        }
        this.num_steps = _length/_step_length;
        if (this.isIn()) {
            for (this.i=0;this.i<this.num_steps;this.i++) {
                this.update(this.x,this.y);
                this.x_step = (_step_length * cos(this.angle()-_plot.angle(this.plotted)));
                this.y_step = (_step_length * sin(this.angle()-_plot.angle(this.plotted)));
                this.x = (this.x+this.x_step);
                this.y = (this.y+this.y_step);
                this.plotted = this.plotted+_step_length/_scale;
            }
        } else {
            this.plotted = this.plotted+_step_length;
        }
        this.update(this.x,this.y);
    }
}

class LineStyle {
    constructor (type,limit = false) {
        this.type = type;
        this.limit = limit;
        switch (this.type) { // Global Parameters for the brushes
            case "pen":
                // weight, vibration, definition, quality, opacity, step_length
                this.params = [6,1.2,0.5,8,200,3]
            break;
            case "rotring":
                this.params = [3,1,0.8,15,200,3]
            break;
            case "2B":
                this.params = [5,7,0.3,10,200,4]
            break;
            case "HB":
                this.params = [4,4,0.5,4,180,3]
            break;
            case "2H":
                this.params = [3.5,3,0.3,2,150,4]
            break;
            case "cpencil":
                this.params = [6,5,0.9,10,120,2]
            break;
            case "charcoal":
                this.params = [8,25,0.75,300,140,0.5]
            break;
            case "marker":
                this.params = [25,3,0.5,4,60,5]
                this.marker = true;
            break;
            case "spray":
                this.params = [2,90,0.5,90,190,8]
                this.spray = true;
            break;
        }      
        this.weight = this.params[0], this.vibration = this.params[1], this.def = this.params[2], this.quality = this.params[3], this.opacity = this.params[4], this.step_length = this.params[5];   
        
        // SVG STUFF
        this.buffers = []
        for (let m = 0; m < 6; m++) {
            this.buffers[m] = createGraphics(C.width, C.height,SVG);
            this.buffers[m].stroke(T.pickedColors[m+2])
            this.buffers[m].strokeWeight(this.params[0])
            this.buffers[m].noFill()
        }
        S.buffers.push(this.buffers)
    }
    limite(x,y) {
        if (this.limit) return x >= C.w1 && x <= C.w2 && y >= C.h1 && y <= C.h2;
        else return true;
    }
    brushvariation () {
        switch (this.type) {
            case "pen":
                this.param = [R.rand(0.35,0.65),R.rand(0.7,0.8),1.5,1,R.rand(3.5,5)];
            break;
            case "rotring":
                this.param = [R.rand(0.45,0.55),R.rand(0.7,0.8),1.1,0.9,R.rand(3.5,5)];
            break;
            case "2H": case "2B": case "HB":
                this.param = [R.rand(0.35,0.65),R.rand(0.7,0.8),1.2,0.9,R.rand(3.5,5)];
            break;
            case "cpencil":
                this.param = [R.rand(0.35,0.65),R.rand(0.7,0.8),1.2,0.9,R.rand(3.5,5)];
            break;
            case "charcoal":
                this.param = [R.rand(0.35,0.65),R.rand(0.7,0.8),1.3,0.8,R.rand(3.5,5)];
            break;
            case "marker":
                this.param = [R.rand(0.45,0.55),R.rand(0.85,0.9),1,0.75,R.rand(3,6)];
            break;
            case "spray":
                this.param = [R.rand(0.45,0.55),R.rand(0.85,0.9),0.3,1.2,R.rand(5,7)];
            break;
        }
        this.a = this.param[0], this.b = this.param[1], this.m1 = this.param[2], this.m2 = this.param[3], this.c = this.param[4];
        this.adj = 1,this.adj2=1; 
        stroke(this.color), fill(this.color);
        if (this.marker) {
            this.adj = this.strokeWeight, this.adj2 = 0.9*this.strokeWeight;
            this.randMark = R.rand(0.1,0.3), this.randMark2 = R.rand(0.7,0.9);
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

        // SVG STUFF
        this.color_index = T.pickedColors.indexOf(_color)-2
        this.pickBuffer()

        // PLOT LINE
        this.buffer.beginShape()
            // GEOMETRY PARAMS
            
            this.length = _plot.length, this.linepoint = new Pos(_x,_y);
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
    line(_x,_y,_par1,_par2,_color,_strokeWeight,_type = "straight") { 
        push();

        // PARAMS
        this.strokeWeight = _strokeWeight, this.color = color(_color), this.distance = 0, this.color.setAlpha(this.opacity);
        this.brushvariation();

        // SVG STUFF
        this.color_index = T.pickedColors.indexOf(_color)-2
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
        // SVG STUFF
        this.buffer.vertex(this.linepoint.x,this.linepoint.y)
        if (this.limite(this.linepoint.x,this.linepoint.y)) {
            if (this.spray) { // SPRAY TYPE BRUSHES
                this.vibr = (this.strokeWeight*this.vibration*this.pressureSimulation(0.5,0.9,3,0.2,1))+this.vibration/5*randomGaussian();
                let strokeWii = R.rand(0.9*this.weight,1.1*this.weight);
                for (this.j = 0; this.j < this.quality; this.j++) {
                    this.randSp = R.rand(0.9,1.1);
                    this.randX = R.rand(this.randSp*-this.vibr, this.randSp*this.vibr);
                    this.randY = R.rand(-1, 1) * sqrt(sq(this.randSp*this.vibr) - this.randX * this.randX);
                    circle(this.linepoint.x + this.randX, this.linepoint.y + this.randY,strokeWii);
                }
            } else if (this.marker) { // MARKER TYPE BRUSHES
                maskBuffer.push();
                maskBuffer.fill(0,255,0,100);
                maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.strokeWeight*this.weight*this.pressureSimulation(this.a,this.b,5,this.m1,this.m2));
                this.markerOpacity(0,this.randMark,"inicio");
                this.markerOpacity(this.randMark2,1,"final");
                for (this.j = 0; this.j < R.rande(1,4); this.j++) {
                    this.markerOpacity(this.j*0.25+R.rand(0.05,0.30),this.j*0.25+R.rand(0.25,0.40));
                }
                maskBuffer.pop();
            }
            else { // REST OF BRUSHES
                this.vibr = this.strokeWeight*this.vibration*(this.def+(1-this.def)*this.pressureSimulation(0.5,0.9,5,0.2,1)*randomGaussian());
                if (R.rand(0,this.quality)>0.4) {
                    circle(this.linepoint.x+0.7*R.rand(-this.vibr,this.vibr),this.linepoint.y+R.rand(-this.vibr,this.vibr),R.rand(0.9*this.weight,1.1*this.weight)*this.pressureSimulation(this.a,this.b,5,this.m1,this.m2));
                }
            }
        }
    }
    markerOpacity(a,b,where) {
        this.distance = this.linepoint.plotted;
        if (this.distance < b*this.length && this.distance > a*this.length) {
            if (where == "inicio") {this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,0,1));} else if (where == "final") {this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,1,0));}else {this.opacity2 = this.opacity*(1-Math.abs(map(this.distance,a*this.length,b*this.length,-1,1)));}
            maskBuffer.push();
            maskBuffer.fill(0,0,255,this.opacity2);
            maskBuffer.circle(this.linepoint.x+R.rand(-this.vibration,this.vibration),this.linepoint.y+R.rand(-this.vibration,this.vibration),this.strokeWeight*this.weight)
            if (this.distance <= R.rand(0.01,0.015)*this.length || this.distance >= R.rand(0.985,0.99)*this.length) {
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
            polygons.push(new Polygon([[C.w1,C.h1],[C.w2,C.h1],[C.w2,C.h2],[C.w1,C.h2]]))
        }
        if (angle <= 90 && angle >= 0) {this.startY = 0} else {this.startY = C.height}

        // Pages borders
        //let boundary = {w1: 0,w2: C.width,h1: 0,h2: C.height}

        // if i want the hatch to go over borders, I need this boundary
        let boundary = {w1: -0.5*C.width,w2: 1.5*C.width,h1: -0.5*C.height,h2: 1.5*C.height}

        // if i want the hatch to stay inside borders, this:
        //let boundary = {w1: C.w1,w2: C.w2,h1: C.h1,h2: C.h2}

        let ventana = new Polygon([[0,0],[C.width,0],[C.width,C.height],[0,C.height]])
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
    rainbowHatch (brush,weight = 1,colors) {
        for (let dd of this.dots) {
            let index = 2;
            for (let i = 0; i < dd.length-1; i++) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,colors[index],weight * R.rand(0.8,1.2))
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
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,color,R.rand(0.8,1.2)*weight)
                }
            }
        }
    }
    isolate (brush, color, weight) {
        for (let dd of this.dots) {
            for (let i = 0; i < dd.length-1; i++) {
                if (i % 2 == 0) {
                    brush.line(dd[i].x,dd[i].y,dd[i+1].x,dd[i+1].y,color,R.rand(0.8,1.2)*weight)
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
                w1: -0.5*C.width,
                w2: 1.5*C.width,
                h1: -0.5*C.height,
                h2: 1.5*C.height,
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
        if (_a < 0) {_a = 360+_a} 
        if (_a > 360) {_a = _a - int(_a/360)*360}
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
                let map0 = this.angles[this.index];
                let map1 = this.angles[this.index+1];
                if (typeof map1 == "undefined") { map1 = map0}
                if (abs(map1-map0) > 180) {if (map1 > map0) {map1 = - (360-map1);} else {map0 = - (360-map0);}}
                return map(_d-this.suma,0,this.segments[this.index],map0,map1,true) + this.dir;
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
    genPol (_x,_y,_scale,_step=50) {
        let vertices = []
            let linepoint = new Pos(_x,_y);
            let numsteps = Math.round(this.length/_step)*_scale;
            for (let steps = 0; steps < numsteps; steps++) {
                vertices.push([linepoint.x,linepoint.y])
                linepoint.plotTo(this,_step,_step,_scale)
            }
            
        this.polygon = new Polygon(vertices)
        return this.polygon;
    }
}