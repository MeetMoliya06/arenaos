import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppShowcase } from './AppShowcase';
import { playClick, playHover } from '../audio/soundEffects';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {


  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-8 overflow-hidden border-b border-white/[0.08]">
      {/* Background glow & subtle grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#CCFF00]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Product Positioning & Value */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              <span className="text-[#EDEDEF] font-medium">Esports &amp; Gaming Lounge OS</span>
              <span className="text-white/20">·</span>
              <span className="text-[#6B6B77] font-mono text-xs">v2.4 Production</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-[4.25rem] font-semibold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">Zero unbilled minutes.</span>{' '}
              <span className="text-[#8A8A93]">Absolute control from desk to station.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9999A0] max-w-lg mb-9 leading-relaxed">
              Hardware-enforced PC lockscreens, instant member wallets, in-seat café ordering, and automated shift till reconciliations.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-5 mb-10">
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 bg-[#CCFF00] text-[#0A0A0B] font-semibold text-sm rounded-lg transition-all hover:bg-[#b8e600] active:scale-[0.98] flex items-center gap-2.5"
              >
                <span>Book Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#modules"
                onClick={() => playClick()}
                className="text-[#B4B4BB] hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>View Features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Proof strip */}
            <div className="pt-7 border-t border-white/[0.08] flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#8A8A93]">
              <span><strong className="text-white font-semibold">240+</strong> rigs live</span>
              <span className="text-white/20">•</span>
              <span><strong className="text-white font-semibold">₹0</strong> timer leakage</span>
              <span className="text-white/20">•</span>
              <span><strong className="text-white font-semibold">Offline</strong> LAN resilient</span>
            </div>

          </div>

          {/* Right Column: Cursor-style Auto-Cycling Product Showcase */}
          <div className="lg:col-span-6 relative">
            <AppShowcase />
          </div>

        </div>
      </div>
    </section>
  );
};
