import React from 'react';
import { ArrowDownRight, Terminal } from 'lucide-react';
import { Hero3DScene } from './Hero3D/Scene';
import { playClick, playHover } from '../audio/soundEffects';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative pt-20 md:pt-24 pb-8 md:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* System Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-xs text-arena-muted mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
              <span>Zero-leakage engine, live in production</span>
            </div>

            {/* Headline */}
            <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white mb-4">
              Every PC. Every rupee.<br />
              One dashboard.
            </h1>

            {/* Copy */}
            <p className="text-base sm:text-lg text-arena-muted max-w-xl mb-6 leading-relaxed">
              The operating system for gaming cafés and esports arenas. Stop unbilled minutes, eliminate cash drawer skimming, and command your PC fleet with sub-millisecond synchronization.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-5 py-2.5 bg-arena-lime text-black font-medium text-sm rounded-md transition-colors hover:bg-arena-limeBright flex items-center gap-2 active:scale-[0.98]"
              >
                <Terminal className="w-4 h-4" />
                <span>Book a fleet audit</span>
              </button>

              <a
                href="#leakage"
                onClick={() => playClick()}
                className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-white text-sm rounded-md transition-colors bg-white/[0.02] hover:bg-white/[0.05] flex items-center gap-2"
              >
                <span>Calculate leakage</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>
            </div>

            {/* Proof Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-white font-semibold text-lg md:text-xl">106 rigs</div>
                <div className="text-xs text-arena-muted mt-0.5">Active hardware</div>
              </div>
              <div>
                <div className="text-arena-lime font-semibold text-lg md:text-xl">0.00%</div>
                <div className="text-xs text-arena-muted mt-0.5">Unbilled leakage</div>
              </div>
              <div>
                <div className="text-white font-semibold text-lg md:text-xl">&lt;12ms</div>
                <div className="text-xs text-arena-muted mt-0.5">Lock latency</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Scene */}
          <div className="lg:col-span-6 relative">
            <Hero3DScene />
          </div>

        </div>
      </div>

      {/* Live event strip */}
      <div className="mt-6 md:mt-8 border-y border-white/10 py-2.5 overflow-hidden text-sm">
        <div className="flex w-max animate-marquee space-x-10 text-arena-muted">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span className="text-white">Indiranagar</span> — Rig 03 session started (VIP zone)
          </span>
          <span className="text-white/15">/</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-cyan" />
            <span className="text-white">Wallet top-up</span> — ₹1,000 credited via UPI
          </span>
          <span className="text-white/15">/</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span className="text-white">POS sync</span> — cash drawer verified (Shift A)
          </span>
          <span className="text-white/15">/</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-white">F&B order</span> — 2x energy drinks to Station 14
          </span>
          <span className="text-white/15">/</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span className="text-white">EOD reconciliation</span> — Bandra branch, fully balanced
          </span>
          <span className="text-white/15">/</span>
        </div>
      </div>
    </section>
  );
};
