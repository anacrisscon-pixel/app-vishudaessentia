import React, { useState, useEffect, useRef } from 'react';
import { WeeklyRelease } from '../types';
import { isPremiumUser } from '../utils/storage';
import { audioEngine } from '../utils/audioEngine';
import { soulPillsVoice } from '../utils/soulPillsVoice';
import { SOUL_PILLS_CATALOG } from '../data/soulPills';
import {
  Calendar,
  Lock,
  Play,
  Pause,
  Clock,
  Sparkles,
  Headphones,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  ArrowLeft,
  Volume2,
  Mic,
  Square,
  Trash2,
  Check,
  Radio,
  BookOpen,
  Heart,
  Sliders,
  RotateCcw,
} from 'lucide-react';

interface WeeklyReleasesProps {
  onBack?: () => void;
  onOpenPremium: () => void;
  onExplorePattern?: (patternId: string) => void;
}

export const WeeklyReleases: React.FC<WeeklyReleasesProps> = ({
  onBack,
  onOpenPremium,
  onExplorePattern,
}) => {
  const isPremium = isPremiumUser();
  const [selectedWeek, setSelectedWeek] = useState<WeeklyRelease>(SOUL_PILLS_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<'audio' | 'guion' | 'practica'>('audio');

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [voiceProgressPercent, setVoiceProgressPercent] = useState(0);
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Background ambience selection for voice reading
  const [selectedAmbience, setSelectedAmbience] = useState<string>('/sounds/arroyo-bosque.mp3');

  // Custom recorded or linked audios per week
  const [customAudios, setCustomAudios] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('vishuda_custom_weekly_audios');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Voice recording studio state
  const [showStudio, setShowStudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recTimerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<any>(null);

  const activeAudioSource = customAudios[selectedWeek.id] || selectedWeek.audioUrl;

  useEffect(() => {
    return () => {
      soulPillsVoice.stop();
      audioEngine.stop();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  // Handle switching pills
  const handleSelectPill = (pill: WeeklyRelease) => {
    if (selectedWeek.id === pill.id) return;
    soulPillsVoice.stop();
    audioEngine.stop();
    if (audioElementRef.current) audioElementRef.current.pause();
    setIsPlaying(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setVoiceProgressPercent(0);
    setSelectedWeek(pill);
  };

  // Toggle playback: User recorded audio vs. Soul Voice Narrator (Voz de Alma)
  const handleTogglePlay = (pill: WeeklyRelease = selectedWeek) => {
    const isAccessible = pill.isUnlocked || isPremium;
    if (!isAccessible) {
      onOpenPremium();
      return;
    }

    // If user has uploaded or recorded their own voice for this week:
    const customSource = customAudios[pill.id] || pill.audioUrl;

    if (customSource) {
      if (isPlaying) {
        if (audioElementRef.current) audioElementRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true);
      } else {
        soulPillsVoice.stop();
        if (audioElementRef.current) {
          audioElementRef.current.src = customSource;
          audioElementRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
        setIsPaused(false);
      }
      return;
    }

    // Default: Play via Soul Voice Narrator ("Voz de Alma")
    if (isPlaying) {
      if (isPaused) {
        soulPillsVoice.resume();
        setIsPaused(false);
      } else {
        soulPillsVoice.pause();
        setIsPaused(true);
      }
    } else {
      if (audioElementRef.current) audioElementRef.current.pause();
      const chunks = soulPillsVoice.prepareFullScript(pill.fullScript || pill.description);
      setTotalSegments(chunks.length);
      setIsPlaying(true);
      setIsPaused(false);
      setElapsedSeconds(0);

      soulPillsVoice.playScript(chunks, selectedAmbience, (state) => {
        setIsPlaying(state.isPlaying);
        setIsPaused(state.isPaused);
        setVoiceProgressPercent(state.progressPercent);
        setCurrentSegmentIdx(state.currentSegmentIndex);
        setTotalSegments(state.totalSegments);
      });

      // Local timer for visual counter
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopVoice = () => {
    soulPillsVoice.stop();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setIsPlaying(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setVoiceProgressPercent(0);
  };

  // Recording controls
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mr.start(200);
      setIsRecording(true);
      setRecSeconds(0);

      recTimerRef.current = setInterval(() => {
        setRecSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Por favor autoriza el micrófono para grabar tu píldora de voz.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recTimerRef.current) clearInterval(recTimerRef.current);
    }
  };

  const saveRecordedAudioToWeek = () => {
    const toSave = recordedBlobUrl || customUrlInput.trim();
    if (!toSave) return;

    const updated = { ...customAudios, [selectedWeek.id]: toSave };
    setCustomAudios(updated);
    try {
      localStorage.setItem('vishuda_custom_weekly_audios', JSON.stringify(updated));
    } catch {}

    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3000);
  };

  const removeCustomAudio = (weekId: string) => {
    const updated = { ...customAudios };
    delete updated[weekId];
    setCustomAudios(updated);
    try {
      localStorage.setItem('vishuda_custom_weekly_audios', JSON.stringify(updated));
    } catch {}
    if (isPlaying) {
      handleStopVoice();
    }
  };

  const totalDurationSecs = selectedWeek.durationMinutes * 60;
  const progressPercent = activeAudioSource
    ? Math.min(100, Math.max(0, (elapsedSeconds / totalDurationSecs) * 100))
    : voiceProgressPercent;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-[#1d2924]">
      {/* Top Breadcrumb */}
      {onBack && (
        <button
          onClick={() => {
            handleStopVoice();
            onBack();
          }}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#d2dfd8] shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c221c] via-[#143e32] to-[#1a4f3f] text-white p-6 shadow-xl border-2 border-[#c5a059]">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#ead08f]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 rounded-full bg-[#ead08f] text-[#081a15] shadow-xs">
              PÍLDORAS DEL ALMA
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#ead08f] font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ciclo 1 · 8 Píldoras</span>
            </div>
          </div>

          <h1 className="text-2xl font-serif font-bold text-white leading-snug">
            Voz Íntima & Sabiduría Semanal
          </h1>
          <p className="text-xs text-[#cfe1d9] leading-relaxed max-w-xl">
            Narraciones de 4 a 6 minutos con ritmo pausado, cálido y confidente. Cada píldora nombra lo invisible para que tu sistema nervioso pueda soltar la guardia.
          </p>
        </div>
      </div>

      {/* ACTIVE PILL PLAYER & STUDIO */}
      <div className="bg-[#fcfdfa] border-2 border-[#144436] rounded-3xl p-5 sm:p-6 shadow-lg space-y-5">
        {/* Week / Pill Badge Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#e4ede8] text-[#144436] uppercase tracking-wider">
              Semana {selectedWeek.weekNumber} · Píldora {selectedWeek.pillNumber || selectedWeek.weekNumber}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ead08f]/30 text-[#67511c]">
              {selectedWeek.tag}
            </span>
          </div>

          <span className="text-xs font-semibold text-[#556961] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {selectedWeek.durationMinutes} min
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0c221c]">
            {selectedWeek.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#52665e] mt-1">
            {selectedWeek.subtitle}
          </p>
        </div>

        {/* Hidden Audio element for custom recorded or uploaded audios */}
        <audio
          ref={audioElementRef}
          onTimeUpdate={(e) => setElapsedSeconds(Math.floor(e.currentTarget.currentTime))}
          onEnded={() => {
            setIsPlaying(false);
            setIsPaused(false);
          }}
          className="hidden"
        />

        {/* VOICE PLAYER BOX */}
        <div className="bg-gradient-to-r from-[#0c221c] via-[#143e32] to-[#184a3b] rounded-2xl p-5 text-white shadow-md space-y-4 border border-[#c5a059]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ead08f] animate-ping" />
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#ead08f]">
                {activeAudioSource ? '🎙️ Tu Voz Grabada de Alma' : '🎙️ Voz Guiada: Alma (Ritmo Íntimo & Pausado)'}
              </span>
            </div>

            {isPlaying && !isPaused && (
              <span className="text-[11px] text-[#cfe1d9] font-mono flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#ead08f]" />
                <span>Narrando...</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={() => handleTogglePlay(selectedWeek)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ead08f] to-[#c5a059] text-[#0c221c] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
              title={isPlaying && !isPaused ? 'Pausar narración' : 'Escuchar píldora con Voz de Alma'}
            >
              {isPlaying && !isPaused ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            {/* Stop / Reset Button */}
            {isPlaying && (
              <button
                onClick={handleStopVoice}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Detener voz"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Track Info & Progress Bar */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <b className="text-sm text-white block truncate">
                {selectedWeek.audioTitle}
              </b>
              <p className="text-[11px] text-[#cfe1d9] truncate">
                {activeAudioSource
                  ? 'Audio exclusivo vinculado'
                  : 'Voz suave con pausas reales de reflexión (3-4s)'}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#ead08f] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(4, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#cfe1d9] font-mono px-1">
            <span>{formatTimer(elapsedSeconds)}</span>
            {!activeAudioSource && totalSegments > 0 && (
              <span className="text-[10px] text-[#ead08f]">
                Párrafo {currentSegmentIdx + 1} de {totalSegments}
              </span>
            )}
            <span>{selectedWeek.durationMinutes}:00 min</span>
          </div>

          {/* Ambient Background Audio Selector (when using Speech Synth) */}
          {!activeAudioSource && (
            <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-[#cfe1d9] flex items-center gap-1">
                <span>Música de fondo:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Arroyo', url: '/sounds/arroyo-bosque.mp3' },
                  { name: 'Cuencos', url: '/sounds/cuencos-tibetanos.mp3' },
                  { name: 'Aves', url: '/sounds/canto-aves-bosque.mp3' },
                  { name: 'Lluvia', url: '/sounds/lluvia-profunda.mp3' },
                  { name: 'Mantra', url: '/sounds/om-namah-shivaya.mp3' },
                ].map((sound) => (
                  <button
                    key={sound.name}
                    onClick={() => setSelectedAmbience(sound.url)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                      selectedAmbience === sound.url
                        ? 'bg-[#ead08f] text-[#0c221c]'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {sound.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TAB CONTROLS: AUDIO VS GUION COMPLETO VS PRÁCTICA */}
        <div className="flex border-b border-[#d2dfd8] gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('audio')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'border-[#144436] text-[#144436]'
                : 'border-transparent text-[#62776e] hover:text-[#144436]'
            }`}
          >
            Escuchar & Reflexión
          </button>

          <button
            onClick={() => setActiveTab('guion')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guion'
                ? 'border-[#144436] text-[#144436]'
                : 'border-transparent text-[#62776e] hover:text-[#144436]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guion Completo ({selectedWeek.durationMinutes} min)</span>
          </button>

          <button
            onClick={() => setActiveTab('practica')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'practica'
                ? 'border-[#144436] text-[#144436]'
                : 'border-transparent text-[#62776e] hover:text-[#144436]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Práctica Semanal</span>
          </button>
        </div>

        {/* TAB CONTENT: AUDIO / OVERVIEW */}
        {activeTab === 'audio' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Key Quote Box */}
            <blockquote className="border-l-4 border-[#c5a059] pl-4 py-2 font-serif italic text-sm sm:text-base text-[#0e2721] bg-[#f5f9f7] rounded-r-2xl">
              "{selectedWeek.keyQuote}"
            </blockquote>

            {/* Description */}
            <div className="text-xs sm:text-sm text-[#3f524a] leading-relaxed space-y-2">
              <p>{selectedWeek.description}</p>
            </div>

            {/* Micro action box */}
            <div className="bg-[#eaf3ef] border border-[#bcd7cb] rounded-2xl p-4 text-xs sm:text-sm text-[#144436] space-y-1.5">
              <b className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#144436]">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                Micro-práctica de esta semana
              </b>
              <p className="leading-relaxed">{selectedWeek.actionTip}</p>
            </div>
          </div>
        )}

        {/* TAB CONTENT: GUION COMPLETO (Texto Íntegro con pausas indicadas) */}
        {activeTab === 'guion' && (
          <div className="space-y-4 animate-fadeIn bg-[#faf8f5] p-5 rounded-2xl border border-[#ded5c2] text-xs sm:text-sm leading-relaxed text-[#2c3d36]">
            <div className="flex items-center justify-between pb-2 border-b border-[#ded5c2]/60">
              <span className="text-[11px] font-bold text-[#8a723e] uppercase tracking-wider">
                Guion Oficial de Grabación · Voz de Alma
              </span>
              <button
                onClick={() => handleTogglePlay(selectedWeek)}
                className="text-xs font-bold text-[#144436] bg-white px-3 py-1 rounded-full border border-[#bcd7cb] flex items-center gap-1 hover:bg-[#eaf3ef] cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Pausar' : 'Leer en voz alta'}</span>
              </button>
            </div>

            {/* Fixed Intro Reminder */}
            <div className="p-3 bg-[#eef5f1] rounded-xl border border-[#cfe1d9] text-[11px] text-[#1b5e4b] italic">
              <b>Intro fija:</b> "Hola, soy Alma... qué bueno que llegaste hasta aquí. Esta es tu píldora de esta semana. Busca un momento tuyo, uno solo, donde nadie te necesite por unos minutos... y quédate conmigo."
            </div>

            {/* Full Script Paragraphs */}
            <div className="space-y-3 whitespace-pre-line font-serif text-[13px] sm:text-[14px] leading-relaxed">
              {selectedWeek.fullScript?.split('[pausa larga]').map((section, idx, arr) => (
                <React.Fragment key={idx}>
                  <p>{section.trim()}</p>
                  {idx < arr.length - 1 && (
                    <div className="my-2 py-1.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f0e6ce] text-[#7a5d1f] text-[10px] font-mono font-bold tracking-wider">
                        <span>[ 3-4 segundos de silencio somático ]</span>
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Fixed Outro Reminder */}
            <div className="p-3 bg-[#eef5f1] rounded-xl border border-[#cfe1d9] text-[11px] text-[#1b5e4b] italic">
              <b>Outro fija:</b> "Gracias por darte este espacio hoy. Lo que acabamos de nombrar ya no es invisible... y eso, aunque no lo sientas todavía, ya es sanación. Nos escuchamos la próxima semana... te voy a estar esperando aquí."
            </div>
          </div>
        )}

        {/* TAB CONTENT: PRÁCTICA */}
        {activeTab === 'practica' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-[#f5ede0] border border-[#c5a059]/50 text-[#4c3614] space-y-2 text-xs sm:text-sm">
              <b className="text-base font-serif font-bold text-[#3d2c0e] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#c5a059]" />
                <span>Ejercicio de Integración Somática</span>
              </b>
              <p className="leading-relaxed">{selectedWeek.actionTip}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#d2dfd8] text-xs space-y-2">
              <b className="font-bold text-[#0c221c] block">
                ¿Cómo acompañar esta píldora durante la semana?
              </b>
              <ul className="list-disc pl-4 space-y-1 text-[#556961]">
                <li>Escúchala el lunes por la mañana o antes de acostarte.</li>
                <li>Vuelve a escucharla el jueves si sientes que la mente vuelve al viejo patrón.</li>
                <li>Acompáñala sacando tu carta del oráculo en el inicio.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ESTUDIO DE GRABACIÓN PARA PERSONALIZAR (Subir tu propio audio real) */}
        <div className="bg-[#f5f9f7] border border-[#bcd7cb] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#144436]" />
              <b className="text-xs font-bold text-[#0e2721]">
                ¿Grabaste tu propia voz para esta píldora?
              </b>
            </div>
            <button
              onClick={() => setShowStudio(!showStudio)}
              className="text-[11px] font-bold text-[#144436] hover:underline cursor-pointer"
            >
              {showStudio ? 'Cerrar estudio' : 'Grabar con micrófono o subir enlace'}
            </button>
          </div>

          {activeAudioSource && !showStudio && (
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#d0e2d9] text-xs">
              <span className="text-[#1b5e4b] font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tu audio propio está activo para esta píldora</span>
              </span>
              <button
                onClick={() => removeCustomAudio(selectedWeek.id)}
                className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer text-[11px] font-semibold"
                title="Eliminar audio personalizado y volver a la Voz de Alma"
              >
                Volver a Voz de Alma
              </button>
            </div>
          )}

          {showStudio && (
            <div className="space-y-3 pt-2 border-t border-[#d2dfd8]">
              <p className="text-[11px] text-[#556961] leading-relaxed">
                Si grabas el guion con tu celular o micrófono, puedes guardarlo aquí para que reemplace la voz sintética por tu voz humana real:
              </p>

              {/* Recorder Controls */}
              <div className="bg-white p-3 rounded-xl border border-[#d2dfd8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={isRecording ? stopRecordingAudio : startRecordingAudio}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#0e2721] text-[#ead08f] hover:bg-[#184236]'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-4 h-4 fill-white" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                  <div>
                    <b className="text-xs text-[#0e2721] block">
                      {isRecording ? 'Grabando tu voz...' : 'Toca el micrófono para grabar'}
                    </b>
                    <span className="text-[10px] text-[#556961]">
                      {isRecording ? `${recSeconds}s transcurridos` : 'Grabación directa en alta fidelidad'}
                    </span>
                  </div>
                </div>

                {recordedBlobUrl && !isRecording && (
                  <button
                    onClick={saveRecordedAudioToWeek}
                    className="px-3 py-1.5 rounded-xl bg-[#144436] text-[#ead08f] font-bold text-xs hover:bg-[#0e2721] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar audio</span>
                  </button>
                )}
              </div>

              {recordedBlobUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#144436]">Escuchar previa grabada:</span>
                  <audio src={recordedBlobUrl} controls className="w-full h-8" />
                </div>
              )}

              {/* Or paste custom URL */}
              <div className="pt-1 flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="O pega enlace de audio (Dropbox, Drive público, MP3)..."
                  className="flex-1 p-2 text-xs rounded-xl border border-[#d2dfd8] bg-white outline-none focus:border-[#144436]"
                />
                <button
                  onClick={saveRecordedAudioToWeek}
                  disabled={!customUrlInput.trim()}
                  className="px-3 py-1.5 rounded-xl bg-[#0e2721] disabled:opacity-40 text-white font-bold text-xs hover:bg-[#183f35] cursor-pointer"
                >
                  Asignar URL
                </button>
              </div>

              {savedSuccessMsg && (
                <div className="p-2 bg-emerald-100 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Audio guardado exitosamente para la Píldora {selectedWeek.pillNumber || selectedWeek.weekNumber}!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CATALOG TIMELINE OF ALL 8 PILLS (4 WEEKS) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4f645b]">
            Ciclo 1: Las 8 Píldoras del Alma (4 Semanas)
          </h3>
          <span className="text-[11px] font-semibold text-[#144436]">
            8 Guiones Disponibles
          </span>
        </div>

        <div className="space-y-2.5">
          {SOUL_PILLS_CATALOG.map((pill) => {
            const isAccessible = pill.isUnlocked || isPremium;
            const isSelected = selectedWeek.id === pill.id;

            return (
              <div
                key={pill.id}
                onClick={() => {
                  if (isAccessible) {
                    handleSelectPill(pill);
                  } else {
                    onOpenPremium();
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                  isSelected
                    ? 'bg-[#eaf3ef] border-[#144436] ring-2 ring-[#144436]/40'
                    : isAccessible
                    ? 'bg-[#fcfdfa] border-[#d2dfd8] hover:border-[#144436]'
                    : 'bg-[#f0f4f2]/80 border-[#d2dfd8] opacity-80'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-xs ${
                      isSelected
                        ? 'bg-[#144436] text-[#ead08f]'
                        : isAccessible
                        ? 'bg-[#f0ede6] text-[#144436]'
                        : 'bg-[#d0dfd8] text-[#556961]'
                    }`}
                  >
                    {isSelected && isPlaying ? (
                      <Volume2 className="w-5 h-5 text-[#ead08f] animate-pulse" />
                    ) : isAccessible ? (
                      <Headphones className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b5e4b]">
                        Semana {pill.weekNumber} · Píldora {pill.pillNumber}
                      </span>
                      {pill.isNew && (
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#ead08f] text-[#0e2721]">
                          ACTUAL
                        </span>
                      )}
                    </div>
                    <b className="text-xs sm:text-sm font-bold text-[#0e2721] block truncate mt-0.5">
                      {pill.title}
                    </b>
                    <span className="text-[11px] text-[#556961] block truncate">
                      {pill.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                  <span className="text-[11px] font-mono text-[#556961]">
                    {pill.durationMinutes}m
                  </span>
                  {isAccessible ? (
                    <ChevronRight className="w-4 h-4 text-[#144436]" />
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0e2721] text-[#ead08f]">
                      $29.900
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
