class AudioManager {
  private audioContext: AudioContext | null = null;
  private buzzNode: OscillatorNode | null = null;

  private init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this environment.", e);
      }
    }
  }

  private createJumpSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  private createLandSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  private createBuyUpgradeSound() {
    if (!this.audioContext) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);

    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1046.50, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  public startBuzz() {
    if (!this.audioContext || this.buzzNode) return;
    this.buzzNode = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    this.buzzNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    this.buzzNode.type = 'sawtooth';
    this.buzzNode.frequency.setValueAtTime(60, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    this.buzzNode.start();
  }

  public stopBuzz() {
    if (this.buzzNode) {
      this.buzzNode.stop();
      this.buzzNode = null;
    }
  }

  public playSound(soundName: string) {
    this.init();

    if (!this.audioContext) {
      return;
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (soundName) {
      case 'jump':
        this.createJumpSound();
        break;
      case 'land':
        this.createLandSound();
        break;
      case 'buyUpgrade':
        this.createBuyUpgradeSound();
        break;
    }
  }
}

export const audioManager = new AudioManager();
