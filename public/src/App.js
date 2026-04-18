import { MeshGrid } from './components/MeshGrid.js';
import { ControlPanel } from './components/ControlPanel.js';
import { ComplexityPanel } from './components/ComplexityPanel.js';
import {
    initializeGrid,
    performRowShift,
    performColumnShift,
    calculateShiftParams,
    validateInput
} from './utils/shiftLogic.js';

class App {
    constructor() {
        this.p = 16;
        this.q = 5;
        this.dim = 4;
        this.initialGrid = initializeGrid(this.p);
        this.currentGrid = JSON.parse(JSON.stringify(this.initialGrid));
        this.afterRowGrid = null;
        
        this.init();
    }
    
    init() {
        const root = document.getElementById('root');
        root.innerHTML = `
            <div class="app-container">
                <h1>2D Mesh Circular Shift Visualizer</h1>
                <div class="subtitle">Parallel Computing: Two-Phase Row-Column Shift Algorithm</div>
                
                <div class="main-layout">
                    <div class="grid-section">
                        <h3 class="section-title">2D Mesh Grid (Toroidal)</h3>
                        <div id="mesh-container"></div>
                        <div id="stage-indicator" class="stage-indicator">State: Initial (No shift applied)</div>
                    </div>
                    <div>
                        <div id="controls-container"></div>
                        <div id="complexity-container"></div>
                    </div>
                </div>
            </div>
        `;
        
        const meshContainer = document.getElementById('mesh-container');
        this.meshGrid = new MeshGrid(meshContainer, (stage, grid) => {
            if (stage === 'afterRow') {
                this.afterRowGrid = JSON.parse(JSON.stringify(grid));
                const indicator = document.getElementById('stage-indicator');
                indicator.innerHTML = 'State: After Stage 1 (Row Shift Complete)';
                indicator.className = 'stage-indicator stage-1';
            } else if (stage === 'afterColumn') {
                const indicator = document.getElementById('stage-indicator');
                indicator.innerHTML = 'State: Final (Full Circular Shift Complete)';
                indicator.className = 'stage-indicator stage-2';
            }
        });
        
        this.meshGrid.setGrid(this.currentGrid, this.dim);
        
        const controlsContainer = document.getElementById('controls-container');
        this.controlPanel = new ControlPanel(
            controlsContainer,
            (p, q) => this.applyChanges(p, q),
            () => this.reset(),
            () => this.executeRowShift(),
            () => this.executeColumnShift()
        );
        
        const complexityContainer = document.getElementById('complexity-container');
        this.complexityPanel = new ComplexityPanel(complexityContainer);
        this.complexityPanel.update(this.p, this.q);
    }
    
    applyChanges(p, q) {
        const error = validateInput(p, q);
        if (error) {
            this.controlPanel.setStatus(error, 'warning');
            this.controlPanel.showErrors(error.includes('p') ? error : '', 
                                        error.includes('q') ? error : '');
            return;
        }
        
        this.p = p;
        this.q = q;
        this.dim = Math.sqrt(p);
        this.initialGrid = initializeGrid(p);
        this.currentGrid = JSON.parse(JSON.stringify(this.initialGrid));
        this.afterRowGrid = null;
        
        this.meshGrid.setGrid(this.currentGrid, this.dim);
        this.complexityPanel.update(p, q);
        this.controlPanel.setStatus(`Applied: ${p} nodes, shift=${q}. Click Stage 1 to start.`, 'info');
        this.controlPanel.resetRowShiftFlag();
        
        const indicator = document.getElementById('stage-indicator');
        indicator.innerHTML = 'State: Initial (No shift applied)';
        indicator.className = 'stage-indicator';
        
        const qInput = document.querySelector('#q-input');
        if (qInput) qInput.max = p - 1;
    }
    
    reset() {
        this.currentGrid = JSON.parse(JSON.stringify(this.initialGrid));
        this.afterRowGrid = null;
        this.meshGrid.setGrid(this.currentGrid, this.dim);
        this.controlPanel.setStatus('Reset to initial state', 'info');
        this.controlPanel.resetRowShiftFlag();
        
        const indicator = document.getElementById('stage-indicator');
        indicator.innerHTML = 'State: Initial (No shift applied)';
        indicator.className = 'stage-indicator';
    }
    
    async executeRowShift() {
        const params = calculateShiftParams(this.p, this.q);
        
        if (params.rowShift === 0) {
            this.controlPanel.setStatus('Row shift amount is 0 (q is multiple of dimension)', 'info');
            const indicator = document.getElementById('stage-indicator');
            indicator.innerHTML = 'State: After Stage 1 (Row Shift - No movement needed)';
            indicator.className = 'stage-indicator stage-1';
            this.afterRowGrid = JSON.parse(JSON.stringify(this.currentGrid));
            return;
        }
        
        this.controlPanel.setStatus('Performing row shift animation...', 'info');
        await this.meshGrid.animateRowShift(params.rowShift);
        this.controlPanel.setStatus('Row shift completed!', 'success');
    }
    
    async executeColumnShift() {
        const params = calculateShiftParams(this.p, this.q);
        
        if (params.colShift === 0) {
            this.controlPanel.setStatus('Column shift amount is 0', 'info');
            const indicator = document.getElementById('stage-indicator');
            indicator.innerHTML = 'State: Final (No column movement needed)';
            indicator.className = 'stage-indicator stage-2';
            return;
        }
        
        this.controlPanel.setStatus('Performing column shift animation...', 'info');
        await this.meshGrid.animateColumnShift(params.colShift);
        this.controlPanel.setStatus('Circular shift completed successfully!', 'success');
    }
}

// Start the app
new App();