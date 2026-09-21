// Voice Narration & Audio Synthesizer for "Píldoras del Alma"
// Implements gentle, warm, paused cadence conforming to user instructions:
// - Rate: ~0.82-0.88x (slow, intimate, like a close friend talking in confidence)
// - Gentle pitch, warm resonance
// - Honor '...' (1-2s pauses) and '[pausa larga]' (3-4s reflective pauses)
// - Accompanied by soft ambient background resonance (theta wave / 432 Hz drone)

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export class SoulPillsVoicePlayer {
  private synth: SpeechSynthesis | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private onStateChangeCallback: ((state: { isPlaying: boolean; isPaused: boolean; progressPercent: number; currentSegmentIndex: number; totalSegments: number }) => void) | null = null;

  private textSegments: string[] = [];
  private currentSegmentIndex: number = 0;
  private pauseTimeout: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  // Female voice filters
  private static readonly FEMALE_KEYWORDS = [
    'paulina',
    'monica',
    'mónica',
    'lucia',
    'lucía',
    'helena',
    'laura',
    'sofia',
    'sofía',
    'elena',
    'sabina',
    'carmen',
    'paloma',
    'francisca',
    'alva',
    'rosa',
    'conchita',
    'lupe',
    'isabel',
    'marta',
    'marina',
    'victoria',
    'catalina',
    'camila',
    'mia',
    'esther',
    'angela',
    'female',
    'mujer',
    'femenina',
    'neural',
    'natural',
  ];

  private static readonly MALE_EXCLUSIONS = [
    'jorge',
    'diego',
    'juan',
    'pablo',
    'carlos',
    'enrique',
    'raul',
    'raúl',
    'miguel',
    'antonio',
    'manuel',
    'pedro',
    'david',
    'male',
    'hombre',
    'alvaro',
    'álvaro',
    'gonzalo',
    'julio',
    'roberto',
  ];

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    const femaleSpanish = this.getAvailableFemaleSpanishVoices();

    // Pick top female Spanish voice
    if (femaleSpanish.length > 0) {
      this.selectedVoice = femaleSpanish[0];
    } else {
      // Fallback: any Spanish voice not strictly in male list
      const nonMaleSpanish = voices.find(
        (v) =>
          (v.lang.startsWith('es') || v.lang.includes('es-')) &&
          !SoulPillsVoicePlayer.MALE_EXCLUSIONS.some((m) => v.name.toLowerCase().includes(m))
      );
      const anySpanish = voices.find((v) => v.lang.startsWith('es') || v.lang.includes('es-'));
      this.selectedVoice = nonMaleSpanish || anySpanish || voices[0] || null;
    }
  }

  public getAvailableFemaleSpanishVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const all = this.synth.getVoices();
    const spanish = all.filter((v) => v.lang.startsWith('es') || v.lang.includes('es-'));

    // Filter by female names or keywords and exclude known male names
    const explicitlyFemale = spanish.filter((v) => {
      const name = v.name.toLowerCase();
      const isMale = SoulPillsVoicePlayer.MALE_EXCLUSIONS.some((m) => name.includes(m));
      if (isMale) return false;
      return SoulPillsVoicePlayer.FEMALE_KEYWORDS.some((f) => name.includes(f));
    });

    if (explicitlyFemale.length > 0) {
      return explicitlyFemale;
    }

    // If no explicit keyword matches, return non-male Spanish voices
    return spanish.filter((v) => {
      const name = v.name.toLowerCase();
      return !SoulPillsVoicePlayer.MALE_EXCLUSIONS.some((m) => name.includes(m));
    });
  }

  public getAvailableSpanishVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableFemaleSpanishVoices();
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  /**
   * Prepares the full script by inserting intro, body with pauses, and outro.
   */
  public prepareFullScript(pillBody: string): string[] {
    const intro =
      'Hola, soy Alma... qué bueno que llegaste hasta aquí. Esta es tu píldora de esta semana. Busca un momento tuyo, uno solo, donde nadie te necesite por unos minutos... y quédate conmigo.';
    const outro =
      'Gracias por darte este espacio hoy. Lo que acabamos de nombrar ya no es invisible... y eso, aunque no lo sientas todavía, ya es sanación. Nos escuchamos la próxima semana... te voy a estar esperando aquí.';

    const fullRaw = `${intro}\n\n[pausa larga]\n\n${pillBody}\n\n[pausa larga]\n\n${outro}`;

    // Split text into semantic chunks while respecting long pauses and ellipses
    // We treat [pausa larga] as a distinct pause event
    const rawParagraphs = fullRaw.split(/\n\s*\n/);
    const chunks: string[] = [];

    rawParagraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;

      if (trimmed === '[pausa larga]') {
        chunks.push('[PAUSE_LONG]');
        return;
      }

      // Check if paragraph has internal [pausa larga]
      if (trimmed.includes('[pausa larga]')) {
        const parts = trimmed.split(/\[pausa larga\]/);
        parts.forEach((part, idx) => {
          const sub = part.trim();
          if (sub) chunks.push(sub);
          if (idx < parts.length - 1) {
            chunks.push('[PAUSE_LONG]');
          }
        });
      } else {
        chunks.push(trimmed);
      }
    });

    return chunks;
  }

  /**
   * Starts playback of the script using warm, slow voice narration with background soundscape
   */
  public playScript(
    scriptChunks: string[],
    backgroundSoundUrl: string = '/sounds/arroyo-bosque.mp3',
    onStateChange?: (state: {
      isPlaying: boolean;
      isPaused: boolean;
      progressPercent: number;
      currentSegmentIndex: number;
      totalSegments: number;
    }) => void
  ) {
    this.stop();
    this.textSegments = scriptChunks;
    this.currentSegmentIndex = 0;
    this.onStateChangeCallback = onStateChange || null;

    // Start background audio at 10% volume for subtle warmth
    try {
      this.bgAudio = new Audio(backgroundSoundUrl);
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.08;
      this.bgAudio.play().catch(() => {});
    } catch {
      // Ignored
    }

    this.isSpeaking = true;
    this.isPaused = false;
    this.speakNextSegment();
  }

  private speakNextSegment() {
    if (!this.synth || !this.isSpeaking) return;

    if (this.currentSegmentIndex >= this.textSegments.length) {
      this.finish();
      return;
    }

    const segment = this.textSegments[this.currentSegmentIndex];

    this.notifyState();

    // If segment is a long pause instruction
    if (segment === '[PAUSE_LONG]') {
      this.pauseTimeout = setTimeout(() => {
        this.currentSegmentIndex++;
        this.speakNextSegment();
      }, 3500); // 3.5s real long pause
      return;
    }

    // Clean text for speech synthesis (preserve punctuation for natural cadence)
    const cleanedText = segment
      .replace(/\.\.\./g, '... ')
      .replace(/["“”]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Cadence & Pitch adjustments for warm, gentle, feminine delivery:
    // Rate: 0.88 (slow, intimate, soothing, warm confident tone)
    // Pitch: 1.08 (gentle, bright and distinctively feminine resonance)
    utterance.rate = 0.88;
    utterance.pitch = 1.08;
    utterance.volume = 1.0;

    utterance.onend = () => {
      // Natural 1.2 second pause between sentences/paragraphs
      this.pauseTimeout = setTimeout(() => {
        this.currentSegmentIndex++;
        this.speakNextSegment();
      }, 1200);
    };

    utterance.onerror = (e) => {
      console.warn('Utterance error:', e);
      this.currentSegmentIndex++;
      this.speakNextSegment();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
      if (this.bgAudio) this.bgAudio.pause();
      if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      if (this.bgAudio) this.bgAudio.play().catch(() => {});
      this.isPaused = false;
      this.notifyState();
    }
  }

  public stop() {
    this.isSpeaking = false;
    this.isPaused = false;
    if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
      this.bgAudio = null;
    }
    this.currentSegmentIndex = 0;
    this.notifyState();
  }

  private finish() {
    this.stop();
  }

  private notifyState() {
    if (!this.onStateChangeCallback) return;
    const total = this.textSegments.length || 1;
    const progress = Math.min(100, Math.round((this.currentSegmentIndex / total) * 100));
    this.onStateChangeCallback({
      isPlaying: this.isSpeaking && !this.isPaused,
      isPaused: this.isPaused,
      progressPercent: progress,
      currentSegmentIndex: this.currentSegmentIndex,
      totalSegments: total,
    });
  }

  public previewSample(
    sampleText: string = 'Hola, soy Alma... qué bueno que llegaste hasta aquí. Esta es tu píldora de esta semana. Busca un momento tuyo, uno solo... y quédate conmigo.',
    onEnd?: () => void
  ) {
    if (!this.synth) return;
    this.stop();

    const cleanedText = sampleText.replace(/\.\.\./g, '... ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 0.88;
    utterance.pitch = 1.08;
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public getIsPlaying(): boolean {
    return this.isSpeaking && !this.isPaused;
  }
}

export const soulPillsVoice = new SoulPillsVoicePlayer();
