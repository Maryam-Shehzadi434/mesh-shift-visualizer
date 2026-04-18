# Mesh Circular Shift Visualizer

## Live Deployment URL
**[Insert your Vercel/Netlify URL here]**

## Description
Interactive web application that visualizes circular q-shift operations on a 2D mesh topology for parallel computing education.

## Features
- Interactive 2D mesh grid visualization (4x4 to 8x8 grids)
- Step-by-step animation of row and column shifts
- Real-time complexity analysis comparing Mesh vs Ring topologies
- Input validation for p (perfect squares 4-64) and q (1 to p-1)
- Before/after state display

## How to Run Locally

### Method 1: Using Python
```bash
cd mesh-shift-visualizer
python -m http.server 8000
# Open http://localhost:8000/public/