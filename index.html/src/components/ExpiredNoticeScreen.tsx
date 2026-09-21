import React from 'react';
import { CreditCard, ExternalLink, ShieldAlert, Sparkles, RefreshCw, Smartphone, KeyRound, MessageCircle } from 'lucide-react';
import { MembershipData } from '../utils/storage';

interface ExpiredNoticeScreenProps {
  membership: MembershipData;
  onGoToActivation: () => void;
  onDismissToExploreFree?: () => void;
}

export const ExpiredNoticeScreen: React.FC<ExpiredNoticeScreenProps> = ({
  membership,
  onGoToActivation,
  onDismissToExploreFree,
}) => {
  const WOMPI_LINK =
    (import.meta as any).env?.VITE_WOMPI_PAYMENT_URL ||
    'https://checkout.wompi.co/l/VISHUDA_CONTINUO';

  const WHATSAPP_SUPPORT_URL =
    (import.meta as any).env?.VITE_WHATSAPP_SUPPORT_URL ||
    'https://wa.me/?text=' +
      encodeURIComponent(
        'Hola Ana Cristina, he realizado mi pago de renovación de $29.900 en Wompi para Vishuda Continuo. Adjunto mi comprobante para recibir mi nuevo código de 30 días.'
      );

  const handlePayWompi = () => {
    window.open(WOMPI_LINK, '_blank');
  };

  const handleOpenWhatsApp = () => {
    window.open(WHATSAPP_SUPPORT_URL, '_blank');
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'recientemente';
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
    <div className="space-y-5 pb-12 animate-fadeIn text-[#1d2924] max-w-md mx-auto">
      {/* Expiration badge */}
      <div className="bg-[#fff9eb] border-2 border-[#d4a347] rounded-3xl p-6 shadow-md text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#fcedc9] text-[#9c6c19] flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-7 h-7 text-[#b57a1b]" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-[#f8e3b3] text-[#7a4f08] inline-block">
            Ciclo de 30 Días Concluido
          </span>
          <h1 className="text-2xl font-serif font-extrabold text-[#0e2721] mt-2">
            Tu Acompañamiento ha Expirado
          </h1>
          <p className="text-xs text-[#52665e] mt-2 leading-relaxed">
            Tu ciclo finalizó el <b>{formatDate(membership.expiresAt)}</b>. Tus reflexiones y tu diario siguen seguros. Los lanzamientos semanales inéditos, los 14 casos y el chat con el Espejo IA han entrado en pausa.
          </p>
        </div>

        {/* Clean phone indicator */}
        <div className="text-[11px] text-[#7a6039] bg-[#fdf4df] p-2.5 rounded-xl border border-[#ecd5a1] flex items-center justify-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 flex-shrink-0 text-[#9c6c19]" />
          <span>Equipo vinculado para renovación directa</span>
        </div>

        {/* Actions: Pay Renewal on Wompi + Send Voucher WhatsApp */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={handlePayWompi}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a059] via-[#ead08f] to-[#deb970] text-[#091c17] font-extrabold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#091c17]" />
            <span>Pagar Renovación en Wompi ($29.900 COP)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#091c17]" />
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 rounded-2xl bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#0f5132] border border-[#25d366]/40 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#25d366]" />
            <span>Enviar comprobante por WhatsApp</span>
          </button>

          <p className="text-[10px] text-[#7a6039]">
            Pago único de 30 días · Sin cobros automáticos sorpresa (Nequi, Bancolombia, PSE, Tarjeta).
          </p>
        </div>
      </div>

      {/* Benefits Reminder */}
      <div className="bg-white border border-[#dce6e1] rounded-3xl p-5 space-y-3 shadow-2xs">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1b5e4b] block">
          Al renovar tu ciclo recuperas de inmediato:
        </span>
        <ul className="space-y-2.5 text-xs text-[#375247]">
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
            <span><b>Lanzamientos semanales de los Lunes:</b> Audios inéditos y prácticas somáticas canalizadas.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
            <span><b>14 Casos Reales:</b> Desglose clínico y espiritual de detonantes, mecanismos y heridas.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
            <span><b>Chat Espejo con Alma (IA):</b> Acompañamiento en tiempo real para decodificar tus patrones diarios.</span>
          </li>
        </ul>
      </div>

      {/* Activation Code CTA */}
      <div className="bg-[#f0f5f2] border border-[#bcd7cb] rounded-3xl p-4 text-center space-y-2.5">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0e2721]">
          <KeyRound className="w-4 h-4 text-[#1b5e4b]" />
          <span>¿Ya hiciste tu pago en Wompi y tienes tu nuevo código?</span>
        </div>
        <p className="text-[11px] text-[#52665e]">
          Ingresa tu nuevo código para reactivar otros 30 días en este teléfono.
        </p>
        <button
          onClick={onGoToActivation}
          className="w-full py-2.5 rounded-xl bg-[#0e2721] text-[#ead08f] font-bold text-xs hover:bg-[#183d33] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#ead08f]" />
          <span>Ingresar Código de Renovación</span>
        </button>
      </div>

      {/* Free mode option & Safe space reassurance */}
      {onDismissToExploreFree && (
        <div className="bg-[#faf7f0] border border-[#e5ded0] rounded-3xl p-4 text-center space-y-2">
          <div className="text-xs font-bold text-[#144436] flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2d6353]" />
            <span>Tus registros y tu diario siguen intactos</span>
          </div>
          <p className="text-[11px] text-[#556961] leading-relaxed">
            Puedes continuar realizando tu respiración de rescate (SOS Cortisol), consultar el oráculo del día y revisar todo lo que has escrito en tu diario.
          </p>
          <button
            onClick={onDismissToExploreFree}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#bcd7cb] text-[#0e2721] font-bold text-xs hover:bg-[#f0f6f3] transition-all cursor-pointer shadow-2xs"
          >
            Continuar con herramientas gratuitas y mi diario →
          </button>
        </div>
      )}
    </div>
  );
};
