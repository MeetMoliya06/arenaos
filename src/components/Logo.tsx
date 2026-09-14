import React from 'react';

interface LogoMarkProps {
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-9 h-9' }) => (
  <img src="/logo-icon.png" alt="" className={`object-contain ${className}`} />
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
