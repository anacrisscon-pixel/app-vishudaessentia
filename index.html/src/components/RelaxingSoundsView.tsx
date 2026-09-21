import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Clock,
  ArrowLeft,
  Waves,
  Trees,
  Moon,
  CloudRain,
  Bird,
  Bell,
  Sparkles,
  Download,
  Share2,
  Heart,
  Sliders,
} from 'lucide-react';

export interface RelaxingSoundTrack {
  id: string;
  title: string;
  subtitle: string;
  category: 'naturaleza' | 'meditacion' | 'noche';
  categoryLabel: string;
  durationFormatted: string;
  durationSeconds: number;
  description: string;
  audioSrc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  colorScheme: {
    bgGradient: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
    border: string;
  };
}

export const RELAXING_TRACKS: RelaxingSoundTrack[] = [
  {
    id: 'arroyo-bosque',
    title: 'Arroyo del Bosque',
    subtitle: 'Agua pura sobre piedras & brisa entre las hojas',
    category: 'naturaleza',
    categoryLabel: 'Naturaleza & Agua',
    durationFormatted: '03:55',
    durationSeconds: 235,
    description: 'El susurro continuo y fresco del agua cristalina fluyendo. Calma la sobrecarga sensorial y descontractura la mente.',
    audioSrc: '/sounds/arroyo-bosque.mp3',
    icon: Trees,
    tag: 'Fresco & Calmo',
    colorScheme: {
      bgGradient: 'from-[#082018] via-[#0d2e23] to-[#164436]',
      badgeBg: 'bg-[#184d3d]',
      badgeText: 'text-[#cfe1d9]',
      accent: '#a8d5be',
      border: 'border-[#32705b]/40',
    },
  },
  {
    id: 'canto-aves-bosque',
    title: 'Canto de Aves en el Bosque',
    subtitle: 'Trinos silvestres matutinos & atmósfera viva',
    category: 'naturaleza',
    categoryLabel: 'Amanecer & Presencia',
    durationFormatted: '02:08',
    durationSeconds: 128,
    description: 'Melodías naturales grabadas en un bosque sereno al amanecer. Estimula la presencia suave y la ligereza del pecho.',
    audioSrc: '/sounds/canto-aves-bosque.mp3',
    icon: Bird,
    tag: 'Vitalidad Serena',
    colorScheme: {
      bgGradient: 'from-[#17251c] via-[#20392b] to-[#2c4e3b]',
      badgeBg: 'bg-[#29503b]',
      badgeText: 'text-[#d6ebd9]',
      accent: '#c8e6c9',
      border: 'border-[#4a775d]/40',
    },
  },
  {
    id: 'cuencos-tibetanos',
    title: 'Cuencos Tibetanos & Campana',
    subtitle: 'Frecuencia armónica & resonancia sagrada',
    category: 'meditacion',
    categoryLabel: 'Meditación & Frecuencia',
    durationFormatted: '00:26',
    durationSeconds: 26,
    description: 'Sonido profundo de cuenco y campana tibetana con ricos sobretonos. Ideal para aquietar el ruido mental y volver al centro.',
    audioSrc: '/sounds/cuencos-tibetanos.mp3',
    icon: Bell,
    tag: 'Silencio Interior',
    colorScheme: {
      bgGradient: 'from-[#1f190c] via-[#332610] to-[#453415]',
      badgeBg: 'bg-[#473412]',
      badgeText: 'text-[#ead08f]',
      accent: '#ead08f',
      border: 'border-[#c5a059]/40',
    },
  },
  {
    id: 'grillos-noche',
    title: 'Grillos de Noche & Paz Estelar',
    subtitle: 'Manto nocturno & campo abierto',
    category: 'noche',
    categoryLabel: 'Noche & Descanso',
    durationFormatted: '02:57',
    durationSeconds: 177,
    description: 'Serenata constante y envolvente de grillos bajo un cielo despejado. Induce el descanso profundo y la conciliación del sueño.',
    audioSrc: '/sounds/grillos-noche.mp3',
    icon: Moon,
    tag: 'Sueño Reparador',
    colorScheme: {
      bgGradient: 'from-[#07131b] via-[#0d2230] to-[#153448]',
      badgeBg: 'bg-[#153a50]',
      badgeText: 'text-[#c6e1f0]',
      accent: '#90caf9',
      border: 'border-[#2d5f7f]/40',
    },
  },
  {
    id: 'lluvia-profunda',
    title: 'Lluvia Profunda & Gotas Suaves',
    subtitle: 'Gotas limpias sobre la tierra & cobijo somático',
    category: 'naturaleza',
    categoryLabel: 'Lluvia Somática',
    durationFormatted: '00:33',
    durationSeconds: 33,
    description: 'El sonido rítmico de la lluvia cayendo suavemente. Lava tensiones, reduce la hiperactivación y brinda seguridad.',
    audioSrc: '/sounds/lluvia-profunda.mp3',
    icon: CloudRain,
    tag: 'Purificación & Calma',
    colorScheme: {
      bgGradient: 'from-[#0f1d24] via-[#162c37] to-[#203e4d]',
      badgeBg: 'bg-[#1e4152]',
      badgeText: 'text-[#cce4ef]',
      accent: '#81d4fa',
      border: 'border-[#386b85]/40',
    },
  },
  {
    id: 'olas-oceano',
    title: 'Olas del Océano & Marea Calma',
    subtitle: 'Vaivén rítmico & flujo respiratorio',
    category: 'naturaleza',
    categoryLabel: 'Océano & Fluidez',
    durationFormatted: '02:26',
    durationSeconds: 146,
    description: 'El flujo y reflujo constante de las olas en la costa. Ayuda al cuerpo a sincronizar su respiración natural sin esfuerzo.',
    audioSrc: '/sounds/olas-oceano.mp3',
    icon: Waves,
    tag: 'Ritmo Orgánico',
    colorScheme: {
      bgGradient: 'from-[#071b1e] via-[#0e2d33] to-[#15424b]',
      badgeBg: 'bg-[#164a54]',
      badgeText: 'text-[#c7e9ee]',
      accent: '#80deea',
      border: 'border-[#2f6f7d]/40',
    },
  },
  {
    id: 'om-namah-shivaya',
    title: 'Mantra Sagrado: Om Namah Shivaya',
    subtitle: 'Voz milenaria & devoción interior (9:59 min)',
    category: 'meditacion',
    categoryLabel: 'Mantra & Voz Sagrada',
    durationFormatted: '09:59',
    durationSeconds: 599,
    description: 'El gran mantra de transmutación y paz de Vishuda. La vibración de la voz que disuelve el miedo y abre el chakra de la garganta.',
    audioSrc: '/sounds/om-namah-shivaya.mp3',
    icon: Sparkles,
    tag: 'Voz & Consciencia',
    colorScheme: {
      bgGradient: 'from-[#1a1126] via-[#2a1740] to-[#3a1d59]',
      badgeBg: 'bg-[#3b1c5c]',
      badgeText: 'text-[#ead08f]',
      accent: '#d8b4fe',
      border: 'border-[#c5a059]/50',
    },
  },
];

interface RelaxingSoundsViewProps {
  onBack: () => void;
}

export const RelaxingSoundsView: React.FC<RelaxingSoundsViewProps> = ({ onBack }) => {
  const [activeTrackId, setActiveTrackId] = useState<string>(RELAXING_TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(RELAXING_TRACKS[0].durationSeconds);
  const [volume, setVolume] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'naturaleza' | 'meditacion' | 'noche'>('todos');
  
  // Sleep timer in minutes: 0 = disabled
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState<number | null>(null);

  // Somatic breathing helper toggle
  const [showBreathingGuide, setShowBreathingGuide] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhala' | 'retiene' | 'exhala'>('inhala');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepIntervalRef = useRef<any>(null);

  const activeTrack = RELAXING_TRACKS.find((t) => t.id === activeTrackId) || RELAXING_TRACKS[0];

  // Initialize or update audio src
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(activeTrack.audioSrc);
    } else {
      const wasPlaying = isPlaying;
      audioRef.current.src = activeTrack.audioSrc;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (wasPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }

    audioRef.current.loop = isLooping;
    audioRef.current.volume = isMuted ? 0 : volume;

    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      } else {
        setDuration(activeTrack.durationSeconds);
      }
    };

    const onEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    const onError = (e: any) => {
      console.warn('Audio playback error:', e);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [activeTrackId]);

  // Handle loop mode
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Handle volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sleep timer logic
  useEffect(() => {
    if (sleepTimerMinutes > 0) {
      setSleepTimerSecondsLeft(sleepTimerMinutes * 60);
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);

      sleepIntervalRef.current = setInterval(() => {
        setSleepTimerSecondsLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(sleepIntervalRef.current);
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
            setSleepTimerMinutes(0);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSleepTimerSecondsLeft(null);
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    }

    return () => {
      if (sleepIntervalRef.current) clearInterval(sleepIntervalRef.current);
    };
  }, [sleepTimerMinutes]);

  // Somatic Breathing rhythm: 4s inhale, 4s hold, 6s exhale
  useEffect(() => {
    if (!showBreathingGuide || !isPlaying) return;

    let timer: any;
    const cycle = () => {
      setBreathPhase('inhala');
      timer = setTimeout(() => {
        setBreathPhase('retiene');
        timer = setTimeout(() => {
          setBreathPhase('exhala');
          timer = setTimeout(() => {
            cycle();
          }, 6000);
        }, 4000);
      }, 4000);
    };

    cycle();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showBreathingGuide, isPlaying]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleSelectTrack = (track: RelaxingSoundTrack) => {
    if (track.id === activeTrackId) {
      togglePlay();
      return;
    }
    setActiveTrackId(track.id);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    setCurrentTime(nextTime);
    if (audioRef.current) {
      audioRef.current.currentTime = nextTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTracks = RELAXING_TRACKS.filter((t) => {
    if (selectedCategory === 'todos') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn text-[#1f2b33]">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-[#d2dfd8] shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <span className="text-[11px] font-bold text-[#8a723e] bg-[#f8f2e2] px-3 py-1 rounded-full border border-[#ead08f]/50">
          7 Sonidos Reales
        </span>
      </div>

      {/* Main Title Banner */}
      <div className="bg-gradient-to-br from-[#0c221c] via-[#143e32] to-[#1a4f3f] rounded-3xl p-6 text-white shadow-xl border-2 border-[#c5a059] relative overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-[#ead08f]/10 pointer-events-none blur-2xl" />

        <div className="relative z-10 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ead08f]/20 border border-[#ead08f]/40 text-[#ead08f] text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oasis Somático · Audio Terapéutico</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Sonidos Relajantes
          </h1>

          <p className="text-xs sm:text-sm text-[#cfe1d9] leading-relaxed max-w-lg">
            7 paisajes sonoros reales y grabaciones de alta fidelidad para regular tu sistema nervioso, pausar la rumiación mental y acompañar tu respiración.
          </p>
        </div>
      </div>

      {/* ACTIVE SOUND MASTER PLAYER (Hero Card) */}
      <div className={`rounded-3xl p-5 sm:p-6 text-white shadow-2xl border-2 transition-all duration-500 relative overflow-hidden bg-gradient-to-br ${activeTrack.colorScheme.bgGradient} ${activeTrack.colorScheme.border}`}>
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Track metadata badge row */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider ${activeTrack.colorScheme.badgeBg} ${activeTrack.colorScheme.badgeText}`}>
              {activeTrack.categoryLabel}
            </span>

            {/* Equalizer animation when playing */}
            {isPlaying ? (
              <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-white/15">
                <span className="w-1 h-3.5 bg-[#ead08f] animate-pulse rounded-full" />
                <span className="w-1 h-5 bg-[#ead08f] animate-bounce rounded-full" />
                <span className="w-1 h-2 bg-[#ead08f] animate-pulse rounded-full" />
                <span className="text-[10px] font-bold text-[#ead08f] ml-1">Reproduciendo</span>
              </div>
            ) : (
              <span className="text-[10px] text-white/60 bg-black/30 px-2.5 py-1 rounded-full border border-white/10">
                En pausa
              </span>
            )}
          </div>

          {/* Track Title & Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
              {activeTrack.title}
            </h2>
            <p className="text-xs text-[#cfe1d9] mt-0.5">
              {activeTrack.subtitle}
            </p>
            <p className="text-xs text-white/80 leading-relaxed mt-2 bg-black/25 p-3 rounded-2xl border border-white/10">
              🌿 {activeTrack.description}
            </p>
          </div>

          {/* Timeline & Scrubber */}
          <div className="space-y-1.5 pt-1">
            <input
              type="range"
              min={0}
              max={duration || activeTrack.durationSeconds}
              step={0.5}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-[#ead08f] cursor-pointer h-2 bg-white/20 rounded-lg"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[#cfe1d9]">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(duration || activeTrack.durationSeconds)}</span>
            </div>
          </div>

          {/* Master Control Buttons */}
          <div className="flex items-center justify-between pt-2">
            {/* Loop Toggle */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                isLooping
                  ? 'bg-[#ead08f] text-[#0c221c] border-[#ead08f] shadow-md font-bold'
                  : 'bg-white/10 text-white/70 border-white/20 hover:text-white'
              }`}
              title="Repetir en bucle continuo sin pausa"
            >
              <Repeat className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">Bucle {isLooping ? 'Activo' : 'Desactivado'}</span>
            </button>

            {/* Restart Button */}
            <button
              onClick={handleRestart}
              className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Reiniciar sonido"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Play / Pause Button */}
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-[#ead08f] via-[#f7e4b2] to-[#c5a059] text-[#0c221c] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-[#ead08f]/30"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-0.5" />
              )}
            </button>

            {/* Volume Control Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#ead08f]" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 sm:w-20 accent-[#ead08f] cursor-pointer hidden xs:block"
                title="Volumen"
              />
            </div>
          </div>

          {/* Somatic Breathing Circle Guide Toggle */}
          <div className="pt-2 border-t border-white/15">
            <button
              onClick={() => setShowBreathingGuide(!showBreathingGuide)}
              className="w-full py-2 px-3 rounded-xl bg-black/30 hover:bg-black/40 border border-white/15 text-xs text-[#ead08f] font-semibold flex items-center justify-between transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-[#ead08f]" />
                <span>{showBreathingGuide ? 'Ocultar guía somática de respiración' : 'Acompañar con respiración guiada'}</span>
              </span>
              <span className="text-[10px] text-white/60">
                {showBreathingGuide ? 'Plegar' : 'Expandir'}
              </span>
            </button>

            {showBreathingGuide && (
              <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/15 text-center space-y-3 animate-fadeIn">
                <span className="text-[11px] font-bold text-[#cfe1d9] uppercase tracking-wider block">
                  Ritmo Somático de Relajación
                </span>

                {/* Animated Pulsing Breathing Circle */}
                <div className="flex justify-center items-center py-2">
                  <div
                    className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-1000 shadow-xl ${
                      breathPhase === 'inhala'
                        ? 'scale-125 border-emerald-400 bg-emerald-500/25 text-white'
                        : breathPhase === 'retiene'
                        ? 'scale-125 border-[#ead08f] bg-[#ead08f]/20 text-[#ead08f]'
                        : 'scale-90 border-teal-400/60 bg-teal-600/15 text-[#cfe1d9]'
                    }`}
                  >
                    <span className="font-bold text-sm uppercase tracking-wide">
                      {breathPhase === 'inhala' && 'Inhala...'}
                      {breathPhase === 'retiene' && 'Sostén...'}
                      {breathPhase === 'exhala' && 'Suelta suave'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#cfe1d9]">
                  Permite que el sonido de {activeTrack.title.toLowerCase()} acune tu pecho mientras sueltas el peso de los hombros.
                </p>
              </div>
            )}
          </div>

          {/* Sleep Timer Bar */}
          <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#cfe1d9] flex items-center gap-1.5 text-[11px] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#ead08f]" />
              <span>Temporizador de apagado:</span>
              {sleepTimerSecondsLeft !== null && (
                <b className="text-[#ead08f] font-mono ml-1">
                  ({formatSeconds(sleepTimerSecondsLeft)})
                </b>
              )}
            </span>

            <div className="flex items-center gap-1">
              {[0, 10, 20, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSleepTimerMinutes(mins)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    sleepTimerMinutes === mins
                      ? 'bg-[#ead08f] text-[#0c221c]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {mins === 0 ? 'Sin límite' : `${mins}m`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CATEGORY PILLS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-[#0c221c]">
            Catálogo de Sonidos Vishuda ({RELAXING_TRACKS.length})
          </h3>
          <span className="text-xs text-[#52665e]">
            Toca cualquiera para escuchar
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'todos', label: 'Todos (7)' },
            { id: 'naturaleza', label: 'Naturaleza (4)' },
            { id: 'noche', label: 'Noche & Descanso (2)' },
            { id: 'meditacion', label: 'Meditación & Mantra (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#144436] text-[#ead08f] shadow-sm'
                  : 'bg-white text-[#52665e] border border-[#d2dfd8] hover:bg-[#faf6ee]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* TRACK LIST CARDS */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTracks.map((track) => {
          const isCurrentActive = track.id === activeTrackId;
          const Icon = track.icon;

          return (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 text-left shadow-xs hover:shadow-md ${
                isCurrentActive
                  ? 'bg-gradient-to-r from-[#0c221c] to-[#153e32] border-[#c5a059] text-white ring-2 ring-[#c5a059]/40'
                  : 'bg-white border-[#ded5c2] hover:border-[#144436] text-[#1f2b33]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Track Icon or Playing State */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform ${
                    isCurrentActive
                      ? 'bg-[#ead08f] text-[#0c221c] border-[#ead08f] scale-105 shadow-md'
                      : 'bg-[#f4efe4] text-[#144436] border-[#d2dfd8]'
                  }`}
                >
                  {isCurrentActive && isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : isCurrentActive ? (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Track Information */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <b
                      className={`text-sm font-bold truncate block ${
                        isCurrentActive ? 'text-[#ead08f]' : 'text-[#0c221c]'
                      }`}
                    >
                      {track.title}
                    </b>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                        isCurrentActive
                          ? 'bg-white/20 text-[#ead08f]'
                          : 'bg-[#eaf4ef] text-[#144436]'
                      }`}
                    >
                      {track.tag}
                    </span>
                  </div>

                  <p
                    className={`text-xs truncate ${
                      isCurrentActive ? 'text-[#cfe1d9]' : 'text-[#52665e]'
                    }`}
                  >
                    {track.subtitle}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-mono ${
                        isCurrentActive ? 'text-white/70' : 'text-[#7d9489]'
                      }`}
                    >
                      ⏱ {track.durationFormatted} min
                    </span>
                    <span
                      className={`text-[10px] ${
                        isCurrentActive ? 'text-[#ead08f]' : 'text-[#8d6f30]'
                      }`}
                    >
                      • {track.categoryLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button Right */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTrack(track);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isCurrentActive && isPlaying
                      ? 'bg-[#ead08f] text-[#0c221c]'
                      : isCurrentActive
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-[#144436] text-[#ead08f] hover:scale-105 shadow-xs'
                  }`}
                  title={isCurrentActive && isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isCurrentActive && isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SOMATIC TIP FOOTER */}
      <div className="p-4 rounded-2xl bg-[#f5ede0] border border-[#c5a059]/40 text-[#554019] space-y-1 text-xs">
        <b className="text-sm font-serif font-bold text-[#3d2c0e] block flex items-center gap-1.5">
          <span>🌿 Cómo utilizar estos sonidos para regularte:</span>
        </b>
        <p className="leading-relaxed text-[11px] text-[#554019]">
          Ponte audífonos, respira suavemente y mantén el sonido en bucle mientras lees tu carta del oráculo, escribes en tu diario o antes de dormir. El cerebro adopta las frecuencias del entorno en menos de 90 segundos.
        </p>
      </div>
    </div>
  );
};
