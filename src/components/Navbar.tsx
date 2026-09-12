import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldCheck, Terminal } from 'lucide-react';
import { toggleAudio, getAudioState, playClick, playHover } from '../audio/soundEffects';

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo }) => {
  const [audioActive, setAudioActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAudioToggle = () => {
    const newState = toggleAudio();
    setAudioActive(newState);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080A]/90 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-5 md:py-6 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="flex items-center gap-3 group"
          data-cursor="ARENA"
        >
          <div className="w-8 h-8 bg-black border border-white/20 rounded flex items-center justify-center relative overflow-hidden group-hover:border-arena-lime transition-colors">
            <div className="w-3.5 h-3.5 bg-arena-lime rotate-45 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-arena-lime/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg md:text-xl tracking-tight text-white flex items-center gap-1.5">
              ARENA<span className="text-arena-lime">OS</span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-arena-muted uppercase hidden sm:block">
              GAMING ERP // KERNEL v2.4
            </span>
          </div>
        </a>

        {/* Live operational status pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-[#121318] border border-white/10 rounded-full font-mono text-[11px] text-arena-text">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arena-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-arena-lime" />
          </div>
          <span className="text-white font-medium">FLEET ONLINE:</span>
          <span className="text-arena-lime font-mono">106 RIGS SYNCED</span>
          <span className="text-arena-subtle">|</span>
          <span className="text-arena-muted">LATENCY 4ms</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-arena-muted">
          <a
            href="#leakage"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="hover:text-arena-lime transition-colors"
          >
            // LEAKAGE AUDIT
          </a>
          <a
            href="#modules"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="hover:text-arena-lime transition-colors"
          >
            // CORE ENGINE
          </a>
          <a
            href="#telemetry"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="hover:text-arena-lime transition-colors"
          >
            // TELEMETRY
          </a>
          <a
            href="#rbac"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="hover:text-arena-lime transition-colors"
          >
            // PERMISSIONS
          </a>
        </nav>

        {/* Action Right: Audio toggle + Request deployment button */}
        <div className="flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => playHover()}
            className="p-2 text-arena-muted hover:text-arena-lime border border-white/10 hover:border-arena-lime/40 rounded bg-white/5 transition-all flex items-center gap-1.5 font-mono text-[11px]"
            title={audioActive ? 'Mute synthesized UI sound' : 'Enable synthesized UI sound'}
            data-cursor="SFX"
          >
            {audioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-arena-lime" />
                <span className="hidden xl:inline text-arena-lime">SFX ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-arena-subtle" />
                <span className="hidden xl:inline text-arena-subtle">SFX OFF</span>
              </>
            )}
          </button>

          {/* Book Deployment CTA */}
          <button
            onClick={() => {
              playClick();
              onOpenDemo();
            }}
            onMouseEnter={() => playHover()}
            className="relative group overflow-hidden px-4 md:px-5 py-2 bg-arena-lime text-black font-mono font-semibold text-xs uppercase tracking-wider rounded transition-all hover:shadow-lime-md active:scale-95"
            data-cursor="DEPLOY"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>REQUEST DEPLOYMENT</span>
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </header>
  );
};
