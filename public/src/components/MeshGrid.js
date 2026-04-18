import { performRowShift, performColumnShift } from '../utils/shiftLogic.js';

export class MeshGrid {
    constructor(container, onStateChange) {
        this.container = container;
        this.onStateChange = onStateChange;
        this.grid = [];
        this.dim = 4;
        this.isAnimating = false;
    }
    
    setGrid(grid, dim) {
        this.grid = JSON.parse(JSON.stringify(grid));
        this.dim = dim;
        this.render();
    }
    
    render() {
        const cellSize = 80;
        const gap = 12;
        
        this.container.innerHTML = '';
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.dim}, ${cellSize}px)`;
        this.container.style.gap = `${gap}px`;
        this.container.style.justifyContent = 'center';
        
        for (let row = 0; row < this.dim; row++) {
            for (let col = 0; col < this.dim; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                const nodeId = row * this.dim + col;
                const value = this.grid[row][col];
                
                cell.innerHTML = `
                    <div class="cell-id">(${row},${col}) ID:${nodeId}</div>
                    <div class="cell-value">${value}</div>
                `;
                
                this.container.appendChild(cell);
            }
        }
    }
    
    async animateRowShift(shiftAmount) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const steps = shiftAmount % this.dim;
        
        for (let step = 0; step < steps; step++) {
            this.grid = performRowShift(this.grid, this.dim, 1);
            this.render();
            this.highlightMovingCells('row');
            await this.sleep(600);
        }
        
        this.isAnimating = false;
        if (this.onStateChange) {
            this.onStateChange('afterRow', this.grid);
        }
    }
    
    async animateColumnShift(shiftAmount) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const steps = shiftAmount % this.dim;
        
        for (let step = 0; step < steps; step++) {
            this.grid = performColumnShift(this.grid, this.dim, 1);
            this.render();
            this.highlightMovingCells('column');
            await this.sleep(600);
        }
        
        this.isAnimating = false;
        if (this.onStateChange) {
            this.onStateChange('afterColumn', this.grid);
        }
    }
    
    highlightMovingCells(direction) {
        const cells = this.container.children;
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.add('animating');
            setTimeout(() => {
                cells[i].classList.remove('animating');
            }, 300);
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    reset(initialGrid) {
        this.grid = JSON.parse(JSON.stringify(initialGrid));
        this.render();
    }
    
    getCurrentGrid() {
        return this.grid;
    }
}