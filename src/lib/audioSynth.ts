// Web Audio API Synthesizer & Audio Engine for Símbolos BR RPG

class AudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgOsc: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private isBgPlaying: boolean = false;

  // Background Music MP3 player
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.03;
  private isBgmPlaying: boolean = false;
  private hasAutoStartedBgm: boolean = false;

  public autoStartBgmOnFirstInteraction() {
    // Soundtrack is disabled by default. User can manually enable BGM in Settings.
    this.hasAutoStartedBgm = true;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopAmbient();
      this.toggleBgm(false);
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // --- BGM METHODS ---
  public toggleBgm(play?: boolean): boolean {
    if (typeof window === 'undefined') return false;

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/br/musica-bg.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
    }

    const shouldPlay = play !== undefined ? play : !this.isBgmPlaying;

    if (shouldPlay) {
      this.initCtx();
      this.bgmAudio
        .play()
        .then(() => {
          this.isBgmPlaying = true;
        })
        .catch((e) => {
          console.warn('BGM play blocked or failed:', e);
          this.isBgmPlaying = false;
        });
    } else {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
      }
      this.isBgmPlaying = false;
    }

    return this.isBgmPlaying;
  }

  public isBgmOn(): boolean {
    return this.isBgmPlaying;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  public playNote(freq: number, duration: number = 0.3, type: OscillatorType = 'sine') {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  public playHymnArpeggio(frequencies: number[]) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    frequencies.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.4, 'triangle');
      }, idx * 250);
    });
  }

  public playSfx(type: 'click' | 'step' | 'levelUp' | 'badge' | 'fanfare' | 'scroll') {
    if (!this.soundEnabled) return;
    this.initCtx();

    if (type === 'click') {
      this.playNote(520, 0.08, 'sine');
    } else if (type === 'step') {
      this.playNote(180, 0.05, 'triangle');
    } else if (type === 'levelUp') {
      this.playHymnArpeggio([523, 659, 784, 1046]);
    } else if (type === 'badge') {
      this.playHymnArpeggio([440, 554, 659, 880]);
    } else if (type === 'fanfare') {
      this.playHymnArpeggio([392, 523, 659, 784, 1046]);
    } else if (type === 'scroll') {
      this.playNote(320, 0.15, 'sawtooth');
    }
  }

  public startAmbient() {
    if (!this.soundEnabled || this.isBgPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.bgOsc = this.ctx.createOscillator();
      this.bgGain = this.ctx.createGain();

      this.bgOsc.type = 'sine';
      this.bgOsc.frequency.setValueAtTime(110, this.ctx.currentTime); // Low A note

      this.bgGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.bgOsc.connect(this.bgGain);
      this.bgGain.connect(this.ctx.destination);

      this.bgOsc.start();
      this.isBgPlaying = true;
    } catch (e) {
      console.warn('Ambient error', e);
    }
  }

  public stopAmbient() {
    if (this.bgOsc) {
      try {
        this.bgOsc.stop();
        this.bgOsc.disconnect();
      } catch (e) {
        // ignore
      }
      this.bgOsc = null;
    }
    this.isBgPlaying = false;
  }
}

export const audioEngine = new AudioEngine();
