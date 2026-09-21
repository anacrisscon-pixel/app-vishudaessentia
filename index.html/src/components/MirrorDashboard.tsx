import React from 'react';
import { ExplorationData, Pattern } from '../types';
import { PATTERNS } from '../data/vishudaData';
import { Sparkles, Compass, HeartHandshake, Shield, Activity, Calendar, ArrowLeft } from 'lucide-react';

interface MirrorDashboardProps {
  explorations?: ExplorationData[];
  onStartExploration?: () => void;
  onGoAi?: () => void;
  onBack?: () => void;
  onExplorePattern?: (patternId: string) => void;
}

export const MirrorDashboard: React.FC<MirrorDashboardProps> = ({
  explorations = [],
  onStartExploration,
  onGoAi,
  onBack,
  onExplorePattern,
}) => {
  const safeExplorations = Array.isArray(explorations) ? explorations : [];

  // Compute counts and frequencies
  const getFrequencies = (key: keyof ExplorationData) => {
    const counts: Record<string, number> = {};
    safeExplorations.forEach((item) => {
      const val = item[key];
      if (typeof val === 'string' && val.trim()) {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const topProtections = getFrequencies('protection');
  const topNeeds = getFrequencies('need');
  const topEmotions = getFrequencies('emotion');
  const topScenes = getFrequencies('scene');

  const dominantProtection = topProtections[0]?.[0] || 'Aún por descubrir';
  const dominantNeed = topNeeds[0]?.[0] || 'Aún por descubrir';
  const dominantEmotion = topEmotions[0]?.[0] || 'Aún por descubrir';

  // Pattern detection score
  const detectedPattern = React.useMemo<Pattern | null>(() => {
    if (safeExplorations.length < 2) return null;
    let bestPattern: Pattern | null = null;
    let maxScore = -1;

    PATTERNS.forEach((p) => {
      let score = 0;
      safeExplorations.forEach((exp) => {
        if (exp.protection && p.tests.protection.includes(exp.protection)) score += 2;
        if (exp.need && p.tests.need.includes(exp.need)) score += 2;
        if (exp.interpretation && p.tests.interpret.includes(exp.interpretation)) score += 3;
      });
      if (score > maxScore) {
        maxScore = score;
        bestPattern = p;
      }
    });

    return maxScore >= 4 ? bestPattern : null;
  }, [safeExplorations]);

  const confidencePercentage = Math.min(92, 45 + safeExplorations.length * 8);

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#1e5f6e] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>
      )}

      <div>
        <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
          Autoconocimiento Profundo
        </span>
        <h1 className="text-2xl font-extrabold text-[#332a3d] mt-1">
          Mi Espejo
        </h1>
        <p className="text-sm text-[#655a68] mt-1 leading-relaxed">
          Lo que estamos aprendiendo de tus momentos de indagación. Los patrones no son diagnósticos, son mapas de comprensión.
        </p>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7188] block">
            Exploraciones
          </span>
          <b className="text-2xl font-extrabold text-[#331935] mt-1 block">
            {safeExplorations.length}
          </b>
          <span className="text-[10px] text-[#7d7188]">momentos observados</span>
        </div>

        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7188] block">
            Protección clave
          </span>
          <b className="text-sm font-bold text-[#5b2a63] mt-1 block truncate">
            {dominantProtection}
          </b>
          <span className="text-[10px] text-[#7d7188]">mecanismo de defensa</span>
        </div>

        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7188] block">
            Necesidad raíz
          </span>
          <b className="text-sm font-bold text-[#5b2a63] mt-1 block truncate">
            {dominantNeed}
          </b>
          <span className="text-[10px] text-[#7d7188]">deseo no cubierto</span>
        </div>

        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-3.5 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7188] block">
            Emoción habitual
          </span>
          <b className="text-sm font-bold text-[#331935] mt-1 block truncate">
            {dominantEmotion}
          </b>
          <span className="text-[10px] text-[#7d7188]">frecuencia principal</span>
        </div>
      </div>

      {/* Recurrent Pattern in Observation */}
      {detectedPattern ? (
        <div className="bg-gradient-to-br from-[#fffdfa] via-[#f7f0f8] to-[#efe4f5] border border-[#d9c3e0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b2a63] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d6b97b]" />
              Patrón en observación
            </span>
            <span className="text-xs font-bold text-[#7d7188]">
              {confidencePercentage}% confianza
            </span>
          </div>

          <h3 className="text-lg font-serif font-bold text-[#331935]">
            {detectedPattern.title}
          </h3>
          <p className="text-xs text-[#655a68] leading-relaxed">
            {detectedPattern.desc}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#5b2a63] block">
              Pregunta reflexiva:
            </span>
            <p className="text-xs italic text-[#332a3d] bg-white/70 p-2.5 rounded-xl border border-[#d8c8ad]/50">
              "{detectedPattern.question}"
            </p>
          </div>

          {topScenes.length > 0 && (
            <div className="text-[11px] text-[#7d7188] pt-1">
              Áreas donde más se presenta: {topScenes.slice(0, 3).map((s) => s[0]).join(' · ')}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-5 text-center space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#efe4f5] text-[#5b2a63] mx-auto flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <b className="text-sm text-[#332a3d] block">
            Aún estamos reuniendo tus señales
          </b>
          <p className="text-xs text-[#7d7188] max-w-xs mx-auto leading-relaxed">
            Realiza al menos 2 exploraciones para que tu espejo empiece a identificar tus patrones recurrentes con precisión.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onStartExploration}
          className="w-full py-3 rounded-xl bg-[#5b2a63] text-white font-bold text-sm shadow-md hover:bg-[#471f4e] transition-all flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Iniciar una nueva exploración</span>
        </button>

        <button
          onClick={onGoAi}
          className="w-full py-2.5 rounded-xl bg-white border border-[#d8c8ad] text-[#5b2a63] font-semibold text-xs hover:bg-[#f8f4ee] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5b2a63]" />
          <span>Llevar esto a la IA de Vishuda</span>
        </button>
      </div>
    </div>
  );
};
