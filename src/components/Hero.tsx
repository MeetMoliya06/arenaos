import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { AppShowcase } from './AppShowcase';
import { playClick, playHover } from '../audio/soundEffects';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {


  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden border-b border-white/[0.08]">
      {/* Background glow & subtle grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#CCFF00]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Product Positioning & Value */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* Editorial Eyebrow */}
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-[#CCFF00] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>Gaming Lounge & Esports Arena OS</span>
              <span className="text-white/20">·</span>
              <span className="text-[#9999A0]">Surat Reference Deployment</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.06] mb-5">
              Stop unbilled gaming hours. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                Run every PC, bill & shift in complete control.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9999A0] max-w-xl mb-8 leading-relaxed">
              The operating system purpose-built for gaming cafés: hardware-enforced PC lockscreens, instant UPI wallet recharges, in-seat café orders, and ₹1-accurate shift till reconciliations.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 bg-[#CCFF00] text-[#0A0A0B] font-semibold text-sm rounded-lg transition-all hover:bg-[#b8e600] active:scale-[0.98] flex items-center gap-2.5 shadow-[0_0_30px_rgba(204,255,0,0.25)]"
              >
                <Terminal className="w-4 h-4" />
                <span>Book Live Demo</span>
              </button>

              <a
                href="#modules"
                onClick={() => playClick()}
                className="px-5 py-3.5 border border-white/10 hover:border-white/20 text-[#EDEDEF] text-sm font-medium rounded-lg transition-colors bg-white/[0.03] hover:bg-white/[0.06] flex items-center gap-2"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-[#9999A0]" />
              </a>
            </div>

            {/* Social Proof & Metrics Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
              <div>
                <div className="text-white font-mono text-xl sm:text-2xl font-bold tabular-nums">240+ Rigs</div>
                <div className="text-xs text-[#8A8A93] mt-0.5">Live across 4 Surat arenas</div>
              </div>
              <div>
                <div className="text-[#CCFF00] font-mono text-xl sm:text-2xl font-bold tabular-nums">₹0 Leakage</div>
                <div className="text-xs text-[#8A8A93] mt-0.5">Auto-lock on timer zero</div>
              </div>
              <div>
                <div className="text-white font-mono text-xl sm:text-2xl font-bold tabular-nums">Online + Offline</div>
                <div className="text-xs text-[#8A8A93] mt-0.5">Works with or without internet</div>
              </div>
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
