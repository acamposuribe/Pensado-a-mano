let randomTest = rande(1,99)

// DEFINE PARAMS
$fx.params([
    {
        id: "seed_rand",
        name: "Seed nr.",
        type: "number",
        default: randomTest,
        options: {
          min: 1,
          max: 99,
          step: 1,
        },
      },
    {
      id: "draw_string",
      name: "PASTE CLIPBOARD HERE",
      type: "string",
      default: "false",
      options: {
        minLength: 300,
        maxLength: 1900,
      },
    },
  ])

// CANVAS SIZE and MARGINS
    
    // Standard PixelDensity
    let pDensity = 2;
    // Get "pixelDensity" from URL for HQ Canvas
    if (new URLSearchParams(window.location.search).get('pixelDensity')) {pDensity = parseFloat(new URLSearchParams(window.location.search).get('pixelDensity'));}

    // Define Canvas Size in mm
    let canvas = {
        width: 2100,
        height: 2100,
    }
    canvas.prop = canvas.height/canvas.width;

    // Margins
    let marg = weightedRand({0.07: 0, 0.09: 0, 0.12: 80, 0: 0});
    let margin = (canvas.width * marg); 
    let w1 = margin, w2 = (canvas.width - margin), h1 = margin, h2 = (canvas.height - margin);

// SVG THINGS
let svg_final;
let svgBuffers = [];

// PARAMS FIX
for (let i = 0; i < $fx.getParam("seed_rand"); i++) {
    $fx.randminter()
}

// AUXILIARY RAND FUNCTIONS
function rand(e, r) {return mapRange($fx.randminter(), 0, 1, e, r)}
function rande(e, r) {return Math.floor(mapRange($fx.randminter(), 0, 1, e, r))}
function weightedRand(e) {
    var r, a, n = [];
    for (r in e)
        for (a = 0; a < 10 * e[r]; a++)
            n.push(r);
        return n[Math.floor($fx.randminter() * n.length)]
}
function mapRange (value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}

// DETECT BROWSER
let isFirefox;
let userAgentString = navigator.userAgent;
let chromeAgent = userAgentString.indexOf("Chrome") > -1;
let safariAgent = userAgentString.indexOf("Safari") > -1;
let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
if ((chromeAgent) && (safariAgent)) safariAgent = false;