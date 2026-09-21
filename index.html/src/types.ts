export type ViewType =
  | 'home'
  | 'checkin'
  | 'weekly'
  | 'oracle'
  | 'oraculo'
  | 'explore'
  | 'patterns'
  | 'situations'
  | 'cases'
  | 'case'
  | 'ai'
  | 'mirror'
  | 'practice'
  | 'practices'
  | 'anchors'
  | 'cortisol'
  | 'guilt'
  | 'belong'
  | 'belonging'
  | 'media'
  | 'journey'
  | 'history'
  | 'more'
  | 'agenda'
  | 'fire'
  | 'calm'
  | 'sounds'
  | 'install'
  | 'insights'
  | 'premium';

export interface ExplorationData {
  id: string;
  date: string;
  scene: string | null;
  emotion: string | null;
  intensity: number;
  body: string | null;
  interpretation: string | null;
  protection: string | null;
  need: string | null;
  completion: string;
  resonance: number | null;
  focusPattern?: string;
  source?: string;
}

export interface Pattern {
  id: string;
  title: string;
  desc: string;
  signs: string[];
  question: string;
  tests: {
    need: string[];
    protection: string[];
    interpret: string[];
  };
  wound?: string;
}

export interface SomaticExercise {
  id: string;
  ico: string;
  tit: string;
  desc: string;
  pasos: string[];
  breathe?: boolean;
}

export interface LifeSituation {
  id: string;
  ico: string;
  title: string;
  desc: string;
  patternId: string;
}

export interface MediaResource {
  id?: string;
  title: string;
  desc: string;
  videoId: string;
  category: 'med' | 'short';
  duration?: string;
}

export interface AnchorItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface CaseDetail {
  wound: string;
  video: [title: string, desc: string, videoId: string];
  med: [title: string, desc: string, videoId: string];
}

export interface AIAnalysisResult {
  pattern: {
    id: string;
    title: string;
    text: string;
    wound?: string;
  };
  trigger: string;
  solution: string;
  reflection: string;
  source?: string;
  note?: string;
}

export interface WeeklyRelease {
  id: string;
  weekNumber: number;
  pillNumber?: number;
  cycleNumber?: number;
  title: string;
  subtitle: string;
  releaseDate: string;
  isUnlocked: boolean;
  isNew: boolean;
  durationMinutes: number;
  type: 'audio' | 'reflection' | 'practice';
  description: string;
  keyQuote: string;
  actionTip: string;
  audioTitle: string;
  tag: string;
  audioUrl?: string;
  fullScript?: string;
}

export interface DailyCheckInRecord {
  id?: string;
  date: string;
  moodId: string;
  microActionDone: boolean;
  phrase?: string;
  energyLevel?: number;
  note?: string;
  timestamp: number;
}

export interface OracleCardItem {
  id: string;
  quote: string;
  theme: string;
  practice: string;
  archetype: string;
  icon: string;
}

export interface CalmSound {
  id: string;
  name: string;
  category: 'naturaleza' | 'cuencos' | 'elementos' | 'frecuencias';
  tagline: string;
  description: string;
  icon: string;
  bgGradient: string;
  accentColor: string;
  synthType:
    | 'rain'
    | 'bowls'
    | 'forest'
    | 'ocean'
    | 'stream'
    | 'night'
    | 'theta'
    | 'piano-voice'
    | 'rain-night'
    | 'binaural-3hz'
    | 'nature-ambient';
  pixabayUrl?: string;
  audioUrl?: string;
  frequencyLabel?: string;
  benefits: string[];
}

