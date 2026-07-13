/**
 * Game Manager
 * Main game logic and state management
 */
class GameManager {
    constructor() {
        this.gridManager = new GridManager();
        this.cardManager = new CardManager();
        this.dragDropManager = new DragDropManager(this.gridManager, this.cardManager);
        this.score = 0;
        this.gameOver = false;
        this.init();
    }

    /**
     * Initialize game
     */
    init() {
        this.setupEventListeners();
        this.refillCards();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
    }

    /**
     * Refill card slots
     */
    refillCards() {
        this.cardManager.refillSlots();
    }

    /**
     * Process card placement
     */
    processPlacement() {
        // Check for cleared lines
        const clearedLines = this.gridManager.getCheckedLines();

        if (clearedLines.length > 0) {
            clearedLines.forEach(line => {
                this.gridManager.highlightCells(line);
                setTimeout(() => {
                    this.gridManager.clearLine(line);
                }, 200);
                this.score += 10;
            });

            soundManager.playClear();
            this.updateScore();
        }

        // Refill empty slots
        this.refillCards();

        // Check game over condition
        setTimeout(() => this.checkGameOver(), 500);
    }

    /**
     * Update score display
     */
    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }

    /**
     * Check for game over
     */
    checkGameOver() {
        if (this.gameOver) return;

        const gridFull = this.gridManager.isCompleteFull();
        const numbersOnly = this.gridManager.isCompleteWithNumbersOnly();
        const hasCards = this.cardManager.hasAvailableCards();

        // Game over: grid full with only numbers (no modifiers)
        if (gridFull && numbersOnly) {
            this.endGame(false);
            return;
        }

        // Game continues if there are modifiers in grid or available cards
        if (gridFull && !numbersOnly) {
            // Grid full but has modifiers - can still potentially clear lines
            return;
        }

        // If grid has space and cards available - game continues
        if (this.gridManager.hasAvailableSpace() && hasCards) {
            return;
        }

        // No space for new cards and no available cards
        if (!this.gridManager.hasAvailableSpace() && !hasCards) {
            this.endGame(false);
        }
    }

    /**
     * End game
     */
    endGame(won = false) {
        this.gameOver = true;

        soundManager.playGameOver();

        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = won ? 'You Won! 🎉' : 'Game Over 😢';
        }

        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            gameStatus.classList.add('active');
        }
    }

    /**
     * Restart game
     */
    restart() {
        this.score = 0;
        this.gameOver = false;
        this.gridManager.reset();
        this.cardManager.reset();
        this.updateScore();

        const gameStatus = document.getElementById('gameStatus');
        if (gameStatus) {
            gameStatus.classList.remove('active');
        }

        // Reinitialize drag and drop for new elements
        this.dragDropManager = new DragDropManager(this.gridManager, this.cardManager);
    }

    /**
     * Get game state
     */
    getGameState() {
        return {
            score: this.score,
            gameOver: this.gameOver,
            grid: this.gridManager.cells,
            cards: this.cardManager.slots
        };
    }
}