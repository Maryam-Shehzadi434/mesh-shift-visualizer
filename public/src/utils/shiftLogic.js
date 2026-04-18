// Pure shift algorithm - testable module

export function calculateShiftParams(p, q) {
    const dim = Math.sqrt(p);
    const rowShift = q % dim;
    const colShift = Math.floor(q / dim);
    const totalSteps = rowShift + colShift;
    
    return {
        dim: dim,
        rowShift: rowShift,
        colShift: colShift,
        totalSteps: totalSteps
    };
}

export function calculateRingSteps(p, q) {
    return Math.min(q, p - q);
}

export function calculateMeshSteps(p, q) {
    const dim = Math.sqrt(p);
    const rowShift = q % dim;
    const colShift = Math.floor(q / dim);
    return rowShift + colShift;
}

export function performRowShift(grid, dim, shiftAmount) {
    const newGrid = JSON.parse(JSON.stringify(grid));
    const shift = shiftAmount % dim;
    
    for (let row = 0; row < dim; row++) {
        for (let col = 0; col < dim; col++) {
            const newCol = (col + shift) % dim;
            newGrid[row][newCol] = grid[row][col];
        }
    }
    return newGrid;
}

export function performColumnShift(grid, dim, shiftAmount) {
    const newGrid = JSON.parse(JSON.stringify(grid));
    const shift = shiftAmount % dim;
    
    for (let col = 0; col < dim; col++) {
        for (let row = 0; row < dim; row++) {
            const newRow = (row + shift) % dim;
            newGrid[newRow][col] = grid[row][col];
        }
    }
    return newGrid;
}

export function initializeGrid(p) {
    const dim = Math.sqrt(p);
    const grid = [];
    for (let i = 0; i < dim; i++) {
        grid[i] = [];
        for (let j = 0; j < dim; j++) {
            grid[i][j] = i * dim + j;
        }
    }
    return grid;
}

export function validateInput(p, q) {
    if (isNaN(p) || isNaN(q)) {
        return "Please enter valid numbers";
    }
    if (p < 4) {
        return "p must be at least 4";
    }
    if (p > 64) {
        return "p must be at most 64";
    }
    const sqrt = Math.sqrt(p);
    if (!Number.isInteger(sqrt)) {
        return "p must be a perfect square (4, 9, 16, 25, 36, 49, 64)";
    }
    if (q < 1) {
        return "q must be at least 1";
    }
    if (q >= p) {
        return `q must be less than ${p}`;
    }
    return null;
}