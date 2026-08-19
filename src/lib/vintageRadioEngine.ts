// Vintage 1930-1950 Golden Age Radio Synthesizer & Acoustic Effects Engine
// Uses Web Audio API with vacuum tube saturation, AM static noise filters, and melodic playback.

class VintageRadioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tubeFilter: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrackNotes: number[] = [];
  private currentNoteIndex: number = 0;
  private playbackTimer: number | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private isVintageFilterActive: boolean = true;
  private onTrackEndCallback: (() => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Vacuum Tube / 1940 AM Radio Bandpass Filter (300 Hz to 3500 Hz warmth)
      this.tubeFilter = this.ctx.createBiquadFilter();
      this.tubeFilter.type = 'bandpass';
      this.tubeFilter.frequency.value = 1600;
      this.tubeFilter.Q.value = 0.9;

      this.tubeFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Create subtle 1940s AM radio static crackle effect
  private startRadioStatic(durationMs: number = 600) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Pinkish crackle noise generator
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.1) * 0.08;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const staticGain = this.ctx.createGain();
      staticGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      staticGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (durationMs / 1000));

      noiseSource.connect(staticGain);
      staticGain.connect(this.masterGain);
      noiseSource.start();

      setTimeout(() => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
        } catch {
          // ignore
        }
      }, durationMs);
    } catch {
      // ignore
    }
  }

  // Play a single warm, vintage brass/organ-like chord note
  private playVintageNote(freq: number, durationSec: number = 0.45) {
    if (!this.ctx || !this.tubeFilter || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Dual Oscillators for rich Golden Age brass/string harmonic overtone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();

    const noteGain = this.ctx.createGain();

    osc1.type = 'triangle'; // Warm fundamental
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sawtooth'; // Brass shimmer
    osc2.frequency.setValueAtTime(freq * 1.002, now); // Slight vintage chorus detune

    osc3.type = 'sine'; // Sub-warmth
    osc3.frequency.setValueAtTime(freq * 0.5, now);

    // Warm envelope
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.28, now + 0.05); // Attack
    noteGain.gain.exponentialRampToValueAtTime(0.18, now + durationSec * 0.6); // Sustain
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec); // Release

    // Connect through filter
    osc1.connect(noteGain);
    osc2.connect(noteGain);
    osc3.connect(noteGain);

    if (this.isVintageFilterActive && this.tubeFilter) {
      noteGain.connect(this.tubeFilter);
    } else {
      noteGain.connect(this.masterGain);
    }

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + durationSec + 0.05);
    osc2.stop(now + durationSec + 0.05);
    osc3.stop(now + durationSec + 0.05);
  }

  // Play a sequence of frequencies in an infinite melodious broadcast loop
  public playTrack(frequencies: number[], tempoBpm: number = 110, onEnd?: () => void) {
    this.initContext();
    this.stop();

    if (!frequencies || frequencies.length === 0) return;

    this.isPlaying = true;
    this.currentTrackNotes = frequencies;
    this.currentNoteIndex = 0;
    this.onTrackEndCallback = onEnd || null;

    // Initial vintage static burst on tuning
    this.startRadioStatic(450);

    const noteDurationMs = (60 / tempoBpm) * 1000 * 0.85;

    const playNext = () => {
      if (!this.isPlaying) return;

      const freq = this.currentTrackNotes[this.currentNoteIndex];
      if (freq) {
        this.playVintageNote(freq, noteDurationMs / 1000);
      }

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.currentTrackNotes.length;

      this.playbackTimer = window.setTimeout(playNext, noteDurationMs);
    };

    // Small delay for initial static sound
    this.playbackTimer = window.setTimeout(playNext, 180);
  }

  public stop() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  public togglePlayPause(frequencies: number[], tempoBpm: number = 110) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.playTrack(frequencies, tempoBpm);
    }
    return this.isPlaying;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleVintageFilter() {
    this.isVintageFilterActive = !this.isVintageFilterActive;
    return this.isVintageFilterActive;
  }

  public setRadioEra(eraId: string) {
    this.initContext();
    if (!this.tubeFilter || !this.ctx) return;
    
    // Adjust tube filter cutoff frequencies dynamically based on the selected era
    if (eraId === 'galena_1920') {
      this.tubeFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      this.tubeFilter.Q.setValueAtTime(1.4, this.ctx.currentTime);
    } else if (eraId === 'catedral_1930_1940') {
      this.tubeFilter.frequency.setValueAtTime(1800, this.ctx.currentTime);
      this.tubeFilter.Q.setValueAtTime(0.9, this.ctx.currentTime);
    } else if (eraId === 'modernista_1950_1960') {
      this.tubeFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      this.tubeFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
    } else if (eraId === 'boombox_1970_1980') {
      this.tubeFilter.frequency.setValueAtTime(3600, this.ctx.currentTime);
      this.tubeFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);
    } else {
      // Digital PLL 1990s
      this.tubeFilter.frequency.setValueAtTime(5000, this.ctx.currentTime);
      this.tubeFilter.Q.setValueAtTime(0.3, this.ctx.currentTime);
    }
  }

  public isRadioPlaying(): boolean {
    return this.isPlaying;
  }

  public playTuningDialSfx() {
    this.initContext();
    this.startRadioStatic(350);
  }
}

export const vintageRadioEngine = new VintageRadioEngine();
