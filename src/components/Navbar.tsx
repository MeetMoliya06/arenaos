import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenDemo: () => void;
}

const NAV_ITEMS = [
  { id: 'leakage', label: 'Why ArenaOS' },
  { id: 'modules', label: 'Features' },
  { id: 'rbac', label: 'Security' },
  { id: 'proof', label: 'Our Client', badge: 'LIVE' },
];

const SHAPE =
  'polygon(28px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 16px 100%, 0 calc(100% - 16px), 0 28px)';
const SHAPE_INNER =
  'polygon(28px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 28px), calc(100% - 28px) 100%, 16px 100%, 0 calc(100% - 16px), 0 28px)';

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav item for the section currently in view
  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.id);
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let cur = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) cur = id;
      }
      setActive(cur);
    };
    onScroll();
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
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div
        className={`relative max-w-7xl mx-auto pointer-events-auto transition-transform duration-300 ${
          scrolled ? 'drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]' : ''
        }`}
      >
        {/* Chamfered border + lime corner accents */}
        <div aria-hidden="true" className="absolute inset-0 bg-white/[0.12]" style={{ clipPath: SHAPE }} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#CCFF00]"
          style={{
            clipPath: SHAPE,
            WebkitMaskImage:
              'radial-gradient(circle at 0 0, #000 0, transparent 190px), radial-gradient(circle at 100% 100%, #000 0, transparent 190px)',
            maskImage:
              'radial-gradient(circle at 0 0, #000 0, transparent 190px), radial-gradient(circle at 100% 100%, #000 0, transparent 190px)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[1px] bg-[#0B0C0F]/90 backdrop-blur-xl"
          style={{ clipPath: SHAPE_INNER }}
        />

        <div className="relative flex items-center justify-between gap-4 px-4 sm:px-8 py-2.5 sm:py-3">
          {/* Brand */}
          <a
            href="#"
            onClick={(e) => handleNavClick('top', e)}
            className="rounded outline-none focus-visible:ring-1 focus-visible:ring-[#CCFF00] transition-opacity hover:opacity-90 shrink-0"
          >
            <Logo markClassName="w-8 h-8 sm:w-10 sm:h-10" wordmarkClassName="h-4 sm:h-5 md:h-[22px]" />
          </a>

          {/* Nav pills */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#9999A0]">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  onMouseEnter={() => playHover()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors outline-none focus-visible:text-white ${
                    isActive
                      ? 'text-white bg-[#CCFF00]/10 border-[#CCFF00]/30'
                      : 'border-transparent hover:text-white'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] text-[10px] font-mono font-semibold tracking-wide">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Status + CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="hidden xl:block w-px h-9 bg-white/10" />
            <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 text-xs text-[#9999A0]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]" />
              </span>
              <span>
                System: <span className="text-[#CCFF00]">Online</span>
              </span>
            </div>
            <a
              href="/live-demo/"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap px-3.5 py-2 sm:px-5 sm:py-2.5 border border-white/15 text-white font-semibold text-xs sm:text-sm tracking-tight rounded-lg transition-all hover:bg-white/5 active:scale-[0.98]"
            >
              Try Live Demo
            </a>
            <button
              onClick={() => {
                playClick();
                onOpenDemo();
              }}
              onMouseEnter={() => playHover()}
              className="group inline-flex items-center justify-center gap-1.5 whitespace-nowrap px-3.5 py-2 sm:px-5 sm:py-2.5 bg-[#CCFF00] hover:bg-[#d8ff33] text-[#08090B] font-bold text-xs sm:text-sm tracking-tight rounded-lg transition-all duration-200 shadow-[0_0_24px_rgba(204,255,0,0.3)] hover:shadow-[0_0_36px_rgba(204,255,0,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
            >
              <span>Book a Live Demo</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
