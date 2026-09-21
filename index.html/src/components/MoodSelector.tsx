import React, { useState } from 'react';
import { MOODS } from '../data/vishudaData';
import { getTodayMood, setTodayMood } from '../utils/storage';
import { Check } from 'lucide-react';

interface MoodSelectorProps {
  onSelectMood?: (moodId: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelectMood }) => {
  const [selectedMood, setSelectedMoodState] = useState<string | null>(getTodayMood());
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedMoodState(id);
    setTodayMood(id);
    setShowFeedback(true);
    if (onSelectMood) {
      onSelectMood(id);
    }
  };

  const getMoodFeedback = (id: string | null) => {
    switch (id) {
      case 'alegria':
        return 'Tu alegría es bienvenida y no necesita justificarse. Disfruta tu expansión.';
      case 'calma':
        return 'Habitas tu centro. Desde este espacio es más fácil ver tus patrones con claridad.';
      case 'ansiedad':
        return 'Tu cuerpo está en alerta cuidándote. Toma tres respiraciones profundas antes de continuar.';
      case 'enojo':
        return 'El enojo protege tus límites. Escucha qué valor tuyo sintió que fue invadido.';
      case 'tristeza':
        return 'La tristeza honra lo que te importa. Permítete ir despacio hoy sin exigirte rendir.';
      default:
        return 'Todas tus emociones traen información valiosa. Ninguna es un error.';
    }
  };

  return (
    <div className="bg-[#fffdfa] border border-[#d5c19f] rounded-2xl p-3 shadow-md -mt-7 relative z-10">
      <div className="text-center mb-2">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#7d7188]">
          ¿Cómo estás llegando hoy?
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#efe4f5] ring-2 ring-[#5b2a63] scale-105'
                  : 'hover:bg-[#f7f2ec]'
              }`}
              title={m.label}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-xs transition-transform"
                style={{ backgroundColor: m.color }}
              >
                {m.emoji}
              </div>
              <span className="text-[11px] font-medium text-[#332a3d] mt-1 line-clamp-1">
                {m.label}
              </span>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#5b2a63] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {selectedMood && showFeedback && (
        <div className="mt-2.5 pt-2 border-t border-[#f0e5d7] text-center text-xs text-[#5b2a63] font-medium animate-fadeIn">
          {getMoodFeedback(selectedMood)}
        </div>
      )}
    </div>
  );
};
