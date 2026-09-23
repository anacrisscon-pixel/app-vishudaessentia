import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { isPremiumUser, getMembershipStatus, getCheckInStatus, getExplorations, MembershipData } from '../utils/storage';
import { VishudaLogo } from './VishudaLogo';
import {
  User,
  ShieldCheck,
  Flame,
  Activity,
  Sparkles,
  ChevronRight,
  Video,
  Feather,
  Compass,
  Calendar,
  Volume2,
  Download,
  FileDown,
  CheckCheck,
  TrendingUp,
} from 'lucide-react';

interface MoreHubProps {
  onNavigate: (view: ViewType) => void;
}

export const MoreHub: React.FC<MoreHubProps> = ({ onNavigate }) => {
  const [membership, setMembership] = useState<MembershipData>(() => getMembershipStatus());
  const [exported, setExported] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setMembership(getMembershipStatus());
    window.addEventListener('vishuda_membership_updated', handleUpdate);
    return () => window.removeEventListener('vishuda_membership_updated', handleUpdate);
  }, []);

  const isPremium = membership.isActive && !membership.isExpired;
  const isExpired = membership.isExpired;
  const checkIn = getCheckInStatus();
  const explorationsCount = getExplorations().length;

  const handleExportDiary = () => {
    const explorations = getExplorations();
    if (explorations.length === 0) {
      alert('Aún no tienes reflexiones guardadas en tu diario. Realiza un check-in o una autoindagación.');
      return;
    }

    let textContent = `=====================================\n`;
    textContent += `✨ DIARIO Y REFLEXIONES - VISHUDA ESSENTIA ✨\n`;
    textContent += `Exportado el: ${new Date().toLocaleDateString('es-CO')}\n`;
    textContent += `Racha de consciencia: ${checkIn.streak} días\n`;
    textContent += `Total de momentos registrados: ${explorations.length}\n`;
    textContent += `=====================================\n\n`;

    explorations.forEach((item, index) => {
      textContent += `--- MOMENTO #${index + 1} (${item.date || 'Reciente'}) ---\n`;
      if (item.emotion) {
        textContent += `Emoción detonada: ${item.emotion} (Intensidad: ${item.intensity || 5}/10)\n`;
      }
      if (item.body) {
        textContent += `Sensación en el cuerpo: ${item.body}\n`;
      }
      if (item.scene) {
        textContent += `Situación / Hecho: ${item.scene}\n`;
      }
      if (item.interpretation) {
        textContent += `Interpretación mental: ${item.interpretation}\n`;
      }
      if (item.protection) {
        textContent += `Mecanismo de protección: ${item.protection}\n`;
      }
      if (item.need) {
        textContent += `Necesidad profunda: ${item.need}\n`;
      }
      if (item.completion) {
        textContent += `Frase sanadora / Integración:\n"${item.completion}"\n`;
      }
      textContent += `\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vishuda_Diario_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn text-[#1d2924]">
      {/* Profile / Account Snapshot */}
      <div className="bg-gradient-to-br from-[#081a15] via-[#0e2721] to-[#153a30] text-white rounded-3xl p-5 shadow-md border border-[#c5a059]/40 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ead08f]/20 border border-[#ead08f]/50 flex items-center justify-center text-[#ead08f]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ead08f] block">
                TU ESPACIO VISHUDA
              </span>
              <b className="text-base font-serif font-extrabold text-white">
                {isPremium ? 'Membresía Continuo' : isExpired ? 'Membresía Concluida' : 'Cuenta Personal'}
              </b>
              {isPremium && (
                <span className="text-[11px] text-[#cfe0d8] block">
                  {membership.daysRemaining} días restantes en este equipo
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('premium')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isPremium
                ? 'bg-[#ead08f] text-[#081a15]'
                : isExpired
                ? 'bg-amber-200 text-amber-900 border border-amber-400'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            {isPremium ? `${membership.daysRemaining}d activos` : isExpired ? 'Renovar' : '$29.900'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
            <Flame className="w-4 h-4 text-[#ead08f]" />
            <div>
              <span className="text-[10px] text-[#cfe0d8] block">Racha diaria</span>
              <b className="text-xs text-white">{checkIn.streak} días consciente</b>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
            <Activity className="w-4 h-4 text-[#ead08f]" />
            <div>
              <span className="text-[10px] text-[#cfe0d8] block">Momentos</span>
              <b className="text-xs text-white">{explorationsCount} exploraciones</b>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Hub Items */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#475b52] px-1">
          Espacios Principales
        </h3>

        <div className="space-y-2">
          {/* Tendencias e Insights Emocionales */}
          <button
            onClick={() => onNavigate('insights')}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#f7f2e7] to-[#ede3ce] border border-[#c5a059] hover:border-[#94742f] transition-all flex items-center justify-between text-left group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#144436] text-[#ead08f] flex items-center justify-center shadow-xs">
                <TrendingUp className="w-4 h-4 text-[#ead08f]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <b className="text-xs font-bold text-[#144436] block group-hover:text-[#0c2b22]">
                    Tendencias e Insights Emocionales
                  </b>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#144436] text-[#ead08f]">
                    GRÁFICOS
                  </span>
                </div>
                <span className="text-[11px] text-[#556961]">
                  Visualiza tus curvas de regulación, patrones y el impacto de tus micro-pausas
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#144436]" />
          </button>

          {/* Lunes de Alma */}
          <button
            onClick={() => onNavigate('weekly')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f0eb] text-[#144436] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#1b5e4b]">
                  Lanzamientos de los Lunes
                </b>
                <span className="text-[11px] text-[#556961]">
                  Píldora semanal de audio somático y micro-acción
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* El Espejo de Voz: Dejar ir al Fuego */}
          <button
            onClick={() => onNavigate('fire')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#e67e22] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#fff2e8] text-[#e67e22] flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#e67e22]" />
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#e67e22]">
                  El Espejo de Voz: Dejar ir al Fuego
                </b>
                <span className="text-[11px] text-[#556961]">
                  Micro-ritual táctil de catarsis y transmutación de cargas
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* Sonidos Relajantes */}
          <button
            onClick={() => onNavigate('sounds')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f4ee] text-[#144436] flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-[#144436]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#144436]">
                    Sonidos Relajantes
                  </b>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#ead08f]/30 text-[#644e1e]">
                    7 AUDIOS
                  </span>
                </div>
                <span className="text-[11px] text-[#556961]">
                  Arroyo, canto de aves, cuencos, grillos, lluvia, olas y mantra sagrado
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* Videos de YouTube */}
          <button
            onClick={() => onNavigate('media')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f0eb] text-[#144436] flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#1b5e4b]">
                  Tus Videos y Meditaciones
                </b>
                <span className="text-[11px] text-[#556961]">
                  14 contenidos oficiales de YouTube integrados
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* Casos Reales */}
          <button
            onClick={() => onNavigate('cases')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f0eb] text-[#144436] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#1b5e4b]">
                  30 Casos de la Vida Real
                </b>
                <span className="text-[11px] text-[#556961]">
                  Situaciones cotidianas y de pareja con video y meditación
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* Mi Espejo */}
          <button
            onClick={() => onNavigate('mirror')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f0eb] text-[#144436] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#1b5e4b]">
                  Mi Espejo de Autoconocimiento
                </b>
                <span className="text-[11px] text-[#556961]">
                  Patrones inconscientes detectados con el tiempo
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* Prácticas Somáticas */}
          <button
            onClick={() => onNavigate('practice')}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f0eb] text-[#144436] flex items-center justify-center">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#1b5e4b]">
                  Prácticas Somáticas & Alquimia
                </b>
                <span className="text-[11px] text-[#556961]">
                  Respiración 4-7-8, Alquimia de la Culpa y Pertenencia
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#556961]" />
          </button>

          {/* Cómo instalar en tu celular */}
          <button
            onClick={() => onNavigate('install')}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#f7f4ea] to-[#fcfaf5] border border-[#ebd8ad] hover:border-[#c5a059] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#ead08f] text-[#0c241d] flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <b className="text-xs font-bold text-[#0c241d] block group-hover:text-[#9c6c19]">
                    Cómo instalar en tu celular
                  </b>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#0c241d] text-[#ead08f]">
                    PWA
                  </span>
                </div>
                <span className="text-[11px] text-[#6d5b35]">
                  Agrega el icono directo en la pantalla de inicio (iPhone y Android)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9c6c19]" />
          </button>

          {/* Exportar mi diario / reflexiones */}
          <button
            onClick={handleExportDiary}
            className="w-full p-3.5 rounded-2xl bg-[#fcfdfa] border border-[#d2dfd8] hover:border-[#144436] transition-all flex items-center justify-between text-left group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eaf4ef] text-[#144436] flex items-center justify-center">
                {exported ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <FileDown className="w-4 h-4 text-[#144436]" />}
              </div>
              <div>
                <b className="text-xs font-bold text-[#0e2721] block group-hover:text-[#144436]">
                  {exported ? '¡Diario descargado!' : 'Exportar mi diario de reflexiones'}
                </b>
                <span className="text-[11px] text-[#556961]">
                  Descarga un archivo con tus momentos, estados y respuestas del Espejo
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#144436]">TXT</span>
          </button>
        </div>
      </div>

      {/* Sobre Vishuda Essentia - Identidad Oficial */}
      <div className="rounded-3xl bg-white border border-[#ded5c2] p-6 text-center space-y-3 shadow-xs">
        <VishudaLogo size="lg" showText={true} theme="dark" layout="vertical" />
        <p className="text-xs text-[#556961] max-w-sm mx-auto leading-relaxed">
          Espacio de sabiduría somática, autorregulación y coherencia interior. Un espacio íntimo para pausar y volver a tu centro.
        </p>
        <div className="pt-1">
          <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-[#3d5449] uppercase px-3 py-1 rounded-full bg-[#f3f7f5] border border-[#bcdbc9]">
            ✦ Vishuda Essentia · Sabiduría Somática ✦
          </span>
        </div>
      </div>
    </div>
  );
};
