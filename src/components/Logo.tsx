import React from 'react';

interface LogoMarkProps {
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-[22px] h-[22px]' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M8 22L16 6L24 22H18L16 17L14 22H8Z" fill="#CCFF00" />
  </svg>
);

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => (
  <span className={`flex items-center gap-2.5 ${className}`}>
    <LogoMark />
    <span className="font-semibold text-lg tracking-tight text-white">
      Arena<span className="text-arena-lime">OS</span>
    </span>
  </span>
);
