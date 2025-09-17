/**
 * GridRenderer - Handles grid generation and rendering
 */
class GridRenderer {
    constructor(oscilloscope) {
        this.scope = oscilloscope;
    }

    /**
     * Generate and render the oscilloscope grid
     */
    generateGrid() {
        const grid = document.querySelector('.grid');
        const divisions = 10;
        const stepX = this.scope.canvas.width / divisions;
        const stepY = this.scope.canvas.height / divisions;

        // Clear existing grid
        grid.innerHTML = '';

        // Vertical lines
        for (let i = 0; i <= divisions; i++) {
            const x = i * stepX;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x);
            line.setAttribute('y2', this.scope.canvas.height);
            line.setAttribute('class', i === divisions/2 ? 'grid-line-major' : 'grid-line');
            grid.appendChild(line);
        }

        // Horizontal lines
        for (let i = 0; i <= divisions; i++) {
            const y = i * stepY;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', this.scope.canvas.width);
            line.setAttribute('y2', y);
            line.setAttribute('class', i === divisions/2 ? 'grid-line-major' : 'grid-line');
            grid.appendChild(line);
        }
    }
}
