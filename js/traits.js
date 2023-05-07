// COLOR PALETTES
let palette = parseInt(weightedRand({
    0: 60,     // Blac Ivoire
    1: 90,    // Outremer Gris
    2: 30,     // Gris Clair
    3: 50,     // Le Rubis
}));
const colors = [
    // Nombre,                  color1,     color2,          color3,        color4,         color5,         color6,        color7 
    ["Blanc Ivoire",            "#fffceb",  "#2c695a",      "#4ad6af",      "#7facc6",      "#4e93cc",      "#f6684f",      "#ffd300"],
    ["Outremer Gris",           "#e2e7dc",  "#7b4800",      "#002185",      "#003c32",      "#fcd300",      "#ff2702",      "#6b9404"],
    ["Gris Clair",              "#ccccc6",  "#474238",      "#f4bd48",      "#9c2128",      "#395a8e",      "#7facc6",      "#2c695a"],   
    ["Le Rubis",                "#ffe6d4",  "#6c2b3b",      "#c76282",      "#445e87",      "#003c32",      "#e0b411",      "#c8491b"],
];
let gridColor = colors[palette][2];
const pickedColors = colors[palette]

// FLOW FIELD SELECTION
const ffTypes = [
    ["Windy",10],
    ["Nasty",8],
    ["Tilted",15],
    ["Zigzag",15],
    ["Wavy",20],
    ["Scales",0],
    ["Wobbly",15],
    ["Honest",10],
];
let ffSel = parseInt(weightedRand({
    0: ffTypes[0][1],  // curved
    1: ffTypes[1][1],  // truncated
    2: ffTypes[2][1],  // tilted
    3: ffTypes[3][1],  // zigzag
    4: ffTypes[4][1],  // waves
    5: ffTypes[5][1],   // scales
    6: ffTypes[6][1],  // seabed
    7: ffTypes[7][1],  // partiture
}));
let ffType = ffTypes[ffSel][0];

// DRAWING MODE
const drawModes = [
    ["Imitation",70,[60,10,20,15]],
    ["Repetition",20,[50,0,0,50]],
    ["Learning",30,[50,0,0,30]],
    ["Rotation",10,[50,0,0,50]],
]
let drawSel = parseInt(weightedRand({
    0: drawModes[0][1],
    1: drawModes[1][1],
    2: drawModes[2][1],
    3: drawModes[3][1],
}))
let drawMode = drawModes[drawSel][0]
const tileNr = rande(2,4);
const dNr = rande(3,7);
const polarNr = rande(3,10);

// HATCHING MODE
const hatchModes = [
    ["Spectrum",drawModes[drawSel][2][0]],
    ["Fill",drawModes[drawSel][2][1]],
    ["Nest",drawModes[drawSel][2][2]],
    ["In and Around",drawModes[drawSel][2][3]],
]
let hatchMode = hatchModes[parseInt(weightedRand({
    0: hatchModes[0][1],
    1: hatchModes[1][1],
    2: hatchModes[2][1],
    3: hatchModes[3][1],
}))][0]

// SHOW LINE?
const showLine = rande(0,2)

// DEPTH
let isDeep;
switch (hatchMode) {
    case "Fill":
        isDeep = true;
        break;
    case "Nest":
        isDeep = false;
        break; 
    case "Spectrum":
        isDeep = true;
        if (drawMode == "Repetition" && rand(0,1) < 0.5) {
            isDeep = false;
        }
        break; 
    case "In and Around":
        isDeep = false;
        break; 
}

// MAX DOODLES
let maxDrawings;
switch(drawMode) {
    case "Imitation":
        maxDrawings = parseInt(weightedRand({
            3: 30,
            4: 40,
            5: 30,
        }))
        break;
    case "Repetition": case "Learning": case "Rotation":
        maxDrawings = 1;
        break;
}

// DEFINE FEATURES
$fx.features({
    'Mood': ffType,
    'Phase': drawMode,
    'Hatch': hatchMode,
})