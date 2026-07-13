/**
 * Sound Manager
 * Handles all game sound effects
 */
class SoundManager {
    constructor() {
        this.sounds = {
            place: this.createAudio('place'),
            clear: this.createAudio('clear'),
            gameover: this.createAudio('gameover'),
            adjust: this.createAudio('adjust'),
            invalid: this.createAudio('invalid')
        };
        this.isMuted = localStorage.getItem('soundMuted') === 'true';
    }

    /**
     * Create audio element with fallback using Web Audio API
     */
    createAudio(type) {
        return {
            type: type,
            play: () => this.playSound(type)
        };
    }

    /**
     * Play sound using Web Audio API
     */
    playSound(type) {
        if (this.isMuted) return;

        // Create context if not exists
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const volume = 0.3;

        try {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            switch (type) {
                case 'place':
                    // Low beep
                    oscillator.frequency.setValueAtTime(400, now);
                    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                    gainNode.gain.setValueAtTime(volume, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    oscillator.start(now);
                    oscillator.stop(now + 0.1);
                    break;

                case 'clear':
                    // Rising tones
                    oscillator.frequency.setValueAtTime(500, now);
                    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.2);
                    gainNode.gain.setValueAtTime(volume, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;

                case 'gameover':
                    // Falling tones
                    oscillator.frequency.setValueAtTime(800, now);
                    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.4);
                    gainNode.gain.setValueAtTime(volume, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                    oscillator.start(now);
                    oscillator.stop(now + 0.4);
                    break;

                case 'adjust':
                    // Quick double beep
                    oscillator.frequency.setValueAtTime(600, now);
                    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                    gainNode.gain.setValueAtTime(volume * 0.7, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    oscillator.start(now);
                    oscillator.stop(now + 0.05);
                    break;

                case 'invalid':
                    // Error buzz
                    oscillator.frequency.setValueAtTime(300, now);
                    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                    gainNode.gain.setValueAtTime(volume * 0.5, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    oscillator.start(now);
                    oscillator.stop(now + 0.15);
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.warn('Could not play sound:', error);
        }
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('soundMuted', this.isMuted);
        return this.isMuted;
    }

    /**
     * Trigger sound for placing a card
     */
    playPlace() {
        this.playSound('place');
    }

    /**
     * Trigger sound for clearing a line
     */
    playClear() {
        this.playSound('clear');
    }

    /**
     * Trigger sound for game over
     */
    playGameOver() {
        this.playSound('gameover');
    }

    /**
     * Trigger sound for adjusting a card
     */
    playAdjust() {
        this.playSound('adjust');
    }

    /**
     * Trigger sound for invalid action
     */
    playInvalid() {
        this.playSound('invalid');
    }
}

// Create global sound manager
const soundManager = new SoundManager();