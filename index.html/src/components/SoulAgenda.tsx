import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Heart,
  ShieldCheck,
  CheckSquare,
  Square,
  Play,
  Pause,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  Volume2,
  Lock,
  ArrowLeft,
  Feather,
  Sun,
  Smile,
  Check,
} from 'lucide-react';
import { isPremiumUser } from '../utils/storage';

interface SoulAgendaProps {
  onBack?: () => void;
  onOpenPremium?: () => void;
  onStartExploration?: (patternId?: string) => void;
}

type AgendaTab = 'pacto' | 'checkup' | 'baul' | 'espejo' | 'bloques' | 'diario' | 'limites';

interface AgendaBlock {
  id: string;
  number: number;
  title: string;
  focus: string;
  wound: string;
  mask: string;
  color: string;
  symptoms: string[];
  affirmation: string;
  meditationTitle: string;
  meditationDesc: string;
  durationMinutes: number;
  script: string[];
}

const AGENDA_BLOCKS: AgendaBlock[] = [
  {
    id: 'bloque-1',
    number: 1,
    title: 'La Pertenencia',
    focus: 'El Despertar de tu Brillo',
    wound: 'Herida de Rechazo',
    mask: 'La máscara del huidizo',
    color: 'border-emerald-300 bg-emerald-50/50',
    symptoms: [
      'El "No" antes del "No": huir o alejarte antes de que te rechacen.',
      'Pedir perdón por existir: decir "perdón" al entrar, al preguntar o al ocupar un lugar.',
      'Perfeccionismo extremo: creer que solo siendo impecable serás aceptado/a.',
      'Hacerte invisible: callar en reuniones, no destacar para no incomodar.',
    ],
    affirmation: 'Mi presencia es valiosa y mi brillo no opaca a nadie.',
    meditationTitle: 'El Derecho a Estar: Sanar el Rechazo',
    meditationDesc: 'Enraizamiento somático para recordar que tienes derecho a ocupar tu lugar en el mundo.',
    durationMinutes: 8,
    script: [
      'Cierra los ojos. Coloca tus dos pies firmes sobre la tierra.',
      'Inhala profundo y siente el peso de tu cuerpo sostenido sin esfuerzo.',
      'Reconoce: No necesitas pedir permiso para existir.',
      'Repite mentalmente: Este espacio también me pertenece.',
    ],
  },
  {
    id: 'bloque-2',
    number: 2,
    title: 'La Autonomía',
    focus: 'Mi Amor es mi Hogar Seguro',
    wound: 'Herida de Abandono',
    mask: 'El Apego Ansioso',
    color: 'border-amber-300 bg-amber-50/50',
    symptoms: [
      'Revisar el celular compulsivamente esperando señales de vida.',
      'Convertirte en camaleón: cambiar tus gustos para que el otro no se vaya.',
      'Miedo al silencio: llenar cada momento de ruido para no sentir soledad.',
      'Dar de más para volverte indispensable en la vida ajena.',
      'Perdonar lo imperdonable por pánico a quedarte solo/a.',
    ],
    affirmation: 'La única verdad es mi amor y mi propia compañía.',
    meditationTitle: 'Mi Propio Refugio: Sanar el Abandono',
    meditationDesc: 'Visualización profunda para soltar la necesidad de salvadores externos.',
    durationMinutes: 10,
    script: [
      'Lleva una mano a tu pecho y otra a tu abdomen.',
      'Siente la calidez de tu propia palma sobre tu corazón.',
      'Tú eres la persona que nunca te va a dejar en soledad.',
      'Inhala seguridad, exhala la necesidad urgente de aprobación.',
    ],
  },
  {
    id: 'bloque-3',
    number: 3,
    title: 'La Libertad y el Placer',
    focus: 'Respiro Libertad y no Miento',
    wound: 'Herida de Humillación',
    mask: 'La Culpa y el Autosacrificio',
    color: 'border-rose-300 bg-rose-50/50',
    symptoms: [
      'El "Sí" automático: aceptar compromisos por miedo a quedar mal.',
      'Olvidar tus necesidades básicas (alimentación, descanso) por otros.',
      'Sentirte observado/a: creer que todos están juzgando tus fallos.',
      'Vergüenza de brillar o recibir halagos.',
      'Cargar con mochilas y problemas que no son tuyos.',
    ],
    affirmation: 'Merezco el placer de ser yo mismo/a, sin culpas ni condiciones.',
    meditationTitle: 'Libertad y Placer: Sanar la Humillación',
    meditationDesc: 'Desactivar la culpa por descansar y abrazar el goce sin pedir perdón.',
    durationMinutes: 9,
    script: [
      'Suelta la mandíbula y deja caer los hombros.',
      'El placer no es un lujo que tienes que ganarte; es tu derecho de nacimiento.',
      'Permítete no hacer nada durante los próximos instantes.',
      'Inhala libertad, exhala la carga ajena.',
    ],
  },
  {
    id: 'bloque-4',
    number: 4,
    title: 'La Confianza y el Poder',
    focus: 'Suelto el Control y Confío',
    wound: 'Herida de Traición',
    mask: 'El Controlador / La Armadura de Hierro',
    color: 'border-indigo-300 bg-indigo-50/50',
    symptoms: [
      'Hipervigilancia constante: buscar señales ocultas o mentiras.',
      'Dificultad para delegar: "Si no lo hago yo, nadie lo hace bien".',
      'La armadura de hierro: jamás mostrar vulnerabilidad ni debilidad.',
      'Crear escenarios catastróficos en tu mente para estar preparado/a.',
      'Dudar sistemáticamente de las buenas intenciones de los demás.',
    ],
    affirmation: 'Suelto el control y confío en que estoy a salvo.',
    meditationTitle: 'Volver a Confiar: Sanar la Traición',
    meditationDesc: 'Aprender a bajar la guardia del sistema nervioso y confiar en tu fuerza interna.',
    durationMinutes: 11,
    script: [
      'Observa la tensión en tu cuello y tu espalda.',
      'Has llevado una armadura muy pesada durante mucho tiempo.',
      'Por hoy, puedes soltar la espada. Estás a salvo en este instante.',
      'La verdadera fuerza no es vigilar todo; es confiar en tu capacidad de sostenerte.',
    ],
  },
  {
    id: 'bloque-5',
    number: 5,
    title: 'El Equilibrio y la Flexibilidad',
    focus: 'De la Rigidez a la Bondad',
    wound: 'Herida de Injusticia',
    mask: 'El Perfeccionismo Implacable',
    color: 'border-teal-300 bg-teal-50/50',
    symptoms: [
      'Perfeccionismo extremo: si algo no sale impecable, no tiene valor.',
      'Autoexigencia implacable: culpa al detenerte, lista interminable de tareas.',
      'Bloqueo emocional (frialdad): priorizar la lógica sobre lo que sientes.',
      'No pedir ayuda por considerarlo un signo de debilidad.',
      'Comparación constante con estándares inalcanzables.',
    ],
    affirmation: 'Suelto la perfección para abrazar mi humanidad.',
    meditationTitle: 'De la Rigidez a la Bondad: Sanar la Injusticia',
    meditationDesc: 'Reconocer que tu valor sigue intacto incluso en los días en que no eres productivo/a.',
    durationMinutes: 8,
    script: [
      'Respira hondo y siente la suavidad de tu inhalación.',
      'No eres un robot creado para rendir sin fallar.',
      'Eres un ser humano vulnerable, sabio y en constante aprendizaje.',
      'Hoy te das permiso de equivocarte, descansar y volver a empezar.',
    ],
  },
];

export const SoulAgenda: React.FC<SoulAgendaProps> = ({
  onBack,
  onOpenPremium,
  onStartExploration,
}) => {
  const [activeTab, setActiveTab] = useState<AgendaTab>('bloques');
  const [activeBlock, setActiveBlock] = useState<AgendaBlock>(AGENDA_BLOCKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStep, setAudioStep] = useState(0);

  // Pact state
  const [pactSigned, setPactSigned] = useState(() => {
    return localStorage.getItem('vishuda_pact_signed') === 'true';
  });
  const [signatureName, setSignatureName] = useState(() => {
    return localStorage.getItem('vishuda_pact_name') || '';
  });

  // Check-up state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('vishuda_checkup_items');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Daily space state
  const [dailyMood, setDailyMood] = useState('Alegría');
  const [thermometerValue, setThermometerValue] = useState(7);
  const [dailyJournal, setDailyJournal] = useState(() => {
    return localStorage.getItem('vishuda_daily_journal_' + new Date().toDateString()) || '';
  });
  const [dailyFocus, setDailyFocus] = useState(['', '', '']);
  const [dailyHabits, setDailyHabits] = useState<Record<string, boolean>>({});

  // Audio timer simulation
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setAudioStep((prev) => (prev + 1) % activeBlock.script.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeBlock]);

  const handleSignPact = () => {
    if (signatureName.trim()) {
      setPactSigned(true);
      localStorage.setItem('vishuda_pact_signed', 'true');
      localStorage.setItem('vishuda_pact_name', signatureName);
    }
  };

  const toggleCheckItem = (key: string) => {
    const updated = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(updated);
    localStorage.setItem('vishuda_checkup_items', JSON.stringify(updated));
  };

  const handleSaveJournal = (text: string) => {
    setDailyJournal(text);
    localStorage.setItem('vishuda_daily_journal_' + new Date().toDateString(), text);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Top Breadcrumb */}
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#1e5f6e] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>
      )}

      {/* Header Banner - Exact from Agenda para el Alma */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a1738] via-[#432356] to-[#592b6e] text-white p-5 shadow-lg border border-[#c5a059]/40">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-[0.22em] px-2.5 py-0.5 rounded-full bg-[#ead08f] text-[#2a1738]">
              AGENDA PARA EL ALMA
            </span>
            <span className="text-xs text-[#ead08f] font-serif italic">
              "Brilla sin pedir permiso"
            </span>
          </div>

          <h1 className="text-xl font-serif font-extrabold text-white leading-snug">
            El Mapa Vivo de tus Patrones Inconscientes
          </h1>
          <p className="text-xs text-[#ebdce6] leading-relaxed">
            Tu libro y agenda de sanación somática, digitalizada para acompañarte en tu día a día: heridas de infancia, espejos, pacto de amor y límites conscientes.
          </p>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {[
          { id: 'bloques', label: '5 Bloques de Heridas' },
          { id: 'checkup', label: 'Check-up del Corazón' },
          { id: 'limites', label: 'Detector de Límites' },
          { id: 'diario', label: 'Mi Espacio Diario' },
          { id: 'pacto', label: 'Pacto Conmigo' },
          { id: 'espejo', label: 'Limpiando el Espejo' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AgendaTab)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#1e353f] text-[#ead08f] shadow-sm'
                : 'bg-[#fffdfa] border border-[#d8c8ad] text-[#4f5860] hover:bg-[#f3ebe0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 5 BLOQUES DE HERIDAS (Heart of the Agenda) */}
      {activeTab === 'bloques' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Block Selector */}
          <div className="grid grid-cols-5 gap-1.5">
            {AGENDA_BLOCKS.map((b) => {
              const isSelected = activeBlock.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBlock(b);
                    setIsPlaying(false);
                    setAudioStep(0);
                  }}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#1e353f] text-white ring-2 ring-[#c5a059] shadow-md scale-102'
                      : 'bg-[#fffdfa] border border-[#d8c8ad] text-[#555f66] hover:bg-[#f5eee3]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-extrabold block">
                    B{b.number}
                  </span>
                  <b className="text-[11px] truncate max-w-full block mt-0.5">
                    {b.title.split(' ')[1] || b.title}
                  </b>
                </button>
              );
            })}
          </div>

          {/* Active Block Card */}
          <div className="bg-[#fffdfa] border-2 border-[#1e353f] rounded-3xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#ebdcc9] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e5f6e] block">
                  BLOQUE {activeBlock.number} · {activeBlock.focus}
                </span>
                <h2 className="text-lg font-serif font-extrabold text-[#1f2b33]">
                  {activeBlock.title}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  {activeBlock.wound}
                </span>
                <span className="text-[10px] text-[#786e60] block mt-0.5">
                  {activeBlock.mask}
                </span>
              </div>
            </div>

            {/* Inconscious Patterns from PDF */}
            <div className="space-y-2">
              <b className="text-xs font-bold text-[#1f2b33] uppercase tracking-wider block">
                Patrones Inconscientes que se activan:
              </b>
              <div className="space-y-1.5">
                {activeBlock.symptoms.map((sym, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e4d9c8] text-xs text-[#3d454c]"
                  >
                    <span className="text-[#c5a059] font-bold mt-0.5">✦</span>
                    <span className="leading-relaxed">{sym}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Affirmation from the PDF */}
            <div className="p-3.5 rounded-2xl bg-[#fdf9f0] border border-[#d6b97b] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a6b28]">
                Afirmación del Mes
              </span>
              <blockquote className="text-sm font-serif italic font-bold text-[#1f2b33]">
                "{activeBlock.affirmation}"
              </blockquote>
            </div>

            {/* Audio Guided Meditation (Built directly from Agenda QR Codes!) */}
            <div className="bg-[#1e353f] text-white rounded-2xl p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#ead08f] text-[#1e353f] flex items-center justify-center font-bold">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#ead08f] uppercase tracking-wider font-bold block">
                      Meditación de Sanación
                    </span>
                    <b className="text-xs text-white block">
                      {activeBlock.meditationTitle}
                    </b>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#ead08f]">
                  {activeBlock.durationMinutes} min
                </span>
              </div>

              <p className="text-xs text-[#d3e2e7] leading-relaxed">
                {activeBlock.meditationDesc}
              </p>

              {/* Synchronized Script when playing */}
              {isPlaying && (
                <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-center space-y-1 animate-fadeIn">
                  <span className="text-[10px] uppercase tracking-widest text-[#ead08f] font-mono">
                    Paso {audioStep + 1} de {activeBlock.script.length}
                  </span>
                  <p className="text-xs font-serif italic text-white leading-relaxed">
                    "{activeBlock.script[audioStep]}"
                  </p>
                </div>
              )}

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ead08f] to-[#deb970] text-[#162730] font-extrabold text-xs shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-[#162730]" />
                    <span>Pausar meditación guiada</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-[#162730]" />
                    <span>Reproducir meditación del bloque</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHECK-UP DEL CORAZÓN (Page 8 of PDF) */}
      {activeTab === 'checkup' && (
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e5f6e] block">
              TEST INTERACTIVO · PÁGINA 8
            </span>
            <h2 className="text-lg font-serif font-extrabold text-[#1f2b33]">
              Check-up del Corazón
            </h2>
            <p className="text-xs text-[#636b72] leading-relaxed mt-0.5">
              Un momento para escucharte sin filtros. Marca con una cruz las frases que resuenan contigo ahora mismo.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <b className="text-xs font-bold text-[#1e5f6e] uppercase tracking-wider block">
                En mis relaciones (pareja, amigos o familia):
              </b>
              {[
                { id: 'rel-1', text: 'Siento que siempre doy mucho más de lo que recibo.' },
                { id: 'rel-2', text: 'Me da pánico decir que "no" porque siento que se van a enojar o me van a dejar.' },
                { id: 'rel-3', text: 'Me atraen personas que no están disponibles o que tengo que "arreglar".' },
                { id: 'rel-4', text: 'Me cuesta poner límites y termino haciendo cosas que no quiero.' },
                { id: 'rel-5', text: 'Siento que si me conocen de verdad, no me van a querer.' },
              ].map((item) => {
                const checked = checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      checked
                        ? 'bg-[#1e353f] text-white border-[#1e353f]'
                        : 'bg-[#fbf9f4] border-[#e4dcd0] text-[#333a42] hover:bg-[#f3ede1]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#ead08f]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8a7f6f]" />
                      )}
                    </div>
                    <span className="text-xs leading-relaxed">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#ebdcc9]">
              <b className="text-xs font-bold text-[#1e5f6e] uppercase tracking-wider block">
                Conmigo misma / mismo:
              </b>
              {[
                { id: 'self-1', text: 'Mi voz interna es muy dura y me critica por todo.' },
                { id: 'self-2', text: 'Me siento culpable cuando me tomo tiempo para descansar o no hacer nada.' },
                { id: 'self-3', text: 'A veces siento un vacío que trato de llenar con comida, compras o redes sociales.' },
                { id: 'self-4', text: 'Me cuesta reconocer mis logros; siempre veo lo que me falta.' },
              ].map((item) => {
                const checked = checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      checked
                        ? 'bg-[#1e353f] text-white border-[#1e353f]'
                        : 'bg-[#fbf9f4] border-[#e4dcd0] text-[#333a42] hover:bg-[#f3ede1]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#ead08f]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8a7f6f]" />
                      )}
                    </div>
                    <span className="text-xs leading-relaxed">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DETECTOR DE LÍMITES (Page 70-75 of PDF) */}
      {activeTab === 'limites' && (
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e5f6e] block">
              BLOQUE FINAL · PÁGINA 70
            </span>
            <h2 className="text-lg font-serif font-extrabold text-[#1f2b33]">
              Mis Límites son mi Amor Propio en Acción
            </h2>
            <p className="text-xs text-[#636b72] leading-relaxed mt-0.5">
              Poner límites no es levantar un muro; es abrir una puerta para elegir con consciencia qué dejas entrar a tu vida.
            </p>
          </div>

          {/* Practical Scripts from PDF */}
          <div className="space-y-3">
            <b className="text-xs font-bold text-[#1f2b33] uppercase tracking-wider block">
              Frases listas para adaptar (sin pedir perdón por existir):
            </b>

            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e2d5c2] space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#1e5f6e] block">
                En pareja:
              </span>
              <p className="italic text-[#333d45]">
                "Cuando me hablas así, necesito que paremos la conversación y la retomemos cuando ambos estemos en calma."
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e2d5c2] space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#1e5f6e] block">
                Con la familia:
              </span>
              <p className="italic text-[#333d45]">
                "Entiendo que te preocupa, pero esa decisión ya la tomé y no está en discusión."
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e2d5c2] space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#1e5f6e] block">
                En el trabajo y con amistades:
              </span>
              <p className="italic text-[#333d45]">
                "No voy a poder, pero gracias por pensar en mí." (Y punto, sin justificaciones excesivas).
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e2d5c2] space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#1e5f6e] block">
                Conmigo misma / mismo:
              </span>
              <p className="italic text-[#333d45]">
                "Hoy no terminé todo lo que quería y está bien. Mañana continúo sin castigarme."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MI ESPACIO DIARIO (Journaling from PDF) */}
      {activeTab === 'diario' && (
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e5f6e] block">
                HOY ES {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <h2 className="text-lg font-serif font-extrabold text-[#1f2b33]">
                Mi Espacio Diario
              </h2>
            </div>
            <span className="text-xs font-bold text-[#8a6b28] bg-[#fbf5e6] px-2.5 py-1 rounded-full border border-[#e2d3b0]">
              Termómetro: {thermometerValue}/10
            </span>
          </div>

          {/* Thermometer Slider */}
          <div className="space-y-1 bg-[#fbf9f4] p-3 rounded-2xl border border-[#ebdcc9]">
            <div className="flex justify-between text-[11px] text-[#786e60] font-semibold">
              <span>Termómetro Emocional (Vacía)</span>
              <span>(Rebosante)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={thermometerValue}
              onChange={(e) => setThermometerValue(Number(e.target.value))}
              className="w-full accent-[#1e5f6e] cursor-pointer"
            />
          </div>

          {/* Journaling free write */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1f2b33] uppercase tracking-wider block">
              Journaling: Vaciando mi mente
            </label>
            <textarea
              rows={4}
              value={dailyJournal}
              onChange={(e) => handleSaveJournal(e.target.value)}
              placeholder="Escribe aquí lo primero que te venga a la mente... este espacio no se juzga."
              className="w-full p-3 rounded-2xl bg-[#fdfbf7] border border-[#e0d4c1] text-xs text-[#2b333a] focus:outline-none focus:ring-2 focus:ring-[#1e5f6e] leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 5: PACTO CONMIGO MISMA (Page 7 of PDF) */}
      {activeTab === 'pacto' && (
        <div className="bg-[#fffdfa] border-2 border-[#c5a059] rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div className="text-center space-y-1 border-b border-[#ebdcc9] pb-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8a6b28] block">
              COMPROMISO DE AUTOCOMPASIÓN
            </span>
            <h2 className="text-xl font-serif font-extrabold text-[#1f2b33]">
              ¡Un Pacto Conmigo Misma!
            </h2>
            <p className="text-xs text-[#636b72]">
              Sanar no es una línea recta donde todo es felicidad. Es abrazar cada paso con paciencia.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-[#3d454c] leading-relaxed">
            <p className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e4dcd0]">
              <b>1. No me voy a juzgar:</b> Si hoy no tengo ganas de escribir o si lo que sale es puro caos, no me voy a castigar.
            </p>
            <p className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e4dcd0]">
              <b>2. Voy a ser mi prioridad:</b> Me doy permiso de decir "no" al mundo para decirme "sí" a mí.
            </p>
            <p className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e4dcd0]">
              <b>3. Acepto mi proceso:</b> Mis sombras son parte de mi historia y voy a aprender a bailar con ellas.
            </p>
            <p className="p-2.5 rounded-xl bg-[#f8f5ee] border border-[#e4dcd0]">
              <b>4. Me voy a tener paciencia:</b> Si un patrón regresa, no significa que fallé; significa que sigo aprendiendo.
            </p>
          </div>

          {/* Digital Signature */}
          <div className="p-4 rounded-2xl bg-[#f7f3ea] border border-[#decbb2] space-y-3">
            <label className="text-xs font-bold text-[#1f2b33] block">
              Tu nombre y firma consciente:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Escribe tu nombre completo..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#d6c7b0] text-xs font-serif italic text-[#1f2b33] focus:outline-none focus:ring-2 focus:ring-[#1e5f6e]"
              />
              <button
                onClick={handleSignPact}
                className="px-4 py-2 rounded-xl bg-[#1e353f] hover:bg-[#14262f] text-[#ead08f] font-bold text-xs shadow-sm transition-all"
              >
                {pactSigned ? 'Firmado ✓' : 'Firmar pacto'}
              </button>
            </div>
            {pactSigned && (
              <span className="text-[11px] text-emerald-800 font-bold block flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Pacto sellado con amor y respeto.
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: LIMPIANDO EL ESPEJO (Page 11 of PDF) */}
      {activeTab === 'espejo' && (
        <div className="bg-[#fffdfa] border border-[#d8c8ad] rounded-3xl p-5 shadow-md space-y-4 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1e5f6e] block">
              SOLTAR PARA AVANZAR · PÁGINA 11
            </span>
            <h2 className="text-lg font-serif font-extrabold text-[#1f2b33]">
              Limpiando el Espejo
            </h2>
            <p className="text-xs text-[#636b72]">
              Imagina que estás limpiando un espejo empañado para poder verte de verdad.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e4dcd0] space-y-1">
              <b className="text-[#1f2b33] block">1. Lo que ya no me sirve:</b>
              <p className="text-[#555f66]">
                "Dejo ir la idea de que tengo que ser perfecta/o para que me quieran. Hoy suelto la autoexigencia."
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e4dcd0] space-y-1">
              <b className="text-[#1f2b33] block">2. Mi nueva verdad:</b>
              <p className="text-[#555f66]">
                "Soy valioso/a tal como soy, incluso en mis días grises. Elijo creer en mi capacidad de sanar."
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#e4dcd0] space-y-1">
              <b className="text-[#1f2b33] block">3. Un pequeño mimo hoy:</b>
              <p className="text-[#555f66]">
                "Comer algo rico, un baño largo, o descansar 15 minutos sin pantalla."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
