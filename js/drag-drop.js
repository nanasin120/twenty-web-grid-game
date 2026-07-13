/**
 * Drag and Drop Manager
 * Handles card dragging and dropping
 */
class DragDropManager {
    constructor(gridManager, cardManager) {
        this.gridManager = gridManager;
        this.cardManager = cardManager;
        this.draggedCard = null;
        this.draggedSlot = null;
        this.draggedElement = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.init();
    }

    /**
     * Initialize drag and drop
     */
    init() {
        this.setupCardDragListeners();
        this.setupGridDropListeners();
    }

    /**
     * Setup card drag listeners
     */
    setupCardDragListeners() {
        const slotsElement = document.getElementById('cardSlots');

        slotsElement.addEventListener('mousedown', (e) => this.handleCardMouseDown(e));
        slotsElement.addEventListener('touchstart', (e) => this.handleCardTouchStart(e), false);

        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);

        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
    }

    /**
     * Setup grid drop listeners
     */
    setupGridDropListeners() {
        const gridElement = document.getElementById('grid');

        gridElement.addEventListener('mouseenter', () => this.handleGridEnter());
        gridElement.addEventListener('mouseleave', () => this.handleGridLeave());
    }

    /**
     * Handle card mouse down
     */
    handleCardMouseDown(e) {
        const cardElement = e.target.closest('.card');
        if (!cardElement) return;

        const slot = e.target.closest('.card-slot');
        if (!slot) return;

        const slotIndex = parseInt(slot.dataset.slotIndex);
        const card = this.cardManager.getCard(slotIndex);

        if (card === null) return;

        this.startDrag(card, slotIndex, e.clientX, e.clientY);
    }

    /**
     * Handle card touch start
     */
    handleCardTouchStart(e) {
        const cardElement = e.target.closest('.card');
        if (!cardElement) return;

        const slot = e.target.closest('.card-slot');
        if (!slot) return;

        const slotIndex = parseInt(slot.dataset.slotIndex);
        const card = this.cardManager.getCard(slotIndex);

        if (card === null) return;

        const touch = e.touches[0];
        this.startDrag(card, slotIndex, touch.clientX, touch.clientY);
    }

    /**
     * Start dragging
     */
    startDrag(card, slotIndex, clientX, clientY) {
        this.draggedCard = card;
        this.draggedSlot = slotIndex;

        // Create dragged card element
        this.draggedElement = document.createElement('div');
        this.draggedElement.className = 'dragged-card';

        if (card === -1 || card === 1) {
            this.draggedElement.classList.add('modifier');
            this.draggedElement.textContent = card === 1 ? '+1' : '-1';
        } else {
            this.draggedElement.classList.add('number');
            this.draggedElement.textContent = card;
        }

        document.body.appendChild(this.draggedElement);

        // Calculate offset
        const slot = document.querySelector(`[data-slot-index="${slotIndex}"]`);
        const rect = slot.getBoundingClientRect();
        this.offsetX = clientX - rect.left;
        this.offsetY = clientY - rect.top;

        // Update position
        this.updateDragPosition(clientX, clientY);

        // Mark slot as active
        slot.classList.add('active');

        soundManager.playPlace();
    }

    /**
     * Handle mouse move
     */
    handleMouseMove(e) {
        if (this.draggedElement) {
            this.updateDragPosition(e.clientX, e.clientY);
        }
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        if (this.draggedElement && e.touches.length > 0) {
            const touch = e.touches[0];
            this.updateDragPosition(touch.clientX, touch.clientY);
        }
    }

    /**
     * Update dragged element position
     */
    updateDragPosition(clientX, clientY) {
        if (!this.draggedElement) return;

        const x = clientX - this.offsetX - this.draggedElement.offsetWidth / 2;
        const y = clientY - this.offsetY - this.draggedElement.offsetHeight / 2;

        this.draggedElement.style.left = x + 'px';
        this.draggedElement.style.top = y + 'px';
    }

    /**
     * Handle mouse up
     */
    handleMouseUp(e) {
        if (this.draggedElement) {
            this.handleDrop(e.clientX, e.clientY);
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        if (this.draggedElement && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            this.handleDrop(touch.clientX, touch.clientY);
        }
    }

    /**
     * Handle drop
     */
    handleDrop(clientX, clientY) {
        const targetElement = CollisionDetector.getElementAtCoordinates(clientX, clientY);

        let success = false;

        if (targetElement) {
            if (targetElement.type === 'cell') {
                success = this.dropOnCell(this.draggedCard, targetElement.index);
            } else if (targetElement.type === 'slot') {
                success = this.dropOnSlot(this.draggedCard, targetElement.index);
            }
        }

        this.endDrag(success);
    }

    /**
     * Drop card on grid cell
     */
    dropOnCell(card, cellIndex) {
        const currentCell = this.gridManager.getCell(cellIndex);
        const isModifier = card === -1 || card === 1;

        if (currentCell === null) {
            // Empty cell - can place any card
            this.gridManager.setCell(cellIndex, card);
            this.cardManager.removeCard(this.draggedSlot);
            return true;
        } else if (isModifier) {
            // Modifier card on occupied cell
            const newValue = currentCell + card;

            // Validate: keep value between 1 and 9
            if (newValue < 1 || newValue > 9) {
                soundManager.playInvalid();
                this.gridManager.showInvalidAnimation(cellIndex);
                return false;
            }

            this.gridManager.setCell(cellIndex, newValue);
            this.cardManager.removeCard(this.draggedSlot);
            soundManager.playAdjust();
            return true;
        }

        // Regular number card on occupied cell - not allowed
        soundManager.playInvalid();
        this.gridManager.showInvalidAnimation(cellIndex);
        return false;
    }

    /**
     * Drop card on card slot
     */
    dropOnSlot(card, slotIndex) {
        const targetSlot = this.cardManager.getCard(slotIndex);

        if (slotIndex === this.draggedSlot) {
            // Dropped on same slot - no-op
            return true;
        }

        if (targetSlot === null) {
            // Empty slot - swap
            this.cardManager.removeCard(this.draggedSlot);
            this.cardManager.addCard(slotIndex, card);
            return true;
        }

        // Target slot occupied - no swap
        soundManager.playInvalid();
        return false;
    }

    /**
     * End dragging
     */
    endDrag(success) {
        if (this.draggedElement) {
            this.draggedElement.remove();
            this.draggedElement = null;
        }

        const slot = document.querySelector(`[data-slot-index="${this.draggedSlot}"]`);
        if (slot) {
            slot.classList.remove('active');
        }

        this.draggedCard = null;
        this.draggedSlot = null;
    }

    /**
     * Handle grid enter
     */
    handleGridEnter() {
        if (this.draggedCard === null || this.draggedCard === undefined) {
            return;
        }
    }

    /**
     * Handle grid leave
     */
    handleGridLeave() {
        if (this.draggedCard === null || this.draggedCard === undefined) {
            return;
        }
    }
}