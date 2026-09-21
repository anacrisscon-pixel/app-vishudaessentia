import React, { useState, useEffect } from 'react';
import {
  PATTERNS,
  SCENES,
  EMOTIONS,
  BODY_ZONES,
  INTERPRETATIONS,
  INTERP_REFLECTIONS,
  PROTECTIONS,
  PROTECTION_REFLECTIONS,
  NEEDS,
} from '../data/vishudaData';
import { ExplorationData, Pattern, ViewType } from '../types';
import { saveExploration } from '../utils/storage';
import { audioEngine } from '../utils/audioEngine';
import { getActionKitForPattern, getMatchedCaseForPattern } from '../data/patternActionData';
import { GraphicHacks } from './GraphicHacks';
import { GraphicFourSteps } from './GraphicFourSteps';
import somaticBodyImg from '../assets/images/ilustracion_cuerpo_somatico_1789823000455.jpg';
import botanicalMirrorImg from '../assets/images/espejo_botanico_alma_1789823013814.jpg';
import {
  Sparkles,
  Flame,
  ArrowLeft,
  ExternalLink,
  Clock,
  Heart,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Zap,
  Play,
  Video,
  Headphones,
  X,
  Volume2,
} from 'lucide-react';

interface ExplorationFlowProps {
  onFinish: (result: ExplorationData) => void;
  onCancel: () => void;
  onGoAiWithContext?: (exp: ExplorationData) => void;
  onGoPractice?: () => void;
  onNavigate?: (view: ViewType) => void;
  initialPatternFocus?: string;
  initialPatternId?: string;
  onGoFireWithBurden?: (burden: string) => void;
}

// 3 PASOS STREAMLINED: Ligeros, visuales y sin sobrecarga de lectura
export const STREAMLINED_BODY_OPTIONS = [
  { id: 'pecho', icon: '🫀', label: 'Pecho', desc: 'Opresión, taquicardia o vacío', patternId: 'conexion' },
  { id: 'garganta', icon: '🫁', label: 'Garganta', desc: 'Nudo o me costó decir mi verdad', patternId: 'limites' },
  { id: 'estomago', icon: '🌪️', label: 'Estómago', desc: 'Nudo, aceleración o control', patternId: 'control' },
  { id: 'hombros', icon: '🎒', label: 'Hombros y Cuello', desc: 'Carga pesada o resolver a solas', patternId: 'autosuficiencia' },
  { id: 'mandibula', icon: '😬', label: 'Mandíbula', desc: 'Rigidez o ganas de defenderme', patternId: 'defensa' },
  { id: 'huida', icon: '🏃', label: 'Inquietud / Huida', desc: 'Ganas de aislarme o desconectar', patternId: 'evitacion' },
  { id: 'duda', icon: '🎭', label: 'Inseguridad general', desc: 'Duda de mi valor o qué pensarán', patternId: 'aprobacion' },
];

export const STREAMLINED_EMOTIONS = [
  { emoji: '⚡', label: 'Ansiedad' },
  { emoji: '😔', label: 'Culpa' },
  { emoji: '💔', label: 'Rechazo' },
  { emoji: '🌋', label: 'Enojo' },
  { emoji: '🌊', label: 'Sobrecarga' },
  { emoji: '🍂', label: 'Miedo' },
  { emoji: '🌧️', label: 'Tristeza' },
  { emoji: '🎭', label: 'Exigencia' },
];

export const STREAMLINED_TRIGGERS = [
  {
    id: 'distancia',
    icon: '💬',
    title: 'Un mensaje sin responder, frialdad o distancia',
    sub: 'Siento desamparo o miedo a que se alejen de mí',
    patternId: 'conexion',
  },
  {
    id: 'limite',
    icon: '🙅',
    title: 'Dije que sí cuando quería decir que no',
    sub: 'Me costó poner un límite o callé para no incomodar',
    patternId: 'limites',
  },
  {
    id: 'control',
    icon: '🌪️',
    title: 'Cosas imprevistas o fuera de mi control',
    sub: 'Me angustia no tener todo supervisado y seguro',
    patternId: 'control',
  },
  {
    id: 'critica',
    icon: '🛡️',
    title: 'Sentí juicio, crítica o necesidad de defenderme',
    sub: 'Salté a justificarme o a demostrar que tengo razón',
    patternId: 'defensa',
  },
  {
    id: 'aislar',
    icon: '🚪',
    title: 'Una discusión o agobio y me encerré en silencio',
    sub: 'Me desconecté y sentí que es más seguro estar sola/o',
    patternId: 'evitacion',
  },
  {
    id: 'ayuda',
    icon: '🏔️',
    title: 'Estoy al límite pero me niego a pedir ayuda',
    sub: 'Prefiero colapsar antes que depender o flaquear',
    patternId: 'autosuficiencia',
  },
  {
    id: 'aprobacion',
    icon: '🎭',
    title: 'Dudo de si soy suficiente para los demás',
    sub: 'Busco aprobación y temo decepcionar o equivocarme',
    patternId: 'aprobacion',
  },
];

// Opciones sensoriales rápidas
const SOMATIC_BODY_OPTIONS = [
  {
    id: 'garganta',
    icon: '🫁',
    title: 'Garganta apretada o dificultad para decir mi verdad',
    desc: 'Trago saliva con dificultad, me cuesta decir "no" o callo por temor a incomodar.',
    patternId: 'limites',
  },
  {
    id: 'pecho-vacio',
    icon: '🫀',
    title: 'Pecho oprimido o vacío ante la distancia de alguien',
    desc: 'Siento un desamparo repentino, angustia si no responden o miedo a que se alejen.',
    patternId: 'conexion',
  },
  {
    id: 'estomago-control',
    icon: '🌪️',
    title: 'Nudo en el estómago o necesidad urgente de controlar todo',
    desc: 'Aceleración interna, no puedo descansar si las cosas no están bajo mi supervisión.',
    patternId: 'control',
  },
  {
    id: 'mandibula-defensa',
    icon: '😬',
    title: 'Mandíbula apretada, rigidez y ganas de defenderme',
    desc: 'Siento que me juzgan injustamente o una autoexigencia feroz de ser impecable.',
    patternId: 'defensa',
  },
  {
    id: 'hombros-carga',
    icon: '🎒',
    title: 'Hombros pesados como si llevara la carga del mundo',
    desc: 'Resuelvo los problemas de todos a solas sin pedir ayuda ni permitirme flaquear.',
    patternId: 'autosuficiencia',
  },
  {
    id: 'ahogo-huida',
    icon: '🏃',
    title: 'Sensación de ahogo o impulso de huir y desconectarme',
    desc: 'Cuando alguien se acerca demasiado o hay mucha intimidad, busco enfriar o escapar.',
    patternId: 'evitacion',
  },
  {
    id: 'duda-impostor',
    icon: '🎭',
    title: 'Inquietud constante por complacer y qué pensarán de mí',
    desc: 'Dudo de mi valor, minimizo mis logros y busco aprobación externa para sentirme a salvo.',
    patternId: 'aprobacion',
  },
];

const LIFE_SITUATIONS_OPTIONS = [
  {
    id: 'sit-mensaje',
    icon: '💬',
    title: 'Dejaron mi mensaje en visto o tardaron en responder',
    desc: 'Empiezo a pensar qué hice mal, reviso el chat repetidamente y siento angustia.',
    patternId: 'conexion',
  },
  {
    id: 'sit-limite',
    icon: '🙅',
    title: 'Dije que sí cuando todo mi cuerpo gritaba que no',
    desc: 'Acepté un favor o compromiso por miedo a que se molestaran o pensaran que soy egoísta.',
    patternId: 'limites',
  },
  {
    id: 'sit-delegar',
    icon: '⚡',
    title: 'No puedo delegar nada porque siento que nadie lo hace bien',
    desc: 'Me sobrecargo de tareas porque corregir a los demás me genera demasiada ansiedad.',
    patternId: 'control',
  },
  {
    id: 'sit-critica',
    icon: '🛡️',
    title: 'Me hicieron un comentario y salté a la defensiva de inmediato',
    desc: 'Sentí una punzada de ataque y argumenté con vehemencia para demostrar que tenía razón.',
    patternId: 'defensa',
  },
  {
    id: 'sit-aislar',
    icon: '🚪',
    title: 'Tuvimos una discusión y me encerré en un silencio gélido',
    desc: 'Dejo de hablar, me desconecto emocionalmente y siento que es más seguro estar sola/o.',
    patternId: 'evitacion',
  },
  {
    id: 'sit-ayuda',
    icon: '🏔️',
    title: 'Estoy agotada/o pero me niego físicamente a pedir auxilio',
    desc: 'Prefiero colapsar antes que darle a alguien la oportunidad de fallarme o juzgarme.',
    patternId: 'autosuficiencia',
  },
];

export const ExplorationFlow: React.FC<ExplorationFlowProps> = ({
  onFinish,
  onCancel,
  onGoAiWithContext,
  onNavigate,
  initialPatternFocus,
  initialPatternId,
  onGoFireWithBurden,
}) => {
  const activeFocus = initialPatternFocus || initialPatternId;

  // Modos principales: 'guided' (el viaje reflexivo paso a paso de ayer a las 5 PM) o 'quick' (el espejo rápido sensorial)
  const [inquiryMode, setInquiryMode] = useState<'guided' | 'quick'>('guided');
  const [viewMode, setViewMode] = useState<'input' | 'revelation'>(() => {
    return activeFocus ? 'revelation' : 'input';
  });

  // Estado para la Tarjeta Flotante con Audio/Video Directo
  const [showQuickCard, setShowQuickCard] = useState<boolean>(false);
  // Medio activo en reproductor superior (video vs meditación)
  const [activeMedia, setActiveMedia] = useState<'video' | 'meditation'>('video');

  // Estado del Viaje Ligero de 3 Pasos (Sin sobrecarga ni texto pesado)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedBodyPoint, setSelectedBodyPoint] = useState<string>('pecho');
  const [selectedEmotionPill, setSelectedEmotionPill] = useState<string>('Ansiedad');
  const [selectedTriggerId, setSelectedTriggerId] = useState<string>('distancia');

  // Compatibilidad con diario y desahogo
  const [scene, setScene] = useState<string>(SCENES[0].label);
  const [sceneText, setSceneText] = useState<string>('');
  const [emotion, setEmotion] = useState<string>(EMOTIONS[1]);
  const [intensity, setIntensity] = useState<number>(7);
  const [bodyZone, setBodyZone] = useState<string>(BODY_ZONES[2].label);
  const [interpretation, setInterpretation] = useState<string>(INTERPRETATIONS[0]);
  const [protection, setProtection] = useState<string>(PROTECTIONS[0].label);
  const [need, setNeed] = useState<string>(NEEDS[0].label);

  // Estado del Modo Rápido Somático
  const [inputTab, setInputTab] = useState<'body' | 'situation'>('body');
  const [selectedBodyId, setSelectedBodyId] = useState<string>('pecho-vacio');
  const [selectedSituationId, setSelectedSituationId] = useState<string>('sit-mensaje');
  const [personalNote, setPersonalNote] = useState<string>('');

  // Pestaña en la pantalla de resultado
  const [activeResultTab, setActiveResultTab] = useState<'neurohacks' | 'plan' | 'case'>('neurohacks');
  const [selectedPatternId, setSelectedPatternId] = useState<string>(() => {
    return activeFocus || 'conexion';
  });

  useEffect(() => {
    if (activeFocus) {
      setSelectedPatternId(activeFocus);
      setViewMode('revelation');
    }
  }, [activeFocus]);

  // Deducir el patrón de forma inteligente y ágil a partir de los 3 pasos ligeros
  const computePatternFromGuided = (): string => {
    // 1. Prioridad: el detonante situacional del paso 3
    const triggerMatch = STREAMLINED_TRIGGERS.find((t) => t.id === selectedTriggerId);
    if (triggerMatch) return triggerMatch.patternId;

    // 2. Respaldo por zona del cuerpo
    const bodyMatch = STREAMLINED_BODY_OPTIONS.find((b) => b.id === selectedBodyPoint);
    if (bodyMatch) return bodyMatch.patternId;

    return 'conexion';
  };

  // Lanzar video o meditación directa desde la tarjeta flotante
  const handleDirectMediaFromModal = (mediaType: 'video' | 'meditation') => {
    setActiveMedia(mediaType);
    setShowQuickCard(false);
    const target = computePatternFromGuided();
    setSelectedPatternId(target);
    audioEngine.playChime(432);
    setViewMode('revelation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Acción para finalizar el viaje paso a paso
  const handleFinishGuided = () => {
    const detected = computePatternFromGuided();
    setSelectedPatternId(detected);
    audioEngine.playChime(432);
    setViewMode('revelation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Acción para revelar el modo rápido
  const handleRevealQuick = () => {
    let targetPattern = 'conexion';
    if (inputTab === 'body') {
      const match = SOMATIC_BODY_OPTIONS.find((o) => o.id === selectedBodyId);
      if (match) targetPattern = match.patternId;
    } else {
      const match = LIFE_SITUATIONS_OPTIONS.find((o) => o.id === selectedSituationId);
      if (match) targetPattern = match.patternId;
    }
    setSelectedPatternId(targetPattern);
    audioEngine.playChime(432);
    setViewMode('revelation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const detectedPattern =
    PATTERNS.find((p) => p.id === selectedPatternId) || PATTERNS[0];
  const actionKit = getActionKitForPattern(detectedPattern.id);
  const matchedCase = getMatchedCaseForPattern(detectedPattern.id);

  const handleSaveToJournal = () => {
    const exp: ExplorationData = {
      id: 'exp_' + Date.now(),
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      scene: inquiryMode === 'guided' ? (sceneText ? `${scene}: ${sceneText}` : scene) : (personalNote || matchedCase.title),
      emotion: inquiryMode === 'guided' ? emotion : matchedCase.sintoma,
      intensity: inquiryMode === 'guided' ? intensity : 8,
      body: inquiryMode === 'guided' ? bodyZone : matchedCase.contexto,
      interpretation: inquiryMode === 'guided' ? interpretation : matchedCase.mecanismo,
      protection: inquiryMode === 'guided' ? protection : detectedPattern.title,
      need: inquiryMode === 'guided' ? need : actionKit.woundTitle,
      completion: 'completada',
      resonance: 9,
      focusPattern: detectedPattern.id,
      source: inquiryMode === 'guided' ? 'guided-step-by-step' : 'sensorial-mirror',
    };
    saveExploration(exp);
    onFinish(exp);
  };

  const handleGoAi = () => {
    const exp: ExplorationData = {
      id: 'exp_' + Date.now(),
      date: new Date().toLocaleDateString('es-ES'),
      scene: inquiryMode === 'guided' ? (sceneText ? `${scene}: ${sceneText}` : scene) : (personalNote || matchedCase.title),
      emotion: inquiryMode === 'guided' ? emotion : matchedCase.sintoma,
      intensity: inquiryMode === 'guided' ? intensity : 8,
      body: inquiryMode === 'guided' ? bodyZone : matchedCase.contexto,
      interpretation: inquiryMode === 'guided' ? interpretation : matchedCase.mecanismo,
      protection: inquiryMode === 'guided' ? protection : detectedPattern.title,
      need: inquiryMode === 'guided' ? need : actionKit.woundTitle,
      completion: 'completada',
      resonance: 9,
      focusPattern: detectedPattern.id,
      source: inquiryMode === 'guided' ? 'guided-step-by-step' : 'sensorial-mirror',
    };
    if (onGoAiWithContext) {
      onGoAiWithContext(exp);
    } else if (onNavigate) {
      onNavigate('ai');
    }
  };

  const handleSendToFire = () => {
    const burden = inquiryMode === 'guided'
      ? `${sceneText || scene}: Siento que "${interpretation}" y me protejo con "${protection}"`
      : personalNote
      ? `${personalNote} · ${detectedPattern.title}`
      : `El peso de sentir que tengo que "${detectedPattern.title}" y la culpa asociada`;
    if (onGoFireWithBurden) {
      onGoFireWithBurden(burden);
    } else if (onNavigate) {
      onNavigate('fire');
    }
  };

  const handleOpenMediaFromSteps = (media: 'video' | 'meditation') => {
    setActiveMedia(media);
    document.getElementById('media-player-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ==================================================================================
  // VISTA 1: ENTRADA (Selector de modo: Viaje Paso a Paso de Ayer vs Espejo Rápido)
  // ==================================================================================
  if (viewMode === 'input') {
    return (
      <div className="space-y-6 pb-24 animate-fadeIn text-[#1f2b33]">
        {/* MODAL DE TARJETA FLOTANTE: ILUSTRACIÓN + AUDIO/VIDEO DIRECTO */}
        {showQuickCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
            <div className="bg-[#0c241e] text-white border-2 border-[#c5a059] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 relative overflow-hidden">
              {/* Botón Cerrar */}
              <button
                onClick={() => setShowQuickCard(false)}
                className="absolute top-4 right-4 text-[#cfe0d8] hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Cerrar tarjeta flotante"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 pr-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c5a059] flex-shrink-0 bg-[#143d31] shadow-md">
                  <img
                    src={botanicalMirrorImg}
                    alt="Espejo del Alma"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ead08f] block">
                    ✦ Tarjeta Flotante
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
                    Tu Espejo en Audio y Video
                  </h3>
                  <p className="text-[11px] text-[#cfe0d8]">
                    Para cuando leer te satura o no deseas cuestionarios.
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-3.5 space-y-2 text-xs text-[#e2f0e8] border border-white/15">
                <div className="flex items-start gap-2">
                  <span>🌿</span>
                  <p>
                    <b>No estás fallando:</b> tu cuerpo solo repite una alarma automática aprendida en la infancia.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span>🎬</span>
                  <p>
                    <b>Video Explicativo (3 min):</b> te muestra pedagógicamente qué herida se activó hoy.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span>🧘</span>
                  <p>
                    <b>Meditación Guiada (5 min):</b> calma el nudo en tu garganta y pecho con frecuencias de paz.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleDirectMediaFromModal('video')}
                  className="w-full py-3 px-4 rounded-xl bg-[#ead08f] hover:bg-[#f2dda7] text-[#0c241e] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Video className="w-4 h-4 text-[#0c241e]" />
                  <span>Ver Video Explicativo Directo</span>
                </button>

                <button
                  onClick={() => handleDirectMediaFromModal('meditation')}
                  className="w-full py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Headphones className="w-4 h-4 text-[#ead08f]" />
                  <span>Escuchar Meditación de Calma Directa</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cabecera con botón de retorno */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-[#144436] hover:text-[#0b1f19] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#eaf4ef] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </button>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#144436] bg-[#e6f2ec] px-3 py-1 rounded-full border border-[#bcdbc9]">
            Autoindagación Ágil
          </span>
        </div>

        {/* ACCESO RÁPIDO SIN LECTURA: TARJETA FLOTANTE Y AUDIO/VIDEO DIRECTO */}
        <div className="bg-gradient-to-r from-[#faf5eb] via-[#f7f0e0] to-[#f4ebe1] border-2 border-[#c5a059] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#c5a059] flex-shrink-0 bg-white shadow-2xs">
              <img
                src={botanicalMirrorImg}
                alt="Espejo interior"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <b className="text-xs sm:text-sm font-bold text-[#0c221c] block">
                ¿Prefieres no leer en este momento?
              </b>
              <p className="text-[11px] sm:text-xs text-[#52645c]">
                Abre la tarjeta flotante con audio y video directo sin cuestionarios.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowQuickCard(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0c221c] hover:bg-[#14362b] text-[#ead08f] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 text-[#ead08f]" />
            <span>Ver Tarjeta Flotante</span>
          </button>
        </div>

        {/* SELECTOR DE MODALIDAD: Paso a Paso (Ágil de 3 pasos) vs Espejo Rápido (1 toque) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#eef5f1] rounded-2xl border border-[#cfe2d7]">
          <button
            onClick={() => setInquiryMode('guided')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              inquiryMode === 'guided'
                ? 'bg-[#0e2721] text-[#ead08f] shadow-sm'
                : 'text-[#354f44] hover:bg-white/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🧭 Viaje Ágil (3 pasos)</span>
          </button>
          <button
            onClick={() => setInquiryMode('quick')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              inquiryMode === 'quick'
                ? 'bg-[#0e2721] text-[#ead08f] shadow-sm'
                : 'text-[#354f44] hover:bg-white/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>⚡ Espejo Rápido (1 toque)</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* OPCIÓN A: VIAJE ÁGIL DE 3 PASOS (LIGERO, SIN TEXTOS PESADOS) */}
        {/* ------------------------------------------------------------- */}
        {inquiryMode === 'guided' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Barra de progreso de los 3 pasos */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#144436]">
                <span>Paso {currentStep + 1} de 3</span>
                <span className="text-[11px] text-[#556961]">
                  {currentStep === 0 && '1. En tu cuerpo'}
                  {currentStep === 1 && '2. Emoción en píldoras'}
                  {currentStep === 2 && '3. Situación detonante'}
                </span>
              </div>
              <div className="w-full bg-[#d6e5dd] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#144436] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* PASO 0: DÓNDE LO SIENTES EN EL CUERPO */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3 bg-[#eaf4ef] border border-[#bcdbc9] rounded-2xl p-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-2xs border border-[#144436]/20">
                    <img
                      src={somaticBodyImg}
                      alt="Cuerpo somático"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-[#0e2721]">
                      ¿En qué parte de tu cuerpo lo sientes?
                    </h2>
                    <p className="text-xs text-[#52665e]">
                      Toca la zona donde sientes la tensión, nudo o vacío:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {STREAMLINED_BODY_OPTIONS.map((b) => {
                    const isSelected = selectedBodyPoint === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBodyPoint(b.id);
                          setBodyZone(b.label);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#144436] shadow-xs'
                            : 'bg-[#fafcfb] border-[#d8e8df] hover:border-[#a3c9b7]'
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{b.icon}</span>
                        <div className="min-w-0">
                          <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                            {b.label}
                          </b>
                          <p className="text-[11px] sm:text-xs text-[#556961] mt-0.5 leading-snug">
                            {b.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASO 1: EMOCIÓN EN PÍLDORAS VISUALES COMPACTAS */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-[#0e2721]">
                    ¿Qué emoción predomina en este instante?
                  </h2>
                  <p className="text-xs text-[#52665e]">
                    Toca una píldora directa (sin pensar de más):
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {STREAMLINED_EMOTIONS.map((em) => {
                    const isSelected = selectedEmotionPill === em.label;
                    return (
                      <button
                        key={em.label}
                        onClick={() => {
                          setSelectedEmotionPill(em.label);
                          setEmotion(em.label);
                        }}
                        className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#144436] text-[#ead08f] border-[#144436] shadow-xs'
                            : 'bg-[#fafcfb] border-[#d8e8df] text-[#2c3d35] hover:border-[#a3c9b7]'
                        }`}
                      >
                        <span className="text-lg">{em.emoji}</span>
                        <span>{em.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASO 2: QUÉ DETONÓ ESTO (1 LÍNEA BREVE) */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-[#0e2721]">
                    ¿Qué situación encendió esta reacción?
                  </h2>
                  <p className="text-xs text-[#52665e]">
                    Elige la que más resuene con lo que viviste:
                  </p>
                </div>

                <div className="space-y-2">
                  {STREAMLINED_TRIGGERS.map((tr) => {
                    const isSelected = selectedTriggerId === tr.id;
                    return (
                      <div
                        key={tr.id}
                        onClick={() => {
                          setSelectedTriggerId(tr.id);
                          setSceneText(tr.title);
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#144436] shadow-xs'
                            : 'bg-[#fafcfb] border-[#d8e8df] hover:border-[#a3c9b7]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-xl flex-shrink-0">{tr.icon}</span>
                          <div className="flex-1 min-w-0">
                            <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                              {tr.title}
                            </b>
                            <p className="text-[11px] sm:text-xs text-[#52665e] mt-0.5">
                              {tr.sub}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botones de Navegación del Flujo Ágil */}
            <div className="flex items-center justify-between pt-3 border-t border-[#d8e8df]">
              {currentStep > 0 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold text-[#354f44] hover:bg-[#eaf4ef] transition-colors cursor-pointer"
                >
                  Paso anterior
                </button>
              ) : (
                <div />
              )}

              {currentStep < 2 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="py-2.5 px-5 rounded-xl bg-[#0e2721] hover:bg-[#071713] text-[#ead08f] font-extrabold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Siguiente paso</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishGuided}
                  className="py-2.5 px-5 rounded-xl bg-[#0e2721] hover:bg-[#071713] text-[#ead08f] font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#ead08f]" />
                  <span>Ver mi Espejo y Video</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* OPCIÓN B: ESPEJO RÁPIDO SOMÁTICO (La propuesta nueva en 1 toque) */}
        {/* ------------------------------------------------------------- */}
        {inquiryMode === 'quick' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f0f6f2] rounded-xl border border-[#cfe2d7]">
              <button
                onClick={() => setInputTab('body')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  inputTab === 'body'
                    ? 'bg-[#144436] text-white shadow-xs'
                    : 'text-[#354f44]'
                }`}
              >
                🌿 En mi cuerpo
              </button>
              <button
                onClick={() => setInputTab('situation')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                  inputTab === 'situation'
                    ? 'bg-[#144436] text-white shadow-xs'
                    : 'text-[#354f44]'
                }`}
              >
                ⚡ Lo que viví hoy
              </button>
            </div>

            {inputTab === 'body' ? (
              <div className="space-y-2 animate-fadeIn">
                {SOMATIC_BODY_OPTIONS.map((opt) => {
                  const isSelected = selectedBodyId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedBodyId(opt.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#144436] shadow-xs'
                          : 'bg-[#fafcfb] border-[#d8e8df] hover:border-[#a3c9b7]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                            {opt.title}
                          </b>
                          <p className="text-xs text-[#52665e] mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 animate-fadeIn">
                {LIFE_SITUATIONS_OPTIONS.map((sit) => {
                  const isSelected = selectedSituationId === sit.id;
                  return (
                    <div
                      key={sit.id}
                      onClick={() => setSelectedSituationId(sit.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#144436] shadow-xs'
                          : 'bg-[#fafcfb] border-[#d8e8df] hover:border-[#a3c9b7]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{sit.icon}</span>
                        <div className="flex-1 min-w-0">
                          <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                            {sit.title}
                          </b>
                          <p className="text-xs text-[#52665e] mt-0.5">{sit.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-[#f2f7f4] border border-[#cfe2d7] rounded-2xl p-3.5 space-y-1">
              <span className="text-xs font-bold text-[#354f44] block">
                Nota personal o situación breve (opcional):
              </span>
              <input
                type="text"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="Ej. 'Me sentí ignorada cuando no contestó el mensaje...'"
                className="w-full bg-white border border-[#bed8cb] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#144436] placeholder-[#8ea69b] focus:outline-none focus:border-[#144436]"
              />
            </div>

            <button
              onClick={handleRevealQuick}
              className="w-full py-3.5 rounded-2xl bg-[#0e2721] hover:bg-[#071713] text-[#ead08f] font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#ead08f]" />
              <span>Revelar patrón de inmediato</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==================================================================================
  // VISTA 2: LA GRAN REVELACIÓN INTEGRAL (Combina los datos de Ayer con la Riqueza Nueva)
  // ==================================================================================
  return (
    <div className="space-y-6 pb-24 animate-fadeIn text-[#1f2b33]">
      {/* Cabecera para cambiar sentir o volver */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setViewMode('input');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-bold text-[#144436] hover:text-[#0b1f19] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#eaf4ef] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a indagar</span>
        </button>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#144436] bg-[#e6f2ec] px-3 py-1 rounded-full border border-[#bcdbc9]">
          Revelación en Espejo
        </span>
      </div>

      {/* 1. TARJETA DE REVELACIÓN DEL PATRÓN Y HERIDA */}
      <div className="bg-gradient-to-br from-[#0c241e] to-[#071613] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#c5a059]/30 relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#c5a059]/60 shadow-lg flex-shrink-0 bg-[#16362d]">
            <img
              src={botanicalMirrorImg}
              alt="Tu espejo interior"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#ead08f] block">
              Tu Espejo Interior Revelado
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
              {detectedPattern.title}
            </h1>
            <div className="inline-block mt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ead08f]/20 text-[#ead08f] border border-[#ead08f]/40">
                {actionKit.woundTitle}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#d4e4dc] leading-relaxed relative z-10 border-t border-white/10 pt-3">
          {actionKit.summary}
        </p>

        {/* Explicación Biológica y Compasiva */}
        <div className="bg-white/10 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-[#e8f3ee] space-y-1.5 border border-white/15">
          <div className="flex items-center gap-2 font-bold text-[#ead08f]">
            <Heart className="w-4 h-4" />
            <span>Por qué tu cuerpo reacciona así (Sin culpa):</span>
          </div>
          <p className="text-xs text-[#cce0d6] leading-relaxed">
            Tu amígdala interpretó esta situación cotidiana como una amenaza a tu supervivencia o afecto. No estás "fallando"; tu sistema simplemente repitió la respuesta automática que aprendió en la infancia para protegerte. Hoy puedes desarmar esa alarma con amor.
          </p>
        </div>
      </div>

      {/* 2. RESUMEN COMPACTO DE TU AUTOINDAGACIÓN */}
      {inquiryMode === 'guided' && (
        <div className="bg-[#f2f8f5] border border-[#bcdbc9] rounded-2xl p-3 space-y-1.5 text-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144436] block">
            📋 Resumen de tu Indagación Ágil
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-white px-2.5 py-1 rounded-lg border border-[#cfe2d7] text-[#2c3d35]">
              <b>Cuerpo:</b> {bodyZone}
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-[#cfe2d7] text-[#2c3d35]">
              <b>Emoción:</b> {emotion}
            </span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-[#cfe2d7] text-[#2c3d35]">
              <b>Detonante:</b> {sceneText || scene}
            </span>
          </div>
        </div>
      )}

      {/* 3. RECURSOS MULTIMEDIA VISIBLES DE INMEDIATO (VIDEO Y MEDITACIÓN DIRECTOS) */}
      <div id="media-player-container" className="bg-[#0b1f19] text-white rounded-3xl p-4 sm:p-5 border-2 border-[#c5a059]/40 space-y-3 shadow-lg">
        {/* Selector de Medios Visible Arriba */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <b className="text-xs sm:text-sm font-bold text-[#ead08f] block">
                Multimedia para tu calma (Sin lecturas pesadas)
              </b>
              <span className="text-[10px] sm:text-[11px] text-[#cfe0d8]">
                Elige si prefieres ver la explicación visual o meditar ahora:
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-white/10 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveMedia('video')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMedia === 'video'
                ? 'bg-[#ead08f] text-[#0c241e] shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🎬 Video ({actionKit.video.duration})</span>
          </button>

          <button
            onClick={() => setActiveMedia('meditation')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMedia === 'meditation'
                ? 'bg-[#ead08f] text-[#0c241e] shadow-sm'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>🧘 Meditación ({actionKit.meditation.duration})</span>
          </button>
        </div>

        {/* Reproductor de Video */}
        {activeMedia === 'video' && (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <b className="text-white font-serif">{actionKit.video.title}</b>
              <span className="text-[#ead08f] font-bold text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
                {actionKit.video.duration}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#cfe0d8] leading-relaxed">
              {actionKit.video.desc}
            </p>
            <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-inner border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${actionKit.video.videoId}?rel=0&modestbranding=1`}
                title={actionKit.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#a6c4b7]">
              <span>Cápsula oficial pedagógica</span>
              <a
                href={`https://www.youtube.com/watch?v=${actionKit.video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#ead08f] underline font-bold flex items-center gap-1 hover:text-white"
              >
                <span>Abrir en YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Reproductor de Meditación */}
        {activeMedia === 'meditation' && (
          <div className="space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <b className="text-white font-serif">{actionKit.meditation.title}</b>
              <span className="text-[#ead08f] font-bold text-[11px] bg-white/10 px-2 py-0.5 rounded-full">
                {actionKit.meditation.duration}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#cfe0d8] leading-relaxed">
              {actionKit.meditation.desc}
            </p>
            <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-inner border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${actionKit.meditation.videoId}?rel=0&modestbranding=1`}
                title={actionKit.meditation.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#a6c4b7]">
              <span>Audio oficial con frecuencias de calma</span>
              <a
                href={`https://www.youtube.com/watch?v=${actionKit.meditation.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#ead08f] underline font-bold flex items-center gap-1 hover:text-white"
              >
                <span>Abrir en YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 4. RECURSOS ADICIONALES EN PESTAÑAS (MICRO-HACKS, CASO Y PLAN) */}
      <div className="space-y-3">
        {/* Selector de pestañas compactas */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#eef5f1] rounded-2xl border border-[#cfe2d7]">
          <button
            onClick={() => setActiveResultTab('neurohacks')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
              activeResultTab === 'neurohacks'
                ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                : 'text-[#354f44] hover:bg-white/60'
            }`}
          >
            <span>🧠 Hacks Gráficos (60s)</span>
          </button>

          <button
            onClick={() => setActiveResultTab('case')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
              activeResultTab === 'case'
                ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                : 'text-[#354f44] hover:bg-white/60'
            }`}
          >
            <span>📖 Caso Real</span>
          </button>

          <button
            onClick={() => setActiveResultTab('plan')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
              activeResultTab === 'plan'
                ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                : 'text-[#354f44] hover:bg-white/60'
            }`}
          >
            <span>🗺️ 4 Pasos Gráficos</span>
          </button>
        </div>

        {/* CONTENIDO DE LAS PESTAÑAS */}
        {activeResultTab === 'neurohacks' && (
          <GraphicHacks
            neurohacks={actionKit.neurohacks}
            onOpenMedia={handleOpenMediaFromSteps}
          />
        )}

        {activeResultTab === 'case' && (
          <div className="bg-[#fbfcfb] border-2 border-[#144436] rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#e2ede7] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{matchedCase.icon}</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#144436] block">
                    Tu Espejo en la Vida Real
                  </span>
                  <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                    Caso: {matchedCase.title}
                  </b>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#eaf4ef] text-[#144436] border border-[#bcdbc9]">
                {matchedCase.categoryLabel}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white border border-[#d8e8df] rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144436] flex items-center gap-1">
                  <span>📍</span> Situación Cotidiana
                </span>
                <p className="text-[#3a4f45] leading-relaxed">{matchedCase.contexto}</p>
              </div>

              <div className="bg-white border border-[#d8e8df] rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9c4136] flex items-center gap-1">
                  <span>💥</span> Reacción Automática
                </span>
                <p className="text-[#3a4f45] leading-relaxed">{matchedCase.sintoma}</p>
              </div>

              <div className="bg-[#f0f8f4] border-2 border-[#144436] rounded-2xl p-3 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#144436] flex items-center gap-1">
                  <span>✨</span> Reencuadre para Volver a Ti
                </span>
                <p className="text-[#144436] font-medium leading-relaxed italic">
                  "{matchedCase.reframe}"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeResultTab === 'plan' && (
          <GraphicFourSteps
            steps={actionKit.whatToDoSteps}
            onOpenMedia={handleOpenMediaFromSteps}
            onOpenHacks={() => setActiveResultTab('neurohacks')}
            onOpenAi={handleGoAi}
            videoDuration={actionKit.video.duration}
            meditationDuration={actionKit.meditation.duration}
          />
        )}
      </div>

      {/* 5. PUENTES SAGRADOS INTEGRADOS */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#52665e] block text-center">
          Puentes de Sanación Integrados
        </span>

        {/* Puente al Fuego Sagrado */}
        <button
          onClick={handleSendToFire}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#e76f51] to-[#b84a32] hover:brightness-105 text-white font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <Flame className="w-5 h-5 text-[#ffe3db]" />
          <span>Llevar este peso al Fuego Sagrado</span>
        </button>

        {/* Puente a Alma (IA) */}
        <button
          onClick={handleGoAi}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#5b2a63] hover:bg-[#481c50] text-[#ead08f] font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <Sparkles className="w-5 h-5 text-[#ead08f]" />
          <span>Profundizar este diagnóstico con Alma (IA)</span>
        </button>

        {/* Guardar en Diario y Volver */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleSaveToJournal}
            className="py-3 px-4 rounded-xl bg-white border-2 border-[#144436] text-[#144436] font-bold text-xs sm:text-sm hover:bg-[#f2f8f5] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Guardar en Mi Bitácora</span>
          </button>

          <button
            onClick={onCancel}
            className="py-3 px-4 rounded-xl bg-[#eef3f0] hover:bg-[#dfebe4] text-[#354f44] font-bold text-xs sm:text-sm flex items-center justify-center gap-1 cursor-pointer transition-all"
          >
            <span>Finalizar y volver</span>
          </button>
        </div>
      </div>
    </div>
  );
};
