/**
 * Card Manager
 * Handles card generation and slot management
 */
class CardManager {
    constructor() {
        this.slots = [];
        this.numSlots = 5;
        this.cardTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 1]; // +1 appears as 1 (duplicate 1 for balance)
        this.slotsElement = document.getElementById('cardSlots');
        this.initSlots();
        this.generateCards();
    }

    /**
     * Initialize card slots
     */
    initSlots() {
        this.slotsElement.innerHTML = '';
        this.slots = Array(this.numSlots).fill(null);

        for (let i = 0; i < this.numSlots; i++) {
            const slot = document.createElement('div');
            slot.className = 'card-slot';
            slot.dataset.slotIndex = i;
            this.slotsElement.appendChild(slot);
        }
    }

    /**
     * Generate random card
     */
    generateRandomCard() {
        const randomType = this.cardTypes[Math.floor(Math.random() * this.cardTypes.length)];
        return randomType;
    }

    /**
     * Generate new set of cards
     */
    generateCards() {
        for (let i = 0; i < this.numSlots; i++) {
            this.slots[i] = this.generateRandomCard();
        }
        this.updateDisplay();
    }

    /**
     * Get card at slot
     */
    getCard(slotIndex) {
        return this.slots[slotIndex];
    }

    /**
     * Remove card from slot
     */
    removeCard(slotIndex) {
        const card = this.slots[slotIndex];
        this.slots[slotIndex] = null;
        this.updateDisplay();
        return card;
    }

    /**
     * Add card to slot (for future use)
     */
    addCard(slotIndex, card) {
        this.slots[slotIndex] = card;
        this.updateDisplay();
    }

    /**
     * Update display
     */
    updateDisplay() {
        for (let i = 0; i < this.numSlots; i++) {
            this.updateSlotDisplay(i);
        }
    }

    /**
     * Update single slot display
     */
    updateSlotDisplay(slotIndex) {
        const slot = this.slotsElement.querySelector(`[data-slot-index="${slotIndex}"]`);
        const card = this.slots[slotIndex];

        if (!slot) return;

        slot.innerHTML = '';

        if (card !== null) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            if (card === -1 || card === 1) {
                cardElement.classList.add('modifier');
                cardElement.classList.add(card === 1 ? 'positive' : 'negative');
                cardElement.textContent = card === 1 ? '+1' : '-1';
            } else {
                cardElement.classList.add('number');
                cardElement.textContent = card;
            }

            slot.appendChild(cardElement);
        }
    }

    /**
     * Check if there are any cards available
     */
    hasAvailableCards() {
        return this.slots.some(card => card !== null);
    }

    /**
     * Get all occupied slots
     */
    getOccupiedSlots() {
        return this.slots
            .map((card, index) => card !== null ? index : null)
            .filter(index => index !== null);
    }

    /**
     * Get first available slot
     */
    getFirstAvailableSlot() {
        return this.slots.findIndex(card => card === null);
    }

    /**
     * Refill empty slots
     */
    refillSlots() {
        for (let i = 0; i < this.numSlots; i++) {
            if (this.slots[i] === null) {
                this.slots[i] = this.generateRandomCard();
            }
        }
        this.updateDisplay();
    }

    /**
     * Reset cards
     */
    reset() {
        this.initSlots();
        this.generateCards();
    }
}