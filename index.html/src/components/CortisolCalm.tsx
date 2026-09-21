import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { audioEngine } from '../utils/audioEngine';
import somaticIllustration from '../assets/images/ilustracion_cuerpo_somatico_1789823000455.jpg';
import {
  Wind,
  Play,
  RotateCcw,
  Check,
  Sparkles,
  Activity,
  Volume2,
  VolumeX,
  MessageSquare,
  Compass,
  ArrowLeft,
  Info,
  Mic,
  ArrowRight,
} from 'lucide-react';

interface CortisolCalmProps {
  onBack: () => void;
  onNavigate?: (view: ViewType) => void;
  onOpenAi?: (prompt: string) => void;
  initialExerciseId?: string;
}

type TabMode = 'mapping' | 'sigh' | '478';
type SoundGuideMode = 'both' | 'voice' | 'breath' | 'mute';

interface BodyPoint {
  id: string;
  name: string;
  zone: string;
  top: string; // percentage
  left: string; // percentage
  emotion: string;
  color: string;
  glowColor: string;
  why: string;
  somaticAction: string[];
  affirmation: string;
  aiPrompt: string;
}

const BODY_POINTS: BodyPoint[] = [
  {
    id: 'throat',
    name: 'Garganta',
    zone: 'Nudo al hablar, silencio forzado o llanto reprimido',
    top: '32%',
    left: '50%',
    emotion: 'Bloqueo / Expresión',
    color: '#2a7065',
    glowColor: 'rgba(42, 112, 101, 0.45)',
    why: 'Tus músculos faríngeos y cuerdas vocales se contraen automáticamente cuando te callas una verdad por temor al conflicto o cuando tragas el llanto.',
    somaticAction: [
      'Separa la lengua del paladar y deja caer la mandíbula relajada.',
      'Traga saliva despacio bajando suavemente la barbilla hacia el pecho.',
      'Emite un suave zumbido "Mmmmm" o suspiro sonoro "Haaaa" para hacer vibrar las cuerdas vocales.',
    ],
    affirmation: 'Es seguro darle voz a lo que siento. No tengo que tragarme el dolor para pertenecer.',
    aiPrompt: 'Siento un nudo cerrado en la garganta y me cuesta expresar lo que estoy viviendo. Ayúdame a entender qué silencio estoy reteniendo y cómo liberarlo con Alma.',
  },
  {
    id: 'chest',
    name: 'Pecho y Corazón',
    zone: 'Opresión, falta de aire o taquicardia',
    top: '44%',
    left: '50%',
    emotion: 'Ansiedad / Angustia',
    color: '#a3485e',
    glowColor: 'rgba(163, 72, 94, 0.45)',
    why: 'Ante una alerta o angustia, el cuerpo contrae la caja torácica para bombear oxígeno rápido a los músculos motores. Tu pecho siente la alarma de peligro.',
    somaticAction: [
      'Coloca tu mano derecha tibia en el centro de tu pecho (sobre el esternón).',
      'Aplica una presión suave y reconfortante sintiendo el calor de tu palma.',
      'Inhala despacio sintiendo cómo tu mano se eleva y exhala soltando el peso de tus hombros.',
    ],
    affirmation: 'En este instante exacto, mi corazón puede latir en calma. Estoy a salvo.',
    aiPrompt: 'Tengo opresión en el pecho y el corazón acelerado por ansiedad. Ayúdame a mirar qué amenaza siente mi cuerpo y cómo volver a la calma.',
  },
  {
    id: 'solar',
    name: 'Estómago y Vientre',
    zone: 'Vacío visceral, retortijón o nudo gástrico',
    top: '56%',
    left: '50%',
    emotion: 'Miedo / Alerta',
    color: '#c27b2b',
    glowColor: 'rgba(194, 123, 43, 0.45)',
    why: 'Cuando hay cortisol elevado, el flujo sanguíneo se retira del sistema digestivo hacia los músculos de escape, produciendo ese característico "vacío en el estómago".',
    somaticAction: [
      'Apoya ambas manos entrelazadas sobre tu ombligo.',
      'Inhala inflando suavemente el abdomen hacia afuera (respiración diafragmática).',
      'Exhala lento dejando que el vientre caiga completamente desinflado.',
    ],
    affirmation: 'Suelto la necesidad de controlarlo todo. Puedo digerir la vida momento a momento.',
    aiPrompt: 'Siento un nudo y vacío en el estómago por miedo e incertidumbre. Quisiera hacer una autoindagación con Alma para serenar esta alerta.',
  },
  {
    id: 'jaw',
    name: 'Mandíbula y Cuello',
    zone: 'Dientes apretados, bruxismo o rigidez',
    top: '25%',
    left: '50%',
    emotion: 'Enojo / Tensión',
    color: '#8b4f7a',
    glowColor: 'rgba(139, 79, 122, 0.45)',
    why: 'Apretar la mandíbula es el reflejo instintivo de "morder" la rabia o aguantar la molestia para no explotar ante personas queridas.',
    somaticAction: [
      'Pon las yemas de tus dedos en la articulación frente a tus orejas.',
      'Abre la boca despacio y masajea en círculos suaves durante 20 segundos.',
      'Sopla con los labios sueltos como si imitaras el trote de un caballo ("Brrrr...").',
    ],
    affirmation: 'Puedo poner límites claros sin tener que apretar los dientes en silencio.',
    aiPrompt: 'Tengo la mandíbula apretada y tensión de enojo acumulado. Ayúdame a revisar qué límite necesito poner.',
  },
  {
    id: 'shoulders',
    name: 'Hombros y Espalda Alta',
    zone: 'Sensación de cargar el mundo o contractura',
    top: '37%',
    left: '32%',
    emotion: 'Culpa / Sobrecarga',
    color: '#3b6282',
    glowColor: 'rgba(59, 98, 130, 0.45)',
    why: 'Los hombros se encogen hacia las orejas como postura de caparazón protector para resguardar el cuello cuando te sientes bajo ataque o juicio.',
    somaticAction: [
      'Sube los hombros hacia las orejas inhalando fuerte.',
      'Sostenlos arriba 3 segundos sintiendo la tensión deliberadamente.',
      'Suéltalos de golpe con un suspiro fuerte por la boca ("¡Fuuuh!"). Repite 3 veces.',
    ],
    affirmation: 'Devuelvo las cargas ajenas. Solo respondo por lo que me corresponde con amor.',
    aiPrompt: 'Siento los hombros duros y mucha culpa por sobreexigirme. Quisiera indagar este patrón con Alma.',
  },
  {
    id: 'pelvis',
    name: 'Pelvis y Piernas',
    zone: 'Sensación de perder el piso o desamparo',
    top: '78%',
    left: '50%',
    emotion: 'Abandono / Desarraigo',
    color: '#265444',
    glowColor: 'rgba(38, 84, 68, 0.45)',
    why: 'Ante un shock o sensación de soledad intensa, el sistema nervioso tiende a desconectarse del piso (sensación de flotar o vulnerabilidad).',
    somaticAction: [
      'Apoya las plantas de tus pies con firmeza en el suelo (descalzo/a si es posible).',
      'Mira a tu alrededor y nombra 3 objetos sólidos que veas (ej. "mesa, ventana, piso").',
      'Frota tus manos y masajea tus muslos para sentir la presencia física de tus piernas.',
    ],
    affirmation: 'Mis pies tocan la tierra firme. Estoy aquí, en mi cuerpo y a salvo.',
    aiPrompt: 'Siento desconexión y miedo a la soledad o al desamparo. Deseo hacer una indagación con Alma para volver a mi cuerpo.',
  },
];

const EMOTIONS_LIST = [
  { id: 'anxiety', label: 'Ansiedad', pointId: 'chest', dotColor: '#d97d7d', dotBg: '#fae8e8' },
  { id: 'sadness', label: 'Tristeza', pointId: 'chest', dotColor: '#9f7db8', dotBg: '#f2eaf7' },
  { id: 'anger', label: 'Enojo', pointId: 'jaw', dotColor: '#d66a55', dotBg: '#faece8' },
  { id: 'fear', label: 'Miedo', pointId: 'solar', dotColor: '#caa04d', dotBg: '#fbf4e4' },
  { id: 'abandon', label: 'Abandono', pointId: 'pelvis', dotColor: '#6da78f', dotBg: '#e8f3ee' },
  { id: 'guilt', label: 'Culpa', pointId: 'shoulders', dotColor: '#7295aa', dotBg: '#eaf1f5' },
  { id: 'block', label: 'Bloqueo', pointId: 'throat', dotColor: '#5a9997', dotBg: '#e5f3f3' },
  { id: 'other', label: 'Otro', pointId: 'throat', dotColor: '#936b9c', dotBg: '#f4ebf7' },
];

export const CortisolCalm: React.FC<CortisolCalmProps> = ({
  onBack,
  onNavigate,
  onOpenAi,
  initialExerciseId,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>(
    initialExerciseId === '478' ? '478' : 'mapping'
  );

  const [selectedPointId, setSelectedPointId] = useState<string>('throat');
  const selectedPoint = BODY_POINTS.find((p) => p.id === selectedPointId) || BODY_POINTS[0];
  const [soundGuideMode, setSoundGuideMode] = useState<SoundGuideMode>('both');

  // Trigger voice or breath sound according to mode
  const triggerCue = (text: string, breathType: 'inhale' | 'exhale' | 'none', duration: number = 4) => {
    if (soundGuideMode === 'mute') return;
    if (soundGuideMode === 'voice' || soundGuideMode === 'both') {
      audioEngine.speakBreathCue(text);
    }
    if (soundGuideMode === 'breath' || soundGuideMode === 'both') {
      if (breathType === 'inhale') audioEngine.playInhaleBreath(duration);
      else if (breathType === 'exhale') audioEngine.playExhaleBreath(duration);
    }
  };

  // -------------------------------------------------------------
  // PHYSIOLOGICAL SIGH ENGINE
  // -------------------------------------------------------------
  type SighPhase = 'idle' | 'inhale1' | 'inhale2' | 'exhale' | 'done';
  const [sighPhase, setSighPhase] = useState<SighPhase>('idle');
  const [sighCountdown, setSighCountdown] = useState<number>(3);
  const [sighRound, setSighRound] = useState<number>(1);
  const [sighTotalRounds, setSighTotalRounds] = useState<number>(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (sighPhase === 'inhale1') {
      if (sighCountdown === 3) {
        triggerCue('Inhala profundo...', 'inhale', 3);
      }
      if (sighCountdown > 1) {
        timer = setTimeout(() => setSighCountdown((prev) => prev - 1), 1000);
      } else {
        setSighPhase('inhale2');
        setSighCountdown(2);
      }
    } else if (sighPhase === 'inhale2') {
      if (sighCountdown === 2) {
        triggerCue('Toma otro poco de aire...', 'inhale', 2);
      }
      if (sighCountdown > 1) {
        timer = setTimeout(() => setSighCountdown((prev) => prev - 1), 1000);
      } else {
        setSighPhase('exhale');
        setSighCountdown(7);
      }
    } else if (sighPhase === 'exhale') {
      if (sighCountdown === 7) {
        triggerCue('Exhala despacio y suelta...', 'exhale', 7);
      }
      if (sighCountdown > 1) {
        timer = setTimeout(() => setSighCountdown((prev) => prev - 1), 1000);
      } else {
        if (sighRound < sighTotalRounds) {
          setSighRound((prev) => prev + 1);
          setSighPhase('inhale1');
          setSighCountdown(3);
        } else {
          setSighPhase('done');
          triggerCue('Cuerpo en calma.', 'none');
        }
      }
    }

    return () => clearTimeout(timer);
  }, [sighPhase, sighCountdown, sighRound, sighTotalRounds, soundGuideMode]);

  const startSigh = () => {
    setSighRound(1);
    setSighPhase('inhale1');
    setSighCountdown(3);
  };

  const resetSigh = () => {
    setSighPhase('idle');
    setSighCountdown(3);
    setSighRound(1);
    audioEngine.stopVoice();
  };

  // -------------------------------------------------------------
  // 4-7-8 ENGINE
  // -------------------------------------------------------------
  type BreathePhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done';
  const [breathePhase, setBreathePhase] = useState<BreathePhase>('idle');
  const [countdown478, setCountdown478] = useState<number>(4);
  const [round478, setRound478] = useState<number>(1);
  const totalRounds478 = 4;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (breathePhase === 'inhale') {
      if (countdown478 === 4) {
        triggerCue('Inhala...', 'inhale', 4);
      }
      if (countdown478 > 1) {
        timer = setTimeout(() => setCountdown478((prev) => prev - 1), 1000);
      } else {
        setBreathePhase('hold');
        setCountdown478(7);
      }
    } else if (breathePhase === 'hold') {
      if (countdown478 === 7) {
        triggerCue('Sostén con calma...', 'none');
      }
      if (countdown478 > 1) {
        timer = setTimeout(() => setCountdown478((prev) => prev - 1), 1000);
      } else {
        setBreathePhase('exhale');
        setCountdown478(8);
      }
    } else if (breathePhase === 'exhale') {
      if (countdown478 === 8) {
        triggerCue('Exhala y suelta todo...', 'exhale', 8);
      }
      if (countdown478 > 1) {
        timer = setTimeout(() => setCountdown478((prev) => prev - 1), 1000);
      } else {
        if (round478 < totalRounds478) {
          setRound478((prev) => prev + 1);
          setBreathePhase('inhale');
          setCountdown478(4);
        } else {
          setBreathePhase('done');
          triggerCue('Ciclo completado.', 'none');
        }
      }
    }

    return () => clearTimeout(timer);
  }, [breathePhase, countdown478, round478, soundGuideMode]);

  const start478 = () => {
    setRound478(1);
    setBreathePhase('inhale');
    setCountdown478(4);
  };

  const reset478 = () => {
    setBreathePhase('idle');
    setCountdown478(4);
    setRound478(1);
    audioEngine.stopVoice();
  };

  return (
    <div className="space-y-5 pb-16 animate-fadeIn max-w-lg mx-auto text-[#142620]">
      {/* Top Header Row */}
      {/* Top Header: Back + 4-Segment Progress Bar + Audio Switcher */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <button
          onClick={() => {
            audioEngine.stopVoice();
            onBack();
          }}
          className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white border border-[#ded5c2] text-[#2c3d36] hover:text-[#0c221c] hover:border-[#4A2E55]/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver</span>
        </button>

        {/* 4-Segment Progress Bar (matching 1a.png) */}
        <div className="flex items-center gap-1.5 flex-1 max-w-[200px] sm:max-w-xs justify-center">
          <div className="h-1.5 flex-1 rounded-full bg-[#4A2E55] transition-all" />
          <div className={`h-1.5 flex-1 rounded-full ${activeTab === 'sigh' || activeTab === '478' ? 'bg-[#4A2E55]' : 'bg-[#e5ded4]'} transition-all`} />
          <div className="h-1.5 flex-1 rounded-full bg-[#e5ded4]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#e5ded4]" />
        </div>

        {/* Sound Guide Mode Selector */}
        <button
          onClick={() => {
            const nextMode: Record<SoundGuideMode, SoundGuideMode> = {
              both: 'voice',
              voice: 'breath',
              breath: 'mute',
              mute: 'both',
            };
            const next = nextMode[soundGuideMode];
            setSoundGuideMode(next);
            if (next === 'mute') audioEngine.stopVoice();
          }}
          className="text-xs text-[#2c3d36] flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ded5c2] bg-white cursor-pointer shadow-2xs font-semibold hover:border-[#4A2E55]/40 transition-colors"
          title="Cambiar modo de audio (Voz / Aire / Silencio)"
        >
          {soundGuideMode === 'both' && (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#4A2E55]" />
              <span className="text-[11px] font-bold hidden sm:inline">Voz + Aire</span>
            </>
          )}
          {soundGuideMode === 'voice' && (
            <>
              <Mic className="w-3.5 h-3.5 text-[#4A2E55]" />
              <span className="text-[11px] font-bold hidden sm:inline">Solo Voz</span>
            </>
          )}
          {soundGuideMode === 'breath' && (
            <>
              <Wind className="w-3.5 h-3.5 text-[#4A2E55]" />
              <span className="text-[11px] font-bold hidden sm:inline">Solo Aire</span>
            </>
          )}
          {soundGuideMode === 'mute' && (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500 hidden sm:inline">Silencio</span>
            </>
          )}
        </button>
      </div>

      {/* Main Title & Subtitle (matching 1a.png) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D234A] tracking-tight">
          Reconoce lo que sientes
        </h1>
        <p className="text-sm text-[#4E5C56] leading-relaxed">
          Tu cuerpo también habla. ¿Dónde sientes esta emoción?
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#eae3d5] rounded-2xl">
        <button
          onClick={() => setActiveTab('mapping')}
          className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
            activeTab === 'mapping'
              ? 'bg-white text-[#3D234A] shadow-xs'
              : 'text-[#5d6e67] hover:text-[#0c221c]'
          }`}
        >
          Mapeo Corporal
        </button>

        <button
          onClick={() => setActiveTab('sigh')}
          className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
            activeTab === 'sigh'
              ? 'bg-white text-[#3D234A] shadow-xs'
              : 'text-[#5d6e67] hover:text-[#0c221c]'
          }`}
        >
          Suspiro (60s)
        </button>

        <button
          onClick={() => setActiveTab('478')}
          className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
            activeTab === '478'
              ? 'bg-white text-[#3D234A] shadow-xs'
              : 'text-[#5d6e67] hover:text-[#0c221c]'
          }`}
        >
          Respirar 4-7-8
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. MAPEO SOMÁTICO CORPORAL (DISEÑO EXACTO SEGÚN REFERENCIA 1a) */}
      {/* ============================================================== */}
      {activeTab === 'mapping' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Split Stage: Left is Meditating Body Illustration, Right is Vertical Emotion List */}
          <div className="bg-[#FAF7F2] border border-[#e5ddcb] rounded-3xl p-4 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Column: Body Illustration with interactive luminous nodes */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-inner border border-[#d8cdb8] bg-gradient-to-b from-[#fbf9f5] via-[#f7f2ea] to-[#eee5d8] flex items-center justify-center">
                  {/* Subtle calm aura */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,142,189,0.18),transparent_70%)] pointer-events-none" />

                  {/* High Quality Meditating Woman Illustration */}
                  <img
                    src={somaticIllustration}
                    alt="Mapeo somático corporal"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain select-none"
                  />

                  {/* Luminous interactive glowing touch points */}
                  {BODY_POINTS.map((pt) => {
                    const isActive = pt.id === selectedPointId;
                    return (
                      <button
                        key={pt.id}
                        onClick={() => setSelectedPointId(pt.id)}
                        style={{ top: pt.top, left: pt.left }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer focus:outline-none p-3 group"
                        aria-label={`Punto corporal: ${pt.name}`}
                      >
                        <span
                          className={`relative flex items-center justify-center rounded-full transition-all duration-300 shadow-md ${
                            isActive
                              ? 'w-9 h-9 ring-4 ring-[#4A2E55]/35 scale-125'
                              : 'w-6 h-6 ring-2 ring-white/95 group-hover:scale-115 opacity-90'
                          }`}
                          style={{ backgroundColor: pt.color }}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full bg-white shadow-xs ${isActive ? 'animate-ping' : ''}`} />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Zone Pill directly below illustration */}
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e0d6c8] shadow-2xs text-xs sm:text-sm font-bold text-[#3D234A]">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedPoint.color }}
                    />
                    Zona activa: <span className="underline decoration-[#4A2E55] decoration-2">{selectedPoint.name}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Vertical list of 8 emotion pills (matching 1a.png) */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A4560] block px-1">
                  ¿Qué emoción reconoces?
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                  {EMOTIONS_LIST.map((em) => {
                    const isSelected = selectedPoint.id === em.pointId;
                    return (
                      <button
                        key={em.id}
                        onClick={() => setSelectedPointId(em.pointId)}
                        className={`w-full py-2.5 px-4 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                          isSelected
                            ? 'bg-[#4A2E55] text-white border-[#4A2E55] font-bold scale-[1.01] shadow-sm'
                            : 'bg-white text-[#2c3d36] border-[#ded5c2] hover:border-[#4A2E55]/40 hover:bg-[#faf7f2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{
                              backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : em.dotBg,
                              color: isSelected ? '#ffffff' : em.dotColor,
                            }}
                          >
                            ●
                          </span>
                          <span className="text-sm font-medium">
                            {em.label}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-white/80 font-medium">
                            {selectedPoint.name}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Active Body Point Explanation Card */}
          <div className="bg-white border border-[#ded5c2] rounded-3xl p-5 shadow-xs space-y-4">
            {/* Header of the zone */}
            <div className="border-b border-[#eee7da] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedPoint.color }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#556961]">
                  Zona corporal
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#3D234A] mt-1">
                {selectedPoint.name}
              </h3>
              <p className="text-sm text-[#5d6e67] font-medium mt-0.5">
                {selectedPoint.zone}
              </p>
            </div>

            {/* Why your body feels this */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebe4d5] space-y-1">
              <b className="text-xs font-bold uppercase tracking-wider text-[#3D234A] flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#4A2E55]" />
                ¿Por qué reacciona tu cuerpo aquí?
              </b>
              <p className="text-sm text-[#384b42] leading-relaxed pt-0.5">
                {selectedPoint.why}
              </p>
            </div>

            {/* Somatic release 3 steps */}
            <div className="space-y-2.5">
              <b className="text-xs font-bold uppercase tracking-wider text-[#263b32] block">
                Cómo aliviarte ahora mismo (30 segundos):
              </b>
              <div className="space-y-2">
                {selectedPoint.somaticAction.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#263b32]">
                    <span className="w-6 h-6 rounded-full bg-[#4A2E55] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <p className="flex-1 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Affirmation */}
            <div className="p-3.5 rounded-2xl bg-[#F7EEF9] border border-[#e8d7ea] text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A2E55] block">
                Frase para recordarle a tu cuerpo
              </span>
              <p className="text-sm font-serif italic font-bold text-[#3D234A] mt-1 leading-relaxed">
                "{selectedPoint.affirmation}"
              </p>
            </div>

            {/* Action Buttons: Siguiente Button from 1a.png */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setActiveTab('sigh');
                  startSigh();
                }}
                className="w-full py-4 px-6 rounded-full bg-[#4A2E55] hover:bg-[#392042] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Siguiente →</span>
              </button>

              {onOpenAi && (
                <button
                  onClick={() => onOpenAi(selectedPoint.aiPrompt)}
                  className="w-full py-2.5 px-4 rounded-full bg-white border border-[#ded5c2] text-[#4A2E55] font-semibold text-xs hover:bg-[#faf7f2] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#4A2E55]" />
                  <span>Explorar esta sensación con Alma (IA)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SUSPIRO FISIOLÓGICO (Stanford Huberman)                    */}
      {/* ============================================================== */}
      {activeTab === 'sigh' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-[#3D234A] text-white rounded-3xl p-5 shadow-sm border border-[#522f64] space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d8c3e2]">
              PROTOCOLO CIENTÍFICO (STANFORD)
            </span>
            <h2 className="text-xl font-serif font-bold text-white">
              El Suspiro Fisiológico
            </h2>
            <p className="text-sm text-[#e8def0] leading-relaxed">
              La técnica más rápida para frenar el cortisol: <strong>dos inhalaciones seguidas por la nariz</strong> (una honda + un sorbo extra al tope) y <strong>una exhalación larga y suave por la boca</strong>.
            </p>
          </div>

          {/* Interactive Breathing Sphere */}
          <div className="bg-white border border-[#ded5c2] rounded-3xl p-6 text-center shadow-xs space-y-4">
            <div className="flex items-center justify-center min-h-[260px] py-4">
              <div
                className={`w-52 h-52 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-xl ${
                  sighPhase === 'inhale1'
                    ? 'scale-115 bg-gradient-to-br from-[#4A2E55] to-[#2E1837] ring-8 ring-[#4A2E55]/20'
                    : sighPhase === 'inhale2'
                    ? 'scale-130 bg-gradient-to-br from-[#6b3d7d] to-[#4A2E55] ring-12 ring-[#b28ac4]/40'
                    : sighPhase === 'exhale'
                    ? 'scale-85 bg-gradient-to-br from-[#3b594f] to-[#1e3b33]'
                    : sighPhase === 'done'
                    ? 'scale-100 bg-[#4A2E55]'
                    : 'scale-100 bg-[#3D234A]'
                }`}
              >
                {sighPhase === 'idle' && (
                  <div className="text-center p-3">
                    <Activity className="w-10 h-10 mx-auto mb-2 text-[#d8c3e2]" />
                    <span className="text-sm font-bold uppercase tracking-wider block text-white">
                      Listo para empezar
                    </span>
                    <span className="text-xs text-[#e0d3e8] mt-1 block">
                      Toca Iniciar abajo
                    </span>
                  </div>
                )}

                {sighPhase === 'inhale1' && (
                  <div className="text-center p-3 animate-fadeIn">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d8c3e2]">
                      1. Inhala profundo
                    </span>
                    <span className="text-5xl font-serif font-extrabold block my-1">
                      {sighCountdown}
                    </span>
                    <span className="text-xs text-[#e8def0]">Por la nariz</span>
                  </div>
                )}

                {sighPhase === 'inhale2' && (
                  <div className="text-center p-3 animate-fadeIn">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#f5e6fb]">
                      2. ¡Sorbo extra!
                    </span>
                    <span className="text-5xl font-serif font-extrabold text-white block my-1">
                      {sighCountdown}
                    </span>
                    <span className="text-xs font-bold text-[#f5e6fb]">Llena tus pulmones</span>
                  </div>
                )}

                {sighPhase === 'exhale' && (
                  <div className="text-center p-3 animate-fadeIn">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c2dfd4]">
                      3. Exhala despacio
                    </span>
                    <span className="text-5xl font-serif font-extrabold block my-1">
                      {sighCountdown}
                    </span>
                    <span className="text-xs text-[#dbece5]">Por la boca ("Ahhh...")</span>
                  </div>
                )}

                {sighPhase === 'done' && (
                  <div className="text-center p-3 animate-fadeIn">
                    <Check className="w-10 h-10 mx-auto text-[#d8c3e2] mb-1" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider block">
                      Ciclo Completado
                    </span>
                    <span className="text-xs text-white/90 mt-1 block">
                      Tu ritmo cardíaco bajó
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Round info */}
            {sighPhase !== 'idle' && sighPhase !== 'done' && (
              <p className="text-sm text-[#3D234A] font-bold">
                Ronda {sighRound} de {sighTotalRounds}
              </p>
            )}

            {/* Control Button */}
            <div className="pt-2">
              {sighPhase === 'idle' && (
                <button
                  onClick={startSigh}
                  className="w-full py-4 px-6 rounded-full bg-[#4A2E55] hover:bg-[#382041] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Suspiro ({sighTotalRounds} rondas)</span>
                </button>
              )}

              {sighPhase !== 'idle' && sighPhase !== 'done' && (
                <button
                  onClick={resetSigh}
                  className="w-full py-3 px-6 rounded-full bg-white border border-[#ded5c2] text-[#3D234A] font-bold text-sm hover:bg-[#faf7f2] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Detener y reiniciar</span>
                </button>
              )}

              {sighPhase === 'done' && (
                <div className="flex gap-2">
                  <button
                    onClick={startSigh}
                    className="flex-1 py-3 px-4 rounded-full bg-[#4A2E55] text-white font-bold text-sm hover:bg-[#382041] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Hacer otra ronda</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('mapping')}
                    className="flex-1 py-3 px-4 rounded-full bg-white border border-[#ded5c2] text-[#3D234A] font-bold text-sm hover:bg-[#faf7f2] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ir al Mapeo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. RESPIRACIÓN 4-7-8                                          */}
      {/* ============================================================== */}
      {activeTab === '478' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-[#3D234A] text-white rounded-3xl p-5 shadow-sm border border-[#522f64] space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d8c3e2]">
              RESETEO PARASIMPÁTICO
            </span>
            <h2 className="text-xl font-serif font-bold text-white">
              Respiración 4-7-8
            </h2>
            <p className="text-sm text-[#e8def0] leading-relaxed">
              Inhala en 4 segundos, retén en 7 y exhala en 8. Ideal para frenar el insomnio y la rumiación nocturna.
            </p>
          </div>

          <div className="bg-white border border-[#ded5c2] rounded-3xl p-6 text-center shadow-xs space-y-4">
            <div className="flex items-center justify-center min-h-[240px] py-4">
              <div
                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-xl ${
                  breathePhase === 'inhale'
                    ? 'scale-120 bg-gradient-to-br from-[#4A2E55] to-[#2E1837]'
                    : breathePhase === 'hold'
                    ? 'scale-120 bg-gradient-to-br from-[#6b3d7d] to-[#4A2E55] ring-6 ring-[#b28ac4]/50'
                    : breathePhase === 'exhale'
                    ? 'scale-85 bg-gradient-to-br from-[#3b594f] to-[#1e3b33]'
                    : breathePhase === 'done'
                    ? 'scale-100 bg-[#4A2E55]'
                    : 'scale-100 bg-[#3D234A]'
                }`}
              >
                {breathePhase === 'idle' && (
                  <div className="text-center">
                    <Wind className="w-10 h-10 mx-auto mb-1 opacity-80" />
                    <span className="text-sm font-bold uppercase">Listo</span>
                  </div>
                )}

                {breathePhase === 'inhale' && (
                  <div className="text-center animate-fadeIn">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#d8c3e2]">
                      Inhala
                    </span>
                    <span className="text-4xl font-serif font-bold block my-1">{countdown478}</span>
                    <span className="text-xs opacity-80">por la nariz</span>
                  </div>
                )}

                {breathePhase === 'hold' && (
                  <div className="text-center animate-fadeIn">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#f5e6fb]">
                      Retén
                    </span>
                    <span className="text-4xl font-serif font-bold text-white block my-1">
                      {countdown478}
                    </span>
                    <span className="text-xs text-[#f5e6fb] font-semibold">sostén el aire</span>
                  </div>
                )}

                {breathePhase === 'exhale' && (
                  <div className="text-center animate-fadeIn">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c2dfd4]">
                      Exhala
                    </span>
                    <span className="text-4xl font-serif font-bold block my-1">{countdown478}</span>
                    <span className="text-xs opacity-80">por la boca</span>
                  </div>
                )}

                {breathePhase === 'done' && (
                  <div className="text-center animate-fadeIn">
                    <Check className="w-10 h-10 mx-auto text-[#d8c3e2] mb-1" />
                    <span className="text-sm font-bold">Completado</span>
                  </div>
                )}
              </div>
            </div>

            {breathePhase !== 'idle' && breathePhase !== 'done' && (
              <p className="text-sm text-[#3D234A] font-bold">
                Ronda {round478} de {totalRounds478}
              </p>
            )}

            <div className="pt-2">
              {breathePhase === 'idle' && (
                <button
                  onClick={start478}
                  className="w-full py-4 px-6 rounded-full bg-[#4A2E55] hover:bg-[#382041] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar ciclo 4-7-8</span>
                </button>
              )}

              {breathePhase !== 'idle' && breathePhase !== 'done' && (
                <button
                  onClick={reset478}
                  className="w-full py-3 px-6 rounded-full bg-white border border-[#ded5c2] text-[#3D234A] font-bold text-sm hover:bg-[#faf7f2] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Detener y reiniciar</span>
                </button>
              )}

              {breathePhase === 'done' && (
                <button
                  onClick={start478}
                  className="w-full py-4 px-6 rounded-full bg-[#4A2E55] hover:bg-[#382041] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Hacer otra serie</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
