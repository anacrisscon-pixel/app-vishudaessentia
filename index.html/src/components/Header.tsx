import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { VishudaLogo } from './VishudaLogo';
import { ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { getMembershipStatus, MembershipData } from '../utils/storage';

interface HeaderProps {
  onNavigate?: (view: ViewType) => void;
  currentView?: ViewType;
  onGoHome?: () => void;
  onOpenPremium?: () => void;
  onOpenWeekly?: () => void;
  onOpenAi?: () => void;
  onOpenMedia?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onGoHome,
  onOpenPremium,
  onOpenAi,
}) => {
  const [membership, setMembership] = useState<MembershipData>(() => getMembershipStatus());
  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    return localStorage.getItem('vishuda_large_text') === 'true';
  });

  useEffect(() => {
    if (isLargeText) {
      document.documentElement.classList.add('large-text-mode');
    } else {
      document.documentElement.classList.remove('large-text-mode');
    }
    localStorage.setItem('vishuda_large_text', String(isLargeText));
  }, [isLargeText]);

  useEffect(() => {
    const handleUpdate = () => setMembership(getMembershipStatus());
    window.addEventListener('vishuda_membership_updated', handleUpdate);
    return () => window.removeEventListener('vishuda_membership_updated', handleUpdate);
  }, []);

  const toggleTextSize = () => {
    setIsLargeText((prev) => !prev);
  };

  const isPremium = membership.isActive && !membership.isExpired;
  const isExpired = membership.isExpired;
  const isExpiringSoon = isPremium && (membership.daysRemaining ?? 30) <= 3;

  const handleHome = () => {
    if (onGoHome) onGoHome();
    else if (onNavigate) onNavigate('home');
  };

  const handlePremium = () => {
    if (onOpenPremium) onOpenPremium();
    else if (onNavigate) onNavigate('premium');
  };

  const handleAi = () => {
    if (onOpenAi) onOpenAi();
    else if (onNavigate) onNavigate('ai');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0c221c] border-b border-[#c5a059]/40 px-3.5 py-3 flex items-center justify-between shadow-md">
      {/* Brand & Logo */}
      <div onClick={handleHome} className="cursor-pointer group flex items-center">
        <VishudaLogo size="md" />
      </div>

      {/* Action buttons with larger, comfortable click targets */}
      <div className="flex items-center gap-2">
        {/* Quick Text Size Toggle: A / A+ */}
        <button
          onClick={toggleTextSize}
          className={`text-xs font-extrabold px-2.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
            isLargeText
              ? 'bg-[#ead08f] text-[#0c221c] border-[#ead08f] shadow-xs ring-2 ring-white/30'
              : 'bg-white/10 text-[#d8e8e1] border-white/20 hover:bg-white/20'
          }`}
          title={isLargeText ? 'Texto Grande Activado (Toca para Normal)' : 'Toca para Agrandar Letra'}
          aria-label="Agrandar o reducir texto"
        >
          <span className="text-sm">A{isLargeText ? '+' : ''}</span>
          <span className="hidden xs:inline">{isLargeText ? 'Grande' : 'Letra'}</span>
        </button>

        <button
          onClick={handleAi}
          className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-[#0c221c] bg-[#ead08f] hover:bg-[#deb970] shadow-xs cursor-pointer active:scale-95"
          title="Hablar con Alma (IA)"
        >
          <Sparkles className="w-4 h-4 text-[#0c221c]" />
          <span>Alma IA</span>
        </button>

        <button
          onClick={handlePremium}
          className={`text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
            isExpiringSoon
              ? 'bg-amber-400 text-[#091c17] animate-pulse border border-amber-500'
              : isPremium
              ? 'bg-[#153e32] text-[#d6ede4] border border-[#c5a059]/50'
              : isExpired
              ? 'bg-amber-100 text-amber-900 border border-amber-400'
              : 'bg-[#153e32] text-[#ead08f] border border-[#c5a059]/50'
          }`}
          title="Estado de tu membresía"
        >
          {isExpiringSoon ? (
            <Clock className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>
            {isExpiringSoon
              ? `${membership.daysRemaining}d`
              : isPremium
              ? `${membership.daysRemaining}d`
              : isExpired
              ? 'Renovar'
              : 'Membresía'}
          </span>
        </button>
      </div>
    </header>
  );
};
