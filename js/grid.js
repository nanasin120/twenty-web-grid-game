/**
 * Grid Manager
 * Handles 4x4 grid operations
 */
class GridManager {
    constructor() {
        this.rows = 4;
        this.cols = 4;
        this.cells = Array(this.rows * this.cols).fill(null);
        this.gridElement = document.getElementById('grid');
        this.createGrid();
    }

    /**
     * Create grid DOM elements
     */
    createGrid() {
        this.gridElement.innerHTML = '';
        this.cells = Array(this.rows * this.cols).fill(null);

        for (let i = 0; i < this.rows * this.cols; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;
            this.gridElement.appendChild(cell);
        }
    }

    /**
     * Get cell by index
     */
    getCell(index) {
        return this.cells[index];
    }

    /**
     * Set cell value
     */
    setCell(index, value) {
        this.cells[index] = value;
        this.updateCellDisplay(index);
    }

    /**
     * Clear cell
     */
    clearCell(index) {
        this.cells[index] = null;
        this.updateCellDisplay(index);
    }

    /**
     * Update cell display
     */
    updateCellDisplay(index) {
        const cellElement = this.gridElement.querySelector(`[data-index="${index}"]`);
        const value = this.cells[index];

        if (!cellElement) return;

        if (value === 10) {
            cellElement.textContent = '+1';
        } else {
            cellElement.textContent = value !== null ? value : '';
        }
        cellElement.classList.remove('cleared', 'highlight');

        if (value === null) {
            cellElement.classList.remove('highlight');
        }
    }

    /**
     * Get cell index from row and column
     */
    getIndex(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return -1;
        }
        return row * this.cols + col;
    }

    /**
     * Get row and column from index
     */
    getRowCol(index) {
        return {
            row: Math.floor(index / this.cols),
            col: index % this.cols
        };
    }

    /**
     * Check if cell is empty
     */
    isEmpty(index) {
        return this.cells[index] === null;
    }

    /**
     * Check if all cells are filled with numbers (no modifiers)
     */
    isCompleteWithNumbersOnly() {
        return this.cells.every(cell => {
            if (cell === null) return false;
            return cell !== -1 && (cell >= 1 && cell <= 9); // -1은 수정자, 1-9는 숫자
        });
    }

    /**
     * Check if grid is completely full (including modifiers)
     */
    isCompleteFull() {
        return this.cells.every(cell => cell !== null);
    }

    /**
     * Check if there are any available moves left
     */
    hasAvailableSpace() {
        return this.cells.some(cell => cell === null);
    }

    /**
     * Get all empty cells
     */
    getEmptyCells() {
        return this.cells
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null);
    }

    /**
     * Check if line is completely full and sums to 20
     */
    isLineClear(indices) {
        // 먼저 라인의 모든 칸이 채워져 있는지 확인
        const allFilled = indices.every(index => this.cells[index] !== null);
        if (!allFilled) return false;

        // 모든 칸이 채워져 있으면 합 확인
        const sum = indices.reduce((acc, index) => {
            const cell = this.cells[index];
            if (cell === 10) {
                return acc + 1;
            }
            return acc + (cell !== null ? cell : 0);
        }, 0);
        return sum === 20;
    }

    /**
     * Get horizontal line indices
     */
    getHorizontalLine(row) {
        const indices = [];
        for (let col = 0; col < this.cols; col++) {
            indices.push(this.getIndex(row, col));
        }
        return indices;
    }

    /**
     * Get vertical line indices
     */
    getVerticalLine(col) {
        const indices = [];
        for (let row = 0; row < this.rows; row++) {
            indices.push(this.getIndex(row, col));
        }
        return indices;
    }

    /**
     * Get main diagonal indices (top-left to bottom-right)
     */
    getMainDiagonal() {
        const indices = [];
        for (let i = 0; i < this.rows; i++) {
            indices.push(this.getIndex(i, i));
        }
        return indices;
    }

    /**
     * Get anti-diagonal indices (top-right to bottom-left)
     */
    getAntiDiagonal() {
        const indices = [];
        for (let i = 0; i < this.rows; i++) {
            indices.push(this.getIndex(i, this.cols - 1 - i));
        }
        return indices;
    }

    /**
     * Get all lines (horizontal, vertical, diagonals)
     */
    getAllLines() {
        const lines = [];

        // Horizontal lines
        for (let row = 0; row < this.rows; row++) {
            lines.push(this.getHorizontalLine(row));
        }

        // Vertical lines
        for (let col = 0; col < this.cols; col++) {
            lines.push(this.getVerticalLine(col));
        }

        // Diagonals
        lines.push(this.getMainDiagonal());
        lines.push(this.getAntiDiagonal());

        return lines;
    }

    /**
     * Check for cleared lines and return their indices
     */
    getCheckedLines() {
        const lines = this.getAllLines();
        const clearedLines = [];

        for (const line of lines) {
            if (this.isLineClear(line)) {
                clearedLines.push(line);
            }
        }

        return clearedLines;
    }

    /**
     * Highlight cells
     */
    highlightCells(indices) {
        indices.forEach(index => {
            const cellElement = this.gridElement.querySelector(`[data-index="${index}"]`);
            if (cellElement) {
                cellElement.classList.add('highlight');
            }
        });
    }

    /**
     * Remove highlight from cells
     */
    removeHighlight() {
        const cells = this.gridElement.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight');
        });
    }

    /**
     * Clear line cells with animation
     */
    clearLine(indices) {
        indices.forEach(index => {
            const cellElement = this.gridElement.querySelector(`[data-index="${index}"]`);
            if (cellElement) {
                cellElement.classList.add('cleared');
                // Clear after animation completes
                setTimeout(() => {
                    this.clearCell(index);
                    cellElement.classList.remove('cleared');
                }, 500);
            }
        });
    }

    /**
     * Show invalid placement animation
     */
    showInvalidAnimation(index) {
        const cellElement = this.gridElement.querySelector(`[data-index="${index}"]`);
        if (cellElement) {
            cellElement.classList.add('invalid');
            setTimeout(() => {
                cellElement.classList.remove('invalid');
            }, 300);
        }
    }

    /**
     * Reset grid
     */
    reset() {
        this.createGrid();
    }
}