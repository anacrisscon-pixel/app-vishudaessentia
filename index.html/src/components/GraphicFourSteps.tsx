import React, { useState } from 'react';
import { audioEngine } from '../utils/audioEngine';
import {
  CheckCircle2,
  Circle,
  Play,
  Video,
  Headphones,
  Sparkles,
  ArrowRight,
  Activity,
  Award,
  ChevronRight,
} from 'lucide-react';

export interface StepItem {
  stepNumber: number;
  title: string;
  action: string;
  toolLabel: string;
}

interface GraphicFourStepsProps {
  steps: StepItem[];
  onOpenMedia: (media: 'video' | 'meditation') => void;
  onOpenHacks: () => void;
  onOpenAi: () => void;
  videoDuration?: string;
  meditationDuration?: string;
}

export const GraphicFourSteps: React.FC<GraphicFourStepsProps> = ({
  steps,
  onOpenMedia,
  onOpenHacks,
  onOpenAi,
  videoDuration = '4 min',
  meditationDuration = '12 min',
}) => {
  // Estado de pasos completados (interactivo para que el usuario sienta avance)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStepCompleted = (stepNum: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompletedSteps((prev) => {
      const nextState = !prev[stepNum];
      if (nextState) {
        audioEngine.playChime(580);
      } else {
        audioEngine.playTap();
      }
      return { ...prev, [stepNum]: nextState };
    });
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (steps.length || 4)) * 100);

  // Iconos y colores infográficos por número de paso
  const getStepVisualConfig = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return {
          icon: '🫀',
          category: 'Fisiología Somática',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          borderColor: 'border-emerald-600',
          accentColor: '#144436',
          actionText: 'Hacer Hack Somático',
          actionHandler: () => onOpenHacks(),
        };
      case 2:
        return {
          icon: '🎬',
          category: 'Comprensión Visual',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          borderColor: 'border-[#c5a059]',
          accentColor: '#845c1c',
          actionText: `Ver Video (${videoDuration})`,
          actionHandler: () => onOpenMedia('video'),
        };
      case 3:
        return {
          icon: '🧘',
          category: 'Regulación Profunda',
          badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
          borderColor: 'border-teal-600',
          accentColor: '#1b4d3e',
          actionText: `Meditar (${meditationDuration})`,
          actionHandler: () => onOpenMedia('meditation'),
        };
      case 4:
      default:
        return {
          icon: '✨',
          category: 'Integración Sabia',
          badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
          borderColor: 'border-purple-600',
          accentColor: '#5b2a63',
          actionText: 'Conversar con Alma (IA)',
          actionHandler: () => onOpenAi(),
        };
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. CABECERA INFOGRÁFICA CON BARRA DE PROGRESO */}
      <div className="bg-[#f3f9f5] border-2 border-[#bcdbc9] rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <div>
              <b className="text-xs sm:text-sm font-bold text-[#0e2721] block">
                Ruta Gráfica de los 4 Pasos
              </b>
              <span className="text-[11px] text-[#4d6357]">
                Sigue la secuencia ilustrada para volver a tu centro
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-[#144436] text-[#ead08f] flex-shrink-0 shadow-2xs">
            {completedCount}/4 listos
          </span>
        </div>

        {/* Barra de progreso visual con porcentaje */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-[#445b50]">
            <span>Progreso de Integración</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#d6e8de] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#144436] to-[#256c57] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {progressPercent === 100 && (
          <div className="bg-[#eaf5ef] border border-[#a2cfb7] p-2.5 rounded-2xl flex items-center gap-2 text-xs text-[#144436] font-bold animate-fadeIn">
            <Award className="w-4 h-4 text-[#c5a059]" />
            <span>¡Enhorabuena! Has completado todo tu ciclo de integración de hoy.</span>
          </div>
        )}
      </div>

      {/* 2. ROADMAP VISUAL CONECTADO (Nodos e Ilustraciones) */}
      <div className="relative pl-3 sm:pl-4 space-y-3.5">
        {/* Línea conectora vertical de la línea de tiempo */}
        <div className="absolute left-[26px] sm:left-[30px] top-6 bottom-6 w-1 bg-gradient-to-b from-[#144436] via-[#c5a059] to-[#5b2a63] rounded-full z-0 opacity-40" />

        {steps.map((st) => {
          const config = getStepVisualConfig(st.stepNumber);
          const isDone = Boolean(completedSteps[st.stepNumber]);

          return (
            <div
              key={st.stepNumber}
              className={`relative z-10 rounded-2xl p-3.5 sm:p-4 border-2 transition-all shadow-xs ${
                isDone
                  ? 'bg-[#f4faf6] border-emerald-500 opacity-95'
                  : 'bg-white border-[#d3e5dc] hover:border-[#144436]'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* NODO NUMÉRICO / CHECKMARK INTERACTIVO */}
                <button
                  onClick={(e) => toggleStepCompleted(st.stepNumber, e)}
                  title={isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 cursor-pointer transition-all shadow-sm ${
                    isDone
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                      : 'bg-[#144436] text-[#ead08f] hover:scale-105'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <span>{st.stepNumber}</span>
                  )}
                </button>

                {/* CONTENIDO INFOGRÁFICO DE LA TARJETA */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{config.icon}</span>
                      <b
                        className={`text-xs sm:text-sm font-bold ${
                          isDone ? 'text-emerald-900 line-through opacity-80' : 'text-[#0e2721]'
                        }`}
                      >
                        {st.title}
                      </b>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeColor}`}
                    >
                      {config.category}
                    </span>
                  </div>

                  <p className="text-xs text-[#3d5248] leading-relaxed">
                    {st.action}
                  </p>

                  {/* BOTÓN DE ACCIÓN VISUAL DIRECTA */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[#eaf2ed]">
                    <span className="text-[10px] text-[#697f74]">
                      {isDone ? '✨ Paso completado' : 'Pulsa para realizarlo ahora:'}
                    </span>

                    <button
                      onClick={() => {
                        config.actionHandler();
                        audioEngine.playTap();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#f2f8f5] hover:bg-[#144436] hover:text-[#ead08f] text-[#144436] border border-[#bcdbc9] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                    >
                      <span>{config.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. RESUMEN PEDAGÓGICO DE LA SECUENCIA */}
      <div className="bg-[#fcfdfc] border border-[#d2e5db] rounded-2xl p-3 flex items-center justify-between text-xs text-[#445b50]">
        <div className="flex items-center gap-2">
          <span>💡</span>
          <span className="text-[11px] leading-snug">
            <b>Secuencia clave:</b> Primero calma el cuerpo (1), luego comprende (2), repara tu calma (3) y finalmente decide tu respuesta (4).
          </span>
        </div>
      </div>
    </div>
  );
};
