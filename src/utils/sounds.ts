/**
 * Sound Manager using Web Audio API
 * 
 * Provides high-performance sound effects using synthesized audio.
 * - Lazy initialization to avoid autoplay policy issues
 * - No external audio files needed (reduces bundle size)
 * - GPU-accelerated audio processing
 * 
 * @class SoundManager
 */
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isPreloaded: boolean = false;

  constructor() {
    // Initialize AudioContext lazily to avoid autoplay policy issues
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = null;
    }
  }

  /**
   * Get or create AudioContext
   * Uses singleton pattern for optimal performance
   */
  private getContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API is not supported in this browser');
        return null;
      }
    }
    return this.audioContext;
  }

  /**
   * Preload audio context on user interaction
   * Call this on app start to ensure smooth audio playback
   * 
   * @returns Promise that resolves when audio context is ready
   */
  async preload(): Promise<void> {
    if (this.isPreloaded) return;
    
    const context = this.getContext();
    if (!context) return;

    try {
      // Resume context if suspended (required by some browsers)
      if (context.state === 'suspended') {
        await context.resume();
      }
      this.isPreloaded = true;
      console.log('🔊 Audio system preloaded successfully');
    } catch (e) {
      console.warn('Failed to preload audio context:', e);
    }
  }

  /**
   * Check if audio system is ready
   */
  isReady(): boolean {
    const context = this.getContext();
    return context !== null && context.state === 'running';
  }

  /**
   * Play a simple tone (internal helper)
   * Uses Web Audio API oscillators for zero-latency playback
   */
  private async playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    const context = this.getContext();
    if (!context) return;

    // Auto-resume if suspended
    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch (e) {
        console.warn('Failed to resume audio context:', e);
        return;
      }
    }

    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + duration);
    } catch (e) {
      console.warn('Failed to play sound:', e);
    }
  }

  /**
   * Swipe Right Sound - Success (upward sweep)
   * Pleasant ascending tone indicating successful action
   */
  async swipeRight() {
    const context = this.getContext();
    if (!context) return;

    if (context.state === 'suspended') {
      await context.resume();
    }

    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.15);
    } catch (e) {
      console.warn('Failed to play swipe right sound:', e);
    }
  }

  /**
   * Swipe Left Sound - Drink (downward sweep)
   * Descending tone indicating drink action
   */
  async swipeLeft() {
    const context = this.getContext();
    if (!context) return;

    if (context.state === 'suspended') {
      await context.resume();
    }

    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, context.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.2);
    } catch (e) {
      console.warn('Failed to play swipe left sound:', e);
    }
  }

  // Card Draw Sound (quick pop)
  cardDraw() {
    const context = this.getContext();
    if (!context) return;

    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
    } catch (e) {
      console.warn('Failed to play card draw sound:', e);
    }
  }

  // Button Click Sound
  buttonClick() {
    this.playTone(600, 0.05, 'square', 0.15);
  }

  // Success Sound (achievement)
  success() {
    const context = this.getContext();
    if (!context) return;

    try {
      // Play three ascending tones
      const frequencies = [523.25, 659.25, 783.99]; // C, E, G
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.15, 'sine', 0.2);
        }, index * 80);
      });
    } catch (e) {
      console.warn('Failed to play success sound:', e);
    }
  }

  // Error Sound
  error() {
    const context = this.getContext();
    if (!context) return;

    try {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.2, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.2);
    } catch (e) {
      console.warn('Failed to play error sound:', e);
    }
  }

  // Player Change Sound (soft notification)
  playerChange() {
    this.playTone(440, 0.1, 'sine', 0.15);
  }

  // Drink Sound (pour effect)
  drink() {
    const context = this.getContext();
    if (!context) return;

    try {
      // Create noise for pour effect
      const bufferSize = context.sampleRate * 0.3;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 5);
      }

      const noise = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gainNode = context.createGain();

      noise.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, context.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.15, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(context.destination);

      noise.start(context.currentTime);
      noise.stop(context.currentTime + 0.3);
    } catch (e) {
      console.warn('Failed to play drink sound:', e);
    }
  }

  // Tutorial sounds
  async tutorialSuccess() {
    if (!this.isReady()) {
      await this.preload();
    }
    
    // Happy ascending chime
    await this.playTone(523.25, 0.15, 'sine', 0.3); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.3), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2, 'sine', 0.35), 200); // G5
  }

  async tutorialHint() {
    if (!this.isReady()) {
      await this.preload();
    }
    
    // Gentle notification tone
    await this.playTone(440, 0.1, 'sine', 0.2);
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Typed sound effects
export type SoundEffect = 
  | 'swipeRight' 
  | 'swipeLeft' 
  | 'cardDraw' 
  | 'buttonClick' 
  | 'success' 
  | 'error' 
  | 'playerChange'
  | 'drink'
  | 'tutorialSuccess'
  | 'tutorialHint';

export const playSound = (effect: SoundEffect, enabled: boolean = true) => {
  if (!enabled) return;
  
  switch (effect) {
    case 'swipeRight':
      soundManager.swipeRight();
      break;
    case 'swipeLeft':
      soundManager.swipeLeft();
      break;
    case 'cardDraw':
      soundManager.cardDraw();
      break;
    case 'buttonClick':
      soundManager.buttonClick();
      break;
    case 'success':
      soundManager.success();
      break;
    case 'error':
      soundManager.error();
      break;
    case 'playerChange':
      soundManager.playerChange();
      break;
    case 'drink':
      soundManager.drink();
      break;
    case 'tutorialSuccess':
      soundManager.tutorialSuccess();
      break;
    case 'tutorialHint':
      soundManager.tutorialHint();
      break;
  }
};
