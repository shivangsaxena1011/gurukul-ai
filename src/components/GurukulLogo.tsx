import React from 'react';

interface GurukulLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
}

export const GurukulLogo: React.FC<GurukulLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  subtitle
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 24, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10 sm:w-11 sm:h-11', svg: 32, text: 'text-lg sm:text-xl', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14 sm:w-16 sm:h-16', svg: 44, text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20 sm:w-24 sm:h-24', svg: 64, text: 'text-3xl sm:text-4xl', sub: 'text-sm' }
  };

  const { box, svg, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Symbolic Emblem */}
      <div
        className={`${box} relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-saffron-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all duration-300 flex-shrink-0`}
      >
        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle amber radial shine in logo background */}
          <div className="absolute inset-0 bg-radial from-amber-50/80 via-transparent to-transparent pointer-events-none" />

          <svg
            width={svg}
            height={svg}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <defs>
              {/* Flame Gradient */}
              <linearGradient id="gkFlameGrad" x1="32" y1="8" x2="32" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Book Base Gradient */}
              <linearGradient id="gkBookGrad" x1="12" y1="34" x2="52" y2="54" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* AI Circuit Pulse Gradient */}
              <linearGradient id="gkPulseGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Gurukul Diya / Open Wisdom Book Base */}
            {/* Left Page */}
            <path
              d="M32 44C25 41 17 40 12 43V48C17 45 25 46 32 49V44Z"
              fill="url(#gkBookGrad)"
            />
            {/* Right Page */}
            <path
              d="M32 44C39 41 47 40 52 43V48C47 45 39 46 32 49V44Z"
              fill="url(#gkBookGrad)"
            />

            {/* Book Spine / Pedestal */}
            <path
              d="M30 48.5C31.2 48.2 32.8 48.2 34 48.5V52C32.8 51.5 31.2 51.5 30 52V48.5Z"
              fill="#78350F"
            />

            {/* Neural / AI Orbit rings around enlightenment flame */}
            <ellipse
              cx="32"
              cy="25"
              rx="18"
              ry="7"
              transform="rotate(-20 32 25)"
              stroke="url(#gkPulseGrad)"
              strokeWidth="1.75"
              strokeDasharray="2 2"
              strokeOpacity="0.75"
            />
            <circle cx="47" cy="18" r="2" fill="#10B981" />
            <circle cx="17" cy="32" r="1.5" fill="#F59E0B" />

            {/* Inner Sacred Gyan Jyoti / Flame of Wisdom */}
            <path
              d="M32 9C32 9 39 19 39 25C39 29.5 35.8 33 32 33C28.2 33 25 29.5 25 25C25 19 32 9 32 9Z"
              fill="url(#gkFlameGrad)"
            />

            {/* Inner core brilliant spark */}
            <path
              d="M32 17C32 17 35.5 22.5 35.5 25.5C35.5 27.5 33.9 29.5 32 29.5C30.1 29.5 28.5 27.5 28.5 25.5C28.5 22.5 32 17 32 17Z"
              fill="#FEF3C7"
            />

            {/* AI Top North Star Diamond */}
            <path
              d="M32 4L33.5 7L36.5 8.5L33.5 10L32 13L30.5 10L27.5 8.5L30.5 7L32 4Z"
              fill="#F59E0B"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black text-slate-900 tracking-tight ${text}`}>
              GURUKUL
            </span>
            <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 tracking-tight ${text}`}>
              AI
            </span>
          </div>
          {subtitle && (
            <p className={`text-slate-500 font-medium tracking-tight mt-0.5 ${sub}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
