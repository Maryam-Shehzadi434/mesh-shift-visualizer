import { validateInput, calculateShiftParams } from '../utils/shiftLogic.js';

export class ControlPanel {
    constructor(container, onApply, onReset, onRowShift, onColumnShift) {
        this.container = container;
        this.onApply = onApply;
        this.onReset = onReset;
        this.onRowShift = onRowShift;
        this.onColumnShift = onColumnShift;
        this.rowShiftDone = false;
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="controls-section">
                <h3 class="section-title">Controls</h3>
                
                <div class="input-group">
                    <label>Number of Nodes (p):</label>
                    <input type="number" id="p-input" min="4" max="64" step="1" value="16">
                    <div id="p-error" class="error"></div>
                </div>
                
                <div class="input-group">
                    <label>Shift Distance (q):</label>
                    <input type="number" id="q-input" min="1" max="15" step="1" value="5">
                    <div id="q-error" class="error"></div>
                </div>
                
                <button id="apply-btn" class="btn btn-primary">Apply & Reset</button>
                <button id="reset-btn" class="btn btn-secondary">Reset to Initial</button>
                
                <div class="button-group">
                    <button id="row-shift-btn" class="btn btn-step">Stage 1: Row Shift</button>
                    <button id="col-shift-btn" class="btn btn-step" disabled>Stage 2: Column Shift</button>
                </div>
                
                <div id="status" class="status status-info">Ready. Set p and q, then click Apply.</div>
            </div>
        `;
        
        // Event listeners
        document.getElementById('apply-btn').addEventListener('click', () => {
            const p = parseInt(document.getElementById('p-input').value);
            const q = parseInt(document.getElementById('q-input').value);
            this.rowShiftDone = false;
            document.getElementById('col-shift-btn').disabled = true;
            this.onApply(p, q);
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.rowShiftDone = false;
            document.getElementById('col-shift-btn').disabled = true;
            this.onReset();
        });
        
        document.getElementById('row-shift-btn').addEventListener('click', async () => {
            if (this.rowShiftDone) {
                this.setStatus('Row shift already completed!', 'warning');
                return;
            }
            await this.onRowShift();
            this.rowShiftDone = true;
            document.getElementById('col-shift-btn').disabled = false;
            this.setStatus('Row shift complete! Click Stage 2 for column shift', 'success');
        });
        
        document.getElementById('col-shift-btn').addEventListener('click', async () => {
            if (!this.rowShiftDone) {
                this.setStatus('Please complete Stage 1 (Row Shift) first', 'warning');
                return;
            }
            await this.onColumnShift();
            this.setStatus('Circular shift completed successfully!', 'success');
        });
        
        // Update q max when p changes
        document.getElementById('p-input').addEventListener('change', (e) => {
            const p = parseInt(e.target.value);
            const qInput = document.getElementById('q-input');
            qInput.max = p - 1;
            if (parseInt(qInput.value) >= p) {
                qInput.value = p - 1;
            }
        });
    }
    
    setStatus(message, type = 'info') {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status status-${type}`;
    }
    
    showErrors(pError, qError) {
        const pErrorDiv = document.getElementById('p-error');
        const qErrorDiv = document.getElementById('q-error');
        if (pErrorDiv) pErrorDiv.textContent = pError || '';
        if (qErrorDiv) qErrorDiv.textContent = qError || '';
    }
    
    resetRowShiftFlag() {
        this.rowShiftDone = false;
        document.getElementById('col-shift-btn').disabled = true;
    }
}