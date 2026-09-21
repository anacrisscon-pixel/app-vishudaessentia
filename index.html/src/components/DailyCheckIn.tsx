import React, { useState, useEffect } from 'react';
import { getCheckInStatus, recordCheckIn, completeCheckInMicroAction } from '../utils/storage';
import { Check, Flame, Clock, Play, RotateCcw, Sparkles, ChevronRight, Heart, TrendingUp } from 'lucide-react';

interface DailyCheckInProps {
  onProceedToExplore?: () => void;
  onGoInsights?: () => void;
  onClose?: () => void;
  isInitialScreen?: boolean;
}

const CHECKIN_MOODS = [
  { id: 'calma', emoji: '🌿', label: 'En calma', tag: 'Centrado y en paz', color: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
  { id: 'energia', emoji: '⚡', label: 'Con energía', tag: 'Motivado y activo', color: 'bg-amber-50 border-amber-300 text-amber-900' },
  { id: 'sobrecarga', emoji: '🌪️', label: 'Sobrecarga', tag: 'Mente acelerada', color: 'bg-slate-100 border-slate-300 text-slate-800' },
  { id: 'cansancio', emoji: '🌙', label: 'Agotamiento', tag: 'Baja energía física', color: 'bg-stone-100 border-stone-300 text-stone-800' },
  { id: 'reflexivo', emoji: '🧭', label: 'Reflexivo/a', tag: 'Mirada hacia adentro', color: 'bg-teal-50 border-teal-300 text-teal-900' },
];

const DAILY_MICRO_ACTIONS: Record<string, { title: string; instruction: string; affirmation: string }> = {
  calma: {
    title: 'Anclar la serenidad presente',
    instruction: 'Lleva tus dos manos a las piernas o al pecho. Siente el aire entrar fresco por la nariz y salir tibio. Reconoce que este segundo no te exige nada más.',
    affirmation: 'Habito mi cuerpo con gratitud y firmeza.',
  },
  energia: {
    title: 'Canalizar tu impulso consciente',
    instruction: 'Endereza tu espalda, rota los hombros hacia atrás tres veces. Exhala fuerte por la boca y enfoca tu mente en una sola prioridad esencial hoy.',
    affirmation: 'Dirijo mi energía hacia lo que de verdad me construye.',
  },
  sobrecarga: {
    title: 'Reseteo somático de 30 segundos',
    instruction: 'Exhala todo el aire. Inhala en 4 segundos, sostén 2 segundos y exhala en 6 segundos como si soplaras por un pitillo. Deja caer los hombros.',
    affirmation: 'No tengo que resolver todo en este instante. Un respiro a la vez.',
  },
  cansancio: {
    title: 'Validar la necesidad de reposo',
    instruction: 'Cierra los ojos. Suelta la tensión de la mandíbula y la frente. Permítete no tener que rendir ni demostrar nada durante este medio minuto.',
    affirmation: 'Mi valor no depende de mi productividad ininterrumpida.',
  },
  reflexivo: {
    title: 'Espacio de escucha interior',
    instruction: 'Pon una mano sobre tu corazón. Pregúntate con amabilidad sin juzgarte: "¿Qué es lo que más necesito cuidar de mí el día de hoy?"',
    affirmation: 'Escucho mi voz interior con respeto y templanza.',
  },
};

const DEFAULT_PHRASES = [
  'Hoy no necesitas tenerlo todo resuelto; basta con no abandonarte en el camino.',
  'La serenidad no es ausencia de retos, es la certeza de saber habitarte ante ellos.',
  'Tu energía es tu bien más sagrado: elígela donde te nutra y no donde te drene.',
  'Date el permiso de ir a tu propio ritmo. La constancia tranquila supera a la prisa.',
  'Un límite sano puesto a tiempo es el mayor acto de respeto hacia ti y los demás.',
];

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({
  onProceedToExplore,
  onGoInsights,
  onClose,
  isInitialScreen = false,
}) => {
  const [status, setStatus] = useState(getCheckInStatus());
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhala...' | 'Sostén...' | 'Exhala...'>('Inhala...');
  const [todayPhraseIndex] = useState(() => {
    const day = new Date().getDate();
    return day % DEFAULT_PHRASES.length;
  });

  const selectedMoodId = status.moodId || 'calma';
  const activeAction = DAILY_MICRO_ACTIONS[selectedMoodId] || DAILY_MICRO_ACTIONS.calma;

  // 30-second timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev - 1;
          // Cycle breathing rhythm
          const cycle = (30 - next) % 12;
          if (cycle < 4) setBreathPhase('Inhala...');
          else if (cycle < 6) setBreathPhase('Sostén...');
          else setBreathPhase('Exhala...');

          if (next <= 0) {
            setIsTimerRunning(false);
            const updated = completeCheckInMicroAction();
            setStatus(updated);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleSelectMood = (moodId: string) => {
    const updated = recordCheckIn(moodId, status.microActionDone);
    setStatus(updated);
  };

  const handleStartTimer = () => {
    if (timerSeconds === 0) setTimerSeconds(30);
    setIsTimerRunning(true);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(30);
  };

  const handleMarkComplete = () => {
    const updated = completeCheckInMicroAction();
    setStatus(updated);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-3xl p-5 shadow-md relative overflow-hidden transition-all space-y-5">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1e5f6e]/10 rounded-full blur-2xl pointer-events-none -ml-8 -mb-8" />

      {/* Top Bar with Date & Streak Counter */}
      <div className="flex items-center justify-between border-b border-[#ece2d4] pb-3.5 relative z-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e5f6e] block">
            Efecto Check-in Diario
          </span>
          <span className="text-xs font-semibold text-[#665e52] capitalize">
            {todayFormatted}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ebe0] border border-[#d8c8ad] shadow-xs">
          <Flame className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
          <span className="text-xs font-extrabold text-[#2a241d]">
            {status.streak} {status.streak === 1 ? 'día' : 'días'}
          </span>
          <span className="text-[10px] text-[#786e60] font-medium hidden sm:inline">de racha</span>
        </div>
      </div>

      {/* 1. The Core Question */}
      <div className="space-y-1 relative z-10">
        <h2 className="text-lg font-serif font-extrabold text-[#1f2b33] leading-snug">
          ¿Cómo estás llegando en este momento?
        </h2>
        <p className="text-xs text-[#636b72] leading-relaxed">
          Dedica 30 segundos a reconocer tu estado sin juzgarlo. Es el primer paso hacia tu autorregulación.
        </p>
      </div>

      {/* 2. Gender-Neutral Mood Grid */}
      <div className="grid grid-cols-5 gap-1.5 relative z-10">
        {CHECKIN_MOODS.map((m) => {
          const isSelected = status.moodId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMood(m.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all text-center group ${
                isSelected
                  ? 'bg-[#1e353f] text-white shadow-md scale-102 ring-2 ring-[#c5a059]'
                  : 'bg-[#f7f4ee] hover:bg-[#ede7dc] text-[#333a42] border border-[#e4dcd0]'
              }`}
            >
              <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                {m.emoji}
              </span>
              <b className="text-[11px] font-semibold leading-tight line-clamp-1">
                {m.label}
              </b>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#ead08f] mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. 30-Second Micro-Action Engine */}
      <div className="bg-gradient-to-br from-[#f8f5ee] to-[#f1ebd9] border border-[#d6c7b0] rounded-2xl p-4 relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1e353f] text-[#ead08f] flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1e5f6e] block">
                Micro-hábito de 30 segundos
              </span>
              <b className="text-xs font-bold text-[#1f2b33]">
                {activeAction.title}
              </b>
            </div>
          </div>

          {status.microActionDone ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
              <Check className="w-3 h-3 text-emerald-700" />
              Completado
            </span>
          ) : (
            <span className="text-[11px] font-mono font-bold text-[#1e5f6e] bg-white/70 px-2 py-0.5 rounded-md border border-[#dcd2c4]">
              {timerSeconds}s
            </span>
          )}
        </div>

        <p className="text-xs text-[#525a61] leading-relaxed">
          {activeAction.instruction}
        </p>

        {/* Breathing Rhythm Display during timer */}
        {isTimerRunning && (
          <div className="bg-[#1e353f] text-white rounded-xl p-2.5 text-center space-y-1 animate-fadeIn">
            <span className="text-xs font-bold text-[#ead08f] uppercase tracking-widest block">
              {breathPhase}
            </span>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ead08f] transition-all duration-1000 ease-linear"
                style={{ width: `${((30 - timerSeconds) / 30) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-white/70 font-mono">
              Quedan {timerSeconds} segundos
            </span>
          </div>
        )}

        {/* Interactive Controls */}
        <div className="flex items-center gap-2 pt-1">
          {!status.microActionDone && !isTimerRunning && (
            <button
              onClick={handleStartTimer}
              className="flex-1 py-2 px-3 rounded-xl bg-[#1e353f] hover:bg-[#14262e] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-[#ead08f] text-[#ead08f]" />
              <span>Iniciar 30 segundos</span>
            </button>
          )}

          {isTimerRunning && (
            <button
              onClick={() => setIsTimerRunning(false)}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Pausar</span>
            </button>
          )}

          {!status.microActionDone && (
            <button
              onClick={handleMarkComplete}
              className="py-2 px-3 rounded-xl bg-[#eae2d3] hover:bg-[#ded4c1] text-[#333a42] font-semibold text-xs border border-[#cfc1aa] transition-all"
              title="Marcar como realizado"
            >
              Marcar listo
            </button>
          )}

          {status.microActionDone && (
            <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>¡Micro-acción registrada para hoy!</span>
              </div>
              <button
                onClick={handleResetTimer}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-normal"
              >
                <RotateCcw className="w-3 h-3" /> Repetir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Daily Phrase of Alignment */}
      <div className="border-t border-[#ece2d4] pt-3 relative z-10 flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-full bg-[#c5a059]/20 text-[#8d6f30] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#796f60]">
            Frase del día
          </span>
          <blockquote className="text-xs font-serif italic text-[#303841] leading-relaxed">
            "{DEFAULT_PHRASES[todayPhraseIndex]}"
          </blockquote>
        </div>
      </div>

      {/* Insights / Trends Button */}
      {onGoInsights && (
        <div className="pt-2">
          <button
            onClick={onGoInsights}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#144436] to-[#0c221c] text-[#ead08f] hover:brightness-110 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#ead08f]" />
            <span>Ver mis Tendencias e Insights Emocionales</span>
          </button>
        </div>
      )}

      {/* Optional link to deeper flow */}
      {onProceedToExplore && (
        <div className="pt-1">
          <button
            onClick={onProceedToExplore}
            className="w-full py-2.5 rounded-xl bg-[#f0e9dd] hover:bg-[#e4dcce] text-[#1e353f] font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-[#d8ccb8]"
          >
            <span>Continuar a exploración de patrones</span>
            <ChevronRight className="w-4 h-4 text-[#1e5f6e]" />
          </button>
        </div>
      )}
    </div>
  );
};
