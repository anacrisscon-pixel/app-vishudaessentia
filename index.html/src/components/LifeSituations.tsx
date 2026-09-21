import React, { useState, useEffect } from 'react';
import { ALMA_CASES, ALMA_CATEGORIES, AlmaCase } from '../data/almaCasesData';
import { audioEngine } from '../utils/audioEngine';
import { ViewType } from '../types';
import {
  Play,
  Pause,
  Sparkles,
  Heart,
  ArrowLeft,
  Video,
  Shield,
  Search,
  ExternalLink,
  Volume2,
  ChevronRight,
  MessageSquare,
  Compass,
  BookOpen,
  Users,
} from 'lucide-react';

interface LifeSituationsProps {
  onBack: () => void;
  onExplorePattern?: (patternId: string) => void;
  onGoAiWithCase?: (c: AlmaCase) => void;
  onNavigate?: (view: ViewType) => void;
  initialCaseId?: string | null;
}

export const LifeSituations: React.FC<LifeSituationsProps> = ({
  onBack,
  onExplorePattern,
  onGoAiWithCase,
  onNavigate,
  initialCaseId,
}) => {
  const [selectedCase, setSelectedCase] = useState<AlmaCase | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'analisis' | 'video' | 'audio'>('analisis');

  useEffect(() => {
    if (initialCaseId) {
      const found = ALMA_CASES.find((c) => c.id === initialCaseId);
      if (found) {
        setSelectedCase(found);
        setActiveTab('analisis');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [initialCaseId]);

  const filteredCases =
    selectedCategory === 'todas'
      ? ALMA_CASES
      : ALMA_CASES.filter((c) => c.category === selectedCategory);

  const handleOpenCase = (c: AlmaCase) => {
    setSelectedCase(c);
    setActiveTab('analisis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAmbientAudio = () => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      audioEngine.startAmbientTrack();
      setIsPlayingAudio(true);
    }
  };

  const getHeridaBadgeColor = (herida: string) => {
    switch (herida) {
      case 'Abandono':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case 'Rechazo':
        return 'bg-rose-100 text-rose-950 border-rose-300';
      case 'Traición':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      case 'Injusticia':
        return 'bg-sky-100 text-sky-950 border-sky-300';
      case 'Humillación':
        return 'bg-orange-100 text-orange-950 border-orange-300';
      default:
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
    }
  };

  return (
    <div className="space-y-5 pb-16 animate-fadeIn text-[#1d2924]">
      {/* Top Header & Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (selectedCase) {
              audioEngine.stop();
              setIsPlayingAudio(false);
              setSelectedCase(null);
            } else {
              onBack();
            }
          }}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5 p-1 -ml-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{selectedCase ? 'Volver a la lista de casos' : 'Volver al inicio'}</span>
        </button>

        {!selectedCase && (
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#eaf4ef] text-[#144436] border border-[#bcdbc9]">
            {ALMA_CASES.length} Casos de la Vida Real
          </span>
        )}
      </div>

      {/* Top Cross-Navigation Tabs (when in catalog view) */}
      {!selectedCase && (
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#ede6f2] rounded-2xl border border-[#d9cadf]">
          <button
            onClick={() => onNavigate && onNavigate('explore')}
            className="py-2.5 px-2 rounded-xl text-xs font-bold text-[#553b5e] hover:bg-white/60 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#5b2a63]" />
            <span>Descubrir</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('patterns')}
            className="py-2.5 px-2 rounded-xl text-xs font-bold text-[#553b5e] hover:bg-white/60 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#5b2a63]" />
            <span>Catálogo</span>
          </button>

          <button
            className="py-2.5 px-2 rounded-xl text-xs font-extrabold bg-[#144436] text-[#ead08f] shadow-xs flex flex-col sm:flex-row items-center justify-center gap-1 text-center"
          >
            <Users className="w-4 h-4" />
            <span>{ALMA_CASES.length} Casos</span>
          </button>
        </div>
      )}

      {/* DETAIL VIEW OF A SELECTED CASE */}
      {selectedCase ? (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#144436] text-white">
                {selectedCase.categoryLabel}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${getHeridaBadgeColor(
                  selectedCase.herida
                )}`}
              >
                Herida detonada: {selectedCase.herida}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-[#0e2721] mt-2 flex items-center gap-2">
              <span className="text-3xl">{selectedCase.icon}</span>
              <span>{selectedCase.title}</span>
            </h1>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex bg-[#e4ede8] p-1.5 rounded-2xl border border-[#bcd7cb] gap-1">
            <button
              onClick={() => setActiveTab('analisis')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'analisis'
                  ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                  : 'text-[#364b42] hover:bg-white/40'
              }`}
            >
              Desglose de Patrón
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                  : 'text-[#364b42] hover:bg-white/40'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Guía</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                  : 'text-[#364b42] hover:bg-white/40'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Meditación</span>
            </button>
          </div>

          {/* TAB 1: 5-STEP DESGLOSE */}
          {activeTab === 'analisis' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* 1. Contexto */}
              <div className="bg-white border-2 border-[#d2dfd8] rounded-2xl p-5 space-y-1.5 shadow-2xs">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1b5e4b] block">
                  1. Contexto / Situación cotidiana
                </span>
                <p className="text-sm sm:text-base text-[#2c3e37] leading-relaxed">
                  {selectedCase.contexto}
                </p>
              </div>

              {/* 2. Síntoma */}
              <div className="bg-white border-2 border-[#d2dfd8] rounded-2xl p-5 space-y-1.5 shadow-2xs">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#915a13] block">
                  2. El Síntoma / Reacción visible
                </span>
                <p className="text-sm sm:text-base text-[#2c3e37] leading-relaxed">
                  {selectedCase.sintoma}
                </p>
              </div>

              {/* 3. Mecanismo de Defensa */}
              <div className="bg-[#fffbf2] border-2 border-[#e8d2a6] rounded-2xl p-5 space-y-1.5 shadow-2xs">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#824f00] block flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#b0791d]" />
                  <span>3. El Mecanismo de Defensa inconsciente</span>
                </span>
                <p className="text-sm sm:text-base text-[#423116] leading-relaxed font-semibold">
                  {selectedCase.mecanismo}
                </p>
              </div>

              {/* 4. Herida de Infancia */}
              <div className="bg-[#f3f7f5] border-2 border-[#bcd7cb] rounded-2xl p-5 space-y-2 shadow-2xs">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#144436] block">
                  4. La Herida de Infancia detonada
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span
                    className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-xl border ${getHeridaBadgeColor(
                      selectedCase.herida
                    )}`}
                  >
                    Herida de {selectedCase.herida}
                  </span>
                  <span className="text-xs sm:text-sm text-[#4f645b]">
                    Patrón inconsciente de origen en la infancia
                  </span>
                </div>
              </div>

              {/* 5. El Reframe */}
              <div className="bg-gradient-to-br from-[#0a1e18] to-[#163f33] text-white rounded-2xl p-5 shadow-md space-y-2 border-2 border-[#c5a059]/40">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#ead08f] block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ead08f]" />
                  <span>5. El Reframe (Cómo volver a tu centro)</span>
                </span>
                <p className="text-sm sm:text-base text-[#dcebe3] leading-relaxed">
                  {selectedCase.reframe}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO GUÍA */}
          {activeTab === 'video' && selectedCase.videoId && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-[#0b1f19] text-white rounded-3xl p-5 border border-[#c5a059]/30 space-y-3">
                <b className="text-sm text-[#ead08f] block">{selectedCase.videoTitle}</b>
                <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black shadow-inner">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedCase.videoId}?rel=0&modestbranding=1`}
                    title={selectedCase.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="flex items-center justify-between pt-1 text-xs text-[#a6c4b7]">
                  <span>¿Dificultad de reproducción?</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedCase.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ead08f] underline font-bold flex items-center gap-1 hover:text-white"
                  >
                    <span>Abrir en YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDITACIÓN SONORA */}
          {activeTab === 'audio' && (
            <div className="bg-[#f0f6f3] border-2 border-[#144436] rounded-3xl p-6 space-y-4 animate-fadeIn text-center">
              <div className="w-16 h-16 rounded-full bg-[#0e2721] text-[#ead08f] flex items-center justify-center mx-auto shadow-md">
                <Volume2 className="w-8 h-8" />
              </div>
              <div>
                <b className="text-base text-[#0e2721] block">
                  Regulación Somática: Ondas Alfa y Cuencos (432 Hz)
                </b>
                <p className="text-sm text-[#52665e] mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Sonido armónico continuo diseñado para relajar la amígdala cerebral y desactivar el mecanismo de {selectedCase.mecanismo.toLowerCase()}.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleToggleAmbientAudio}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0d231d] to-[#184437] text-[#ead08f] font-extrabold text-sm flex items-center justify-center gap-2 mx-auto shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <Pause className="w-4 h-4 fill-[#ead08f]" />
                      <span>Pausar sonido relajante</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-[#ead08f]" />
                      <span>Escuchar audio de calma ahora</span>
                    </>
                  )}
                </button>
              </div>

              {isPlayingAudio && (
                <div className="text-xs text-[#1b5e4b] font-bold flex items-center justify-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>Reproduciendo frecuencia 432 Hz en directo...</span>
                </div>
              )}
            </div>
          )}

          {/* LLEVAR ESTE CASO AL CHAT ESPEJO CON ALMA */}
          {onGoAiWithCase && (
            <div className="bg-gradient-to-r from-[#0d221c] via-[#14362d] to-[#1c4b3e] text-white rounded-3xl p-5 shadow-md border border-[#c5a059]/60 space-y-2.5 mt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ead08f]" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#ead08f]">
                  Chat Espejo con Alma (IA)
                </span>
              </div>
              <b className="text-sm sm:text-base font-bold text-white block">
                ¿Vives una situación parecida a este caso hoy?
              </b>
              <p className="text-xs sm:text-sm text-[#cfe0d8] leading-relaxed">
                Lleva este caso al Chat Espejo. Alma abrirá una sesión personalizada para acompañarte a explorar cómo se detona en tus relaciones, trabajo o familia.
              </p>
              <button
                onClick={() => onGoAiWithCase(selectedCase)}
                className="w-full py-3 px-4 rounded-2xl bg-[#ead08f] hover:bg-[#deb970] text-[#0d221c] font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Indagar mi propia versión de este caso con Alma →</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* CATALOG VIEW */
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs tracking-widest uppercase text-[#144436] font-extrabold block">
                Desglose de Casos Reales
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#144436] text-white">
                {ALMA_CASES.length} casos
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-[#0e2721] mt-1">
              Casos de la Vida Real
            </h1>
            <p className="text-sm sm:text-base text-[#40544c] mt-1 leading-relaxed">
              Historias cortas para identificar tu síntoma, el mecanismo inconsciente que se dispara y la herida de infancia que hay debajo.
            </p>
          </div>

          {/* Direct CTA to Alma Chat */}
          {onGoAiWithCase && (
            <div
              onClick={() => onGoAiWithCase({ title: 'Situación cotidiana' } as any)}
              className="bg-[#eaf3ee] border-2 border-[#bcd7cb] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#144436] hover:bg-[#e1ede6] transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#0e2721] text-[#ead08f] flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                  ✦
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#144436] block">
                    ¿No encuentras tu caso exacto aquí?
                  </span>
                  <b className="text-sm sm:text-base font-bold text-[#0e2721] block leading-tight">
                    Cuéntale a Alma en privado qué te ocurrió hoy
                  </b>
                  <span className="text-xs text-[#4c6057]">
                    Te escuchará por voz o texto y desglosará tu patrón en minutos.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#144436] group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          )}

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {ALMA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0e2721] text-[#ead08f] shadow-xs'
                    : 'bg-[#eaf2ee] text-[#2d443a] hover:bg-[#dbe9e2]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Cases List */}
          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenCase(c)}
                className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#d2dfd8] hover:border-[#144436] transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-start gap-3.5 group"
              >
                <div className="text-3xl flex-shrink-0 p-2.5 rounded-2xl bg-[#eef5f1] group-hover:scale-105 transition-transform">
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#144436]">
                      {c.categoryLabel}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getHeridaBadgeColor(
                        c.herida
                      )}`}
                    >
                      {c.herida}
                    </span>
                  </div>
                  <b className="text-base sm:text-lg font-bold text-[#0e2721] group-hover:text-[#144436] transition-colors block">
                    {c.title}
                  </b>
                  <p className="text-xs sm:text-sm text-[#4c6057] line-clamp-2 leading-relaxed">
                    {c.contexto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
