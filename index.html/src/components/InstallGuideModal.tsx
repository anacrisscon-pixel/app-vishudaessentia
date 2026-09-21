import React, { useState } from 'react';
import { Smartphone, Share, PlusSquare, MoreVertical, CheckCircle2, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

interface InstallGuideModalProps {
  onBack: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ onBack }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  return (
    <div className="space-y-4 pb-12 animate-fadeIn text-[#192b23]">
      <div className="flex items-center justify-between pb-2 border-b border-[#e5ded2]">
        <button
          onClick={onBack}
          className="text-xs font-bold text-[#144436] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9c7827] bg-[#fdf6e7] px-2.5 py-0.5 rounded-full border border-[#f0dfb5]">
          PWA · Acceso Directo
        </span>
      </div>

      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#0c241d] to-[#173e33] text-white rounded-3xl p-5 shadow-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#ead08f] text-[#0c241d] flex items-center justify-center mx-auto shadow-md">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-serif font-bold text-[#ead08f]">
            Cómo instalar Vishuda en tu celular
          </h1>
          <p className="text-xs text-[#d1e2db] mt-1.5 leading-relaxed">
            No necesitas entrar a App Store ni Google Play. Al agregarla a la pantalla de inicio, se abrirá en <b>pantalla completa como una app nativa</b> con su propio icono dorado.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 max-w-xs mx-auto text-xs font-bold">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              platform === 'ios'
                ? 'bg-[#ead08f] text-[#0c241d] shadow-sm'
                : 'text-[#cfded7] hover:text-white'
            }`}
          >
            iPhone (Safari)
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              platform === 'android'
                ? 'bg-[#ead08f] text-[#0c241d] shadow-sm'
                : 'text-[#cfded7] hover:text-white'
            }`}
          >
            Android (Chrome)
          </button>
        </div>
      </div>

      {/* Steps iOS */}
      {platform === 'ios' && (
        <div className="space-y-3">
          <div className="bg-white border border-[#d9e3de] rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div className="text-xs">
                <b>Abre el enlace en Safari:</b> Asegúrate de estar navegando en Safari (el navegador oficial de Apple).
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div className="text-xs">
                <b>Toca el botón Compartir:</b> En la barra inferior de Safari, pulsa el icono cuadrado con la flecha hacia arriba (<Share className="w-3.5 h-3.5 inline text-[#144436]" />).
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div className="text-xs">
                <b>Selecciona «Agregar al inicio»:</b> Desliza un poco hacia abajo en el menú y toca la opción con el símbolo más (<PlusSquare className="w-3.5 h-3.5 inline text-[#144436]" />).
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div className="text-xs">
                <b>Confirma «Agregar»:</b> Arriba a la derecha toca <b>Agregar</b>. ¡Listo! Ya verás el icono de Vishuda junto a tus demás aplicaciones.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Steps Android */}
      {platform === 'android' && (
        <div className="space-y-3">
          <div className="bg-white border border-[#d9e3de] rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div className="text-xs">
                <b>Abre el enlace en Google Chrome:</b> Ingresa al link de tu app desde el navegador Chrome.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div className="text-xs">
                <b>Toca el menú de tres puntos:</b> Arriba a la derecha en Chrome, pulsa los 3 puntos verticales (<MoreVertical className="w-3.5 h-3.5 inline text-[#144436]" />).
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div className="text-xs">
                <b>Toca «Instalar aplicación» o «Agregar a pantalla principal»:</b> Selecciona esa opción del menú desplegable.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#144436] text-[#ead08f] text-xs font-bold flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div className="text-xs">
                <b>Confirma «Instalar»:</b> Se creará el acceso directo independiente en tu cajón de apps de inmediato.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="bg-[#f0f6f3] border border-[#bcd7cb] rounded-2xl p-4 text-xs text-[#204235] space-y-2">
        <b className="block text-[#0e2721] font-bold">Ventajas de instalarla en la pantalla de inicio:</b>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#144436] flex-shrink-0" />
            <span>Sin barras de navegación estorbosas de Safari o Chrome.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#144436] flex-shrink-0" />
            <span>Tu código de 30 días y tus reflexiones quedan guardados en ese teléfono.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#144436] flex-shrink-0" />
            <span>Los reproductores de audio y sonidos de calma continúan sonando con fluidez.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
