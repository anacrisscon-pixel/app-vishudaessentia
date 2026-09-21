import React, { useState } from 'react';
import {
  ANCHORS_MORNING,
  ANCHORS_AFTERNOON,
  ANCHORS_NIGHT,
} from '../data/vishudaData';
import { getDailyAnchors, toggleDailyAnchor } from '../utils/storage';
import { AnchorItem } from '../types';
import { CheckCircle2, Circle, Sun, Sunset, Moon, Sparkles } from 'lucide-react';

interface DailyAnchorsProps {
  onBack: () => void;
}

export const DailyAnchors: React.FC<DailyAnchorsProps> = ({ onBack }) => {
  const [anchorsState, setAnchorsState] = useState<Record<string, boolean>>(getDailyAnchors());

  const allItems: AnchorItem[] = [
    ...ANCHORS_MORNING,
    ...ANCHORS_AFTERNOON,
    ...ANCHORS_NIGHT,
  ];

  const total = allItems.length;
  const completedCount = allItems.filter((item) => anchorsState[item.id]).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const handleToggle = (id: string) => {
    const updated = toggleDailyAnchor(id);
    setAnchorsState({ ...updated });
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: AnchorItem[]
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5b2a63]">
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isDone = !!anchorsState[item.id];
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                isDone
                  ? 'bg-[#efe4f5] border-[#5b2a63]/40 shadow-xs'
                  : 'bg-[#fffdfa] border-[#d8c8ad] hover:border-[#5b2a63]/50'
              }`}
            >
              <div className="text-xl flex-shrink-0 mt-0.5">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-semibold block ${
                    isDone ? 'text-[#331935] line-through opacity-80' : 'text-[#332a3d]'
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-xs text-[#7d7188] block mt-0.5 leading-snug">
                  {item.desc}
                </span>
              </div>
              <div className="mt-1 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#5b2a63]" />
                ) : (
                  <Circle className="w-5 h-5 text-[#d8c8ad]" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

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
          Ritmo y Hábitos
        </span>
        <h1 className="text-2xl font-extrabold text-[#332a3d] mt-1">
          Mis Anclas del Día
        </h1>
        <p className="text-sm text-[#655a68] mt-1 leading-relaxed">
          Pequeños actos somáticos que regulan tu sistema nervioso. No buscan exigirte, sino sostenerte con suavidad.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-[#efe4f5] to-[#f4eaf7] border border-[#d9c3e0] rounded-2xl p-4 shadow-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-[#5b2a63] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Progreso diario
          </span>
          <span className="text-xs font-extrabold text-[#331935]">
            {completedCount} de {total} completadas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#e6dcf0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5b2a63] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {progressPercent === 100 && (
          <p className="text-xs text-[#5b2a63] font-semibold mt-2 text-center">
            ✨ ¡Has cuidado de todas tus anclas hoy! Tu cuerpo te lo agradece.
          </p>
        )}
      </div>

      {renderSection('🌅 Mañana Consciente', <Sun className="w-4 h-4" />, ANCHORS_MORNING)}
      {renderSection('☀️ Tarde en Presencia', <Sunset className="w-4 h-4" />, ANCHORS_AFTERNOON)}
      {renderSection('🌙 Noche Restauradora', <Moon className="w-4 h-4" />, ANCHORS_NIGHT)}
    </div>
  );
};
