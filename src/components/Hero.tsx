import React from 'react';
import { ArrowDownRight, Terminal, Zap, ShieldAlert, Cpu } from 'lucide-react';
import { Hero3DScene } from './Hero3D/Scene';
import { playClick, playHover } from '../audio/soundEffects';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden bg-tech-grid">
      {/* Subtle architectural vertical line guides */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 md:px-8 flex justify-between">
        <div className="w-[1px] h-full bg-white/[0.04]" />
        <div className="w-[1px] h-full bg-white/[0.04] hidden md:block" />
        <div className="w-[1px] h-full bg-white/[0.04]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Asymmetrical Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* System Status Tag */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#10121A] border border-white/10 rounded font-mono text-[11px] text-arena-muted mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-arena-lime" />
              <span className="text-white font-semibold">ARENA_KERNEL V2.4</span>
              <span className="text-arena-subtle">/</span>
              <span className="text-arena-lime">ZERO-LEAKAGE ENGINE</span>
            </div>

            {/* Oversized High-Impact Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-white mb-6 uppercase">
              <span>EVERY PC.</span><br />
              <span>EVERY RUPEE.</span><br />
              <span className="text-arena-lime glow-lime">ONE DASHBOARD.</span>
            </h1>

            {/* Confident, Realistic Copy */}
            <p className="text-base sm:text-lg text-arena-muted max-w-xl mb-8 leading-relaxed font-sans font-normal">
              The operating system for gaming cafés and esports arenas. Stop unbilled minutes, eliminate cash drawer skimming, and command your PC fleet with sub-millisecond SignalR synchronization.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 bg-arena-lime text-black font-mono font-bold text-xs uppercase tracking-wider rounded transition-all hover:bg-arena-limeBright hover:shadow-lime-md flex items-center gap-2 active:scale-95"
                data-cursor="DEPLOY"
              >
                <Terminal className="w-4 h-4" />
                <span>BOOK FLEET AUDIT & DEMO</span>
              </button>

              <a
                href="#leakage"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="px-5 py-3.5 border border-white/15 hover:border-arena-lime/50 text-white font-mono text-xs uppercase tracking-wider rounded transition-all bg-white/[0.03] hover:bg-white/[0.07] flex items-center gap-2"
                data-cursor="CALC"
              >
                <span>CALCULATE LEAKAGE</span>
                <ArrowDownRight className="w-4 h-4 text-arena-lime" />
              </a>
            </div>

            {/* Technical Proof Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 font-mono">
              <div>
                <div className="text-white font-bold text-lg md:text-xl">106 RIGS</div>
                <div className="text-[10px] text-arena-muted uppercase">ACTIVE HARDWARE</div>
              </div>
              <div>
                <div className="text-arena-lime font-bold text-lg md:text-xl">0.00%</div>
                <div className="text-[10px] text-arena-muted uppercase">UNBILLED LEAKAGE</div>
              </div>
              <div>
                <div className="text-white font-bold text-lg md:text-xl">&lt;12ms</div>
                <div className="text-[10px] text-arena-muted uppercase">LOCK LATENCY</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive WebGL Scene */}
          <div className="lg:col-span-6 relative">
            <Hero3DScene />
          </div>

        </div>
      </div>

      {/* Real-time Telemetry Event Marquee Ticker */}
      <div className="mt-14 md:mt-20 border-y border-white/10 bg-[#090A0E] py-2.5 overflow-hidden font-mono text-xs">
        <div className="flex w-max animate-marquee space-x-8 text-arena-muted">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span className="text-white">SYS_EVENT:</span> INDIRANAGAR // RIG-03 SESSION STARTED [VIP ZONE]
          </span>
          <span className="text-white/20">///</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-cyan" />
            <span className="text-white">WALLET_TOPUP:</span> ₹1,000 CREDITED VIA UPI TO @VALO_GOD
          </span>
          <span className="text-white/20">///</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span className="text-white">POS_SYNC:</span> CASH DRAWER LOCKBOX VERIFIED [BLR_02 SHIFT A]
          </span>
          <span className="text-white/20">///</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-white">F&B_ORDER:</span> 2x MONSTER ENERGY TO STATION-14 (PAID WALLET)
          </span>
          <span className="text-white/20">///</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span className="text-white">EOD_RECON:</span> BANDRA BRANCH AUDIT 100% BALANCED
          </span>
          <span className="text-white/20">///</span>
        </div>
      </div>
    </section>
  );
};
