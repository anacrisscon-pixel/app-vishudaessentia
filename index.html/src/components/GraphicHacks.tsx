import React, { useState, useEffect } from 'react';
import { PatternNeurohack } from '../data/patternActionData';
import { audioEngine } from '../utils/audioEngine';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Heart,
  Brain,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Activity,
  ShieldCheck,
} from 'lucide-react';

interface GraphicHacksProps {
  neurohacks: PatternNeurohack[];
  onOpenMedia?: (media: 'video' | 'meditation') => void;
}

export const GraphicHacks: React.FC<GraphicHacksProps> = ({ neurohacks }) => {
  // Pestaña de hack activo para visualización gráfica destacada
  const [activeHackCategory, setActiveHackCategory] = useState<'somático' | 'cognitivo' | 'relacional'>(
    'somático'
  );

  // Estado para la respiración somática guiada gráfica (60 seg)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState<number>(60);
  const [breathPhase, setBreathPhase] = useState<'inhala' | 'sosten' | 'exhala'>('inhala');

  // Estado para el temporizador cognitivo de 20 minutos
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(20 * 60); // 20 min
  const [timerPreset, setTimerPreset] = useState<20 | 5>(20);

  // Estado de copiado de frase relacional
  const [copiedPhrase, setCopiedPhrase] = useState<boolean>(false);

  // Ciclo de la respiración somática (4s inhala, 2s sostén, 6s exhala)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            audioEngine.speakBreathCue('Práctica completada. Regresas a tu centro.');
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Manejo de fases del ciclo de respiración cada 12 segundos (4s + 2s + 6s)
  useEffect(() => {
    if (isBreathingActive) {
      const cycleTime = (60 - breathSecondsLeft) % 12;
      if (cycleTime === 0) {
        setBreathPhase('inhala');
        audioEngine.speakBreathCue('Inhala...');
        audioEngine.playInhaleBreath(4);
      } else if (cycleTime === 4) {
        setBreathPhase('sosten');
        audioEngine.speakBreathCue('Sostén...');
      } else if (cycleTime === 6) {
        setBreathPhase('exhala');
        audioEngine.speakBreathCue('Exhala y suelta...');
        audioEngine.playExhaleBreath(6);
      }
    }
  }, [isBreathingActive, breathSecondsLeft]);

  // Manejo del temporizador cognitivo de 20 min
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            audioEngine.playChime(432);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (!isTimerRunning && timerSecondsLeft === 0) {
      setTimerSecondsLeft(timerPreset * 60);
    }
    setIsTimerRunning(!isTimerRunning);
    audioEngine.playTap();
  };

  const resetTimer = (mins: 20 | 5) => {
    setIsTimerRunning(false);
    setTimerPreset(mins);
    setTimerSecondsLeft(mins * 60);
    audioEngine.playTap();
  };

  const handleCopyPhrase = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPhrase(true);
      audioEngine.playChime(640);
      setTimeout(() => setCopiedPhrase(false), 2500);
    }
  };

  // Obtener los hacks por categoría
  const somaticHack = neurohacks.find((h) => h.category === 'somático') || neurohacks[0];
  const cognitiveHack = neurohacks.find((h) => h.category === 'cognitivo') || neurohacks[1];
  const relationalHack = neurohacks.find((h) => h.category === 'relacional') || neurohacks[2];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* CABECERA INFOGRÁFICA DE SELECTOR DE HACKS */}
      <div className="bg-[#f2f8f5] border-2 border-[#bcdbc9] rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <div>
            <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
              Hacks Gráficos de 60 Segundos
            </b>
            <span className="text-[11px] text-[#4b6156]">
              Herramientas visuales e interactivas para desactivar la reactividad
            </span>
          </div>
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#144436] bg-white px-2.5 py-1 rounded-full border border-[#bcdbc9] shadow-2xs">
          Infografía Activa
        </span>
      </div>

      {/* SELECTOR GRÁFICO DE PESTAÑAS CON ICONOS Y CÓDIGO DE COLOR */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#eaf2ed] rounded-2xl border border-[#cfe2d7]">
        <button
          onClick={() => {
            setActiveHackCategory('somático');
            audioEngine.playTap();
          }}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeHackCategory === 'somático'
              ? 'bg-[#144436] text-[#ead08f] shadow-sm'
              : 'text-[#354f44] hover:bg-white/60'
          }`}
        >
          <Heart className="w-4 h-4 text-emerald-400" />
          <span>🌿 1. Somático</span>
        </button>

        <button
          onClick={() => {
            setActiveHackCategory('cognitivo');
            audioEngine.playTap();
          }}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeHackCategory === 'cognitivo'
              ? 'bg-[#144436] text-[#ead08f] shadow-sm'
              : 'text-[#354f44] hover:bg-white/60'
          }`}
        >
          <Brain className="w-4 h-4 text-amber-300" />
          <span>⏱️ 2. Cognitivo</span>
        </button>

        <button
          onClick={() => {
            setActiveHackCategory('relacional');
            audioEngine.playTap();
          }}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeHackCategory === 'relacional'
              ? 'bg-[#144436] text-[#ead08f] shadow-sm'
              : 'text-[#354f44] hover:bg-white/60'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-sky-300" />
          <span>💬 3. Relacional</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 1. HACK SOMÁTICO GRÁFICO: CÍRCULO RESPIRATORIO + DIAGRAMA DE MANOS */}
      {/* ----------------------------------------------------------------- */}
      {activeHackCategory === 'somático' && somaticHack && (
        <div className="bg-[#fafcfb] border-2 border-[#144436] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs animate-fadeIn">
          {/* Título y Tagline */}
          <div className="flex items-start justify-between gap-2 border-b border-[#e1ece5] pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#144436] bg-[#e6f2ec] px-2.5 py-0.5 rounded-full border border-[#bcdbc9] inline-block mb-1">
                Fisiología y Nervio Vago
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0e2721]">
                {somaticHack.name}
              </h3>
              <p className="text-xs text-[#52665e] mt-0.5">{somaticHack.tagline}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#144436] text-[#ead08f] flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              60s
            </span>
          </div>

          {/* DIAGRAMA GRÁFICO DE RESPIRACIÓN INTERACTIVA */}
          <div className="bg-gradient-to-b from-[#f0f8f4] to-[#e4f1ea] border border-[#bcdbc9] rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
            {/* Animación del círculo de respiración */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Anillo exterior animado */}
              <div
                className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                  isBreathingActive
                    ? breathPhase === 'inhala'
                      ? 'scale-110 border-emerald-500 bg-emerald-500/10 shadow-lg'
                      : breathPhase === 'sosten'
                      ? 'scale-110 border-amber-400 bg-amber-400/10 shadow-md'
                      : 'scale-90 border-teal-600 bg-teal-600/10'
                    : 'border-[#144436]/30 bg-white/50'
                }`}
              />

              {/* Núcleo central del círculo */}
              <div className="relative z-10 text-center flex flex-col items-center">
                {isBreathingActive ? (
                  <>
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#144436]">
                      {breathPhase === 'inhala' && '🌬️ Inhala (4s)'}
                      {breathPhase === 'sosten' && '✨ Sostén (2s)'}
                      {breathPhase === 'exhala' && '💨 Exhala (6s)'}
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#0e2721]">
                      {breathSecondsLeft}s
                    </span>
                    <span className="text-[9px] text-[#556961] font-bold">restantes</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🤲</span>
                    <span className="text-xs font-bold text-[#0e2721] mt-0.5">
                      Pulsa para iniciar
                    </span>
                    <span className="text-[10px] text-[#556961]">Guía de 60s</span>
                  </>
                )}
              </div>
            </div>

            {/* Controles del círculo */}
            <button
              onClick={() => {
                if (!isBreathingActive) {
                  setBreathSecondsLeft(60);
                  audioEngine.speakBreathCue('Inicia respiración...');
                  audioEngine.playInhaleBreath(4);
                }
                setIsBreathingActive(!isBreathingActive);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isBreathingActive
                  ? 'bg-white border border-[#144436] text-[#144436] hover:bg-[#f7faf8]'
                  : 'bg-[#144436] text-[#ead08f] hover:bg-[#0e2721]'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar respiración guiada</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Iniciar respiración somática (60s)</span>
                </>
              )}
            </button>
          </div>

          {/* DIAGRAMA GRÁFICO DE POSICIÓN DE MANOS */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white border border-[#cfe2d7] rounded-xl p-2.5 flex items-start gap-2">
              <span className="text-xl">✋</span>
              <div>
                <b className="text-[#0e2721] block">Mano Derecha</b>
                <span className="text-[11px] text-[#556961]">
                  Sobre el centro del pecho (esternón)
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#cfe2d7] rounded-xl p-2.5 flex items-start gap-2">
              <span className="text-xl">🤚</span>
              <div>
                <b className="text-[#0e2721] block">Mano Izquierda</b>
                <span className="text-[11px] text-[#556961]">
                  Sobre el vientre / bajo vientre
                </span>
              </div>
            </div>
          </div>

          {/* Instrucción concisa */}
          <p className="text-xs text-[#3b5148] leading-relaxed bg-[#f2f7f4] p-3 rounded-2xl border border-[#cfe2d7]">
            {somaticHack.instruction}
          </p>

          {/* Mantra Somático en tarjeta destacada */}
          {somaticHack.phraseOrMantra && (
            <div className="bg-gradient-to-r from-[#144436] to-[#0c2b22] text-[#ead08f] p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ead08f] flex-shrink-0" />
                <span className="text-xs sm:text-sm font-serif italic">
                  "{somaticHack.phraseOrMantra}"
                </span>
              </div>
              <button
                onClick={() => handleCopyPhrase(somaticHack.phraseOrMantra || '')}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
              >
                {copiedPhrase ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPhrase ? 'Copiada' : 'Copiar'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 2. HACK COGNITIVO GRÁFICO: INFOGRAFÍA DE LA CURVA DE CORTISOL + TIMER */}
      {/* ----------------------------------------------------------------- */}
      {activeHackCategory === 'cognitivo' && cognitiveHack && (
        <div className="bg-[#fafcfb] border-2 border-[#c5a059] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs animate-fadeIn">
          {/* Título y Tagline */}
          <div className="flex items-start justify-between gap-2 border-b border-[#e1ece5] pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9c6a1e] bg-[#fbf5e8] px-2.5 py-0.5 rounded-full border border-[#ebd8b1] inline-block mb-1">
                Neurobiología y Autorregulación
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0e2721]">
                {cognitiveHack.name}
              </h3>
              <p className="text-xs text-[#52665e] mt-0.5">{cognitiveHack.tagline}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#c5a059] text-[#0e2721] flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              20 min
            </span>
          </div>

          {/* INFOGRAFÍA GRÁFICA DE LA CURVA DE CORTISOL */}
          <div className="bg-[#fbf8f0] border border-[#ebd8b1] rounded-2xl p-3.5 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9c6a1e] block">
              📊 ¿Qué le ocurre a tu cerebro durante estos 20 minutos?
            </span>

            {/* Barras de la curva biológica */}
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-rose-700 flex items-center gap-1">
                    <span>🔴 Minuto 0:</span> Alarma de la Amígdala
                  </span>
                  <span className="text-rose-700">100% Pico de reactividad</span>
                </div>
                <div className="w-full bg-[#eedcc2] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[100%] rounded-full" />
                </div>
                <span className="text-[10px] text-[#6d5e4b] block">
                  Corteza prefrontal apagada; impulso urgente de reclamar o explicarse.
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-amber-700 flex items-center gap-1">
                    <span>🟡 Minuto 10:</span> Descenso metabólico
                  </span>
                  <span className="text-amber-700">50% Adrenalina</span>
                </div>
                <div className="w-full bg-[#eedcc2] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[50%] rounded-full" />
                </div>
                <span className="text-[10px] text-[#6d5e4b] block">
                  El ritmo cardíaco se estabiliza al caminar o beber agua fresca.
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-emerald-800 flex items-center gap-1">
                    <span>🟢 Minuto 20:</span> Ventana de Claridad Adulta
                  </span>
                  <span className="text-emerald-800">20% Cortisol</span>
                </div>
                <div className="w-full bg-[#eedcc2] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[20%] rounded-full" />
                </div>
                <span className="text-[10px] text-[#4a5f54] block font-bold">
                  Vuelves al mando: el 80% de la desesperación urgente ha desaparecido.
                </span>
              </div>
            </div>
          </div>

          {/* TEMPORIZADOR GRÁFICO INTERACTIVO DE PAUSA */}
          <div className="bg-white border-2 border-[#c5a059] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-[#fbf5e8] border-2 border-[#c5a059] flex items-center justify-center font-mono font-bold text-lg text-[#0e2721] flex-shrink-0 shadow-inner">
                {formatTime(timerSecondsLeft)}
              </div>
              <div>
                <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                  {isTimerRunning ? '⏳ Pausa en curso...' : 'Temporizador de Pausa Consciente'}
                </b>
                <span className="text-[11px] text-[#556961]">
                  Pon tu mente en pausa antes de enviar ese mensaje o llamada
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => resetTimer(timerPreset === 20 ? 5 : 20)}
                className="px-2.5 py-1.5 rounded-lg border border-[#ebd8b1] bg-[#faf6ed] text-[#845c1c] text-xs font-bold hover:bg-[#f3ead4] cursor-pointer"
              >
                {timerPreset === 20 ? 'Modo 5m' : 'Modo 20m'}
              </button>

              <button
                onClick={toggleTimer}
                className="px-4 py-2 rounded-xl bg-[#0e2721] hover:bg-[#143d31] text-[#ead08f] text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isTimerRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>
            </div>
          </div>

          {/* Mantra Cognitivo */}
          {cognitiveHack.phraseOrMantra && (
            <div className="bg-[#f4efe3] border border-[#e2d1b0] p-3 rounded-2xl text-xs font-medium text-[#4d3d21] italic flex items-center justify-between gap-2">
              <span>"{cognitiveHack.phraseOrMantra}"</span>
              <button
                onClick={() => handleCopyPhrase(cognitiveHack.phraseOrMantra || '')}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-[#c5a059] text-[#4d3d21] hover:bg-[#faf5eb] flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
              >
                {copiedPhrase ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPhrase ? 'Copiada' : 'Copiar'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 3. HACK RELACIONAL GRÁFICO: DIAGRAMA DE CONTRASTE "ANTES VS DESPUÉS" */}
      {/* ----------------------------------------------------------------- */}
      {activeHackCategory === 'relacional' && relationalHack && (
        <div className="bg-[#fafcfb] border-2 border-[#3b5998] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xs animate-fadeIn">
          {/* Título y Tagline */}
          <div className="flex items-start justify-between gap-2 border-b border-[#e1ece5] pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2c4785] bg-[#edf2fc] px-2.5 py-0.5 rounded-full border border-[#c2d4f8] inline-block mb-1">
                Comunicación Soberana
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#0e2721]">
                {relationalHack.name}
              </h3>
              <p className="text-xs text-[#52665e] mt-0.5">{relationalHack.tagline}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2c4785] text-white flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3 h-3" />
              1 min
            </span>
          </div>

          {/* DIAGRAMA GRÁFICO DE CONTRASTE: EL GIRO SABIO */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2c4785] block">
              🔄 Infografía: Del Impulso Reactivo a la Respuesta Soberana
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              {/* Tarjeta Reactiva (Lo que harías en automático) */}
              <div className="bg-[#fef2f2] border-2 border-rose-200 rounded-2xl p-3.5 space-y-1.5 relative shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 flex items-center gap-1">
                  <span>❌</span> Impulso Reactivo
                </span>
                <b className="text-xs font-serif text-rose-900 block italic">
                  "Exigir, culpar, reclamar o sobre-explicar"
                </b>
                <p className="text-[11px] text-rose-800 leading-snug">
                  Nace del niño/a asustado. Preguntas como "¿te pasa algo conmigo?" ponen al otro en posición de juez.
                </p>
              </div>

              {/* Tarjeta Sabia (El Giro Consciente) */}
              <div className="bg-[#f0f9f5] border-2 border-emerald-400 rounded-2xl p-3.5 space-y-1.5 relative shadow-2xs">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 flex items-center gap-1">
                  <span>✅</span> El Giro Consciente
                </span>
                <b className="text-xs font-serif text-emerald-950 block">
                  Nombrar tu proceso sin presionar
                </b>
                <p className="text-[11px] text-emerald-900 leading-snug">
                  Hablas desde tu centro adulto, no desde la carencia ni desde el reproche.
                </p>
              </div>
            </div>
          </div>

          {/* GLOBO DE DIÁLOGO DE LA FRASE DE ANCLAJE */}
          {relationalHack.phraseOrMantra && (
            <div className="bg-gradient-to-r from-[#17382d] to-[#0e2721] text-white p-4 rounded-2xl space-y-2.5 shadow-md border border-[#c5a059]/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ead08f] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Frase de Anclaje Lista para Usar</span>
                </span>
                <span className="text-[10px] text-[#cfe0d8]">Copia y envía con calma</span>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/15 text-xs sm:text-sm font-serif italic text-[#f3f9f6] leading-relaxed">
                {relationalHack.phraseOrMantra}
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => handleCopyPhrase(relationalHack.phraseOrMantra || '')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#ead08f] hover:bg-[#f2dda7] text-[#0c241e] font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  {copiedPhrase ? <Check className="w-3.5 h-3.5 text-[#0c241e]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhrase ? '¡Copiada con éxito!' : 'Copiar Frase'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
