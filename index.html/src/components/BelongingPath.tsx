import React, { useState } from 'react';
import {
  BELONGING_ROADMAP,
  BELONGING_PATTERNS,
  BELONGING_CHECKS,
} from '../data/vishudaData';
import { getBelongingData, saveBelongingData } from '../utils/storage';
import { CheckCircle2, Circle, Sparkles, Heart } from 'lucide-react';

interface BelongingPathProps {
  onBack: () => void;
}

export const BelongingPath: React.FC<BelongingPathProps> = ({ onBack }) => {
  const [data, setData] = useState(getBelongingData());

  const toggleRuta = (idx: number) => {
    const nextRuta = { ...(data.ruta || {}) };
    nextRuta[idx] = !nextRuta[idx];
    const updated = { ...data, ruta: nextRuta };
    setData(updated);
    saveBelongingData(updated);
  };

  const togglePatron = (idx: number) => {
    const nextPatrones = { ...(data.patrones || {}) };
    nextPatrones[idx] = !nextPatrones[idx];
    const updated = { ...data, patrones: nextPatrones };
    setData(updated);
    saveBelongingData(updated);
  };

  const toggleCheck = (label: string) => {
    const nextChecks = { ...(data.checks || {}) };
    nextChecks[label] = !nextChecks[label];
    const updated = { ...data, checks: nextChecks };
    setData(updated);
    saveBelongingData(updated);
  };

  const setTermo = (n: number) => {
    const updated = { ...data, termo: n };
    setData(updated);
    saveBelongingData(updated);
  };

  const handleField = (field: 'frase' | 'balanceDia' | 'orgullo' | 'suelto', val: string) => {
    const updated = { ...data, [field]: val };
    setData(updated);
    saveBelongingData(updated);
  };

  const rutaDone = Object.values(data.ruta || {}).filter(Boolean).length;
  const patronesCount = Object.values(data.patrones || {}).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-8">
      <button
        onClick={onBack}
        className="text-xs font-bold text-[#5b2a63] hover:underline flex items-center gap-1"
      >
        ← Volver
      </button>

      <div>
        <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
          Camino de Pertenencia · Mes 1
        </span>
        <h1 className="text-2xl font-extrabold text-[#332a3d] mt-1">
          El Despertar de tu Brillo
        </h1>
        <p className="text-sm font-semibold text-[#5b2a63] italic mt-1">
          "¡Sacar belleza de este caos es virtud!"
        </p>
      </div>

      <div className="bg-[#efe4f5] border border-[#d9c3e0] rounded-2xl p-4 text-xs text-[#332a3d] leading-relaxed">
        <b>El propósito de este camino:</b> Por miedo a ser rechazados/as, a menudo nos hacemos pequeños/as o complacemos a los demás. Este mes está dedicado a recordar que tienes todo el derecho de ocupar tu lugar en la tierra, tal como eres.
      </div>

      {/* Roadmap */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#5b2a63]">
            🗺️ Tu mapa de ruta semanal
          </h2>
          <span className="text-xs text-[#7d7188] font-bold">
            {rutaDone}/3 completados
          </span>
        </div>
        <div className="space-y-2">
          {BELONGING_ROADMAP.map((step, idx) => {
            const isDone = !!(data.ruta && data.ruta[idx]);
            return (
              <button
                key={idx}
                onClick={() => toggleRuta(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-[#efe4f5] border-[#5b2a63]/40'
                    : 'bg-[#fffdfa] border-[#d8c8ad] hover:border-[#5b2a63]/50'
                }`}
              >
                <span className="text-xl flex-shrink-0">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <b className={`text-sm block ${isDone ? 'line-through text-[#5b2a63]' : 'text-[#332a3d]'}`}>
                    {step.title}
                  </b>
                  <p className="text-xs text-[#7d7188] mt-0.5">{step.desc}</p>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#5b2a63] flex-shrink-0 mt-1" />
                ) : (
                  <Circle className="w-5 h-5 text-[#d8c8ad] flex-shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Affirmation Card */}
      <div className="bg-gradient-to-br from-[#331935] to-[#5b2a63] text-white p-5 rounded-2xl text-center shadow-md space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#ead08f]">
          Afirmación raíz
        </span>
        <blockquote className="text-base font-serif italic text-white leading-relaxed">
          "Mi presencia es valiosa y mi brillo auténtico no opaca el de nadie."
        </blockquote>
        <p className="text-[11px] text-[#e9d9ef]/70">
          Repítela en voz alta con tus manos en el pecho.
        </p>
      </div>

      {/* Pattern Recognition */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#5b2a63]">
          🔎 ¿Te reconoces en estas máscaras?
        </h2>
        <p className="text-xs text-[#7d7188]">
          Toca las que resuenen contigo. No es tu culpa: son armaduras que aprendiste para sentirte a salvo.
        </p>
        <div className="space-y-2">
          {BELONGING_PATTERNS.map((p, idx) => {
            const isSel = !!(data.patrones && data.patrones[idx]);
            return (
              <button
                key={idx}
                onClick={() => togglePatron(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isSel
                    ? 'bg-[#efe4f5] border-[#5b2a63] ring-1 ring-[#5b2a63]'
                    : 'bg-[#fffdfa] border-[#d8c8ad]'
                }`}
              >
                <span className="text-xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <b className="text-sm text-[#332a3d] block">{p.title}</b>
                  <p className="text-xs text-[#7d7188] mt-0.5">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {patronesCount > 0 && (
          <p className="text-xs text-[#5b2a63] font-semibold text-center mt-2">
            Te reconociste en {patronesCount} de {BELONGING_PATTERNS.length}. Nombrarlas es el primer paso para desarmarlas.
          </p>
        )}
      </div>

      {/* Daily checks */}
      <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5b2a63] block">
          Hoy decido hacer por mí:
        </span>
        <div className="flex flex-wrap gap-2">
          {BELONGING_CHECKS.map((c) => {
            const isChecked = !!(data.checks && data.checks[c.label]);
            return (
              <button
                key={c.label}
                onClick={() => toggleCheck(c.label)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isChecked
                    ? 'bg-[#5b2a63] text-white'
                    : 'bg-[#f7f2ec] text-[#332a3d] border border-[#d8c8ad]/60'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thermometer of Shine */}
      <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5b2a63] block">
          🌡️ Termómetro de mi brillo esta semana
        </span>
        <div className="flex justify-between items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setTermo(n)}
              className={`w-11 h-11 rounded-full text-sm font-bold transition-all ${
                data.termo === n
                  ? 'bg-[#5b2a63] text-white shadow-md scale-105'
                  : 'bg-[#f8f4ee] border border-[#d8c8ad] text-[#332a3d]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[#7d7188] px-1">
          <span>1: Me sentí invisible</span>
          <span>5: Brillé sin pedir perdón</span>
        </div>
      </div>

      {/* Journals */}
      <div className="space-y-3">
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 space-y-1.5">
          <label className="text-xs font-bold text-[#5b2a63] block">
            ¿En qué momento de esta semana te sentiste más orgulloso/a de ti?
          </label>
          <textarea
            value={data.orgullo || ''}
            onChange={(e) => handleField('orgullo', e.target.value)}
            placeholder="Anota ese instante pequeño o grande..."
            rows={2}
            className="w-full p-2.5 text-xs rounded-xl border border-[#e6dcf0] bg-[#f8f4ee]/50 focus:bg-white outline-none"
          />
        </div>

        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 space-y-1.5">
          <label className="text-xs font-bold text-[#5b2a63] block">
            🍃 Lo que se queda fuera de mí hoy:
          </label>
          <textarea
            value={data.suelto || ''}
            onChange={(e) => handleField('suelto', e.target.value)}
            placeholder="Ej: Suelto la necesidad de caerle bien a todos hoy..."
            rows={2}
            className="w-full p-2.5 text-xs rounded-xl border border-[#e6dcf0] bg-[#f8f4ee]/50 focus:bg-white outline-none"
          />
        </div>
      </div>
    </div>
  );
};
