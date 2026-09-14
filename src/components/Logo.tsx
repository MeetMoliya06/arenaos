import React from 'react';

interface LogoMarkProps {
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <rect
      x="10" y="14" width="30" height="34" rx="4"
      transform="rotate(-8 25 31)"
      stroke="#CCFF00" strokeWidth="3.2" fill="none"
    />
    <rect
      x="24" y="20" width="32" height="30" rx="6"
      transform="rotate(7 40 35)"
      stroke="#CCFF00" strokeWidth="3.2" fill="none"
    />
    <g transform="rotate(7 40 35)" fill="#CCFF00">
      <rect x="31" y="30" width="9" height="3" rx="1" />
      <rect x="34" y="27" width="3" height="9" rx="1" />
    </g>
    <g transform="rotate(7 40 35)" fill="#CCFF00">
      <circle cx="47" cy="32" r="1.8" />
      <circle cx="51" cy="35.5" r="1.8" />
      <circle cx="47" cy="39" r="1.8" />
      <circle cx="43.5" cy="35.5" r="1.8" />
    </g>
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
