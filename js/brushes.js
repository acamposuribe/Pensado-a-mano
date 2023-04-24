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
        stroke(this.tono), fill(this.tono);
        if (this.marker) {
            this.adj = this.scale, this.adj2 = 0.9*this.scale;
            this.randMark = rand(0.1,0.3), this.randMark2 = rand(0.7,0.9);
        } else {noStroke();}
    }
    pickBuffer() {
        this.buffer = this.buffers[this.color_index];
    }
    plot (_plot,_x,_y,_tono,_scale) { 
        push();

        // PARAMS
        this.scale = _scale, this.tono = color(_tono), this.distance = 0, this.tono.setAlpha(this.opacity);
        this.brushvariation();
        this.color_index = pickedColors.indexOf(_tono)-2
        this.pickBuffer()

        // PLOT LINE
        this.buffer.beginShape()
            // GEOMETRY PARAMS
            this.length = _plot.length, this.linepoint = new Pos(_x + _plot.adjust[0],_y + _plot.adjust[1]);
            this.step = this.step_length/this.scale*sq(this.adj2)
            let numsteps = Math.round(_plot.length/this.step);
            for (let steps = 0; steps < numsteps; steps++) {
                this.brush(); // PAINT TIP
                this.linepoint.plotTo(_plot,this.step,this.step)
            }
        this.buffer.endShape()

        // COLORMIX
        if (this.marker) {paintColor(this.tono,0.4);}
        pop();
    }
    line (_x,_y,_par1,_par2,_tono,_scale,_type) { 
        push();

        // PARAMS
        this.scale = _scale, this.tono = color(_tono), this.distance = 0, this.tono.setAlpha(this.opacity);
        this.brushvariation();
        this.color_index = pickedColors.indexOf(_tono)-2
        this.pickBuffer()

        // START LINE
        this.buffer.beginShape()
                // Straight Lines
                if (_type == "straight") {
                    this.length = dist(_par1,_par2,_x,_y), this.dir = atan(-(_par2-_y)/(_par1-_x)), this.linepoint = new Pos(_x,_y), this.straight = true;
                } 
                // FieldLines
                else {
                    this.length = _par1, this.dir = _par2, this.linepoint = new Pos(_x,_y), this.straight = false; 
                }
            this.step = this.step_length/this.scale*sq(this.adj2)  
            let numsteps = Math.round(this.length / this.step);     
            for (let steps = 0; steps < numsteps; steps++) {
                this.brush() // PAINT TIP
                this.linepoint.moveTo(this.step,this.dir,this.step,this.straight)
            }
        this.buffer.endShape()

        // Marker ColorMix (mixbox)
        if (this.marker) {paintColor(this.tono,0.4,"marker");}
        pop();
    }
    brush() {
        this.buffer.vertex(this.linepoint.x,this.linepoint.y)

        if (this.spray) { // SPRAY TYPE BRUSHES
            this.vibr = (this.scale*this.vibration*this.pressureSimulation(0.5,0.9,3,0.2,1))+this.vibration/5*randomGaussian();
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
            maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.scale*this.weight*this.pressureSimulation(this.a,this.b,5,this.m1,this.m2));
            this.markerOpacity(0,this.randMark,"inicio");
            this.markerOpacity(this.randMark2,1,"final");
            for (this.j = 0; this.j < rande(1,4); this.j++) {
                this.markerOpacity(this.j*0.25+rand(0.05,0.30),this.j*0.25+rand(0.25,0.40));
            }
            maskBuffer.pop();
        }
        else { // REST OF BRUSHES
            this.vibr = this.scale*this.vibration*(this.def+(1-this.def)*this.pressureSimulation(0.5,0.9,5,0.2,1)*randomGaussian());
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
            maskBuffer.circle(this.linepoint.x+rand(-this.vibration,this.vibration),this.linepoint.y+rand(-this.vibration,this.vibration),this.scale*this.weight)
            if (this.distance <= rand(0.01,0.015)*this.length || this.distance >= rand(0.985,0.99)*this.length) {
                maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.scale*this.weight)
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