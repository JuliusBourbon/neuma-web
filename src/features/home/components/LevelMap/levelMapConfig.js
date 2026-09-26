// Dimension
export const MAP_DIMENSIONS = {
    width: 4600,
    height: 1700,
};

// Position each level
export const LEVEL_COORDINATES = {
    1: { x: 380, y: 1050 },
    2: { x: 620, y: 920 },
    3: { x: 520, y: 700 },
    4: { x: 800, y: 660 },
    5: { x: 1020, y: 820 },
    6: { x: 1220, y: 600 },
    7: { x: 1120, y: 420 },
    8: { x: 1420, y: 460 },
    9: { x: 1620, y: 340 },
    10: { x: 1500, y: 700 },
    11: { x: 1720, y: 880 },
    12: { x: 1580, y: 1060 },
    13: { x: 1820, y: 1100 },
    14: { x: 2020, y: 940 },
    15: { x: 1900, y: 740 },
    16: { x: 2120, y: 600 },
    17: { x: 2000, y: 400 },
    18: { x: 2240, y: 340 },
    19: { x: 2440, y: 480 },
    20: { x: 2340, y: 680 },
    21: { x: 2560, y: 760 },
    22: { x: 2480, y: 960 },
    23: { x: 2720, y: 1020 },
    24: { x: 2920, y: 880 },
    25: { x: 2820, y: 680 },
    26: { x: 3040, y: 560 },
    27: { x: 2940, y: 380 },
    28: { x: 3180, y: 320 },
    29: { x: 3380, y: 460 },
    30: { x: 3260, y: 660 },
    31: { x: 3480, y: 740 },
    32: { x: 3380, y: 940 },
    33: { x: 3600, y: 1020 },
    34: { x: 3800, y: 880 },
    35: { x: 3700, y: 680 },
    36: { x: 3920, y: 540 },
    37: { x: 3820, y: 360 },
    38: { x: 4040, y: 300 },
};

// Connections between levels
export const LEVEL_CONNECTIONS = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 8 },
    { from: 8, to: 9 },
    { from: 9, to: 10 },
    { from: 10, to: 11 },
    { from: 11, to: 12 },
    { from: 12, to: 13 },
    { from: 13, to: 14 },
    { from: 14, to: 15 },
    { from: 15, to: 16 },
    { from: 16, to: 17 },
    { from: 17, to: 18 },
    { from: 18, to: 19 },
    { from: 19, to: 20 },
    { from: 20, to: 21 },
    { from: 21, to: 22 },
    { from: 22, to: 23 },
    { from: 23, to: 24 },
    { from: 24, to: 25 },
    { from: 25, to: 26 },
    { from: 26, to: 27 },
    { from: 27, to: 28 },
    { from: 28, to: 29 },
    { from: 29, to: 30 },
    { from: 30, to: 31 },
    { from: 31, to: 32 },
    { from: 32, to: 33 },
    { from: 33, to: 34 },
    { from: 34, to: 35 },
    { from: 35, to: 36 },
    { from: 36, to: 37 },
    { from: 37, to: 38 },
];

// Helper to get coordinates
export function getLevelPosition(orderIndex) {
    if (LEVEL_COORDINATES[orderIndex]) {
        return LEVEL_COORDINATES[orderIndex];
    }
    const col = (orderIndex - 1) % 5;
    const row = Math.floor((orderIndex - 1) / 5);
    return {
        x: 300 + col * 350 + (row % 2 === 0 ? 0 : 80),
        y: 1100 - row * 320,
    };
}
