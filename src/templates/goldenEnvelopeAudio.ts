// Procedural Web Audio API ambient background music for the Golden Envelope
// template. No external audio file is needed — everything is synthesized in
// the browser. The melody and chord progression here are original (written
// for this template), not modeled on any existing song.

class GoldenEnvelopeAudio {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private padOsc: OscillatorNode | null = null;
  private padGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private ensureMasterChain() {
    if (!this.ctx || this.masterGain) return;

    // Master bus: gentle low-pass warmth + a short soft "hall" delay for space,
    // then out — everything routes through this so start/stop can fade smoothly.
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    const warmth = this.ctx.createBiquadFilter();
    warmth.type = 'lowpass';
    warmth.frequency.setValueAtTime(3200, this.ctx.currentTime);

    const delay = this.ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.32, this.ctx.currentTime);
    const feedback = this.ctx.createGain();
    feedback.gain.setValueAtTime(0.22, this.ctx.currentTime);
    const delayWet = this.ctx.createGain();
    delayWet.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain.connect(warmth);
    warmth.connect(this.ctx.destination);
    warmth.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayWet);
    delayWet.connect(this.ctx.destination);
  }

  public toggleMusic(enable?: boolean): boolean {
    this.initCtx();
    if (!this.ctx) return false;
    this.ensureMasterChain();

    const shouldPlay = enable !== undefined ? enable : !this.isMusicPlaying;

    if (shouldPlay) {
      if (this.isMusicPlaying) return true;
      this.isMusicPlaying = true;
      // Smooth fade-in rather than snapping straight to full volume
      const now = this.ctx.currentTime;
      this.masterGain!.gain.cancelScheduledValues(now);
      this.masterGain!.gain.setValueAtTime(this.masterGain!.gain.value || 0.0001, now);
      this.masterGain!.gain.linearRampToValueAtTime(1, now + 1.2);
      this.startPad();
      this.playAmbientMelody();
    } else {
      this.isMusicPlaying = false;
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value || 0.0001, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      }
      if (this.musicInterval) {
        clearTimeout(this.musicInterval);
        this.musicInterval = null;
      }
      this.stopPad(now + 0.85);
    }

    return this.isMusicPlaying;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public stop() {
    this.toggleMusic(false);
  }

  // A continuous, very soft sustained pad note under the whole progression so
  // the music never feels empty between beats — like a string section holding
  // a warm low note in the background.
  private startPad() {
    if (!this.ctx || !this.masterGain || this.padOsc) return;
    const now = this.ctx.currentTime;

    this.padOsc = this.ctx.createOscillator();
    this.padOsc.type = 'sine';
    this.padOsc.frequency.setValueAtTime(73.42, now); // D2, root drone

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, now); // very slow breathing
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.012, now);

    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.0001, now);
    this.padGain.gain.linearRampToValueAtTime(0.045, now + 2.5);

    lfo.connect(lfoGain);
    lfoGain.connect(this.padGain.gain);
    this.padOsc.connect(this.padGain);
    this.padGain.connect(this.masterGain);

    this.padOsc.start(now);
    lfo.start(now);
    (this.padOsc as OscillatorNode & { _lfo?: OscillatorNode })._lfo = lfo;
  }

  private stopPad(stopTime: number) {
    if (!this.padOsc || !this.ctx) return;
    const osc = this.padOsc;
    const lfo = (osc as OscillatorNode & { _lfo?: OscillatorNode })._lfo;
    try {
      osc.stop(stopTime);
      lfo?.stop(stopTime);
    } catch {
      /* already stopped */
    }
    this.padOsc = null;
    this.padGain = null;
  }

  // A gentle, original 4-phrase romantic progression (D Major -> B Minor -> G Major -> A Major)
  private playAmbientMelody() {
    if (!this.ctx || !this.masterGain) return;
    const bus = this.masterGain;

    const phrases = [
      { bass: 146.83, chord: [293.66, 369.99, 440.0], melody: [587.33, 659.25, 698.46, 587.33] }, // D
      { bass: 123.47, chord: [246.94, 293.66, 369.99], melody: [493.88, 440.0, 392.0, 440.0] }, // Bm
      { bass: 98.0, chord: [196.0, 246.94, 293.66], melody: [392.0, 440.0, 493.88, 440.0] }, // G
      { bass: 110.0, chord: [220.0, 277.18, 329.63], melody: [440.0, 493.88, 523.25, 493.88] }, // A
    ];

    let phraseIdx = 0;
    let stepIdx = 0;

    const playStep = () => {
      if (!this.ctx || !this.isMusicPlaying) return;

      const current = phrases[phraseIdx % phrases.length];
      const now = this.ctx.currentTime;
      const humanize = (Math.random() - 0.5) * 0.03;

      if (stepIdx === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(current.bass, now);
        bassGain.gain.setValueAtTime(0.0001, now);
        bassGain.gain.linearRampToValueAtTime(0.08, now + 0.09);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
        bassOsc.connect(bassGain);
        bassGain.connect(bus);
        bassOsc.start(now);
        bassOsc.stop(now + 2.7);
      }

      if (stepIdx === 0 || stepIdx === 2) {
        current.chord.forEach((freq, i) => {
          if (!this.ctx) return;
          const t = now + i * 0.025;
          const chordOsc = this.ctx.createOscillator();
          const chordGain = this.ctx.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(freq, t);
          chordGain.gain.setValueAtTime(0.0001, t);
          chordGain.gain.linearRampToValueAtTime(0.038, t + 0.09);
          chordGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
          chordOsc.connect(chordGain);
          chordGain.connect(bus);
          chordOsc.start(t);
          chordOsc.stop(t + 1.7);
        });
      }

      const noteFreq = current.melody[stepIdx % current.melody.length];
      const noteStart = now + 0.05 + humanize;
      const melOsc = this.ctx.createOscillator();
      const melGain = this.ctx.createGain();
      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(noteFreq, noteStart);
      melGain.gain.setValueAtTime(0.0001, noteStart);
      melGain.gain.linearRampToValueAtTime(0.06, noteStart + 0.08);
      melGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.3);
      melOsc.connect(melGain);
      melGain.connect(bus);
      melOsc.start(noteStart);
      melOsc.stop(noteStart + 1.4);

      stepIdx++;
      if (stepIdx >= 4) {
        stepIdx = 0;
        phraseIdx++;
      }
    };

    const scheduleNext = () => {
      if (!this.isMusicPlaying) return;
      playStep();
      this.musicInterval = window.setTimeout(scheduleNext, 640 + (Math.random() - 0.5) * 20) as unknown as number;
    };
    scheduleNext();
  }
}

export const goldenEnvelopeAudio = new GoldenEnvelopeAudio();
