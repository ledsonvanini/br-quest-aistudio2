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

  private lastClickTime = 0;

  public playSfx(type: 'click' | 'step' | 'levelUp' | 'badge' | 'fanfare' | 'scroll' | 'hover' | 'travel') {
    if (!this.soundEnabled) return;
    this.initCtx();

    if (type === 'click') {
      const now = performance.now();
      if (now - this.lastClickTime < 75) {
        return; // Previne duplicidade de clique sonoro em disparos encadeados (<75ms)
      }
      this.lastClickTime = now;
      this.playNote(520, 0.08, 'sine');
    } else if (type === 'travel') {
      this.playHymnArpeggio([440, 554, 659, 880]);
    } else if (type === 'hover') {
      this.playMenuHover();
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

  /**
   * Sons Dedicados para Quests e Desafios (diferentes da navegação e passos do Mapa)
   */
  public playQuestOptionSelect() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(784, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // ignore
    }
  }

  public playQuestCorrect() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Dois tons harmônicos nítidos e curtos: D5 -> A5 (marcante e cristalino)
      const freqs = [587.33, 880];
      freqs.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.16);
      });
    } catch (e) {
      // ignore
    }
  }

  public playQuestWrong() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      // ignore
    }
  }

  public playQuestNext() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      // ignore
    }
  }

  public playQuestNewQuestion() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Arpejo cintilante e rápido ao gerar novo enigma
      const freqs = [440, 554.37, 659.25];
      freqs.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.07, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.12);
      });
    } catch (e) {
      // ignore
    }
  }

  /**
   * Discreet, low-volume wooden/parchment menu hover tick
   */
  public playMenuHover() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      // Subtle gentle blip
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.035);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);

      // Low volume for non-intrusive feedback
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {
      // ignore
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
