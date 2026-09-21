import React, { useState, useRef, useEffect } from 'react';
import { Flame, ArrowLeft, Mic, Square, RotateCcw, Heart, Wind, Sparkles, Volume2, VolumeX, Lock, CreditCard } from 'lucide-react';
import fireTransmutationGif from '../assets/images/fire_transmutation.gif';
import { incrementUsageCount, isPremiumUser, getUsageCounts } from '../utils/storage';

interface FireRitualProps {
  onBack: () => void;
  onGoHome?: () => void;
  initialBurden?: string;
  onOpenPremium?: () => void;
}

const QUICK_BURDENS = [
  'La culpa por haber descansado hoy sin ser productivo/a',
  'El miedo a decepcionar a alguien si digo lo que en verdad pienso',
  'Pensar que tengo que resolver la vida de los demás',
  'La herida de sentirme invisible o no suficiente',
  'El pánico a que alguien se aleje o me rechace',
  'La autoexigencia implacable de tener que ser perfecto/a',
];

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  dx: number;
}

export const FireRitual: React.FC<FireRitualProps> = ({ onBack, onGoHome, initialBurden, onOpenPremium }) => {
  const [burdenText, setBurdenText] = useState(initialBurden || '');
  const [stage, setStage] = useState<'write' | 'burning' | 'released'>('write');
  const [isRecording, setIsRecording] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [exhaleCountdown, setExhaleCountdown] = useState(6);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (initialBurden) {
      setBurdenText(initialBurden);
    }
  }, [initialBurden]);

  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize realistic fire crackling sound using Web Audio API (no external file needed)
  const playCracklingSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Noise buffer for fire crackles
      const bufferSize = ctx.sampleRate * 3.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // sporadic bursts mimicking wood crackling
        const burst = Math.random() < 0.006 ? Math.random() * 0.9 : Math.random() * 0.08;
        output[i] = (Math.random() * 2 - 1) * burst;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass filter to make it sound like warmth and embers
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {
      // ignore audio failure
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('El reconocimiento de voz no está disponible en este navegador. Puedes escribir lo que sientes con calma.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'es-CO';
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        if (transcript.trim()) {
          setBurdenText(transcript.trim());
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.start();
      recognitionRef.current = rec;
      setIsRecording(true);
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleIgnite = () => {
    if (!burdenText.trim()) return;

    // Haptic vibration feedback
    if (navigator.vibrate) {
      try {
        navigator.vibrate([80, 50, 120, 60, 200]);
      } catch (e) {}
    }

    // Play crackling audio
    playCracklingSound();
    incrementUsageCount('fire');

    setStage('burning');
    setBurnProgress(0);

    // Animate burning progress from 0% to 100%
    const startTime = Date.now();
    const duration = 3200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setBurnProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setStage('released');
        setBurdenText('');

        // Exhale countdown
        let count = 6;
        const exhaleInterval = setInterval(() => {
          count -= 1;
          setExhaleCountdown(count);
          if (count <= 0) clearInterval(exhaleInterval);
        }, 1000);
      }
    }, 50);
  };

  const handleReset = () => {
    setStage('write');
    setBurdenText('');
    setBurnProgress(0);
    setExhaleCountdown(6);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#1d2924]">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-xs font-semibold text-[#8b5a2b] hover:text-[#5c3a1b] flex items-center gap-1 p-1.5 rounded-lg hover:bg-orange-50 transition-all"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          <span>{soundEnabled ? 'Sonido de leña' : 'Silencio'}</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#180902] via-[#2f1105] to-[#451806] text-white p-6 shadow-xl border-2 border-[#e67e22]/50 text-center">
        {/* Ambient ember glow */}
        <div className="w-48 h-48 rounded-full bg-[#f39c12]/20 blur-3xl absolute -top-10 -left-10 pointer-events-none" />
        <div className="w-48 h-48 rounded-full bg-[#e74c3c]/20 blur-3xl absolute -bottom-10 -right-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#f39c12] mb-3 shadow-[0_0_25px_rgba(243,156,18,0.6)] group">
            <img
              src={fireTransmutationGif}
              alt="Fuego Sagrado Alquímico"
              className="w-full h-full object-cover scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#f8b26a] block">
            RITUAL SOMÁTICO DE TRANSMUTACIÓN
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-white mt-1">
            El Fuego Alquímico: Deshacer Cargas
          </h1>
          <p className="text-xs text-[#f6d5bd] max-w-sm mt-1.5 leading-relaxed">
            Tu cuerpo no fue creado para almacenar culpas, reclamos viejos ni miedos ajenos. Expresa con honestidad lo que te asfixia y mira cómo el fuego sagrado lo quema hasta la última ceniza.
          </p>
        </div>
      </div>

      {/* STAGE 1: WRITE OR SPEAK */}
      {stage === 'write' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick options */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#144436] px-1 block">
              ¿Qué pesa hoy en tu cuerpo? (Toca uno o escribe el tuyo)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_BURDENS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setBurdenText(item)}
                  className="text-left text-xs p-3 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#e67e22] hover:bg-[#fff7f0] transition-all text-[#3c5047]"
                >
                  <span className="font-medium text-[#1c2e27] block">“{item}”</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Area with Voice input */}
          <div className="bg-[#fcfdfa] border-2 border-[#ebd5c8] rounded-3xl p-5 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0e2721] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#e28c46]" />
                <span>Ponlo en palabras sin censura ni juicio:</span>
              </span>

              <button
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-[#0e2721] text-[#ead08f] hover:bg-[#1b4438]'
                }`}
              >
                {isRecording ? <Square className="w-3.5 h-3.5 fill-white" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Detener dictado' : 'Dictar con tu voz'}</span>
              </button>
            </div>

            <textarea
              value={burdenText}
              onChange={(e) => setBurdenText(e.target.value)}
              placeholder="Escribe aquí sin filtros: Me da rabia tener que... Me da pánico equivocarme... Siento culpa por haber dicho no..."
              rows={4}
              className="w-full p-3.5 text-xs rounded-2xl border border-[#d2dfd8] bg-[#f7faf8] focus:bg-white focus:ring-2 focus:ring-[#e28c46]/40 outline-none leading-relaxed text-[#1d2924]"
            />

            <button
              onClick={handleIgnite}
              disabled={!burdenText.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b84a14] via-[#d35400] to-[#f39c12] text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:brightness-105 transition-all disabled:opacity-40 flex items-center justify-center gap-2 group"
            >
              <Flame className="w-5 h-5 text-[#fff275] group-hover:scale-125 transition-transform animate-bounce" />
              <span>Entregar y Quemar en el Fuego Sagrado</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: SPECTACULAR HYPER-REALISTIC BURNING ANIMATION */}
      {stage === 'burning' && (
        <div className="min-h-[420px] rounded-3xl bg-gradient-to-b from-[#140501] via-[#240802] to-[#0a0201] border-2 border-[#e67e22] p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-2xl relative overflow-hidden animate-fadeIn select-none">
          {/* Intense multi-layered burning glow background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff6b00]/30 via-[#d35400]/20 to-transparent animate-pulse pointer-events-none" />

          {/* Floating animated Embers & Sparks */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${(i % 4) + 2}px`,
                  height: `${(i % 4) + 2}px`,
                  backgroundColor: i % 2 === 0 ? '#ffea00' : '#ff5400',
                  left: `${(i * 13) % 94}%`,
                  bottom: `${(i * 7) % 30}%`,
                  boxShadow: '0 0 10px #ff9e00',
                  animation: `emberFly ${(i % 3) + 2}s infinite ease-out`,
                  animationDelay: `${(i * 0.15)}s`,
                }}
              />
            ))}
          </div>

          {/* Top Status */}
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#ffae19] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffea00] animate-spin" />
              <span>EL FUEGO ESTÁ CONSUMIENDO LA CARGA</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ffea00] animate-spin" />
            </span>
            <div className="text-xs font-mono text-[#fcd5b8]">
              {burnProgress < 40
                ? 'Prendiendo las brasas...'
                : burnProgress < 80
                ? 'Desintegrando la culpa y el miedo...'
                : 'Transmutando en ceniza pura y liviandad...'}
            </div>
          </div>

          {/* Burning Parchment Centerpiece */}
          <div className="relative z-10 w-full max-w-sm mx-auto my-4">
            {/* The Parchment being incinerated */}
            <div
              className="relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden shadow-2xl"
              style={{
                backgroundColor: `rgba(${Math.floor(255 - burnProgress * 2.2)}, ${Math.floor(
                  230 - burnProgress * 2.1
                )}, ${Math.floor(190 - burnProgress * 1.8)}, ${1 - burnProgress * 0.008})`,
                borderColor: burnProgress > 30 ? '#ff5400' : '#d2b48c',
                boxShadow: `0 0 ${burnProgress * 0.8 + 15}px rgba(255, 90, 0, ${burnProgress * 0.01 + 0.4})`,
                filter: `contrast(${100 + burnProgress * 1.2}%)`,
              }}
            >
              {/* Flame overlay across parchment */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  background: `linear-gradient(to top, rgba(255, 69, 0, 0.9) 0%, rgba(255, 165, 0, 0.7) ${burnProgress}%, transparent ${Math.min(
                    100,
                    burnProgress + 25
                  )}%)`,
                  opacity: burnProgress > 10 ? 0.9 : 0.2,
                }}
              />

              {/* Burning Edge simulation */}
              <div
                className="absolute left-0 right-0 h-4 pointer-events-none"
                style={{
                  bottom: `${burnProgress}%`,
                  background: 'radial-gradient(circle, #fff700 0%, #ff3b00 60%, transparent 100%)',
                  filter: 'blur(3px)',
                  boxShadow: '0 0 15px #ff4500',
                }}
              />

              <div className="relative z-10 space-y-2">
                <span
                  className="text-[9px] uppercase font-mono tracking-widest block font-bold transition-colors"
                  style={{ color: burnProgress > 50 ? '#ffffff' : '#8b4513' }}
                >
                  CARGA REGISTRADA
                </span>

                <p
                  className="text-base font-serif italic leading-relaxed transition-all duration-300"
                  style={{
                    color: burnProgress > 60 ? '#ffea75' : '#2b1b17',
                    textDecoration: burnProgress > 25 ? 'line-through' : 'none',
                    opacity: Math.max(0.1, 1 - burnProgress * 0.012),
                    filter: burnProgress > 40 ? `blur(${burnProgress * 0.04}px)` : 'none',
                    transform: `scale(${1 - burnProgress * 0.002})`,
                  }}
                >
                  "{burdenText}"
                </p>
              </div>
            </div>

            {/* Realistic Flames GIF Graphic */}
            <div className="flex justify-center -mt-8 relative z-20">
              <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden border border-[#f39c12]/60 shadow-[0_0_35px_rgba(255,107,0,0.8)]">
                <img
                  src={fireTransmutationGif}
                  alt="Llamas de transmutación"
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Burn Progress Bar with Ember spark */}
          <div className="relative z-10 w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono font-bold text-[#ffb066]">
              <span>Cenizas: {burnProgress}%</span>
              <span>Liberación celular</span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-[#e67e22]/60 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#b84a14] via-[#ff6b00] to-[#ffd000] shadow-[0_0_12px_#ff7700] transition-all duration-100"
                style={{ width: `${burnProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: RELEASED AND SOMATIC SIGH */}
      {stage === 'released' && (
        <div className="min-h-[380px] rounded-3xl bg-gradient-to-b from-[#081a15] via-[#0e2721] to-[#153a30] border-2 border-[#c5a059] p-8 flex flex-col items-center justify-center text-center text-white shadow-2xl relative overflow-hidden animate-fadeIn space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#ead08f]/20 border border-[#ead08f]/50 flex items-center justify-center text-3xl text-[#ead08f] shadow-inner">
            🌿
          </div>

          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#ead08f]">
              ALQUIMIA COMPLETADA
            </span>
            <h2 className="text-2xl font-serif font-extrabold text-white">
              Se ha vuelto humo. Ya no te pertenece.
            </h2>
            <p className="text-xs text-[#cfe1d9] leading-relaxed">
              Lo que cargabas fue real y tuvo sentido en su momento, pero ya no tiene permiso de habitar tu cuerpo como veneno ni como tensión muscular.
            </p>
          </div>

          {/* Somatic Exhale Breathing Visualizer */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 max-w-xs w-full space-y-2 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#ead08f] font-bold">
              <Wind className="w-4 h-4 animate-spin" />
              <span>Exhala ahora con un suspiro audible</span>
            </div>
            <p className="text-[11px] text-[#cfe1d9]">
              Baja los hombros, relaja la mandíbula y deja salir todo el aire con sonido "Ahhhh...".
            </p>
            {exhaleCountdown > 0 && (
              <div className="text-2xl font-mono font-bold text-[#ead08f]">
                {exhaleCountdown}s
              </div>
            )}
          </div>

          {!isPremiumUser() && (
            <div className="bg-[#144436]/70 border border-[#c5a059]/40 rounded-2xl p-4 max-w-xs w-full text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#ead08f] font-bold">
                <Sparkles className="w-4 h-4 text-[#ead08f]" />
                <span>Altar de Transmutación Diario</span>
              </div>
              <p className="text-[11px] text-[#cfe1d9] leading-relaxed">
                Has completado tu ritual de fuego de bienvenida. Activa tu Membresía Continuo para transmutaciones y bitácoras sin límites.
              </p>
              {onOpenPremium && (
                <button
                  onClick={onOpenPremium}
                  className="w-full py-2 px-3 rounded-xl bg-[#c5a059] text-[#081a15] font-extrabold text-[11px] shadow-sm hover:bg-[#b58f48] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Activar Membresía ($29.900 COP)</span>
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleReset}
            className="py-3 px-6 rounded-2xl bg-[#ead08f] text-[#081a15] font-extrabold text-xs shadow-md hover:bg-[#deb970] transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Entregar otra carga al fuego</span>
          </button>
        </div>
      )}

      {/* Embedded CSS keyframe for flying embers */}
      <style>{`
        @keyframes emberFly {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-180px) translateX(30px) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
