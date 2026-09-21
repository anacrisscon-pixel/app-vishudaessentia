import React, { useState } from 'react';
import { ViewType, ExplorationData } from '../types';
import { isPremiumUser } from '../utils/storage';
import { VishudaLogo } from './VishudaLogo';
import botanicalMirrorImg from '../assets/images/espejo_botanico_alma_1789823013814.jpg';
import {
  Compass,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Volume2,
  Flame,
  Activity,
  Heart,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface HomeHeroDashboardProps {
  onNavigate: (view: ViewType) => void;
  onStartExploration: (patternId?: string) => void;
  explorations?: ExplorationData[];
  onOpenAi: () => void;
}

const FRIENDLY_MOODS = [
  {
    id: 'calma',
    label: 'Calma',
    desc: 'En paz y centro',
    emoji: '🌿',
    bg: 'bg-[#eaf4ef]',
    text: 'text-[#144436]',
    border: 'border-[#bcdbc9]',
    hint: 'Hermoso momento para sacar tu carta del Oráculo o escuchar Sonidos de Calma.',
  },
  {
    id: 'ansiedad',
    label: 'Ansiedad',
    desc: 'Mente o pecho acelerado',
    emoji: '⚡',
    bg: 'bg-[#fff5e5]',
    text: 'text-[#82531a]',
    border: 'border-[#f2d8a7]',
    hint: 'Te sugerimos hacer el Suspiro Fisiológico de 60s en Mapeo Corporal para calmar tu sistema nervioso.',
  },
  {
    id: 'abrumada',
    label: 'Sobrecarga',
    desc: 'Mucho estrés acumulado',
    emoji: '🌊',
    bg: 'bg-[#e7f3f7]',
    text: 'text-[#194e63]',
    border: 'border-[#bcdde8]',
    hint: 'Cuéntale a Alma lo que sientes o suelta lo que te pesa en el Fuego Sagrado.',
  },
  {
    id: 'triste',
    label: 'Tristeza',
    desc: 'Sensibilidad o desánimo',
    emoji: '🌧️',
    bg: 'bg-[#f4eef9]',
    text: 'text-[#583777]',
    border: 'border-[#dbcaec]',
    hint: 'Es un día para ser compasivo/a contigo. Permítete sentir sin juzgarte.',
  },
  {
    id: 'enojo',
    label: 'Enojo',
    desc: 'Tensión o límites invadidos',
    emoji: '🌋',
    bg: 'bg-[#faeee6]',
    text: 'text-[#8e381b]',
    border: 'border-[#f2beae]',
    hint: 'El enojo protege tus límites. Revisa qué valor tuyo sintió que fue invadido o suelta la carga.',
  },
];

export const HomeHeroDashboard: React.FC<HomeHeroDashboardProps> = ({
  onNavigate,
  onStartExploration,
  explorations = [],
  onOpenAi,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const activeMoodObj = FRIENDLY_MOODS.find((m) => m.id === selectedMood);

  return (
    <div className="space-y-6 pb-14 animate-fadeIn text-[#162922]">
      {/* 1. ENCABEZADO PRINCIPAL - BIENVENIDA CON FONDO VERDE Y LETRAS DORADAS */}
      <div className="rounded-3xl bg-gradient-to-b from-[#13382c] to-[#0c221a] text-[#f2deb0] shadow-md border border-[#c5a059]/40 relative overflow-hidden p-6 sm:p-7 text-center">
        {/* Sacred subtle aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(234,208,143,0.16),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
          {/* Logo Oficial centrado en acabado dorado sagrado */}
          <div className="p-3.5 rounded-2xl bg-[#081813]/70 border border-[#c5a059]/35 shadow-inner">
            <VishudaLogo size="md" showText={true} theme="gold" layout="vertical" />
          </div>

          <div className="max-w-md mx-auto space-y-1 pt-1">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#ead08f] tracking-tight">
              Te damos la bienvenida a Vishuda Essentia
            </h1>
            <p className="text-xs sm:text-sm text-[#e0c995] leading-relaxed">
              Tu espacio para pausar, comprender lo que siente tu cuerpo y recuperar la calma.
            </p>
          </div>
        </div>
      </div>

      {/* 2. ¿CÓMO TE SIENTES HOY? (Círculos pequeños como teníamos antes) */}
      <div className="bg-white border-2 border-[#ded5c2] rounded-3xl p-5 shadow-xs space-y-3.5">
        <div className="space-y-0.5 text-center sm:text-left">
          <h2 className="text-base sm:text-lg font-bold text-[#0c221c]">
            ¿Cómo te sientes en este momento?
          </h2>
          <p className="text-xs sm:text-sm text-[#556961]">
            Toca tu estado actual para ver una sugerencia suave:
          </p>
        </div>

        {/* 5 CÍRCULOS PEQUEÑOS Y ELEGANTES */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 pt-1">
          {FRIENDLY_MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(isSelected ? null : m.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#f4ebe1] ring-2 ring-[#0c221c] scale-105 shadow-xs'
                    : 'hover:bg-[#faf6f0]'
                }`}
                title={m.desc}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-xs border transition-transform ${m.bg} ${m.border} ${
                    isSelected ? 'scale-110 shadow-md font-bold' : 'hover:scale-105'
                  }`}
                >
                  {m.emoji}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-1.5 line-clamp-1 text-center leading-tight ${
                    isSelected ? 'text-[#0c221c]' : 'text-[#3e5349]'
                  }`}
                >
                  {m.label}
                </span>
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0c221c] mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sugerencia y acción suave */}
        {activeMoodObj && (
          <div className="p-4 rounded-2xl bg-[#faf7f0] border border-[#d8cbba] space-y-2.5 animate-fadeIn mt-2">
            <p className="text-sm sm:text-base text-[#1b3e32] font-semibold leading-relaxed">
              💡 {activeMoodObj.hint}
            </p>
            {activeMoodObj.id === 'ansiedad' && (
              <button
                onClick={() => onNavigate('cortisol')}
                className="w-full py-3 px-4 rounded-xl bg-[#0c221c] text-[#ead08f] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Activity className="w-4 h-4" />
                <span>Ir al Suspiro para calmarme (60s)</span>
              </button>
            )}
            {(activeMoodObj.id === 'abrumada' || activeMoodObj.id === 'triste') && (
              <button
                onClick={() => (onOpenAi ? onOpenAi() : onNavigate('ai'))}
                className="w-full py-3 px-4 rounded-xl bg-[#0c221c] text-[#ead08f] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Desahogarme con Alma (IA)</span>
              </button>
            )}
            {activeMoodObj.id === 'calma' && (
              <button
                onClick={() => onNavigate('practice')}
                className="w-full py-3 px-4 rounded-xl bg-[#0c221c] text-[#ead08f] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explorar Prácticas Somáticas</span>
              </button>
            )}
            {activeMoodObj.id === 'enojo' && (
              <button
                onClick={() => onNavigate('fire')}
                className="w-full py-3 px-4 rounded-xl bg-[#0c221c] text-[#ead08f] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Flame className="w-4 h-4" />
                <span>Liberar la carga en el Fuego Sagrado</span>
              </button>
            )}
          </div>
        )}

        {/* Enlace rápido a Check-In e Insights */}
        <div className="pt-2 border-t border-[#ede5d4] flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('checkin')}
            className="text-[11px] font-bold text-[#144436] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Check-In Diario</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className="text-[11px] font-bold text-[#8d6f30] hover:text-[#5e471a] flex items-center gap-1 cursor-pointer"
          >
            <span>Ver mis Tendencias 📊</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. ACCIÓN PRINCIPAL: CONVERSAR CON ALMA (IA) */}
      <div
        onClick={() => (onOpenAi ? onOpenAi() : onNavigate('ai'))}
        className="rounded-3xl bg-gradient-to-br from-[#0c221c] via-[#143d31] to-[#184638] p-6 text-white shadow-lg border-2 border-[#c5a059] cursor-pointer hover:shadow-xl transition-all group space-y-4"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ead08f] text-[#0c221c] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-7 h-7 text-[#0c221c]" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#ead08f] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Espejo con Inteligencia Artificial
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
              ¿Qué te pasó hoy? Cuéntale a Alma
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#dcefe7] leading-relaxed">
          Escribe o habla por voz libremente. Alma te ayuda a entender qué herida o emoción se activó y qué hacer para volver a tu centro.
        </p>

        <div className="pt-3 border-t border-white/20 flex items-center justify-between">
          <span className="text-sm sm:text-base font-bold text-[#ead08f] group-hover:underline">
            Comenzar conversación privada
          </span>
          <ArrowRight className="w-5 h-5 text-[#ead08f] group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>

      {/* 4. SECCIÓN PRINCIPAL: DESCUBRIR QUÉ ME SUCEDE (Mi Espejo Interior) */}
      <div className="bg-gradient-to-br from-[#1d152b] via-[#29173d] to-[#130b1e] text-white rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-[#d8b4fe]/50 space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#d8b4fe]/60 shadow-md flex-shrink-0 bg-[#341d4c]">
            <img
              src={botanicalMirrorImg}
              alt="Espejo botánico del alma"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#d8b4fe]">
              ✦ Mi Espejo Interior
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
              Conoce la raíz de lo que sientes
            </h2>
            <p className="text-xs sm:text-sm text-[#e9d5ff]/90 font-medium">
              Descubre qué herida o patrón inconsciente se activó y cómo recuperar tu libertad emocional.
            </p>
          </div>
        </div>

        {/* 3 mini-bloques inspirados en el diseño amigable */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <span className="text-lg">🪞</span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#ead08f] block">Tu historia</span>
              <span className="text-[11px] text-[#e9d5ff]">Lo que pide sanar</span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <span className="text-lg">🌱</span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#ead08f] block">Tus necesidades</span>
              <span className="text-[11px] text-[#e9d5ff]">Lo que el cuerpo pide</span>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2.5">
            <span className="text-lg">🧭</span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#ead08f] block">Tu patrón</span>
              <span className="text-[11px] text-[#e9d5ff]">Lo que se repite</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/20">
          <button
            onClick={() => onStartExploration()}
            className="py-3.5 px-4 rounded-2xl bg-[#ead08f] hover:bg-[#f3dfa7] text-[#0c221c] font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Compass className="w-5 h-5 text-[#0c221c]" />
            <span>Iniciar Autoindagación Guiada</span>
          </button>

          <button
            onClick={() => onNavigate('patterns')}
            className="py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-[#d8b4fe]" />
            <span>Catálogo de Patrones</span>
          </button>
        </div>
      </div>

      {/* 5. SECCIÓN: CALMAR EL CUERPO Y LA ANSIEDAD (Tarjetas grandes y directas) */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-base sm:text-lg font-bold text-[#0c221c]">
            Alivio Rápido para el Cuerpo
          </h2>
          <p className="text-sm text-[#556961]">
            Herramientas sencillas para bajar el cortisol y la tensión física.
          </p>
        </div>

        <div className="space-y-3">
          {/* Mapeo Somático & Suspiro con icono somático */}
          <button
            onClick={() => onNavigate('cortisol')}
            className="w-full text-left p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#ded5c2] hover:border-[#144436] transition-all shadow-xs flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-13 h-13 rounded-2xl bg-[#eaf4ef] border border-[#b7dfcc] text-[#144436] flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Activity className="w-7 h-7 text-[#144436]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#144436] block">
                Tu cuerpo también habla
              </span>
              <b className="text-base sm:text-lg font-bold text-[#0c221c] block group-hover:text-[#144436] transition-colors">
                Mapeo Corporal & Respiración
              </b>
              <p className="text-xs sm:text-sm text-[#52645c] leading-relaxed mt-0.5">
                Reconoce dónde sientes la emoción en tu cuerpo y calma el cortisol con el Suspiro en 60 segundos.
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-[#556961] group-hover:text-[#0c221c] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>

          {/* Dejar ir al Fuego */}
          <button
            onClick={() => onNavigate('fire')}
            className="w-full text-left p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#ded5c2] hover:border-[#a0451e] transition-all shadow-xs flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-13 h-13 rounded-2xl bg-[#faeee6] border border-[#f4c8b0] text-[#a0451e] flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7 text-[#a0451e]" />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-base sm:text-lg font-bold text-[#0c221c] block group-hover:text-[#a0451e] transition-colors">
                Dejar ir al Fuego
              </b>
              <p className="text-sm text-[#52645c] leading-relaxed mt-0.5">
                Escribe lo que te dolió o pesa y obsérvalo disolverse simbólicamente en el fuego.
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-[#556961] group-hover:text-[#0c221c] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>

          {/* Sonidos Relajantes */}
          <button
            onClick={() => onNavigate('sounds')}
            className="w-full text-left p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#f7faf8] to-[#edf5f1] border-2 border-[#b7dfcc] hover:border-[#144436] transition-all shadow-xs flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-13 h-13 rounded-2xl bg-[#144436] text-[#ead08f] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Volume2 className="w-7 h-7 text-[#ead08f]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <b className="text-base sm:text-lg font-bold text-[#0c221c] block group-hover:text-[#144436] transition-colors">
                  Sonidos Relajantes
                </b>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ead08f]/40 text-[#543f14]">
                  7 AUDIOS REALES
                </span>
              </div>
              <p className="text-sm text-[#52645c] leading-relaxed mt-0.5">
                Arroyo, aves, cuencos tibetanos, grillos, lluvia, olas y mantra Om Namah Shivaya con temporizador y bucle.
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-[#144436] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* 5. SECCIÓN: TU REFLEXIÓN Y PRÁCTICA DEL DÍA */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-base sm:text-lg font-bold text-[#0c221c]">
            Tu Práctica Diaria
          </h2>
          <p className="text-sm text-[#556961]">
            Mensajes, audios y reflexiones para transformar tus patrones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Carta de Intención / Oráculo */}
          <button
            onClick={() => onNavigate('oracle')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#0c221c] to-[#153e32] text-white text-left shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#c5a059]/40 cursor-pointer min-h-[130px]"
          >
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#ead08f] uppercase tracking-wider flex items-center gap-1.5">
                ✦ Carta del Día
              </span>
              <b className="text-base sm:text-lg font-bold text-white block group-hover:text-[#ead08f] transition-colors">
                Oráculo de Intención
              </b>
              <p className="text-sm text-[#c6ded3] leading-relaxed">
                Descubre tu mensaje y recordatorio del día.
              </p>
            </div>
            <span className="text-sm font-bold text-[#ead08f] mt-3 flex items-center gap-1">
              Ver mi carta →
            </span>
          </button>

          {/* Lunes de Alma */}
          <button
            onClick={() => onNavigate('weekly')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#0c221c] to-[#153e32] text-white text-left shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#c5a059]/40 cursor-pointer min-h-[130px]"
          >
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#ead08f] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Entrega Semanal
              </span>
              <b className="text-base sm:text-lg font-bold text-white block group-hover:text-[#ead08f] transition-colors">
                Píldoras del Alma
              </b>
              <p className="text-sm text-[#c6ded3] leading-relaxed">
                8 audios con Voz de Alma, guion completo y práctica.
              </p>
            </div>
            <span className="text-sm font-bold text-[#ead08f] mt-3 flex items-center gap-1">
              Escuchar píldora →
            </span>
          </button>

          {/* 30 Casos de la Vida Real */}
          <button
            onClick={() => onNavigate('cases')}
            className="p-5 rounded-3xl bg-gradient-to-br from-[#0c221c] to-[#153e32] text-white text-left shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#c5a059]/40 cursor-pointer min-h-[130px]"
          >
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-bold text-[#ead08f] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Espejos Reales
              </span>
              <b className="text-base sm:text-lg font-bold text-white block group-hover:text-[#ead08f] transition-colors">
                30 Casos de la Vida Real
              </b>
              <p className="text-sm text-[#c6ded3] leading-relaxed">
                Identifica tus heridas en situaciones de la vida real.
              </p>
            </div>
            <span className="text-sm font-bold text-[#ead08f] mt-3 flex items-center gap-1">
              Explorar casos →
            </span>
          </button>
        </div>
      </div>

      {/* 6. MEMBRESÍA MENSUAL (Si no está activa) */}
      {!isPremiumUser() && (
        <div className="bg-white border-2 border-[#c5a059] p-6 rounded-3xl shadow-sm space-y-3.5 text-center">
          <span className="text-xs sm:text-sm uppercase font-extrabold tracking-widest px-3.5 py-1.5 rounded-full bg-[#0c221c] text-[#ead08f] inline-block">
            MEMBRESÍA MENSUAL · $29.900 COP
          </span>
          <p className="text-sm sm:text-base text-[#465a51] leading-relaxed">
            Acceso ilimitado a todas las meditaciones, audios semanales de cada lunes y consultas continuas con tu Espejo IA.
          </p>
          <button
            onClick={() => onNavigate('premium')}
            className="w-full py-4 rounded-2xl bg-[#0c221c] text-[#ead08f] font-extrabold text-base shadow-md hover:bg-[#153e32] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Ver detalles de membresía</span>
          </button>
        </div>
      )}
    </div>
  );
};
