import React, { useState } from 'react';
import { Wind, Feather, Check, Sparkles } from 'lucide-react';

interface PracticesModalProps {
  onBack: () => void;
  onOpenCortisol: () => void;
}

const CHOICE_ITEMS = [
  {
    icon: '🫥',
    title: 'Me cierro',
    desc: 'Cuando algo me duele, prefiero ocultarlo, congelarme o alejarme.',
    reflection:
      'Cerrarte te protegió alguna vez cuando el entorno era hostil. Hoy eres adulto/a y puedes elegir abrir solo un poco con quien se ha ganado tu confianza.',
  },
  {
    icon: '🤝',
    title: 'Busco aprobación',
    desc: 'Necesito sentir que hice lo correcto para el otro antes de calmarme.',
    reflection:
      'Tu valor no depende de la validación externa. Practica notar cuándo actúas para ti y cuándo actúas solo para calmar la alarma del rechazo.',
  },
  {
    icon: '⚔️',
    title: 'Me defiendo',
    desc: 'Ante cualquier crítica o señal ambigua, respondo rápido, justifico o ataco.',
    reflection:
      'Defenderte es comprensible si aprendiste que el mundo juzga. Prueba soltar la armadura 30 segundos y preguntarte: ¿qué parte de mí se sintió en peligro?',
  },
  {
    icon: '🏃',
    title: 'Evito',
    desc: 'Prefiero posponer, evadir o cambiar de tema ante lo incómodo.',
    reflection:
      'Evitar da un alivio inmediato de minutos, pero la situación sigue ahí. ¿Qué pasaría si te quedas un minuto más respirando con calma?',
  },
  {
    icon: '🎛️',
    title: 'Intento controlar',
    desc: 'Si organizo y preveo cada detalle, siento que nada malo va a pasar.',
    reflection:
      'El control es un intento de sentirte a salvo en un mundo incierto. Practica soltar una sola cosa pequeña hoy y confía en tu capacidad de adaptarte.',
  },
  {
    icon: '🫶',
    title: 'Me adapto',
    desc: 'Cambio lo que necesito para que la relación o el ambiente funcione sin roces.',
    reflection:
      'Adaptarte tiene un límite sano: el punto exacto donde dejas de reconocerte a ti misma/o. Tus necesidades también merecen espacio.',
  },
];

const COMPLETION_PROMPTS = [
  'Cuando algo me duele en un vínculo, mi primer impulso es…',
  'Lo que realmente necesito en esos momentos y me cuesta pedir es…',
  'Si pudiera responder distinto sin miedo al rechazo, haría…',
  'Una señal física de que estoy actuando en automático es…',
];

const VIZ_STEPS = [
  'Cierra los ojos y toma 3 respiraciones profundas alargando la exhalación.',
  'Recuerda la última vez que sentiste esta reacción automática dispararse.',
  'Ahora imagina que tienes 10 segundos extra antes de reaccionar. El tiempo se ralentiza.',
  'En esos 10 segundos, ¿qué te gustaría hacer diferente? ¿Cómo respira tu cuerpo?',
  'Abre los ojos cuando estés listo/a y escribe aquí lo que apareció.',
];

export const PracticesModal: React.FC<PracticesModalProps> = ({ onBack, onOpenCortisol }) => {
  const [subMode, setSubMode] = useState<'menu' | 'choice' | 'complete' | 'scale' | 'viz'>('menu');
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);

  // Completion answers
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    try {
      const raw = localStorage.getItem('vishuda_complete_answers');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Scale state
  const [scaleScore, setScaleScore] = useState<number>(3);
  const [scaleNote, setScaleNote] = useState<string>('');

  // Viz state
  const [vizNote, setVizNote] = useState<string>('');
  const [vizComplete, setVizComplete] = useState<boolean>(false);

  const handleAnswerChange = (idx: number, text: string) => {
    const updated = { ...answers, [idx]: text };
    setAnswers(updated);
    try {
      localStorage.setItem('vishuda_complete_answers', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="space-y-5 pb-8">
      <button
        onClick={() => {
          if (subMode !== 'menu') {
            setSubMode('menu');
          } else {
            onBack();
          }
        }}
        className="text-xs font-bold text-[#5b2a63] hover:underline flex items-center gap-1"
      >
        ← {subMode !== 'menu' ? 'Volver a prácticas' : 'Volver al inicio'}
      </button>

      {subMode === 'menu' && (
        <div className="space-y-4">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
              Laboratorio Consciente
            </span>
            <h1 className="text-2xl font-extrabold text-[#332a3d] mt-1">
              Prácticas de Nuevas Respuestas
            </h1>
            <p className="text-sm text-[#655a68] mt-1 leading-relaxed">
              No se trata de reaccionar perfecto. Se trata de ensayar alternativas para que tu mente descubra que existen otros caminos.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => setSubMode('choice')}
              className="w-full text-left p-4 rounded-2xl bg-[#fffdfa] border border-[#d8c8ad] hover:border-[#5b2a63] transition-all flex items-start gap-3 shadow-xs group"
            >
              <span className="text-2xl">🃏</span>
              <div className="flex-1 min-w-0">
                <b className="text-sm text-[#332a3d] group-hover:text-[#5b2a63] block">
                  Elegir mi respuesta
                </b>
                <p className="text-xs text-[#7d7188] mt-0.5">
                  Tarjetas con reflejos personalizados para cada mecanismo automático.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSubMode('complete')}
              className="w-full text-left p-4 rounded-2xl bg-[#fffdfa] border border-[#d8c8ad] hover:border-[#5b2a63] transition-all flex items-start gap-3 shadow-xs group"
            >
              <span className="text-2xl">✍️</span>
              <div className="flex-1 min-w-0">
                <b className="text-sm text-[#332a3d] group-hover:text-[#5b2a63] block">
                  Completar la frase
                </b>
                <p className="text-xs text-[#7d7188] mt-0.5">
                  Preguntas abiertas para desarmar el automático sin pensar demasiado.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSubMode('scale')}
              className="w-full text-left p-4 rounded-2xl bg-[#fffdfa] border border-[#d8c8ad] hover:border-[#5b2a63] transition-all flex items-start gap-3 shadow-xs group"
            >
              <span className="text-2xl">📊</span>
              <div className="flex-1 min-w-0">
                <b className="text-sm text-[#332a3d] group-hover:text-[#5b2a63] block">
                  ¿Qué tanto te resuena?
                </b>
                <p className="text-xs text-[#7d7188] mt-0.5">
                  Una escala del 1 al 5 con espacio para tu reflexión personal.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSubMode('viz')}
              className="w-full text-left p-4 rounded-2xl bg-[#fffdfa] border border-[#d8c8ad] hover:border-[#5b2a63] transition-all flex items-start gap-3 shadow-xs group"
            >
              <span className="text-2xl">🔮</span>
              <div className="flex-1 min-w-0">
                <b className="text-sm text-[#332a3d] group-hover:text-[#5b2a63] block">
                  Visualización guiada
                </b>
                <p className="text-xs text-[#7d7188] mt-0.5">
                  Paso a paso mental para ensayar una respuesta compasiva antes del conflicto.
                </p>
              </div>
            </button>

            <button
              onClick={onOpenCortisol}
              className="w-full text-left p-4 rounded-2xl bg-[#efe4f5] border border-[#d9c3e0] hover:border-[#5b2a63] transition-all flex items-start gap-3 shadow-xs group"
            >
              <span className="text-2xl">🌬️</span>
              <div className="flex-1 min-w-0">
                <b className="text-sm text-[#5b2a63] block">
                  Respiración 4-7-8 y calma somática
                </b>
                <p className="text-xs text-[#7d7188] mt-0.5">
                  Desactivación de la alarma fisiológica en tiempo real.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Submode 1: Choice */}
      {subMode === 'choice' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
              Práctica · Elegir mi respuesta
            </span>
            <h2 className="text-xl font-extrabold text-[#332a3d] mt-1">
              ¿Cómo sueles responder cuando algo te activa?
            </h2>
            <p className="text-xs text-[#7d7188] mt-1">
              Toca la que más se parezca a tu tendencia de hoy:
            </p>
          </div>

          <div className="space-y-2">
            {CHOICE_ITEMS.map((item, idx) => {
              const isSel = selectedChoiceIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedChoiceIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSel
                      ? 'bg-[#efe4f5] border-[#5b2a63] ring-1 ring-[#5b2a63]'
                      : 'bg-[#fffdfa] border-[#d8c8ad]'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <b className="text-sm text-[#332a3d] block">{item.title}</b>
                    <p className="text-xs text-[#7d7188] mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedChoiceIdx !== null && (
            <div className="bg-gradient-to-br from-[#efe4f5] to-[#f4eaf7] border border-[#d9c3e0] rounded-2xl p-4 text-xs text-[#332a3d] leading-relaxed animate-fadeIn space-y-1.5">
              <b className="text-[#5b2a63] block font-bold">
                Tu reflejo compasivo:
              </b>
              <p>{CHOICE_ITEMS[selectedChoiceIdx].reflection}</p>
            </div>
          )}
        </div>
      )}

      {/* Submode 2: Complete */}
      {subMode === 'complete' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
              Práctica · Completar la frase
            </span>
            <h2 className="text-xl font-extrabold text-[#332a3d] mt-1">
              Completa sin censurarte
            </h2>
            <p className="text-xs text-[#7d7188] mt-1">
              Escribe lo primero que llegue a tu mente:
            </p>
          </div>

          <div className="space-y-3">
            {COMPLETION_PROMPTS.map((prompt, idx) => (
              <div key={idx} className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-3.5 space-y-2 shadow-xs">
                <label className="text-xs font-bold text-[#332a3d] block leading-snug">
                  {idx + 1}. {prompt}
                </label>
                <textarea
                  value={answers[idx] || ''}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  placeholder="Tu respuesta espontánea..."
                  rows={2}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#e6dcf0] bg-[#f8f4ee]/40 focus:bg-white outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submode 3: Scale */}
      {subMode === 'scale' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
              Práctica · Escala de Resonancia
            </span>
            <h2 className="text-xl font-extrabold text-[#332a3d] mt-1">
              "Actúo desde el automático más seguido de lo que me gustaría admitir."
            </h2>
          </div>

          <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-5 text-center space-y-4 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7d7188]">
              ¿Qué tanto resuena esto contigo hoy?
            </span>
            <div className="flex justify-between max-w-xs mx-auto">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setScaleScore(n)}
                  className={`w-12 h-12 rounded-full font-bold text-base transition-all ${
                    scaleScore === n
                      ? 'bg-[#5b2a63] text-white shadow-md scale-105'
                      : 'bg-[#f8f4ee] text-[#332a3d] border border-[#d8c8ad]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-[#7d7188] max-w-xs mx-auto px-2">
              <span>1: Nada</span>
              <span>3: Regular</span>
              <span>5: Totalmente</span>
            </div>

            <div className="pt-2 text-left">
              <label className="text-xs font-bold text-[#5b2a63] block mb-1">
                ¿Por qué elegiste ese número? (opcional)
              </label>
              <textarea
                value={scaleNote}
                onChange={(e) => setScaleNote(e.target.value)}
                placeholder="Anota una breve observación sobre tu respuesta..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-[#e6dcf0] bg-[#f8f4ee]/40 focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submode 4: Viz */}
      {subMode === 'viz' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#8b708f] font-bold block">
              Práctica · Visualización Guiada
            </span>
            <h2 className="text-xl font-extrabold text-[#332a3d] mt-1">
              Imagina una respuesta distinta
            </h2>
            <p className="text-xs text-[#7d7188] mt-1">
              Tu mente aprende antes en la imaginación que en la realidad.
            </p>
          </div>

          <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-2xl p-5 space-y-3 shadow-xs">
            {VIZ_STEPS.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-sm text-[#332a3d] items-start">
                <span className="w-6 h-6 rounded-full bg-[#efe4f5] text-[#5b2a63] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed flex-1 text-xs">{step}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#5b2a63] block">
              ¿Qué imágenes, sensaciones o palabras aparecieron en tu visualización?
            </label>
            <textarea
              value={vizNote}
              onChange={(e) => setVizNote(e.target.value)}
              placeholder="Escribe lo que experimentaste al pausar..."
              rows={4}
              className="w-full p-3 text-xs rounded-xl border border-[#d8c8ad] bg-white focus:ring-2 focus:ring-[#5b2a63]/20 outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
