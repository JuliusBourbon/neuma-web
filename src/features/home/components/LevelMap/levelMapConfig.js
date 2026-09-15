// Dimension
export const MAP_DIMENSIONS = {
    width: 2200,
    height: 1400,
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
