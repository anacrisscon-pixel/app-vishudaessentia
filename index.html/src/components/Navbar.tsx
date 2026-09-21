import React from 'react';
import { ViewType } from '../types';
import { Home, Compass, Calendar, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems: Array<{ id: ViewType; label: string; icon: React.ReactNode }> = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'ai',
      label: 'Alma (IA)',
      icon: <Sparkles className="w-5 h-5 text-[#ead08f]" />,
    },
    {
      id: 'explore',
      label: 'Descubrir',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'weekly',
      label: 'Lunes',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'more',
      label: 'Mi Espacio',
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-[#0c221c] border-t border-[#c5a059]/40 shadow-2xl px-2 py-2 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive =
          currentView === item.id ||
          (item.id === 'home' && (currentView === 'checkin' || currentView === 'oracle' || currentView === 'oraculo')) ||
          (item.id === 'ai' && currentView === 'ai') ||
          (item.id === 'weekly' && currentView === 'weekly') ||
          (item.id === 'explore' && ['cases', 'explore', 'patterns', 'situations'].includes(currentView)) ||
          (item.id === 'more' && ['more', 'insights', 'sounds', 'media', 'mirror', 'history', 'journey', 'practice', 'practices', 'cortisol', 'anchors', 'guilt', 'belonging', 'premium', 'agenda', 'fire'].includes(currentView));

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-[#ead08f] font-extrabold bg-white/15 shadow-sm'
                : 'text-[#d0e2db]/80 hover:text-white'
            }`}
          >
            <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-[#ead08f]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-xs sm:text-sm mt-1 font-bold tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
