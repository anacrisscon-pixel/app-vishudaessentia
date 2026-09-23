import React, { useState, useMemo } from 'react';
import {
  DailyCheckInRecord,
  ViewType,
} from '../types';
import {
  getCheckInHistory,
  addOrUpdateCheckInRecord,
  deleteCheckInRecord,
  resetCheckInHistory,
  clearCheckInHistory,
  getMoodDefaultScore,
  getCheckInStatus,
} from '../utils/storage';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  Flame,
  Activity,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Clock,
  Compass,
  Smile,
  Heart,
  FileText,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface InsightsViewProps {
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
  onGoCheckIn: () => void;
}

const MOOD_CONFIG: Record<
  string,
  {
    label: string;
    emoji: string;
    color: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    valence: string;
  }
> = {
  calma: {
    label: 'En calma',
    emoji: '🌿',
    color: '#10b981',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-900',
    valence: 'Serenidad y centramiento',
  },
  energia: {
    label: 'Con energía',
    emoji: '⚡',
    color: '#f59e0b',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-900',
    valence: 'Vitalidad y acción consciente',
  },
  reflexivo: {
    label: 'Reflexivo/a',
    emoji: '🧭',
    color: '#0d9488',
    bgClass: 'bg-teal-50',
    borderClass: 'border-teal-300',
    textClass: 'text-teal-900',
    valence: 'Escucha interna profunda',
  },
  cansancio: {
    label: 'Agotamiento',
    emoji: '🌙',
    color: '#8b5cf6',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-300',
    textClass: 'text-purple-900',
    valence: 'Baja energía y necesidad de reposo',
  },
  sobrecarga: {
    label: 'Sobrecarga',
    emoji: '🌪️',
    color: '#f43f5e',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
    textClass: 'text-rose-900',
    valence: 'Mente acelerada o tensión',
  },
};

export const InsightsView: React.FC<InsightsViewProps> = ({
  onBack,
  onNavigate,
  onGoCheckIn,
}) => {
  const [history, setHistory] = useState<DailyCheckInRecord[]>(() => getCheckInHistory());
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('14');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'trends' | 'distribution' | 'somatic' | 'log'>('trends');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // New/Edit entry form state
  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [formMood, setFormMood] = useState<string>('calma');
  const [formEnergy, setFormEnergy] = useState<number>(8);
  const [formMicro, setFormMicro] = useState<boolean>(true);
  const [formNote, setFormNote] = useState<string>('');

  const [checkInStatus, setCheckInStatus] = useState(() => getCheckInStatus());
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Filter history by time range
  const filteredHistory = useMemo(() => {
    const days = parseInt(timeRange, 10);
    const cutoffDate = new Date(Date.now() - days * 86400000);
    return history.filter((item) => new Date(item.date).getTime() >= cutoffDate.getTime());
  }, [history, timeRange]);

  // Key metrics calculation
  const metrics = useMemo(() => {
    if (filteredHistory.length === 0) {
      return {
        avgRegulation: 0,
        predominantMood: 'calma',
        predominantPct: 0,
        microRate: 0,
        totalDays: 0,
        streak: checkInStatus.streak,
        microImpactDiff: 0,
      };
    }

    const totalDays = filteredHistory.length;
    const sumEnergy = filteredHistory.reduce((acc, curr) => acc + (curr.energyLevel ?? getMoodDefaultScore(curr.moodId)), 0);
    const avgRegulation = (sumEnergy / totalDays).toFixed(1);

    // Mood counts
    const moodCounts: Record<string, number> = {};
    let microDoneCount = 0;
    let microDoneSumEnergy = 0;
    let microSkipSumEnergy = 0;
    let microSkipCount = 0;

    filteredHistory.forEach((item) => {
      moodCounts[item.moodId] = (moodCounts[item.moodId] || 0) + 1;
      const energy = item.energyLevel ?? getMoodDefaultScore(item.moodId);

      if (item.microActionDone) {
        microDoneCount++;
        microDoneSumEnergy += energy;
      } else {
        microSkipCount++;
        microSkipSumEnergy += energy;
      }
    });

    // Predominant mood
    let maxMood = 'calma';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMood = mood;
      }
    });

    const predominantPct = Math.round((maxCount / totalDays) * 100);
    const microRate = Math.round((microDoneCount / totalDays) * 100);

    const avgWithMicro = microDoneCount > 0 ? microDoneSumEnergy / microDoneCount : 0;
    const avgWithoutMicro = microSkipCount > 0 ? microSkipSumEnergy / microSkipCount : 0;
    const microImpactDiff = +(avgWithMicro - avgWithoutMicro).toFixed(1);

    return {
      avgRegulation: parseFloat(avgRegulation),
      predominantMood: maxMood,
      predominantPct,
      microRate,
      totalDays,
      streak: checkInStatus.streak,
      microImpactDiff,
      moodCounts,
    };
  }, [filteredHistory, checkInStatus.streak]);

  // Chart 1 data: Area & Line trend
  const trendChartData = useMemo(() => {
    return filteredHistory.map((item) => {
      const d = new Date(item.date + 'T12:00:00');
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      const moodInfo = MOOD_CONFIG[item.moodId] || MOOD_CONFIG.calma;
      const energy = item.energyLevel ?? getMoodDefaultScore(item.moodId);

      return {
        dateStr: dayName,
        fullDate: item.date,
        energyLevel: energy,
        moodLabel: moodInfo.label,
        moodEmoji: moodInfo.emoji,
        microDone: item.microActionDone,
        note: item.note,
      };
    });
  }, [filteredHistory]);

  // Chart 2 data: Distribution (Pie)
  const distributionChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredHistory.forEach((item) => {
      counts[item.moodId] = (counts[item.moodId] || 0) + 1;
    });

    return Object.entries(counts).map(([moodId, value]) => {
      const cfg = MOOD_CONFIG[moodId] || MOOD_CONFIG.calma;
      return {
        name: `${cfg.emoji} ${cfg.label}`,
        value,
        color: cfg.color,
        moodId,
      };
    });
  }, [filteredHistory]);

  // Chart 3 data: Somatic micro-action comparison bar
  const somaticChartData = useMemo(() => {
    return filteredHistory.map((item) => {
      const d = new Date(item.date + 'T12:00:00');
      const dayName = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      const energy = item.energyLevel ?? getMoodDefaultScore(item.moodId);

      return {
        day: dayName,
        score: energy,
        microAction: item.microActionDone ? 1 : 0,
        fill: item.microActionDone ? '#10b981' : '#94a3b8',
        label: item.microActionDone ? 'Pausa 30s Realizada' : 'Sin Pausa',
      };
    });
  }, [filteredHistory]);

  // Handle Save Manual Record
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = addOrUpdateCheckInRecord({
      date: formDate,
      moodId: formMood,
      energyLevel: formEnergy,
      microActionDone: formMicro,
      note: formNote.trim(),
    });
    setHistory(updated);
    setCheckInStatus(getCheckInStatus());
    setShowAddModal(false);
    setFormNote('');
    setExportMessage('Día registrado en tu bitácora correctamente.');
    setTimeout(() => setExportMessage(null), 3000);
  };

  // Handle Delete Entry
  const handleRequestDelete = (dateOrId: string) => {
    setEntryToDelete(dateOrId);
  };

  const handleConfirmDelete = () => {
    if (!entryToDelete) return;
    const updated = deleteCheckInRecord(entryToDelete);
    setHistory(updated);
    setCheckInStatus(getCheckInStatus());
    setEntryToDelete(null);
    setExportMessage('Registro eliminado de la bitácora.');
    setTimeout(() => setExportMessage(null), 3000);
  };

  // Handle Reset to Demo Data
  const handleExecuteResetData = () => {
    const fresh = resetCheckInHistory();
    setHistory(fresh);
    setCheckInStatus(getCheckInStatus());
    setShowResetModal(false);
    setExportMessage('🌿 Datos de muestra equilibrados cargados (14 días).');
    setTimeout(() => setExportMessage(null), 4000);
  };

  // Handle Clear All Data to Zero
  const handleExecuteClearToZero = () => {
    const empty = clearCheckInHistory();
    setHistory(empty);
    setCheckInStatus(getCheckInStatus());
    setShowClearModal(false);
    setExportMessage('✨ Bitácora puesta en ceros. Todas las estadísticas y racha han quedado en 0.');
    setTimeout(() => setExportMessage(null), 5000);
  };

  // Handle Export Data to CSV/TXT
  const handleExportHistory = () => {
    let csv = 'Fecha,Emoción,Nivel_Regulación,Pausa_30s_Completada,Nota\n';
    history.forEach((h) => {
      const mood = MOOD_CONFIG[h.moodId]?.label || h.moodId;
      const energy = h.energyLevel ?? getMoodDefaultScore(h.moodId);
      const micro = h.microActionDone ? 'Sí' : 'No';
      const cleanNote = (h.note || '').replace(/"/g, '""');
      csv += `"${h.date}","${mood}",${energy},"${micro}","${cleanNote}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vishuda_Tendencias_Emocionales_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportMessage('¡Historial exportado en formato CSV correctamente!');
    setTimeout(() => setExportMessage(null), 3500);
  };

  // Custom Chart Tooltip
  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0c221c] text-white p-3 rounded-xl border border-[#c5a059]/50 shadow-xl text-xs space-y-1 z-50">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1">
            <span className="font-bold text-[#ead08f] capitalize">{data.fullDate}</span>
            <span className="text-[10px] text-white/70">{data.dateStr}</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base">{data.moodEmoji}</span>
            <b className="text-white font-serif">{data.moodLabel}</b>
            <span className="ml-auto font-mono text-[#ead08f] font-bold">
              {data.energyLevel}/10
            </span>
          </div>
          <div className="text-[11px] text-[#cfe1d9] flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                data.microDone ? 'bg-emerald-400' : 'bg-slate-400'
              }`}
            />
            <span>{data.microDone ? 'Pausa 30s realizada' : 'Pausa 30s omitida'}</span>
          </div>
          {data.note && (
            <p className="text-[10px] italic text-[#ead08f]/90 pt-1 border-t border-white/10">
              "{data.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const currentPredomConfig = MOOD_CONFIG[metrics.predominantMood] || MOOD_CONFIG.calma;

  return (
    <div className="space-y-5 pb-8 animate-fadeIn text-[#1f2b33]">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-[#e2d7c5] pb-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClearModal(true)}
            className="px-2.5 py-1.5 rounded-full bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Vaciar la bitácora y poner todas las estadísticas en ceros"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Poner en ceros</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-2.5 py-1.5 rounded-full bg-[#144436] hover:bg-[#0c2b22] text-[#ead08f] text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            title="Añadir o editar entrada de fecha"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Día</span>
          </button>

          <button
            onClick={handleExportHistory}
            className="p-1.5 rounded-full bg-white border border-[#d2dfd8] hover:bg-[#f4f7f5] text-[#144436] transition-colors"
            title="Exportar bitácora en CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Title & Description */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ead08f]/30 border border-[#c5a059]/40 text-[#634e1e] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#94742f]" />
            <span>Efecto Check-In Diario</span>
          </span>
          <span className="text-[10px] text-[#63726a] font-medium">
            Métricas de Consciencia
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-[#112d24] tracking-tight">
          Tendencias e Insights Emocionales
        </h1>
        <p className="text-xs text-[#52635a] leading-relaxed">
          Visualiza los ritmos de tu sistema nervioso, identifica tus patrones inconscientes y comprueba cómo las micro-pausas transforman tu regulación interna.
        </p>
      </div>

      {/* Export notification */}
      {exportMessage && (
        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Time Horizon Filter Tabs */}
      <div className="bg-[#ede7dc] p-1 rounded-2xl flex items-center justify-between border border-[#ddcfbb] shadow-inner">
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-[#685c4b] px-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#94742f]" />
            <span>Horizonte:</span>
          </span>
          {(['7', '14', '30'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === days
                  ? 'bg-[#144436] text-[#ead08f] shadow-xs'
                  : 'text-[#485b52] hover:text-[#112d24]'
              }`}
            >
              {days === '7' ? '7 Días' : days === '14' ? '14 Días' : '30 Días'}
            </button>
          ))}
        </div>

        <button
          onClick={onGoCheckIn}
          className="text-[11px] font-bold text-[#144436] hover:underline px-2 flex items-center gap-1"
        >
          <span>Check-In de Hoy</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Nivel de Regulación Promedio */}
        <div className="bg-[#fffdf9] p-3.5 rounded-2xl border border-[#dfd4c2] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#716553] tracking-wider">
              Regulación Promedio
            </span>
            <Activity className="w-3.5 h-3.5 text-[#144436]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-extrabold text-[#112d24]">
              {metrics.avgRegulation}
            </span>
            <span className="text-xs text-[#716553] font-mono">/10</span>
          </div>
          <div className="w-full bg-[#ece3d4] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c5a059] to-[#144436]"
              style={{ width: `${Math.min(100, metrics.avgRegulation * 10)}%` }}
            />
          </div>
          <span className="text-[10px] text-[#556960] block truncate">
            {metrics.totalDays === 0
              ? '🌱 En ceros · Lista para tu 1er registro'
              : metrics.avgRegulation >= 7.5
              ? '✨ En equilibrio sereno y vital'
              : metrics.avgRegulation >= 5.5
              ? '⚖️ Regulación moderada'
              : '🌊 Necesidad de calma y reposo'}
          </span>
        </div>

        {/* Metric 2: Estado Predominante */}
        <div className="bg-[#fffdf9] p-3.5 rounded-2xl border border-[#dfd4c2] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#716553] tracking-wider">
              Estado Frecuente
            </span>
            <Smile className="w-3.5 h-3.5 text-[#94742f]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl">{metrics.totalDays === 0 ? '🌱' : currentPredomConfig.emoji}</span>
            <b className="text-sm font-bold text-[#112d24] truncate">
              {metrics.totalDays === 0 ? 'Sin registros' : currentPredomConfig.label}
            </b>
          </div>
          <span className="text-[11px] font-bold text-[#144436] block">
            {metrics.totalDays === 0 ? '0% registrado' : `${metrics.predominantPct}% de los días`}
          </span>
          <span className="text-[10px] text-[#556960] block truncate">
            {metrics.totalDays === 0 ? 'Comienza tu registro hoy' : currentPredomConfig.valence}
          </span>
        </div>

        {/* Metric 3: Micro-hábitos de 30 segundos */}
        <div className="bg-[#fffdf9] p-3.5 rounded-2xl border border-[#dfd4c2] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#716553] tracking-wider">
              Pausas Somáticas
            </span>
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-extrabold text-emerald-800">
              {metrics.microRate}%
            </span>
            <span className="text-[10px] text-[#716553]">cumplidas</span>
          </div>
          <div className="w-full bg-[#ece3d4] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600"
              style={{ width: `${metrics.microRate}%` }}
            />
          </div>
          <span className="text-[10px] text-[#556960] block truncate">
            {metrics.microImpactDiff > 0
              ? `+${metrics.microImpactDiff} pts de calma en días con pausa`
              : 'Reseteos de 30 segundos activos'}
          </span>
        </div>

        {/* Metric 4: Racha de Consciencia */}
        <div className="bg-[#fffdf9] p-3.5 rounded-2xl border border-[#dfd4c2] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#716553] tracking-wider">
              Racha Consecutiva
            </span>
            <Flame className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-serif font-extrabold text-[#112d24]">
              {metrics.streak}
            </span>
            <span className="text-xs text-[#716553]">
              {metrics.streak === 1 ? 'día' : 'días'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#144436] font-bold">
            <Sparkles className="w-3 h-3 text-[#c5a059]" />
            <span>{metrics.totalDays} entradas en total</span>
          </div>
          <span className="text-[10px] text-[#556960] block truncate">
            {metrics.streak === 0 ? '🌱 Inicia hoy tu primera racha' : 'Constancia presente sin exigencia'}
          </span>
        </div>
      </div>

      {/* Visualizer Tabs */}
      <div className="flex items-center border-b border-[#e2d7c5] gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'trends'
              ? 'border-[#144436] text-[#144436] bg-[#eef4f1]'
              : 'border-transparent text-[#5c6e64] hover:text-[#112d24]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Curva de Tendencia</span>
        </button>

        <button
          onClick={() => setActiveTab('distribution')}
          className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'distribution'
              ? 'border-[#144436] text-[#144436] bg-[#eef4f1]'
              : 'border-transparent text-[#5c6e64] hover:text-[#112d24]'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Distribución</span>
        </button>

        <button
          onClick={() => setActiveTab('somatic')}
          className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'somatic'
              ? 'border-[#144436] text-[#144436] bg-[#eef4f1]'
              : 'border-transparent text-[#5c6e64] hover:text-[#112d24]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Impacto 30s</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'log'
              ? 'border-[#144436] text-[#144436] bg-[#eef4f1]'
              : 'border-transparent text-[#5c6e64] hover:text-[#112d24]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Bitácora ({filteredHistory.length})</span>
        </button>
      </div>

      {/* TAB 1: AREA & LINE TREND CHART */}
      {activeTab === 'trends' && (
        <div className="bg-[#fffdf9] p-4 rounded-3xl border border-[#dfd4c2] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#144436]">
                Evolución de Regulación Emocional
              </h3>
              <p className="text-[11px] text-[#556960]">
                Escala de 1 a 10 evaluando serenidad, claridad y centramiento
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-[#144436] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#144436]" />
                Nivel
              </span>
            </div>
          </div>

          {/* Recharts Area Container or Empty State */}
          {filteredHistory.length === 0 ? (
            <div className="py-10 text-center space-y-3 bg-[#fdfcf9] rounded-2xl border border-dashed border-[#dfd4c2]">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#112d24]">Bitácora en ceros (0 registros)</p>
                <p className="text-[11px] text-[#556960] max-w-xs mx-auto">
                  Has vaciado la bitácora. Registra tu estado de hoy para ver tu primera curva o restaura los datos de muestra.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={onGoCheckIn}
                  className="px-3 py-1.5 rounded-xl bg-[#144436] text-[#ead08f] text-xs font-bold shadow-xs cursor-pointer hover:bg-[#0d2a21]"
                >
                  Check-In de Hoy
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#ead08f]/30 text-[#634e1e] text-xs font-bold cursor-pointer hover:bg-[#ead08f]/50"
                >
                  Ver con datos de muestra
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full h-60 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRegulation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#144436" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#c5a059" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="dateStr"
                      tickLine={false}
                      axisLine={{ stroke: '#e2d7c5' }}
                      tick={{ fill: '#6c7a72', fontSize: 10 }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      ticks={[2, 4, 6, 8, 10]}
                      tickLine={false}
                      axisLine={{ stroke: '#e2d7c5' }}
                      tick={{ fill: '#6c7a72', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTrendTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="energyLevel"
                      stroke="#144436"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRegulation)"
                      activeDot={{ r: 6, fill: '#ead08f', stroke: '#144436', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Guide Footer */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ece2d4] text-[10px] text-[#6c7a72]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>1-4: Sobrecarga / Agotamiento</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>5-7: Escucha reflexiva</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>8-10: Calma y vitalidad</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: PIE DISTRIBUTION CHART */}
      {activeTab === 'distribution' && (
        <div className="bg-[#fffdf9] p-4 rounded-3xl border border-[#dfd4c2] shadow-md space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#144436]">
              Composición de tus Estados Emocionales
            </h3>
            <p className="text-[11px] text-[#556960]">
              Proporción de tus emociones durante los últimos {timeRange} días
            </p>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-10 text-center space-y-3 bg-[#fdfcf9] rounded-2xl border border-dashed border-[#dfd4c2]">
              <div className="w-10 h-10 rounded-full bg-[#ead08f]/30 text-[#634e1e] flex items-center justify-center mx-auto">
                <Smile className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#112d24]">Sin datos para mostrar distribución</p>
                <p className="text-[11px] text-[#556960] max-w-xs mx-auto">
                  Completa check-ins para ver la proporción de tus estados emocionales.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={onGoCheckIn}
                  className="px-3 py-1.5 rounded-xl bg-[#144436] text-[#ead08f] text-xs font-bold shadow-xs cursor-pointer hover:bg-[#0d2a21]"
                >
                  Check-In de Hoy
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#ead08f]/30 text-[#634e1e] text-xs font-bold cursor-pointer hover:bg-[#ead08f]/50"
                >
                  Ver con datos de muestra
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            {/* Pie Chart */}
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {distributionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} días (${Math.round((Number(val) / filteredHistory.length) * 100)}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* List breakdown */}
            <div className="space-y-2">
              {distributionChartData.map((entry) => {
                const pct = Math.round((entry.value / filteredHistory.length) * 100);
                const cfg = MOOD_CONFIG[entry.moodId] || MOOD_CONFIG.calma;

                return (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#f8f5ee] border border-[#ece3d4]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs font-bold text-[#112d24]">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#556960]">
                        {entry.value} {entry.value === 1 ? 'día' : 'días'}
                      </span>
                      <b className="text-xs font-bold text-[#144436] w-9 text-right">{pct}%</b>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 3: SOMATIC 30-SECOND MICRO-ACTION IMPACT */}
      {activeTab === 'somatic' && (
        <div className="bg-[#fffdf9] p-4 rounded-3xl border border-[#dfd4c2] shadow-md space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#144436]">
              Efecto de la Pausa Somática de 30 Segundos
            </h3>
            <p className="text-[11px] text-[#556960]">
              Comparativa de regulación interna en los días con pausa completada vs días sin ella
            </p>
          </div>

          {/* Key Correlation Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#144436] to-[#0c221c] text-white space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-[#ead08f] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Evidencia Somática de tu Proceso</span>
            </div>
            <p className="text-xs text-[#cfe1d9] leading-relaxed">
              {filteredHistory.length === 0
                ? 'Cuando registres días completando micro-reseteos de 30 segundos, aquí verás la comparativa de cómo impactan tu calma.'
                : `En los días en que completaste tu micro-reseteo de 30 segundos, tu nivel de regulación promedio fue de ${
                    metrics.microImpactDiff >= 0 ? `+${metrics.microImpactDiff} puntos más alto` : 'mayor estabilidad'
                  }. Una sola pausa diaria previene que la tensión acumulada se convierta en sobrecarga.`}
            </p>
          </div>

          {/* Bar Chart or Empty State */}
          {filteredHistory.length === 0 ? (
            <div className="py-8 text-center space-y-3 bg-[#fdfcf9] rounded-2xl border border-dashed border-[#dfd4c2]">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#112d24]">Sin pausas registradas en este período</p>
                <p className="text-[11px] text-[#556960] max-w-xs mx-auto">
                  Registra un check-in marcando tu pausa de 30 segundos o explora con los datos de muestra.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={onGoCheckIn}
                  className="px-3 py-1.5 rounded-xl bg-[#144436] text-[#ead08f] text-xs font-bold shadow-xs cursor-pointer hover:bg-[#0d2a21]"
                >
                  Check-In de Hoy
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#ead08f]/30 text-[#634e1e] text-xs font-bold cursor-pointer hover:bg-[#ead08f]/50"
                >
                  Ver con datos de muestra
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full h-56 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={somaticChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: '#e2d7c5' }} tick={{ fill: '#6c7a72', fontSize: 10 }} />
                    <YAxis domain={[0, 10]} ticks={[2, 4, 6, 8, 10]} tickLine={false} axisLine={{ stroke: '#e2d7c5' }} tick={{ fill: '#6c7a72', fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any, _name: any, item: any) => [
                        `${val}/10 (${item.payload.label})`,
                        'Nivel de Regulación',
                      ]}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {somaticChartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 border-t border-[#ece2d4] text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                  <span>Con Pausa de 30s</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <span className="w-3 h-3 rounded-sm bg-slate-400" />
                  <span>Sin Pausa</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 4: CHRONOLOGICAL HISTORY LOG */}
      {activeTab === 'log' && (
        <div className="bg-[#fffdf9] p-4 rounded-3xl border border-[#dfd4c2] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#144436]">
                Bitácora Cronológica de Check-Ins
              </h3>
              <p className="text-[11px] text-[#556960]">
                {filteredHistory.length} registros en el período seleccionado
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowClearModal(true)}
                className="text-[11px] text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                title="Vaciar todos los registros y comenzar desde cero"
              >
                <Trash2 className="w-3 h-3" />
                <span>Poner en ceros</span>
              </button>
              <button
                onClick={() => setShowResetModal(true)}
                className="text-[11px] text-[#94742f] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                title="Restaurar datos de muestra equilibrados"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Datos de muestra</span>
              </button>
            </div>
          </div>

          {/* List of records */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-[#6c7a72] space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-[#c5a059]/60" />
                <p className="text-xs">No hay registros en este rango de tiempo.</p>
                <button
                  onClick={onGoCheckIn}
                  className="px-3 py-1.5 rounded-xl bg-[#144436] text-[#ead08f] text-xs font-bold"
                >
                  Hacer check-in de hoy
                </button>
              </div>
            ) : (
              [...filteredHistory].reverse().map((record) => {
                const moodInfo = MOOD_CONFIG[record.moodId] || MOOD_CONFIG.calma;
                const d = new Date(record.date + 'T12:00:00');
                const formattedDate = d.toLocaleDateString('es-ES', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });
                const energy = record.energyLevel ?? getMoodDefaultScore(record.moodId);

                return (
                  <div
                    key={record.id || record.date}
                    className="p-3 rounded-2xl bg-[#f8f5ee] border border-[#ece3d4] flex items-center justify-between gap-3 hover:border-[#144436]/40 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#e0d6c4] flex items-center justify-center text-lg shrink-0 shadow-xs">
                        {moodInfo.emoji}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <b className="text-xs font-bold text-[#112d24] capitalize">
                            {formattedDate}
                          </b>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${moodInfo.bgClass} ${moodInfo.textClass}`}
                          >
                            {moodInfo.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#556960] truncate">
                          {record.note ? `"${record.note}"` : moodInfo.valence}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-mono text-xs font-extrabold text-[#144436] block">
                          {energy}/10
                        </span>
                        <span
                          className={`text-[9px] font-bold ${
                            record.microActionDone ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {record.microActionDone ? '✓ Pausa 30s' : 'Sin pausa'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRequestDelete(record.id || record.date)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Somatic Archetype Intelligence & Recommendations Box */}
      <div className="bg-gradient-to-br from-[#0c221c] via-[#12362b] to-[#1a4a3b] text-white rounded-3xl p-5 border border-[#c5a059]/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ead08f]/20 border border-[#ead08f]/50 flex items-center justify-center text-[#ead08f]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ead08f] block">
              Sabiduría Somática
            </span>
            <b className="text-sm font-serif font-extrabold text-white">
              Patrón Detectado por tu Espejo Interior
            </b>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 text-xs text-[#dbe8e2] leading-relaxed space-y-2">
          {metrics.predominantMood === 'calma' && (
            <p>
              🌿 <b>Anclaje de Serenidad:</b> Tu sistema nervioso ha habitado principalmente estados de calma. Para profundizar esta coherencia, continúa anclando tu serenidad a través de los sonidos armónicos y el Oráculo diario.
            </p>
          )}
          {metrics.predominantMood === 'energia' && (
            <p>
              ⚡ <b>Vitalidad Consciente:</b> Tienes un impulso vital activo y productivo. Canalízalo con intención para no derivar en hiperactivación; asegúrate de realizar tus pausas para validar que tu esfuerzo nutra tu bienestar.
            </p>
          )}
          {metrics.predominantMood === 'reflexivo' && (
            <p>
              🧭 <b>Introspección Fértil:</b> Estás atravesando una fase de profunda mirada hacia adentro. Es un momento ideal para profundizar en la autoindagación de los 7 patrones inconscientes y la Agenda para el Alma.
            </p>
          )}
          {metrics.predominantMood === 'cansancio' && (
            <p>
              🌙 <b>Llamado al Reposo:</b> Tu cuerpo está manifestando la necesidad prioritaria de recarga. Tu valor no depende de tu productividad ininterrumpida; concédete espacio para soltar el control y reposar.
            </p>
          )}
          {metrics.predominantMood === 'sobrecarga' && (
            <p>
              🌪️ <b>Descompresión Requerida:</b> Se detecta acumulación de tensión mental o laboral. Te sugerimos activar la práctica de "Dejar ir al Fuego" o la respiración 4-7-8 para aliviar el cortisol.
            </p>
          )}
        </div>

        {/* Suggested Next Steps */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onNavigate('practice')}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-bold text-white transition-all flex items-center justify-between"
          >
            <span>Prácticas Somáticas</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#ead08f]" />
          </button>

          <button
            onClick={() => onNavigate('cortisol')}
            className="p-2.5 rounded-xl bg-[#ead08f] hover:bg-[#deb970] text-[#0c221c] text-left text-xs font-extrabold transition-all flex items-center justify-between shadow-xs"
          >
            <span>Bajar el Cortisol</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#0c221c]" />
          </button>
        </div>
      </div>

      {/* MODAL: ADD / EDIT MANUAL DAY ENTRY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf7f2] rounded-3xl p-5 border border-[#c5a059] shadow-2xl w-full max-w-sm space-y-4 animate-scaleUp text-[#1f2b33]">
            <div className="flex items-center justify-between border-b border-[#e2d7c5] pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#144436]" />
                <h3 className="font-serif font-extrabold text-sm text-[#112d24]">
                  Registrar o Actualizar Día
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-3.5 text-xs">
              {/* Date Input */}
              <div className="space-y-1">
                <label className="font-bold text-[#475b52] block">Fecha:</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#d6c9b6] text-xs font-medium focus:ring-1 focus:ring-[#144436] outline-hidden"
                  required
                />
              </div>

              {/* Mood Selection */}
              <div className="space-y-1">
                <label className="font-bold text-[#475b52] block">Estado Emocional:</label>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        setFormMood(key);
                        setFormEnergy(getMoodDefaultScore(key));
                      }}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all border ${
                        formMood === key
                          ? 'bg-[#144436] text-white border-[#144436] shadow-xs'
                          : 'bg-white text-[#333] border-[#e2d7c5] hover:bg-[#f4efe6]'
                      }`}
                    >
                      <span className="text-lg">{cfg.emoji}</span>
                      <span className="text-[9px] font-bold mt-0.5 truncate w-full text-center">
                        {cfg.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy / Regulation Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#475b52]">
                    Nivel de Regulación (1 al 10):
                  </label>
                  <span className="font-mono font-extrabold text-[#144436] text-sm">
                    {formEnergy}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formEnergy}
                  onChange={(e) => setFormEnergy(parseInt(e.target.value, 10))}
                  className="w-full accent-[#144436] cursor-pointer"
                />
              </div>

              {/* 30s Micro Action Checkbox */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#d6c9b6] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formMicro}
                  onChange={(e) => setFormMicro(e.target.checked)}
                  className="w-4 h-4 accent-[#144436] rounded-sm cursor-pointer"
                />
                <span className="font-semibold text-xs text-[#2a3832]">
                  Pausa Somática de 30 segundos realizada
                </span>
              </label>

              {/* Note / Reflection */}
              <div className="space-y-1">
                <label className="font-bold text-[#475b52] block">
                  Nota breve de consciencia (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Respiré profundo al llegar a casa..."
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#d6c9b6] text-xs font-medium focus:ring-1 focus:ring-[#144436] outline-hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#144436] hover:bg-[#0d2e24] text-[#ead08f] font-bold shadow-md transition-all cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Clear To Zero */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] border border-[#dfd4c2] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-[#112d24]">
                ¿Poner bitácora en ceros?
              </h3>
              <p className="text-xs text-[#556960] leading-relaxed">
                Esta acción vaciará todos los registros y dejará las estadísticas, promedios y racha en <b>0</b>. Podrás comenzar a registrar tu camino desde hoy con una bitácora limpia y personal.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Nota: Si alguna vez deseas volver a explorar cómo lucen los gráficos, podrás pulsar <b>"Datos de muestra"</b> en cualquier momento.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteClearToZero}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Sí, poner en ceros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Reset to Sample Data */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] border border-[#dfd4c2] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-[#ead08f]/30 text-[#634e1e] flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-[#112d24]">
                ¿Cargar datos de muestra?
              </h3>
              <p className="text-xs text-[#556960] leading-relaxed">
                Se cargarán 14 días de datos demostrativos equilibrados para que puedas apreciar las curvas de autorregulación y distribución emocional.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteResetData}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#144436] hover:bg-[#0e2721] text-[#ead08f] text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Cargar muestra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Specific Entry */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdfa] border border-[#dfd4c2] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-base text-[#112d24]">
                ¿Eliminar este registro?
              </h3>
              <p className="text-xs text-[#556960] leading-relaxed">
                Esta entrada se removerá de tu bitácora emocional y las estadísticas se recalcularán automáticamente.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
