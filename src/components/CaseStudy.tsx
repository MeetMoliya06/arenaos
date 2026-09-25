import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playHover, playClick } from '../audio/soundEffects';

interface Branch {
  name: string;
  x: number;
  y: number;
}

// Positions on a 0-100 grid, hub at center (50, 50).
const BRANCHES: Branch[] = [
  { name: 'Adajan', x: 18, y: 20 },
  { name: 'Katargam', x: 82, y: 20 },
  { name: 'Citylight', x: 18, y: 82 },
  { name: 'Varachha', x: 82, y: 82 },
];

const HUB = { x: 50, y: 51 };

export const CaseStudy: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative bg-[#EDEDEF] text-[#0A0A0B] py-24 md:py-32 overflow-hidden">
      {/* faint dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(10,10,11,0.14) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-black/40 mb-4 text-center">
          Running today, not a demo
        </div>
        <h2 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight text-center max-w-3xl mx-auto">
          One brand, live across four branches in Surat.
        </h2>

        {/* Network diagram */}
        <div className="relative mt-16 md:mt-20 mx-auto max-w-2xl aspect-square">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full overflow-visible"
          >
            {BRANCHES.map((b) => {
              const isActive = active === b.name || active === null;
              return (
                <line
                  key={b.name}
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={active === b.name ? '#0A0A0B' : 'rgba(10,10,11,0.18)'}
                  strokeWidth={active === b.name ? 0.6 : 0.35}
                  strokeDasharray="1.5 2"
                  className="transition-all duration-300"
                  style={{ opacity: isActive ? 1 : 0.25 }}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-70"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
          </svg>

          {/* Hub node */}
          <div
            className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#0A0A0B] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
              <span className="font-display font-semibold text-[#CCFF00] text-sm md:text-base leading-none text-center px-2">
                Apple<br />Esports
              </span>
            </div>
          </div>

          {/* Branch nodes */}
          {BRANCHES.map((b) => (
            <button
              key={b.name}
              onMouseEnter={() => {
                setActive(b.name);
                playHover();
              }}
              onMouseLeave={() => setActive(null)}
              onClick={() => playClick()}
              className="absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-2 border-[#0A0A0B]/10 group-hover:border-[#0A0A0B] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:scale-110">
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7BC96F]">
                  <span className="absolute inset-0 rounded-full bg-[#7BC96F] animate-ping" />
                </span>
                <span className="font-display font-semibold text-lg md:text-xl">
                  {b.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-sm md:text-base whitespace-nowrap">
                {b.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center">
          <p className="text-black/60 text-base md:text-lg max-w-md">
            Every PC, every bill, every shift — running on this exact system,
            live since August 2026.
          </p>
          <a
            href="https://appleesports.in/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="inline-flex items-center gap-2 text-sm font-medium bg-[#0A0A0B] text-white px-5 py-3 rounded-full hover:bg-[#0A0A0B]/85 transition-colors shrink-0 group"
          >
            See Apple Esports
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
