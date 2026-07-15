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
     * Process card placement
     */
    processPlacement() {
        if (this.gameOver) return;

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

        // Refill empty slots only when all slots are empty
        if (this.cardManager.allSlotsEmpty()) {
            this.cardManager.refillAllEmptySlots();
        }

        // Check game over condition after slight delay
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
        const hasSpace = this.gridManager.hasAvailableSpace();

        // 게임 오버: 그리드가 꽉 찼고 숫자만 있음 (수정자 없음)
        if (gridFull && numbersOnly) {
            this.endGame(false, 'Grid is full with only numbers!');
            return;
        }

        // 게임 오버: 그리드가 꽉 찼고 남은 카드가 없음
        if (gridFull && !hasCards) {
            this.endGame(false, 'Grid is full and no cards left!');
            return;
        }

        // 게임 오버: 그리드에 공간이 없고 카드가 없음
        if (!hasSpace && !hasCards) {
            this.endGame(false, 'No space and no cards left!');
            return;
        }
    }

    /**
     * End game
     */
    endGame(won = false, reason = '') {
        this.gameOver = true;

        soundManager.playGameOver();

        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = won ? 'You Won! 🎉' : `Game Over 😢\n${reason}`;
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