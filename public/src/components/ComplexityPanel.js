import { calculateShiftParams, calculateRingSteps, calculateMeshSteps } from '../utils/shiftLogic.js';

export class ComplexityPanel {
    constructor(container) {
        this.container = container;
        this.p = 16;
        this.q = 5;
        this.render();
    }
    
    update(p, q) {
        this.p = p;
        this.q = q;
        this.render();
    }
    
    render() {
        const params = calculateShiftParams(this.p, this.q);
        const ringSteps = calculateRingSteps(this.p, this.q);
        const meshSteps = calculateMeshSteps(this.p, this.q);
        const improvement = ringSteps > 0 ? ((ringSteps - meshSteps) / ringSteps * 100).toFixed(1) : 0;
        const maxSteps = Math.max(ringSteps, meshSteps, 1);
        const ringPercent = (ringSteps / maxSteps) * 100;
        const meshPercent = (meshSteps / maxSteps) * 100;
        
        this.container.innerHTML = `
            <div class="complexity-panel">
                <h3 class="section-title">Complexity Analysis</h3>
                
                <div class="complexity-item">
                    <span class="complexity-label">Row Shift Amount:</span>
                    <span class="complexity-value">${params.rowShift}</span>
                </div>
                <div class="complexity-item">
                    <span class="complexity-label">Column Shift Amount:</span>
                    <span class="complexity-value">${params.colShift}</span>
                </div>
                <div class="complexity-item">
                    <span class="complexity-label">Total Communication Steps:</span>
                    <span class="complexity-value">${params.totalSteps}</span>
                </div>
                
                <div class="formula">
                    <strong>Ring Formula:</strong> min(q, p-q) = ${ringSteps}<br>
                    <strong>Mesh Formula:</strong> (q mod √p) + ⌊q/√p⌋ = ${meshSteps}
                </div>
                
                <div class="bar-container">
                    <div class="bar-item">
                        <div class="bar-label">Ring:</div>
                        <div class="bar-fill ring" style="width: ${ringPercent}%">${ringSteps} steps</div>
                    </div>
                    <div class="bar-item">
                        <div class="bar-label">Mesh:</div>
                        <div class="bar-fill mesh" style="width: ${meshPercent}%">${meshSteps} steps</div>
                    </div>
                </div>
                
                <div class="improvement-badge">
                    Mesh is ${improvement}% more efficient than Ring!
                </div>
                
                <div style="margin-top: 15px; font-size: 0.85rem; color: #666;">
                    ✓ Mesh splits communication into row + column phases<br>
                    ✓ Reduces steps from O(p) to O(√p)<br>
                    ✓ Better bandwidth utilization
                </div>
            </div>
        `;
    }
}