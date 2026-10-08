import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (targetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    playClick();
    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090B]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-transparent py-5 md:py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick('top', e)} 
          className="rounded outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00] transition-opacity hover:opacity-90"
        >
          <Logo markClassName="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11" wordmarkClassName="h-5 sm:h-7 md:h-8" />
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9999A0]">
          <a
            href="#leakage"
            onClick={(e) => handleNavClick('leakage', e)}
            className="hover:text-white transition-colors py-1 outline-none focus-visible:text-white"
          >
            Why ArenaOS
          </a>
          <a
            href="#modules"
            onClick={(e) => handleNavClick('modules', e)}
            className="hover:text-white transition-colors py-1 outline-none focus-visible:text-white"
          >
            Features
          </a>
          <a
            href="#rbac"
            onClick={(e) => handleNavClick('rbac', e)}
            className="hover:text-white transition-colors py-1 outline-none focus-visible:text-white"
          >
            Security & RBAC
          </a>
          <a
            href="#proof"
            onClick={(e) => handleNavClick('proof', e)}
            className="hover:text-white transition-colors py-1 outline-none focus-visible:text-white flex items-center gap-2 text-[#EDEDEF]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
            Apple Esports Case Study
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              onOpenDemo();
            }}
            onMouseEnter={() => playHover()}
            className="group relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-2.5 bg-[#CCFF00] hover:bg-[#d8ff33] text-[#08090B] font-bold text-xs sm:text-sm tracking-tight rounded-lg transition-all duration-200 shadow-[0_0_24px_rgba(204,255,0,0.3)] hover:shadow-[0_0_36px_rgba(204,255,0,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
          >
            <span>Book Live Demo</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
