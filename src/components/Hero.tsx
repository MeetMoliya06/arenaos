import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppShowcase } from './AppShowcase';
import { playClick, playHover } from '../audio/soundEffects';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {


  return (
    <section className="relative min-h-screen flex items-start lg:items-center pt-28 pb-10 overflow-hidden border-b border-white/[0.08]">

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Product Positioning & Value */}
          <div className="lg:col-span-5 flex flex-col justify-center">

            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              <span className="text-[#EDEDEF] font-medium">Software for gaming cafés</span>
              <span className="text-white/20">·</span>
              <span className="text-[#6B6B77] font-mono text-xs">Live now</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[3.25rem] xl:text-[3.75rem] font-semibold tracking-tight leading-[1.08] mb-5">
              <span className="text-white">Never miss a paid minute.</span>{' '}
              <span className="text-[#8A8A93]">Run your gaming café from one screen.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#9999A0] max-w-xl mb-7 leading-relaxed" style={{ textWrap: "balance" }}>
              Every PC locks when time is up. Players pay and order food from their seat. You always know where the money is.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-5 mb-8">
              <a
                href="/live-demo/"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 bg-[#CCFF00] text-[#0A0A0B] font-semibold text-sm rounded-lg transition-all hover:bg-[#b8e600] active:scale-[0.98] flex items-center gap-2.5"
              >
                <span>Try the Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 border border-white/15 text-white font-semibold text-sm rounded-lg transition-all hover:bg-white/5 active:scale-[0.98] flex items-center gap-2.5"
              >
                <span>Book a Walkthrough</span>
              </button>

              <a
                href="#modules"
                onClick={() => playClick()}
                className="text-[#B4B4BB] hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>See How It Works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Proof strip */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-sm sm:text-base text-[#8A8A93]">
              <span><strong className="text-white font-semibold">240+</strong> PCs</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span><strong className="text-white font-semibold">₹0</strong> free minutes lost</span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span><strong className="text-white font-semibold">Works</strong> offline</span>
            </div>

          </div>

          {/* Right Column: Cursor-style Auto-Cycling Product Showcase */}
          <div className="lg:col-span-7 relative">
            <AppShowcase />
          </div>

        </div>
      </div>
    </section>
  );
};
