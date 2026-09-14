import React from 'react';

interface LogoMarkProps {
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ className = 'w-9 h-9' }) => (
  <img src="/logo-icon.png" alt="" className={`object-contain ${className}`} />
);

interface LogoProps {
  className?: string;
  wordmarkClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', wordmarkClassName = 'h-6' }) => (
  <span className={`flex items-center gap-2.5 ${className}`}>
    <LogoMark />
    <img src="/logo-wordmark.png" alt="ArenaOS" className={`w-auto object-contain ${wordmarkClassName}`} />
  </span>
);
