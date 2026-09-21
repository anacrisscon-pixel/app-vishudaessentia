import React, { useState, useEffect } from 'react';
import {
  isPremiumUser,
  getMembershipStatus,
  activateMembershipCode,
  syncMembershipStatus,
  MembershipData,
  getDeviceId,
} from '../utils/storage';
import {
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  CreditCard,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smartphone,
  Copy,
  CheckCheck,
  RefreshCw,
  Lock,
  Plus,
  ShieldAlert,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import { openWompiCheckout } from '../config/payments';

interface PremiumModalProps {
  onBack: () => void;
  onActivated?: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onBack, onActivated }) => {
  const [membership, setMembership] = useState<MembershipData>(() => getMembershipStatus());
  const [codeInput, setCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'error' | 'success' | 'warning';
    title?: string;
    text: string;
    deviceMismatch?: boolean;
    isExpired?: boolean;
  } | null>(null);

  // Admin panel state for the owner (Ana Cristina)
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');
  const [adminCodes, setAdminCodes] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<{ total: number; available: number; used: number; expired: number } | null>(null);
  const [isLoadingAdminCodes, setIsLoadingAdminCodes] = useState(false);
  const [newCodeNote, setNewCodeNote] = useState('Pago Wompi $29.900');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedMessageCode, setCopiedMessageCode] = useState<string | null>(null);
  const [adminActionMsg, setAdminActionMsg] = useState<string | null>(null);

  const deviceId = getDeviceId();

  const WHATSAPP_SUPPORT_URL =
    (import.meta as any).env?.VITE_WHATSAPP_SUPPORT_URL ||
    'https://wa.me/?text=' +
      encodeURIComponent(
        'Hola Ana Cristina, he realizado mi pago de $29.900 en Wompi para Vishuda Continuo. Adjunto mi comprobante para recibir mi código de activación de 30 días.'
      );

  // Sync state on load and listen to updates
  useEffect(() => {
    const refresh = () => setMembership(getMembershipStatus());
    window.addEventListener('vishuda_membership_updated', refresh);
    syncMembershipStatus().then((synced) => setMembership(synced));

    return () => {
      window.removeEventListener('vishuda_membership_updated', refresh);
    };
  }, []);

  const handlePay = () => {
    openWompiCheckout();
  };

  const handleOpenWhatsApp = () => {
    window.open(WHATSAPP_SUPPORT_URL, '_blank');
  };

  const handleActivate = async () => {
    if (!codeInput.trim()) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await activateMembershipCode(codeInput);
    setIsSubmitting(false);

    if (res.success) {
      const updated = getMembershipStatus();
      setMembership(updated);
      setStatusMessage({
        type: 'success',
        title: '¡Membresía Activada por 30 Días!',
        text: `Tu acceso ha quedado vinculado exclusivamente a este celular. Tienes ${res.daysRemaining || 30} días completos de acompañamiento.`,
      });
      setCodeInput('');
      if (onActivated) onActivated();
    } else {
      setStatusMessage({
        type: res.deviceMismatch ? 'warning' : 'error',
        title: res.deviceMismatch
          ? 'Código ya activado en otro dispositivo'
          : res.isExpired
          ? 'Código expirado'
          : 'Error de activación',
        text: res.error || 'No se pudo activar el código. Verifica e inténtalo de nuevo.',
        deviceMismatch: res.deviceMismatch,
        isExpired: res.isExpired,
      });
    }
  };

  // ADMIN OPERATIONS
  const handleAdminLogin = async (pinToTry?: string) => {
    const pin = pinToTry || adminPinInput;
    setIsLoadingAdminCodes(true);
    setAdminPinError('');
    try {
      const res = await fetch('/api/premium/admin/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPin: pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        setAdminCodes(data.codes || []);
        setAdminStats({
          total: data.totalCount,
          available: data.availableCount,
          used: data.usedCount,
          expired: data.expiredCount,
        });
        setAdminPinError('');
      } else {
        setAdminPinError(data.error || 'PIN incorrecto.');
      }
    } catch (e) {
      setAdminPinError('Error conectando con el servidor.');
    } finally {
      setIsLoadingAdminCodes(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const res = await fetch('/api/premium/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPin: adminPinInput || 'ALMA_ADMIN_2026',
          count: 1,
          note: newCodeNote,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminActionMsg('¡Nuevo código de 30 días generado exitosamente!');
        setTimeout(() => setAdminActionMsg(null), 4000);
        handleAdminLogin(adminPinInput || 'ALMA_ADMIN_2026');
      }
    } catch (e) {
      setAdminActionMsg('Error al generar código.');
    }
  };

  const handleResetCode = async (codeStr: string) => {
    if (!window.confirm(`¿Seguro que deseas liberar el código ${codeStr}? Podrá ser enlazado a un nuevo teléfono.`)) return;
    try {
      const res = await fetch('/api/premium/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPin: adminPinInput || 'ALMA_ADMIN_2026',
          code: codeStr,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminActionMsg(`Código ${codeStr} liberado exitosamente.`);
        setTimeout(() => setAdminActionMsg(null), 4000);
        handleAdminLogin(adminPinInput || 'ALMA_ADMIN_2026');
      }
    } catch (e) {
      setAdminActionMsg('Error al liberar código.');
    }
  };

  const handleCopy = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyWhatsappMessage = (code: string) => {
    const text = `✨ ¡Bienvenido/a a Vishuda Continuo! ✨\n\nConfirmamos tu pago de $29.900 COP en Wompi.\n\nTu código de activación personal de 30 días es:\n👉 ${code} 👈\n\n📌 Instrucciones:\n1. Abre la aplicación de Vishuda en tu celular.\n2. Toca en "Membresía" o el botón de $29.900.\n3. Ingresa tu código en la casilla de activación.\n\n🛡️ Nota de seguridad: Este código es personal y queda vinculado exclusivamente a tu celular por 30 días corridos.\n\n¡Que sea un mes de profunda sanación y consciencia!`;
    navigator.clipboard.writeText(text);
    setCopiedMessageCode(code);
    setTimeout(() => setCopiedMessageCode(null), 3000);
  };

  const isCurrentlyActive = membership.isActive && !membership.isExpired;
  const isExpired = membership.isExpired;

  // Calculate percentage of 30 days completed
  const daysLeft = membership.daysRemaining || 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((30 - daysLeft) / 30) * 100)));

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-5 pb-12 animate-fadeIn text-[#1d2924] max-w-2xl mx-auto">
      {/* Top bar navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <span className="text-[10px] text-[#2d5244] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 font-semibold">
          <Smartphone className="w-3 h-3 text-[#1b5e4b]" />
          <span>Este teléfono</span>
        </span>
      </div>

      {/* Header title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] tracking-widest uppercase text-[#1b5e4b] font-extrabold block">
            Membresía Exclusiva
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b5e4b]/10 text-[#1b5e4b]">
            Método Seguro Wompi (30 Días)
          </span>
        </div>
        <h1 className="text-2xl font-serif font-extrabold text-[#0e2721] mt-1">
          Vishuda Continuo
        </h1>
        <p className="text-xs text-[#52665e] mt-1 leading-relaxed">
          Acompañamiento sostenido semanal sin suscripciones automáticas: un pago único de 30 días, vinculado con candado a tu celular.
        </p>
      </div>

      {/* ======================================================= */}
      {/* 1. ACTIVE MEMBERSHIP STATE WITH 30-DAY COUNTDOWN */}
      {/* ======================================================= */}
      {isCurrentlyActive ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#0c2620] via-[#143d33] to-[#1c4d41] text-white border-2 border-[#c5a059] rounded-3xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#ead08f] text-[#0c2620] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-xs font-bold text-[#ead08f] block uppercase tracking-wider">
                    Membresía Activa
                  </span>
                  <span className="text-[11px] text-[#cfe0d8]">
                    Vinculada a este dispositivo
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-900/80 text-[#ead08f] border border-[#c5a059]/40 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{daysLeft} días restantes</span>
              </span>
            </div>

            {/* Visual 30-Day Countdown Box */}
            <div className="bg-[#081a16]/70 border border-[#c5a059]/30 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#cfe0d8]/80 block font-semibold">
                    Tiempo Restante de Acompañamiento
                  </span>
                  <div className="text-3xl font-serif font-extrabold text-white mt-0.5">
                    {daysLeft} {daysLeft === 1 ? 'Día' : 'Días'}
                    <span className="text-xs font-sans text-[#ead08f] ml-2 font-normal">
                      ({membership.hoursRemaining || daysLeft * 24} horas)
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[#cfe0d8]/70 block">Día transcurrido</span>
                  <span className="font-bold text-[#ead08f] text-sm">
                    {Math.max(1, 30 - daysLeft)} de 30
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1b3d33] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#c5a059] to-[#ead08f] h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(5, 100 - progressPercent)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#cfe0d8] pt-1 border-t border-white/10">
                <div>
                  <span className="text-[#cfe0d8]/60 block">Activado el:</span>
                  <span className="font-medium text-white">{formatDate(membership.activatedAt)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#cfe0d8]/60 block">Vence el:</span>
                  <span className="font-bold text-[#ead08f]">{formatDate(membership.expiresAt)}</span>
                </div>
              </div>
            </div>

            {/* Security & Device lock confirmation */}
            <div className="flex items-start gap-2.5 text-xs text-[#cfe0d8] bg-black/20 p-3 rounded-xl border border-white/5">
              <Lock className="w-4 h-4 text-[#ead08f] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <b>Candado de seguridad activo:</b> Tu acceso está protegido de forma exclusiva en este equipo ({deviceId.slice(0, 12)}). No se interrumpirá hasta que concluyan tus 30 días.
              </p>
            </div>

            {/* Early renewal option */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                onClick={onBack}
                className="flex-1 py-3 rounded-xl bg-[#ead08f] text-[#0c2620] font-bold text-xs hover:bg-[#dfc581] transition-all text-center"
              >
                Comenzar a explorar
              </button>
              <button
                onClick={handlePay}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#cfe0d8] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#ead08f]" />
                <span>Renovar anticipadamente vía Wompi</span>
              </button>
            </div>
          </div>
        </div>
      ) : isExpired ? (
        /* ======================================================= */
        /* 2. EXPIRED MEMBERSHIP STATE */
        /* ======================================================= */
        <div className="bg-[#fff9eb] border-2 border-[#d4a347] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#fcedc9] text-[#9c6c19] flex items-center justify-center text-xl">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9c6c19] block">
              Ciclo Concluido
            </span>
            <h2 className="text-xl font-serif font-extrabold text-[#0e2721] mt-0.5">
              Tu período de 30 días ha finalizado
            </h2>
            <p className="text-xs text-[#52665e] mt-1 leading-relaxed">
              Tu último acompañamiento venció el {formatDate(membership.expiresAt)}. Para reactivar los nuevos Lunes de Alma, los 14 Casos Reales y tu Espejo IA de Alma, renueva tu membresía a través de Wompi.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handlePay}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a059] via-[#ead08f] to-[#deb970] text-[#091c17] font-extrabold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pagar Renovación en Wompi ($29.900 COP)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 rounded-2xl bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#0f5132] border border-[#25d366]/40 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25d366]" />
              <span>Enviar comprobante por WhatsApp</span>
            </button>
          </div>
        </div>
      ) : (
        /* ======================================================= */
        /* 3. NEW USER - VALUE PROPOSITION & PURCHASE */
        /* ======================================================= */
        <div className="bg-gradient-to-br from-[#091c17] via-[#0f2d24] to-[#184437] text-white border-2 border-[#c5a059] rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#ead08f] text-[#091c17]">
              VISHUDA ESSENTIA · CONTINUO
            </span>
            <span className="text-xs font-bold text-[#ead08f]">30 Días de Acompañamiento</span>
          </div>

          <div>
            <div className="text-3xl font-serif font-extrabold text-white">
              $29.900 <span className="text-xs font-sans text-[#cfe0d8]">COP / 30 días</span>
            </div>
            <p className="text-xs text-[#cfe0d8] mt-1 leading-relaxed">
              Pago único y seguro en Wompi. Sin débitos automáticos sorpresa ni suscripciones no deseadas.
            </p>
          </div>

          <div className="space-y-2 text-xs text-[#cfe0d8] pt-1 border-t border-white/10">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ead08f] flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-white">
                Lunes de Alma: un audio nuevo semanal con práctica somática profunda
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ead08f] flex-shrink-0 mt-0.5" />
              <span>14 Casos Reales: desglose de detonantes, mecanismos y heridas</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ead08f] flex-shrink-0 mt-0.5" />
              <span>El Chat Espejo con Alma (IA) para indagar en tiempo real</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#ead08f] flex-shrink-0 mt-0.5" />
              <span>Biblioteca completa de meditaciones sonoras afinadas a 432 Hz</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={handlePay}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a059] via-[#ead08f] to-[#deb970] text-[#091c17] font-extrabold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#091c17]" />
              <span>Pagar en Wompi ($29.900 COP)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#091c17]" />
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#ead08f] border border-[#ead08f]/30 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25d366]" />
              <span>Enviar comprobante por WhatsApp</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-[#cfe0d8]/80">
            Acepta Nequi, Bancolombia, PSE y Tarjetas de Crédito de forma segura.
          </p>
        </div>
      )}

      {/* ======================================================= */}
      {/* HOW METHOD A WORKS (HOW ACCESSIBILITY & LOCKING WORK) */}
      {/* ======================================================= */}
      <div className="bg-[#f2f7f4] border border-[#bcd7cb] rounded-3xl p-5 space-y-3 text-xs text-[#1e3b30]">
        <b className="text-xs font-bold text-[#0e2721] block flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#1b5e4b]" />
          <span>¿Cómo funciona el acceso de 30 días (Método Seguro)?</span>
        </b>

        <div className="space-y-2.5 text-[#375247] leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#144436] bg-[#dbeae2] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[11px]">
              1
            </span>
            <p>
              <b>Realizas tu pago único de $29.900 en Wompi:</b> Pagas con Nequi, Bancolombia, PSE o Tarjeta.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#144436] bg-[#dbeae2] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[11px]">
              2
            </span>
            <p>
              <b>Recibes tu código de 30 días:</b> Se te entrega tu código único (ej: <i>ALMA-7842</i>) por WhatsApp o correo.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#144436] bg-[#dbeae2] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-[11px]">
              3
            </span>
            <p>
              <b>Candado en tu celular:</b> Al ingresarlo aquí abajo, queda enlazado exclusivamente a tu teléfono durante 30 días corridos. Nadie más podrá usar tu código, garantizando tu privacidad y seguridad.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* CODE REDEMPTION / ACTIVATION INPUT */}
      {/* ======================================================= */}
      <div className="bg-[#fcfdfa] border border-[#d2dfd8] rounded-3xl p-4 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#1b5e4b]" />
          <span className="text-xs font-bold text-[#0e2721]">
            ¿Tienes un código de activación de 30 días?
          </span>
        </div>
        <p className="text-[11px] text-[#52665e]">
          Escribe el código que recibiste tras tu pago en Wompi para vincular y habilitar tus 30 días en este equipo:
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
            placeholder="Ej: ALMA-7842"
            disabled={isSubmitting}
            className="flex-1 p-3 text-sm font-mono tracking-widest uppercase rounded-xl border border-[#d2dfd8] bg-[#f0f5f2] focus:bg-white focus:border-[#1b5e4b] outline-none text-[#0e2721] font-bold"
          />
          <button
            onClick={handleActivate}
            disabled={!codeInput.trim() || isSubmitting}
            className="px-5 py-3 rounded-xl bg-[#0e2721] disabled:opacity-50 text-[#ead08f] font-bold text-xs hover:bg-[#193e34] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#ead08f]" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#ead08f]" />
            )}
            <span>Activar</span>
          </button>
        </div>

        {/* Status message alerts */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : statusMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border border-amber-300'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : statusMessage.type === 'warning' ? (
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              {statusMessage.title && (
                <b className="block font-bold mb-0.5">{statusMessage.title}</b>
              )}
              <p className="leading-relaxed">{statusMessage.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* ADMIN CODES MANAGER (FOR ANA CRISTINA / OWNER) */}
      {/* ======================================================= */}
      <div className="pt-4 border-t border-[#d2dfd8]/60">
        <button
          onClick={() => {
            setShowAdminPanel(!showAdminPanel);
            if (!isAdminAuthenticated) {
              handleAdminLogin('ALMA_ADMIN_2026');
            }
          }}
          className="text-[11px] text-[#52665e] hover:text-[#0e2721] flex items-center gap-1.5 mx-auto font-medium transition-all"
        >
          <Lock className="w-3 h-3 text-[#1b5e4b]" />
          <span>Panel de Gestión de Códigos Wompi (Administradora)</span>
          {showAdminPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showAdminPanel && (
          <div className="mt-4 bg-[#f8faf8] border-2 border-[#1b5e4b]/40 rounded-3xl p-5 space-y-4 animate-fadeIn text-xs">
            <div className="flex justify-between items-start">
              <div>
                <b className="text-sm font-bold text-[#0e2721] block flex items-center gap-1.5 font-serif">
                  <ShieldCheck className="w-4 h-4 text-[#1b5e4b]" />
                  <span>Gestor de Códigos de Activación (30 Días)</span>
                </b>
                <p className="text-[11px] text-[#52665e] mt-0.5">
                  Genera códigos únicos para entregar a los clientes que paguen $29.900 en Wompi.
                </p>
              </div>

              <button
                onClick={() => handleAdminLogin(adminPinInput || 'ALMA_ADMIN_2026')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 hover:bg-emerald-200"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Actualizar</span>
              </button>
            </div>

            {!isAdminAuthenticated ? (
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2.5">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Ingresa tu PIN de Administradora:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="PIN (Por defecto: ALMA_ADMIN_2026)"
                    className="flex-1 p-2 rounded-xl border border-gray-300 text-xs outline-none"
                  />
                  <button
                    onClick={() => handleAdminLogin()}
                    disabled={isLoadingAdminCodes}
                    className="px-4 py-2 rounded-xl bg-[#0e2721] text-[#ead08f] font-bold text-xs"
                  >
                    Ingresar
                  </button>
                </div>
                {adminPinError && (
                  <p className="text-red-600 text-[11px]">{adminPinError}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats */}
                {adminStats && (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-500 block">Total</span>
                      <b className="text-sm text-gray-800">{adminStats.total}</b>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 block">Disponibles</span>
                      <b className="text-sm text-emerald-800">{adminStats.available}</b>
                    </div>
                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                      <span className="text-[10px] text-blue-700 block">Activos</span>
                      <b className="text-sm text-blue-800">{adminStats.used}</b>
                    </div>
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <span className="text-[10px] text-amber-700 block">Expirados</span>
                      <b className="text-sm text-amber-800">{adminStats.expired}</b>
                    </div>
                  </div>
                )}

                {/* Generator button */}
                <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row gap-2 items-center justify-between">
                  <div className="text-[11px] text-gray-600 w-full sm:w-auto">
                    <span className="font-bold text-gray-800 block">¿Recibiste un pago nuevo en Wompi?</span>
                    <span>Genera un código nuevo de 30 días con 1 clic:</span>
                  </div>
                  <button
                    onClick={handleGenerateCode}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1b5e4b] text-[#ead08f] font-bold text-xs hover:bg-[#144436] transition-all flex items-center justify-center gap-1.5 shadow-sm flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Generar Código de 30 Días</span>
                  </button>
                </div>

                {adminActionMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold text-center animate-fadeIn">
                    {adminActionMsg}
                  </div>
                )}

                {/* Codes List */}
                <div className="space-y-2">
                  <b className="text-xs font-bold text-gray-800 block">
                    Códigos Disponibles para Entregar a Clientes:
                  </b>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {adminCodes
                      .filter((c) => c.status === 'available')
                      .map((c) => (
                        <div
                          key={c.code}
                          className="bg-white p-3 rounded-xl border border-emerald-300 flex items-center justify-between shadow-2xs"
                        >
                          <div>
                            <span className="font-mono font-bold text-sm text-[#0e2721] tracking-wider block">
                              {c.code}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-medium">
                              Válido por {c.durationDays || 30} días (Sin activar)
                            </span>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCopy(c.code, c.code)}
                              className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] flex items-center gap-1"
                              title="Copiar código"
                            >
                              {copiedCode === c.code ? (
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedCode === c.code ? '¡Copiado!' : 'Código'}</span>
                            </button>

                            <button
                              onClick={() => handleCopyWhatsappMessage(c.code)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-[#ead08f] font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                              title="Copiar mensaje completo para WhatsApp"
                            >
                              {copiedMessageCode === c.code ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#ead08f]" />
                              ) : (
                                <Send className="w-3.5 h-3.5 text-[#ead08f]" />
                              )}
                              <span>
                                {copiedMessageCode === c.code ? '¡Mensaje Copiado!' : 'Mensaje WhatsApp'}
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}

                    {adminCodes.filter((c) => c.status === 'available').length === 0 && (
                      <p className="text-gray-500 text-[11px] italic p-2 text-center bg-white rounded-xl">
                        No hay códigos disponibles. Haz clic arriba en "+ Generar Código de 30 Días".
                      </p>
                    )}
                  </div>
                </div>

                {/* Used / Active codes table */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <b className="text-xs font-bold text-gray-800 block">
                    Códigos Usados en Dispositivos:
                  </b>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {adminCodes
                      .filter((c) => c.status === 'used')
                      .map((c) => (
                        <div
                          key={c.code}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${
                            c.isExpired
                              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                              : 'bg-blue-50/50 border-blue-200 text-blue-950'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs">{c.code}</span>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  c.isExpired
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {c.isExpired ? 'Expirado' : `${c.daysRemaining} días restantes`}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 block">
                              Dispositivo: {c.boundDeviceId?.slice(0, 12)}... · Vence:{' '}
                              {formatDate(c.expiresAt)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleResetCode(c.code)}
                            className="px-2 py-1 rounded bg-white hover:bg-red-50 text-gray-600 hover:text-red-700 text-[10px] font-medium border border-gray-200"
                            title="Liberar dispositivo si el cliente cambió de celular"
                          >
                            Liberar equipo
                          </button>
                        </div>
                      ))}

                    {adminCodes.filter((c) => c.status === 'used').length === 0 && (
                      <p className="text-gray-500 text-[11px] italic p-2 text-center">
                        Ningún cliente ha activado códigos aún.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
