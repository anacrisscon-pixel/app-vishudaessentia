import React from 'react';

interface VishudaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
  theme?: 'dark' | 'light' | 'gold' | 'white';
  layout?: 'horizontal' | 'vertical';
}

export const VishudaLogo: React.FC<VishudaLogoProps> = ({
  size = 'md',
  showText = true,
  textColor,
  className = '',
  theme = 'gold',
  layout = 'horizontal',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-11 h-11', text: 'text-base', sub: 'text-xs' },
    lg: { icon: 'w-16 h-16', text: 'text-xl', sub: 'text-sm' },
    xl: { icon: 'w-24 h-24', text: 'text-3xl', sub: 'text-base' },
    '2xl': { icon: 'w-32 h-32', text: 'text-4xl', sub: 'text-lg' },
  };

  const { icon, text, sub } = sizeMap[size];

  // Dynamic colors
  const resolvedTextColor =
    textColor ||
    (theme === 'dark'
      ? 'text-[#143026]'
      : theme === 'white'
      ? 'text-white'
      : 'text-[#eed89f]');

  const isVertical = layout === 'vertical';

  return (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center' : 'items-center gap-3'
      } ${className}`}
    >
      {/* Exact Vishuda Essentia Octagram & Vishuddha Sacred Symbol */}
      <div className={`${icon} relative flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="vishudaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae6b2" />
              <stop offset="25%" stopColor="#dcb367" />
              <stop offset="65%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#8d6b24" />
            </linearGradient>
            <linearGradient id="vishudaNeedleGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fff2cb" />
              <stop offset="60%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#7a5a1b" />
            </linearGradient>
          </defs>

          {/* Square 1: Axis aligned */}
          <rect
            x="24"
            y="24"
            width="72"
            height="72"
            stroke="url(#vishudaGoldGrad)"
            strokeWidth="2.2"
            fill="none"
          />

          {/* Square 2: Rotated 45 degrees around center (60, 60) */}
          <rect
            x="24"
            y="24"
            width="72"
            height="72"
            transform="rotate(45 60 60)"
            stroke="url(#vishudaGoldGrad)"
            strokeWidth="2.2"
            fill="none"
          />

          {/* Top Diamond / Rhombus (Bindu) */}
          <polygon
            points="60,33 63.5,37 60,41 56.5,37"
            fill="url(#vishudaGoldGrad)"
          />

          {/* Stylized Vishuddha "HAM" Seed Calligraphy */}
          {/* Top horizontal canopy bar with subtle angled serifs */}
          <path
            d="M 43 47.5 L 46.5 45.5 L 73.5 45.5 L 77 47.5"
            stroke="url(#vishudaGoldGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left downward flowing curve */}
          <path
            d="M 48 46 C 46 54, 52 58.5, 60 58.5"
            stroke="url(#vishudaGoldGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right curved wing/loop (petal / number 3 curve) */}
          <path
            d="M 60 54.5 C 71 54.5, 73.5 65.5, 65 71 C 58 75.5, 54 80, 56 86.5"
            stroke="url(#vishudaGoldGrad)"
            strokeWidth="2.3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Central spine / vertical needle of truth with sharp tip */}
          <path
            d="M 60 45.5 L 60 89.5"
            stroke="url(#vishudaNeedleGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div
          className={`flex flex-col justify-center ${
            isVertical ? 'items-center mt-2.5' : 'text-left'
          }`}
        >
          <span
            className={`font-serif tracking-[0.24em] font-extrabold uppercase ${resolvedTextColor} ${text} leading-none`}
          >
            VISHUDA
          </span>
          <span
            className={`font-sans tracking-[0.38em] font-medium text-[#c5a059] ${sub} leading-tight ${
              isVertical ? 'mt-1' : 'mt-0.5'
            }`}
          >
            ESSENTIA
          </span>
        </div>
      )}
    </div>
  );
};
