import React, { useState } from 'react';
import { PATTERNS } from '../data/vishudaData';
import { Pattern, ViewType } from '../types';
import { getActionKitForPattern } from '../data/patternActionData';
import {
  Sparkles,
  Compass,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Users,
  Zap,
  Video,
  Volume2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
} from 'lucide-react';

interface PatternIndexProps {
  onBack: () => void;
  onExplorePattern: (patternId: string) => void;
  onNavigate?: (view: ViewType) => void;
}

export const PatternIndex: React.FC<PatternIndexProps> = ({
  onBack,
  onExplorePattern,
  onNavigate,
}) => {
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<Record<string, 'neurohacks' | 'video' | 'meditation'>>({});

  const toggleExpand = (id: string) => {
    setExpandedPattern((prev) => (prev === id ? null : id));
  };

  const setTab = (patternId: string, tab: 'neurohacks' | 'video' | 'meditation') => {
    setActiveSubTab((prev) => ({ ...prev, [patternId]: tab }));
  };
  return (
    <div className="space-y-5 pb-16 animate-fadeIn text-[#1f2b33]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#5b2a63] hover:underline flex items-center gap-1.5 p-1 -ml-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#f3e8ff] text-[#5b2a63] border border-[#d8b4fe]">
          Patrones Inconscientes
        </span>
      </div>

      {/* Top Cross-Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#ede6f2] rounded-2xl border border-[#d9cadf]">
        <button
          onClick={() => onNavigate ? onNavigate('explore') : onExplorePattern('')}
          className="py-2.5 px-2 rounded-xl text-xs font-bold text-[#553b5e] hover:bg-white/60 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#5b2a63]" />
          <span>Descubrir</span>
        </button>

        <button
          className="py-2.5 px-2 rounded-xl text-xs font-extrabold bg-[#5b2a63] text-[#ead08f] shadow-xs flex flex-col sm:flex-row items-center justify-center gap-1 text-center"
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => onNavigate && onNavigate('cases')}
          className="py-2.5 px-2 rounded-xl text-xs font-bold text-[#553b5e] hover:bg-white/60 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center cursor-pointer"
        >
          <Users className="w-4 h-4 text-[#5b2a63]" />
          <span>30 Casos</span>
        </button>
      </div>

      {/* Hero Banner: Autoindagación CTA */}
      <div className="bg-gradient-to-br from-[#2a1738] to-[#12081d] text-white rounded-3xl p-6 shadow-md border-2 border-[#d8b4fe]/40 space-y-3">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#ead08f] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ead08f]" />
            ¿Por qué actúo de tal forma?
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
            Patrones Inconscientes y Heridas
          </h1>
          <p className="text-sm sm:text-base text-[#e9d5ff] leading-relaxed pt-1">
            Un patrón no es cómo eres: es una armadura que aprendiste para protegerte en la infancia. Conocerlos te devuelve la libertad de elegir una respuesta consciente.
          </p>
        </div>

        <button
          onClick={() => onNavigate ? onNavigate('explore') : onExplorePattern('')}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#ead08f] hover:bg-[#f6df9d] text-[#0c221c] font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
        >
          <Compass className="w-5 h-5 text-[#0c221c]" />
          <span>Descubrir qué me sucede ahora mismo (9 pasos)</span>
        </button>
      </div>

      {/* Pattern Cards with Large, Clear Typography */}
      <div className="space-y-4">
        {PATTERNS.map((p) => (
          <div
            key={p.id}
            className="bg-white border-2 border-[#ded5c2] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-[#5b2a63] transition-all"
          >
            <div className="flex items-center justify-between border-b border-[#f0e5d7] pb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5b2a63] bg-[#f5eef8] px-3 py-1 rounded-full border border-[#dfc8e4]">
                🛡️ Patrón de defensa
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#7d7188] italic">
                {p.wound}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#331935]">
                {p.title}
              </h2>
              <p className="text-sm sm:text-base text-[#524458] mt-1.5 leading-relaxed">
                {p.desc}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#332a3d] block">
                Señales habituales cuando se activa en automático:
              </span>
              <div className="flex flex-wrap gap-2">
                {p.signs.map((sign, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full bg-[#f3eaf7] text-[#4a1c52] text-xs sm:text-sm font-medium border border-[#dec9e5]"
                  >
                    ✦ {sign}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#fbf7f1] p-4 rounded-2xl border border-[#ded5c2] space-y-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#7d7188] block">
                Pregunta de compasión para observarte:
              </span>
              <p className="text-sm sm:text-base italic font-medium text-[#332a3d] leading-relaxed">
                "{p.question}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => onExplorePattern(p.id)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#5b2a63] hover:bg-[#481c50] text-[#ead08f] font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explorar este patrón (9 pasos)</span>
              </button>

              <button
                onClick={() => toggleExpand(p.id)}
                className={`py-3 px-4 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  expandedPattern === p.id
                    ? 'bg-[#144436] text-[#ead08f] border-[#144436]'
                    : 'bg-[#f4ecf7] hover:bg-[#ebdcf0] text-[#5b2a63] border-[#d8b4fe]'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{expandedPattern === p.id ? 'Ocultar recursos' : 'Neurohacks y Videos'}</span>
                {expandedPattern === p.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* EXPANDED ACTION KIT PANEL */}
            {expandedPattern === p.id && (() => {
              const kit = getActionKitForPattern(p.id);
              const activeTab = activeSubTab[p.id] || 'neurohacks';

              return (
                <div className="bg-[#faf6fc] border-2 border-[#5b2a63]/40 rounded-2xl p-4 sm:p-5 space-y-3.5 animate-fadeIn mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#5b2a63] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#5b2a63]" />
                      Recursos de Sanación
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#5b2a63] border border-[#d8b4fe]">
                      {kit.woundTitle}
                    </span>
                  </div>

                  {/* Subtabs selector */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#ede6f2] rounded-xl border border-[#d9cadf]">
                    <button
                      onClick={() => setTab(p.id, 'neurohacks')}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                        activeTab === 'neurohacks'
                          ? 'bg-[#5b2a63] text-[#ead08f] shadow-2xs'
                          : 'text-[#553b5e] hover:bg-white/60'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Neurohacks</span>
                    </button>

                    <button
                      onClick={() => setTab(p.id, 'video')}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                        activeTab === 'video'
                          ? 'bg-[#5b2a63] text-[#ead08f] shadow-2xs'
                          : 'text-[#553b5e] hover:bg-white/60'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>

                    <button
                      onClick={() => setTab(p.id, 'meditation')}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                        activeTab === 'meditation'
                          ? 'bg-[#5b2a63] text-[#ead08f] shadow-2xs'
                          : 'text-[#553b5e] hover:bg-white/60'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Meditación</span>
                    </button>
                  </div>

                  {/* TAB 1: NEUROHACKS */}
                  {activeTab === 'neurohacks' && (
                    <div className="space-y-2.5 animate-fadeIn">
                      {kit.neurohacks.map((hack, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-[#d9cadf] rounded-xl p-3.5 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span>{hack.icon}</span>
                              <b className="text-xs sm:text-sm font-bold text-[#331935]">
                                {hack.name}
                              </b>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f3eaf7] text-[#5b2a63] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {hack.timeNeeded}
                            </span>
                          </div>
                          <p className="text-xs text-[#524458] leading-relaxed">
                            {hack.instruction}
                          </p>
                          {hack.phraseOrMantra && (
                            <div className="bg-[#f9f4fb] border border-[#e8d7ed] rounded-lg p-2.5 text-xs font-semibold text-[#5b2a63] italic">
                              "{hack.phraseOrMantra}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: VIDEO */}
                  {activeTab === 'video' && (
                    <div className="bg-[#0b1f19] text-white rounded-2xl p-4 border border-[#c5a059]/30 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <b className="text-xs sm:text-sm text-[#ead08f]">{kit.video.title}</b>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#ead08f]">
                          {kit.video.duration}
                        </span>
                      </div>
                      <div className="w-full rounded-xl overflow-hidden aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${kit.video.videoId}?rel=0&modestbranding=1`}
                          title={kit.video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#a6c4b7]">
                        <span>¿Problemas de reproducción?</span>
                        <a
                          href={`https://www.youtube.com/watch?v=${kit.video.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#ead08f] underline font-bold flex items-center gap-1"
                        >
                          <span>Abrir en YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MEDITACIÓN */}
                  {activeTab === 'meditation' && (
                    <div className="bg-[#0b1f19] text-white rounded-2xl p-4 border border-[#c5a059]/30 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <b className="text-xs sm:text-sm text-[#ead08f]">{kit.meditation.title}</b>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#ead08f]">
                          {kit.meditation.duration}
                        </span>
                      </div>
                      <div className="w-full rounded-xl overflow-hidden aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${kit.meditation.videoId}?rel=0&modestbranding=1`}
                          title={kit.meditation.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#a6c4b7]">
                        <span>Audio oficial de meditación</span>
                        <a
                          href={`https://www.youtube.com/watch?v=${kit.meditation.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#ead08f] underline font-bold flex items-center gap-1"
                        >
                          <span>Abrir en YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#ded5c2] rounded-2xl p-4 text-xs sm:text-sm text-[#7d7188] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#c5a059] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Estos patrones son hipótesis reflexivas de autoconocimiento somático y compasivo, diseñadas para devolverte la capacidad de pausar y elegir tu respuesta.
        </p>
      </div>
    </div>
  );
};
