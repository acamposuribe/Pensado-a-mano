// COLOR PALETTES
let palette = parseInt(weightedRand({
    0: 60,     // Blac Ivoire
    1: 90000,    // Outremer Gris
    2: 40,     // Gris Clair
    3: 65,     // Le Rubis
    4: 0,     // Playgrounds
    5: 20,     // BLeU
    6: 45,     // Bleu Outremer Foncé
    7: 15,     // Noir d'Ivoire
}));
const colors = [
    // Nombre,                  color1,     color2,          color3,        color4,         color5,         color6,        color7 
    ["Blanc Ivoire",            "#fffceb",  "#2c695a",      "#4ad6af",      "#7facc6",      "#4e93cc",      "#f6684f",      "#ffd300"],
    ["Outremer Gris",           "#e2e7dc",  "#7b4800",      "#002185",      "#003c32",      "#fcd300",      "#ff2702",      "#6b9404"],
    ["Gris Clair",              "#ccccc6",  "#474238",      "#f4bd48",      "#9c2128",      "#395a8e",      "#7facc6",      "#2c695a"],   
    ["Le Rubis",                "#ffe6d4",  "#6c2b3b",      "#c76282",      "#445e87",      "#003c32",      "#e0b411",      "#c8491b"],
    ["Playgrounds",             "#c49a70",  "#4e0042",      "#002185",      "#076d16",      "#feec00",      "#ff6900",      "#ff2702"],
    ["Bleu Outremer",           "#4e6498",  "#cdd3e3",      "#c6353c",      "#f6684f",      "#fcd300",      "#488b6d",      "#7fb4b5"],   
    ["Bleu Outremer Fonc\xE9",  "#0e2d58",  "#f4f4f4",      "#c8c9ca",      "#939598",      "#616568",      "#0e1318",      "#080f15"],
    ["Noir d'Ivoire",           "#080f15",  "#C8C1B7",      "#d7d7d7",      "#b0b0b0",      "#8b8b8b",      "#676767",      "#464646"],
];
let gridColor = colors[palette][2];
const pickedColors = colors[palette]


// FLOW FIELD SELECTION
const ffTypes = [
    ["curved",10],
    ["truncated",8],
    ["tilted",15],
    ["zigzag",15],
    ["waves",20],
    ["scales",5],
    ["seabed",15],
    ["partiture",5],
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