/**
 * Collision Detection
 * Handles collision detection between dragged cards and grid/cells
 */
class CollisionDetector {
    /**
     * Check if a point is within a rectangle
     */
    static pointInRect(x, y, rect) {
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    }

    /**
     * Get grid cell at coordinates
     */
    static getCellAtCoordinates(x, y) {
        const cells = document.querySelectorAll('.grid-cell');

        for (const cell of cells) {
            const rect = cell.getBoundingClientRect();
            if (this.pointInRect(x, y, rect)) {
                return {
                    element: cell,
                    index: parseInt(cell.dataset.index),
                    rect: rect
                };
            }
        }

        return null;
    }

    /**
     * Get card slot at coordinates
     */
    static getSlotAtCoordinates(x, y) {
        const slots = document.querySelectorAll('.card-slot');

        for (const slot of slots) {
            const rect = slot.getBoundingClientRect();
            if (this.pointInRect(x, y, rect)) {
                return {
                    element: slot,
                    index: parseInt(slot.dataset.slotIndex),
                    rect: rect
                };
            }
        }

        return null;
    }

    /**
     * Get element at coordinates (cell or slot)
     */
    static getElementAtCoordinates(x, y) {
        const cell = this.getCellAtCoordinates(x, y);
        if (cell) return { type: 'cell', ...cell };

        const slot = this.getSlotAtCoordinates(x, y);
        if (slot) return { type: 'slot', ...slot };

        return null;
    }
}