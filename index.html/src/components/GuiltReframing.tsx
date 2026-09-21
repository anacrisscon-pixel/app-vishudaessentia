import React, { useState } from 'react';
import { getGuiltData, saveGuiltData } from '../utils/storage';
import { Heart, Sparkles, Check } from 'lucide-react';

interface GuiltReframingProps {
  onBack: () => void;
}

export const GuiltReframing: React.FC<GuiltReframingProps> = ({ onBack }) => {
  const initial = getGuiltData();
  const [culpa, setCulpa] = useState(initial.culpa || '');
  const [resp, setResp] = useState(initial.resp || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleCulpaChange = (val: string) => {
    setCulpa(val);
    saveGuiltData({ culpa: val, resp });
    triggerSave();
  };

  const handleRespChange = (val: string) => {
    setResp(val);
    saveGuiltData({ culpa, resp: val });
    triggerSave();
  };

  const triggerSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="space-y-5 pb-8">
      <button
        onClick={onBack}
        className="text-xs font-bold text-[#5b2a63] hover:underline flex items-center gap-1"
      >
        ← Volver
      </button>

      <div>
        <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
          Alquimia Emocional
        </span>
        <h1 className="text-2xl font-extrabold text-[#332a3d] mt-1">
          De la Culpa a la Responsabilidad
        </h1>
        <p className="text-sm text-[#655a68] mt-1 leading-relaxed">
          La culpa te encoge y dice: <i>"Soy defectuoso/a"</i>. La responsabilidad te empodera y dice: <i>"Cometí un error, me hago cargo y aprendo de él"</i>.
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5b2a63] block">
          1. ¿Qué te genera culpa o reproche hoy?
        </label>
        <p className="text-xs text-[#7d7188]">
          Escribe sin filtros ni juicios lo que tu mente se está recriminando:
        </p>
        <textarea
          value={culpa}
          onChange={(e) => handleCulpaChange(e.target.value)}
          placeholder="Ej: Siento culpa porque me enojé y respondí cortante a mi mamá..."
          rows={3}
          className="w-full p-3 text-sm rounded-xl border border-[#e6dcf0] bg-[#f8f4ee]/50 focus:bg-white focus:ring-2 focus:ring-[#5b2a63]/30 focus:border-[#5b2a63] outline-none transition-all"
        />
      </div>

      {/* Step 2 */}
      <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-4 shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5b2a63] block">
          2. Reescríbelo desde la responsabilidad compasiva
        </label>
        <p className="text-xs text-[#7d7188]">
          Comienza con: <i>"Fui responsable de... y de esto aprendí que..."</i>
        </p>
        <textarea
          value={resp}
          onChange={(e) => handleRespChange(e.target.value)}
          placeholder="Ej: Fui responsable de no comunicar mi cansancio a tiempo. Aprendí que cuando me siento sobrecargado/a necesito pausar antes de hablar..."
          rows={4}
          className="w-full p-3 text-sm rounded-xl border border-[#e6dcf0] bg-[#f8f4ee]/50 focus:bg-white focus:ring-2 focus:ring-[#5b2a63]/30 focus:border-[#5b2a63] outline-none transition-all"
        />
      </div>

      {savedMessage && (
        <div className="text-center text-xs font-semibold text-[#5b2a63] flex items-center justify-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Guardado automáticamente</span>
        </div>
      )}

      {/* Affirmation Card */}
      <div className="bg-gradient-to-br from-[#efe4f5] to-[#f5ebf8] border border-[#d9c3e0] rounded-2xl p-5 text-center shadow-xs space-y-2">
        <div className="w-8 h-8 rounded-full bg-[#5b2a63] text-[#ead08f] mx-auto flex items-center justify-center">
          <Heart className="w-4 h-4 fill-[#ead08f]" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#5b2a63] block">
          Nueva verdad en el corazón
        </span>
        <blockquote className="text-sm font-serif italic text-[#332a3d] leading-relaxed">
          "Soy un ser humano en constante aprendizaje. Mis errores son información para crecer, no motivos para castigarme. Me trato con la misma ternura que le ofrecería a quien amo."
        </blockquote>
      </div>
    </div>
  );
};
