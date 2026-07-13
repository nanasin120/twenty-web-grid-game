/**
 * Main Entry Point
 * Initialize game when DOM is ready
 */

let gameManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    gameManager = new GameManager();

    // Override drag-drop manager's processPlacement to call game manager's processPlacement
    const originalDragDropInit = DragDropManager.prototype.init;
    DragDropManager.prototype.init = function() {
        originalDragDropInit.call(this);
        this.gameManager = gameManager;
    };

    // Patch dropOnCell to process placement
    const originalDropOnCell = DragDropManager.prototype.dropOnCell;
    DragDropManager.prototype.dropOnCell = function(card, cellIndex) {
        const result = originalDropOnCell.call(this, card, cellIndex);
        if (result) {
            setTimeout(() => {
                this.gameManager?.processPlacement();
            }, 100);
        }
        return result;
    };

    // Set game manager reference
    gameManager.dragDropManager.gameManager = gameManager;

    console.log('Game initialized successfully!');
});

// Expose game manager globally for debugging
window.gameManager = gameManager;