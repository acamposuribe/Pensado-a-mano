const R = {
    rand(e = 0, r = 1) {return this.mapRange($fx.randminter(), 0, 1, e, r)},
    rande(e, r) {return Math.floor(this.mapRange($fx.randminter(), 0, 1, e, r))},
    weightedRand(e) {
        var r, a, n = [];
        for (r in e)
            for (a = 0; a < 10 * e[r]; a++)
                n.push(r);
            return n[Math.floor($fx.randminter() * n.length)]
    },
    mapRange (value, a, b, c, d) {return c + ((value - a) / (b - a)) * (d - c)}
}

// Global object to store Canvas Size and Resize functions
const C = {
    loaded: false,
    prop() {return this.height/this.width},
    isLandscape() {return window.innerHeight <= window.innerWidth * this.prop()},
    resize () {
        if (this.isLandscape()) {
            this.fitWidth = window.innerHeight / this.prop();
            this.fitHeight = window.innerHeight;
            document.getElementById("mainCanvas").style.height = "100%";
            document.getElementById("mainCanvas").style.removeProperty('width');
          } else {
            this.fitWidth = window.innerWidth;
            this.fitHeight = window.innerWidth * this.prop();
            document.getElementById("mainCanvas").style.removeProperty('height');
            document.getElementById("mainCanvas").style.width = "100%";
        }
        this.fitMult = this.fitHeight / this.height;
    },
    setSize(w,h,p,m) {
        this.width = w;
        this.height = h;
        this.pD = p;
        this.margin(m);
    },
    margin(m) {
       this.m = this.width * R.weightedRand(m)
       this.w1 = this.m, this.w2 = (this.width - this.m), this.h1 = this.m, this.h2 = (this.height - this.m);
    },
    createCanvas(css) {
        this.main = createCanvas(this.width,this.height);
        pixelDensity(this.pD), this.main.id(css)
        // Fit Canvas to Screen at start
        C.resize();
        noiseSeed(R.rand()*9999)
        randomSeed(R.rand()*1221)
    }
};