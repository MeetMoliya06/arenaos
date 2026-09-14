import React, { useState, useEffect } from 'react';
import { playClick, playHover } from '../audio/soundEffects';

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-5 md:py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={() => playClick()}
          className="flex items-center gap-2.5"
        >
          <div className="w-2 h-2 rounded-full bg-arena-lime" />
          <span className="font-semibold text-lg tracking-tight text-white">
            Arena<span className="text-arena-lime">OS</span>
          </span>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-arena-muted">
          <a
            href="#leakage"
            onClick={() => playClick()}
            className="hover:text-white transition-colors"
          >
            Leakage audit
          </a>
          <a
            href="#modules"
            onClick={() => playClick()}
            className="hover:text-white transition-colors"
          >
            Product
          </a>
          <a
            href="#telemetry"
            onClick={() => playClick()}
            className="hover:text-white transition-colors"
          >
            Telemetry
          </a>
          <a
            href="#rbac"
            onClick={() => playClick()}
            className="hover:text-white transition-colors"
          >
            Permissions
          </a>
        </nav>

        {/* Book Deployment CTA */}
        <button
          onClick={() => {
            playClick();
            onOpenDemo();
          }}
          onMouseEnter={() => playHover()}
          className="px-4 py-2 bg-arena-lime text-black font-medium text-sm rounded-md transition-colors hover:bg-arena-limeBright active:scale-[0.98]"
        >
          Request a demo
        </button>
      </div>
    </header>
  );
};
