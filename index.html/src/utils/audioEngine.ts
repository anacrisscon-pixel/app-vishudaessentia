// Web Audio API generator & stream manager for calming meditation soundscapes & chimes
// Ensures audio works reliably in all browsers both with audio streaming and Web Audio synthesis

export type SoundscapeType =
  | 'rain'
  | 'bowls'
  | 'forest'
  | 'ocean'
  | 'stream'
  | 'night'
  | 'theta'
  | 'ambient'
  | 'piano-voice'
  | 'rain-night'
  | 'binaural-3hz'
  | 'nature-ambient';

class MeditationAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeOscillators: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private proceduralTimers: any[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private sleepTimerId: NodeJS.Timeout | null = null;
  private volume: number = 0.6; // Default 60%
  private audioElement: HTMLAudioElement | null = null;
  private currentSoundId: string | null = null;
  private onTimeUpdateCallback: ((seconds: number) => void) | null = null;
  private elapsedSeconds: number = 0;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Set master volume (0.0 to 1.0)
  setMasterVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  getMasterVolume(): number {
    return this.volume;
  }

  getCurrentSoundId(): string | null {
    return this.currentSoundId;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Play a harmonic Tibetan singing bowl chime (rich overtones at 432Hz)
  playChime(frequency: number = 432) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const freqs = [frequency, frequency * 1.5, frequency * 2.01, frequency * 2.76];
    const weights = [0.4, 0.2, 0.1, 0.05];

    freqs.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(weights[i] * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 4.5);
    });
  }

  // Play subtle tactile harmonic tap
  playTap(frequency: number = 520) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, now + 0.08);
      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio context errors
    }
  }

  // Natural organic breath airflow sound for inhalation (no bells, no pianos)
  playInhaleBreath(duration: number = 4) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.1, this.ctx.currentTime);
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + duration * 0.85);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, now + duration * 0.7);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Audio fallback
    }
  }

  // Natural organic breath airflow sound for exhalation / gentle sigh (no bells, no pianos)
  playExhaleBreath(duration: number = 6) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(0.8, this.ctx.currentTime);
      filter.frequency.setValueAtTime(540, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + duration * 0.9);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.20 * this.volume, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Audio fallback
    }
  }

  // Voice guide speaking gentle breath instructions in Spanish
  speakBreathCue(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.pitch = 0.92;
      utterance.rate = 0.84;
      utterance.volume = Math.max(0.3, this.volume);

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(
        (v) => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Paulina') || v.name.includes('Monica') || v.name.includes('Helena'))
      ) || voices.find((v) => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis errors
    }
  }

  stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  // Start soundscape with audio URL or procedural synthesis
  startSoundscape(
    soundId: string,
    synthType: SoundscapeType,
    audioUrl?: string,
    onTick?: (elapsedSeconds: number) => void
  ) {
    this.stop();
    this.init();
    this.currentSoundId = soundId;
    this.isPlaying = true;
    this.elapsedSeconds = 0;
    this.onTimeUpdateCallback = onTick || null;

    // Start timer counter
    this.intervalId = setInterval(() => {
      this.elapsedSeconds += 1;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.elapsedSeconds);
      }
    }, 1000);

    // If audio URL is available, attempt HTML5 audio with fallback to procedural
    if (audioUrl) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio();
        }
        this.audioElement.src = audioUrl;
        this.audioElement.loop = true;
        this.audioElement.volume = this.volume;
        if (!audioUrl.startsWith('blob:') && !audioUrl.startsWith('data:')) {
          this.audioElement.crossOrigin = 'anonymous';
        } else {
          this.audioElement.removeAttribute('crossOrigin');
        }

        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Audio URL blocked or CORS failed, fall back seamlessly to procedural synthesizer
            this.startProceduralSynth(synthType);
          });
        }
        return;
      } catch {
        this.startProceduralSynth(synthType);
        return;
      }
    }

    // Default to procedural synthesizer
    this.startProceduralSynth(synthType);
  }

  // Backwards compatibility for startAmbientTrack
  startAmbientTrack(onTick?: (elapsedSeconds: number) => void) {
    this.startSoundscape('ambient-default', 'bowls', undefined, onTick);
  }

  // Procedural synthesizers for high-quality, continuous soundscapes
  private startProceduralSynth(synthType: SoundscapeType) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    switch (synthType) {
      case 'rain':
        this.createRainSynth(now);
        break;
      case 'ocean':
        this.createOceanSynth(now);
        break;
      case 'forest':
        this.createForestSynth(now);
        break;
      case 'stream':
        this.createStreamSynth(now);
        break;
      case 'night':
        this.createNightSynth(now);
        break;
      case 'theta':
        this.createThetaSynth(now);
        break;
      case 'piano-voice':
        this.createPianoVoiceSynth(now);
        break;
      case 'rain-night':
        this.createRainNightSynth(now);
        break;
      case 'binaural-3hz':
        this.createBinaural3HzSynth(now);
        break;
      case 'nature-ambient':
        this.createNatureAmbientSynth(now);
        break;
      case 'bowls':
      default:
        this.createBowlsSynth(now);
        break;
    }
  }

  // Helper to generate natural pink noise buffer
  private createPinkNoiseBuffer(durationSeconds: number = 3): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 1. Rain: Continuous downpour with distinct raindrop taps on leaves
  private createRainSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createPinkNoiseBuffer(4);
    if (!buffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Highpass to eliminate low rumble, lowpass for rain warmth
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(200, now);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 2);

    noiseSource.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start(now);
    this.activeOscillators.push(noiseSource);

    // Procedural raindrop taps: random gentle drops on foliage
    const dropTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const dropNow = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        const bp = this.ctx.createBiquadFilter();

        const dropFreq = 2200 + Math.random() * 1200;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(dropFreq, dropNow);
        osc.frequency.exponentialRampToValueAtTime(dropFreq * 0.65, dropNow + 0.035);

        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(dropFreq, dropNow);
        bp.Q.setValueAtTime(8, dropNow);

        const dropVol = 0.02 + Math.random() * 0.04;
        dropGain.gain.setValueAtTime(dropVol, dropNow);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, dropNow + 0.035);

        osc.connect(bp);
        bp.connect(dropGain);
        dropGain.connect(this.masterGain);

        osc.start(dropNow);
        osc.stop(dropNow + 0.04);
      } catch {}
    }, 110);

    this.proceduralTimers.push(dropTimer);
  }

  // 2. Ocean: Hypnotic 10-second waves with surging crest and soft recede
  private createOceanSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createPinkNoiseBuffer(4);
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Resonant filter for the surging wave
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.Q.setValueAtTime(1.8, now);

    // LFO for the incoming and receding wave swell (10-second period)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, now); // 10s per wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(320, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const swellGain = this.ctx.createGain();
    swellGain.gain.setValueAtTime(0.01, now);
    swellGain.gain.linearRampToValueAtTime(0.26, now + 2);

    noise.connect(filter);
    filter.connect(swellGain);
    swellGain.connect(this.masterGain);

    noise.start(now);
    lfo.start(now);
    this.activeOscillators.push(noise, lfo);
  }

  // 3. Tibetan Bowls: Rich 432 Hz harmonic singing bowl drone + periodic mallet strike
  private createBowlsSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;
    // Harmonic series centered on 432 Hz with warm grounding bases
    const harmonics = [
      { f: 108, g: 0.12, t: 'sine' as OscillatorType },
      { f: 216, g: 0.11, t: 'sine' as OscillatorType },
      { f: 432, g: 0.14, t: 'sine' as OscillatorType },
      { f: 436, g: 0.07, t: 'sine' as OscillatorType }, // 4Hz acoustic beating
      { f: 864, g: 0.05, t: 'sine' as OscillatorType },
      { f: 1296, g: 0.03, t: 'triangle' as OscillatorType },
    ];

    harmonics.forEach(({ f, g, t }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = t;
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(g, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      this.activeOscillators.push(osc);
    });

    // Initial chime
    this.playChime(432);

    // Periodic gentle singing bowl mallet strike every 7.5 seconds
    const strikeTimer = setInterval(() => {
      if (!this.isPlaying) return;
      this.playChime(432);
    }, 7500);

    this.proceduralTimers.push(strikeTimer);
  }

  // 4. Forest: Wind sighing through leaves + sweet woodland birdsong
  private createForestSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createPinkNoiseBuffer(4);
    if (!buffer) return;

    // Wind bed in leaves
    const wind = this.ctx.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(450, now);
    windFilter.Q.setValueAtTime(1.4, now);

    // Modulate wind gusts
    const windLfo = this.ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.setValueAtTime(0.08, now); // Slow swaying wind

    const windLfoGain = this.ctx.createGain();
    windLfoGain.gain.setValueAtTime(160, now);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.01, now);
    windGain.gain.linearRampToValueAtTime(0.18, now + 2);

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);

    wind.start(now);
    windLfo.start(now);
    this.activeOscillators.push(wind, windLfo);

    // Procedural birdsong chirps: sweet melodic forest birds
    const triggerBird = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const bNow = this.ctx.currentTime;
        const notes = [3100, 3400, 3800, 3300];
        const baseNote = notes[Math.floor(Math.random() * notes.length)];

        // Double chirp pattern
        for (let i = 0; i < 2; i++) {
          const chirpTime = bNow + i * 0.14;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseNote + (i === 1 ? 250 : 0), chirpTime);
          osc.frequency.exponentialRampToValueAtTime(baseNote * 0.85, chirpTime + 0.1);

          gain.gain.setValueAtTime(0.001, chirpTime);
          gain.gain.linearRampToValueAtTime(0.045, chirpTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.1);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(chirpTime);
          osc.stop(chirpTime + 0.12);
        }
      } catch {}
    };

    // First chirp after 2 seconds, then recurring
    const birdInitTimeout = setTimeout(() => {
      triggerBird();
      const birdInterval = setInterval(triggerBird, 3800);
      this.proceduralTimers.push(birdInterval);
    }, 2000);

    this.proceduralTimers.push(birdInitTimeout);
  }

  // 5. Stream: Bubbling mountain stream with clear water drops
  private createStreamSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createPinkNoiseBuffer(4);
    if (!buffer) return;

    // Constant flowing water cascade
    const streamSource = this.ctx.createBufferSource();
    streamSource.buffer = buffer;
    streamSource.loop = true;

    const bp1 = this.ctx.createBiquadFilter();
    bp1.type = 'bandpass';
    bp1.frequency.setValueAtTime(540, now);
    bp1.Q.setValueAtTime(2.2, now);

    const bp2 = this.ctx.createBiquadFilter();
    bp2.type = 'bandpass';
    bp2.frequency.setValueAtTime(1150, now);
    bp2.Q.setValueAtTime(3.0, now);

    const flowGain = this.ctx.createGain();
    flowGain.gain.setValueAtTime(0.01, now);
    flowGain.gain.linearRampToValueAtTime(0.2, now + 2);

    streamSource.connect(bp1);
    streamSource.connect(bp2);
    bp1.connect(flowGain);
    bp2.connect(flowGain);
    flowGain.connect(this.masterGain);

    streamSource.start(now);
    this.activeOscillators.push(streamSource);

    // Procedural bubbling water droplets
    const bubbleTimer = setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const bubNow = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const bubGain = this.ctx.createGain();

        const startFreq = 500 + Math.random() * 300;
        const endFreq = startFreq + 450 + Math.random() * 200;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, bubNow);
        osc.frequency.exponentialRampToValueAtTime(endFreq, bubNow + 0.045);

        bubGain.gain.setValueAtTime(0.001, bubNow);
        bubGain.gain.linearRampToValueAtTime(0.04, bubNow + 0.015);
        bubGain.gain.exponentialRampToValueAtTime(0.0001, bubNow + 0.045);

        osc.connect(bubGain);
        bubGain.connect(this.masterGain);

        osc.start(bubNow);
        osc.stop(bubNow + 0.05);
      } catch {}
    }, 130);

    this.proceduralTimers.push(bubbleTimer);
  }

  // 6. Night: Rich immersive nocturnal atmosphere (gentle wind breeze, distant & close field crickets, midnight sky pad)
  private createNightSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // 1. Midnight Sky Warm Atmospheric Pad (Deep calming harmonic bed)
    const nightOsc1 = this.ctx.createOscillator();
    const nightOsc2 = this.ctx.createOscillator();
    const nightPadGain = this.ctx.createGain();

    nightOsc1.type = 'sine';
    nightOsc1.frequency.setValueAtTime(72, now); // Low calming nocturnal fundamental

    nightOsc2.type = 'triangle';
    nightOsc2.frequency.setValueAtTime(108, now); // 432 Hz sub-harmonic

    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(240, now);

    nightPadGain.gain.setValueAtTime(0.001, now);
    nightPadGain.gain.linearRampToValueAtTime(0.09 * this.volume, now + 3);

    nightOsc1.connect(padFilter);
    nightOsc2.connect(padFilter);
    padFilter.connect(nightPadGain);
    nightPadGain.connect(this.masterGain);

    nightOsc1.start(now);
    nightOsc2.start(now);
    this.activeOscillators.push(nightOsc1, nightOsc2);

    // 2. Nocturnal Breeze & Rustling Foliage (Gentle modulated pink noise)
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.25;
    }

    const breezeNode = this.ctx.createBufferSource();
    breezeNode.buffer = noiseBuffer;
    breezeNode.loop = true;

    const breezeFilter = this.ctx.createBiquadFilter();
    breezeFilter.type = 'bandpass';
    breezeFilter.frequency.setValueAtTime(320, now);
    breezeFilter.Q.setValueAtTime(1.8, now);

    const breezeGain = this.ctx.createGain();
    breezeGain.gain.setValueAtTime(0.001, now);
    breezeGain.gain.linearRampToValueAtTime(0.045 * this.volume, now + 2);

    // Slow organic nocturnal breeze breathing modulation
    const breezeLfo = this.ctx.createOscillator();
    const breezeLfoGain = this.ctx.createGain();
    breezeLfo.type = 'sine';
    breezeLfo.frequency.setValueAtTime(0.12, now); // 8-second slow breath of wind
    breezeLfoGain.gain.setValueAtTime(140, now); // Sweeps filter 180Hz - 460Hz

    breezeLfo.connect(breezeFilter.frequency);
    breezeNode.connect(breezeFilter);
    breezeFilter.connect(breezeGain);
    breezeGain.connect(this.masterGain);

    breezeNode.start(now);
    breezeLfo.start(now);
    this.activeOscillators.push(breezeNode, breezeLfo);

    // 3. Ambient Distant Crickets Bed (Continuous subtle countryside spatial bed)
    const distantCricketOsc = this.ctx.createOscillator();
    const distantCricketGain = this.ctx.createGain();
    const distantFilter = this.ctx.createBiquadFilter();

    distantCricketOsc.type = 'triangle';
    distantCricketOsc.frequency.setValueAtTime(5120, now);

    distantFilter.type = 'bandpass';
    distantFilter.frequency.setValueAtTime(5120, now);
    distantFilter.Q.setValueAtTime(8, now);

    // Tremolo LFO for continuous distant field crickets
    const distantLfo = this.ctx.createOscillator();
    const distantLfoGain = this.ctx.createGain();
    distantLfo.type = 'sine';
    distantLfo.frequency.setValueAtTime(16, now); // 16 Hz natural cricket wing flutter
    distantLfoGain.gain.setValueAtTime(0.012 * this.volume, now);

    distantLfo.connect(distantCricketGain.gain);
    distantCricketGain.gain.setValueAtTime(0.014 * this.volume, now);

    distantCricketOsc.connect(distantFilter);
    distantFilter.connect(distantCricketGain);
    distantCricketGain.connect(this.masterGain);

    distantCricketOsc.start(now);
    distantLfo.start(now);
    this.activeOscillators.push(distantCricketOsc, distantLfo);

    // 4. Foreground Close Crickets (Organic rhythmic burst with natural spatial variety)
    const chirpCricket = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const cNow = this.ctx.currentTime;
        const chirpCount = 3 + Math.floor(Math.random() * 2); // 3 to 4 pulses
        const baseFreq = 4680 + Math.random() * 180; // natural micro pitch variations

        for (let i = 0; i < chirpCount; i++) {
          const pulseTime = cNow + i * 0.052;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq + (i % 2 === 0 ? 80 : 0), pulseTime);

          const pulseGain = (0.042 + Math.random() * 0.015) * this.volume;
          gain.gain.setValueAtTime(0.0001, pulseTime);
          gain.gain.linearRampToValueAtTime(pulseGain, pulseTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, pulseTime + 0.046);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(pulseTime);
          osc.stop(pulseTime + 0.05);
        }
      } catch {}
    };

    chirpCricket();
    // Organic interval timing instead of rigid metronome
    const triggerNextChirp = () => {
      if (!this.isPlaying) return;
      chirpCricket();
      const nextDelay = 1200 + Math.random() * 1200; // between 1.2s and 2.4s
      const timer = setTimeout(triggerNextChirp, nextDelay);
      this.proceduralTimers.push(timer as unknown as NodeJS.Timeout);
    };

    const initialTimer = setTimeout(triggerNextChirp, 1400);
    this.proceduralTimers.push(initialTimer as unknown as NodeJS.Timeout);
  }

  // 7. Theta: 4 Hz Theta binaural entrainment (432 Hz left / 436 Hz right) + Zen Chimes
  private createThetaSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    const gainLeft = this.ctx.createGain();
    const gainRight = this.ctx.createGain();

    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(432, now);

    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(436, now); // 4 Hz binaural Theta beat

    gainLeft.gain.setValueAtTime(0.001, now);
    gainLeft.gain.linearRampToValueAtTime(0.12, now + 2);

    gainRight.gain.setValueAtTime(0.001, now);
    gainRight.gain.linearRampToValueAtTime(0.12, now + 2);

    // Warm base drone
    const baseOsc = this.ctx.createOscillator();
    const baseGain = this.ctx.createGain();
    baseOsc.type = 'sine';
    baseOsc.frequency.setValueAtTime(216, now);
    baseGain.gain.setValueAtTime(0.001, now);
    baseGain.gain.linearRampToValueAtTime(0.08, now + 2);

    oscLeft.connect(gainLeft);
    oscRight.connect(gainRight);
    baseOsc.connect(baseGain);

    gainLeft.connect(this.masterGain);
    gainRight.connect(this.masterGain);
    baseGain.connect(this.masterGain);

    oscLeft.start(now);
    oscRight.start(now);
    baseOsc.start(now);
    this.activeOscillators.push(oscLeft, oscRight, baseOsc);

    // Zen chime every 12 seconds
    this.playChime(576);
    const zenTimer = setInterval(() => {
      if (!this.isPlaying) return;
      this.playChime(576);
    }, 12000);
    this.proceduralTimers.push(zenTimer);
  }

  // 7. Piano & Vocal Chanting ("Om" meditative pad & gentle piano chords)
  private createPianoVoiceSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Vocal "Om" Drone (Formant filtered dual-sine pad)
    const voiceOsc1 = this.ctx.createOscillator();
    const voiceOsc2 = this.ctx.createOscillator();
    const voiceGain = this.ctx.createGain();

    voiceOsc1.type = 'sine';
    voiceOsc1.frequency.setValueAtTime(108, now); // Low A2 base

    voiceOsc2.type = 'triangle';
    voiceOsc2.frequency.setValueAtTime(216, now); // A3 harmonic

    // Dual Formant Filter to simulate human vocal resonance ("Oooom / Aaaaah")
    const formantFilter1 = this.ctx.createBiquadFilter();
    formantFilter1.type = 'bandpass';
    formantFilter1.frequency.setValueAtTime(450, now);
    formantFilter1.Q.setValueAtTime(3.5, now);

    const formantFilter2 = this.ctx.createBiquadFilter();
    formantFilter2.type = 'lowpass';
    formantFilter2.frequency.setValueAtTime(850, now);

    voiceGain.gain.setValueAtTime(0.001, now);
    voiceGain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 3);

    voiceOsc1.connect(formantFilter1);
    voiceOsc2.connect(formantFilter1);
    formantFilter1.connect(formantFilter2);
    formantFilter2.connect(voiceGain);
    voiceGain.connect(this.masterGain);

    voiceOsc1.start(now);
    voiceOsc2.start(now);
    this.activeOscillators.push(voiceOsc1, voiceOsc2);

    // Meditative Piano chords progression (A minor 432 Hz tuning: A - C - E - G)
    const playPianoChord = (chordFreqs: number[]) => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const t = this.ctx.currentTime;

      chordFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Piano harmonic envelope: sharp attack, gentle harmonic ring, long smooth decay
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const chordGain = (0.09 / (idx + 1)) * this.volume;
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(chordGain, t + 0.05 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t + idx * 0.08);
        osc.stop(t + 4.8);
      });
    };

    const chords = [
      [216, 256.8, 324, 432],       // A minor add9
      [171.4, 216, 256.8, 342.8],   // F major 7
      [192, 240, 288, 384],         // C major
      [162, 216, 243, 324],         // E minor 7
    ];

    let chordIdx = 0;
    playPianoChord(chords[0]);

    const pianoTimer = setInterval(() => {
      if (!this.isPlaying) return;
      chordIdx = (chordIdx + 1) % chords.length;
      playPianoChord(chords[chordIdx]);
    }, 6000);

    this.proceduralTimers.push(pianoTimer);
  }

  // 8. Rain & Night: Combination of continuous warm rainfall and nocturnal field crickets
  private createRainNightSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // A. Rain Bed (Pink noise low-rumble filtered)
    const buffer = this.createPinkNoiseBuffer(4);
    if (buffer) {
      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = buffer;
      rainSource.loop = true;

      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(220, now);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1100, now);

      const rainGain = this.ctx.createGain();
      rainGain.gain.setValueAtTime(0.001, now);
      rainGain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 2);

      rainSource.connect(hp);
      hp.connect(lp);
      lp.connect(rainGain);
      rainGain.connect(this.masterGain);

      rainSource.start(now);
      this.activeOscillators.push(rainSource);
    }

    // B. Distant Crickets Bed (Continuous tremolo at 16 Hz)
    const cricketOsc = this.ctx.createOscillator();
    const cricketGain = this.ctx.createGain();
    const cricketFilter = this.ctx.createBiquadFilter();

    cricketOsc.type = 'triangle';
    cricketOsc.frequency.setValueAtTime(5040, now);

    cricketFilter.type = 'bandpass';
    cricketFilter.frequency.setValueAtTime(5040, now);
    cricketFilter.Q.setValueAtTime(7.5, now);

    const cricketLfo = this.ctx.createOscillator();
    const cricketLfoGain = this.ctx.createGain();
    cricketLfo.type = 'sine';
    cricketLfo.frequency.setValueAtTime(15.5, now);
    cricketLfoGain.gain.setValueAtTime(0.01 * this.volume, now);

    cricketLfo.connect(cricketGain.gain);
    cricketGain.gain.setValueAtTime(0.012 * this.volume, now);

    cricketOsc.connect(cricketFilter);
    cricketFilter.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    cricketOsc.start(now);
    cricketLfo.start(now);
    this.activeOscillators.push(cricketOsc, cricketLfo);

    // C. Foreground Night Field Crickets Chirping periodically
    const chirpCricket = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const cNow = this.ctx.currentTime;
        const chirpCount = 3 + Math.floor(Math.random() * 2);
        const baseFreq = 4720 + Math.random() * 160;

        for (let i = 0; i < chirpCount; i++) {
          const pulseTime = cNow + i * 0.05;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq + (i % 2 === 0 ? 70 : 0), pulseTime);

          const pulseGain = (0.038 + Math.random() * 0.012) * this.volume;
          gain.gain.setValueAtTime(0.0001, pulseTime);
          gain.gain.linearRampToValueAtTime(pulseGain, pulseTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, pulseTime + 0.045);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(pulseTime);
          osc.stop(pulseTime + 0.05);
        }
      } catch {}
    };

    chirpCricket();
    const triggerNextChirp = () => {
      if (!this.isPlaying) return;
      chirpCricket();
      const nextDelay = 1400 + Math.random() * 1500;
      const timer = setTimeout(triggerNextChirp, nextDelay);
      this.proceduralTimers.push(timer as unknown as NodeJS.Timeout);
    };

    const initialTimer = setTimeout(triggerNextChirp, 1600);
    this.proceduralTimers.push(initialTimer as unknown as NodeJS.Timeout);
  }

  // 9. Binaural Beats Sound Bath (Deep Sleep & Insomnia Relief 3 Hz)
  private createBinaural3HzSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Carrier frequencies: Left = 216 Hz, Right = 219 Hz (Exactly 3.0 Hz Delta frequency)
    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();
    const leftGain = this.ctx.createGain();
    const rightGain = this.ctx.createGain();

    leftOsc.type = 'sine';
    leftOsc.frequency.setValueAtTime(216, now);

    rightOsc.type = 'sine';
    rightOsc.frequency.setValueAtTime(219, now); // 3 Hz binaural beat

    leftGain.gain.setValueAtTime(0.001, now);
    leftGain.gain.linearRampToValueAtTime(0.13 * this.volume, now + 3);

    rightGain.gain.setValueAtTime(0.001, now);
    rightGain.gain.linearRampToValueAtTime(0.13 * this.volume, now + 3);

    // Deep sub-octave grounding drone: 108 Hz & 111 Hz (3 Hz delta beat in sub-bass)
    const subLeft = this.ctx.createOscillator();
    const subRight = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    subLeft.type = 'sine';
    subLeft.frequency.setValueAtTime(108, now);

    subRight.type = 'sine';
    subRight.frequency.setValueAtTime(111, now);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.09 * this.volume, now + 3);

    // Lowpass filter for smooth, warm binaural relaxation without harsh harmonics
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, now);

    leftOsc.connect(filter);
    rightOsc.connect(filter);
    subLeft.connect(filter);
    subRight.connect(filter);

    filter.connect(leftGain);
    filter.connect(rightGain);
    leftGain.connect(this.masterGain);
    rightGain.connect(this.masterGain);

    leftOsc.start(now);
    rightOsc.start(now);
    subLeft.start(now);
    subRight.start(now);
    this.activeOscillators.push(leftOsc, rightOsc, subLeft, subRight);

    // Deep singing bowl / gong sound bath swell every 9.5 seconds
    this.playChime(324);
    const bathTimer = setInterval(() => {
      if (!this.isPlaying) return;
      this.playChime(324);
    }, 9500);
    this.proceduralTimers.push(bathTimer);
  }

  // 10. Nature: Pure open-air nature soundscape (flowing water, soft breeze & woodland bird trills)
  private createNatureAmbientSynth(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // A. Flowing Water Cascade
    const buffer = this.createPinkNoiseBuffer(4);
    if (buffer) {
      const streamSource = this.ctx.createBufferSource();
      streamSource.buffer = buffer;
      streamSource.loop = true;

      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(680, now);
      bp.Q.setValueAtTime(2.0, now);

      const streamGain = this.ctx.createGain();
      streamGain.gain.setValueAtTime(0.001, now);
      streamGain.gain.linearRampToValueAtTime(0.15 * this.volume, now + 2);

      streamSource.connect(bp);
      bp.connect(streamGain);
      streamGain.connect(this.masterGain);

      streamSource.start(now);
      this.activeOscillators.push(streamSource);
    }

    // B. Swaying Open-Air Breeze
    const breezeBuffer = this.createPinkNoiseBuffer(3);
    if (breezeBuffer) {
      const breezeSource = this.ctx.createBufferSource();
      breezeSource.buffer = breezeBuffer;
      breezeSource.loop = true;

      const breezeFilter = this.ctx.createBiquadFilter();
      breezeFilter.type = 'bandpass';
      breezeFilter.frequency.setValueAtTime(380, now);
      breezeFilter.Q.setValueAtTime(1.5, now);

      const breezeLfo = this.ctx.createOscillator();
      breezeLfo.type = 'sine';
      breezeLfo.frequency.setValueAtTime(0.09, now);

      const breezeLfoGain = this.ctx.createGain();
      breezeLfoGain.gain.setValueAtTime(120, now);
      breezeLfo.connect(breezeLfoGain);
      breezeLfoGain.connect(breezeFilter.frequency);

      const breezeGain = this.ctx.createGain();
      breezeGain.gain.setValueAtTime(0.001, now);
      breezeGain.gain.linearRampToValueAtTime(0.11 * this.volume, now + 2);

      breezeSource.connect(breezeFilter);
      breezeFilter.connect(breezeGain);
      breezeGain.connect(this.masterGain);

      breezeSource.start(now);
      breezeLfo.start(now);
      this.activeOscillators.push(breezeSource, breezeLfo);
    }

    // C. Gentle Woodland Birds
    const triggerBird = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      try {
        const bNow = this.ctx.currentTime;
        const notes = [2950, 3200, 3600, 3100];
        const baseNote = notes[Math.floor(Math.random() * notes.length)];

        for (let i = 0; i < 2; i++) {
          const chirpTime = bNow + i * 0.12;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseNote + (i === 1 ? 220 : 0), chirpTime);
          osc.frequency.exponentialRampToValueAtTime(baseNote * 0.88, chirpTime + 0.09);

          gain.gain.setValueAtTime(0.001, chirpTime);
          gain.gain.linearRampToValueAtTime(0.04 * this.volume, chirpTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.09);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(chirpTime);
          osc.stop(chirpTime + 0.1);
        }
      } catch {}
    };

    const birdInit = setTimeout(() => {
      triggerBird();
      const birdTimer = setInterval(triggerBird, 4200);
      this.proceduralTimers.push(birdTimer);
    }, 2200);
    this.proceduralTimers.push(birdInit);
  }

  // Set Sleep Timer in minutes
  setSleepTimer(minutes: number, onExpire?: () => void) {
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }
    if (minutes <= 0) return;

    this.sleepTimerId = setTimeout(() => {
      this.stop();
      if (onExpire) onExpire();
    }, minutes * 60 * 1000);
  }

  stop() {
    this.isPlaying = false;
    this.currentSoundId = null;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.sleepTimerId) {
      clearTimeout(this.sleepTimerId);
      this.sleepTimerId = null;
    }

    if (this.proceduralTimers.length > 0) {
      this.proceduralTimers.forEach((t) => {
        try {
          clearInterval(t);
          clearTimeout(t);
        } catch {}
      });
      this.proceduralTimers = [];
    }

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
      } catch {}
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
      setTimeout(() => {
        this.activeOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.activeOscillators = [];
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
      }, 350);
    }
  }
}

export const audioEngine = new MeditationAudioEngine();
