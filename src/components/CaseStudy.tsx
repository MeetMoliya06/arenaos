import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Wifi, Monitor, Zap } from 'lucide-react';
import { playHover, playClick } from '../audio/soundEffects';

interface Branch {
  name: string;
  abbr: string;
  angle: number;       // degrees on the orbit
  pcs: number;
  status: string;
  color: string;
}

const BRANCHES: Branch[] = [
  { name: 'Adajan', abbr: 'AD', angle: 315, pcs: 30, status: 'All PCs live', color: '#CCFF00' },
  { name: 'Katargam', abbr: 'KT', angle: 45, pcs: 25, status: 'All PCs live', color: '#00F0FF' },
  { name: 'Citylight', abbr: 'CL', angle: 225, pcs: 28, status: 'All PCs live', color: '#CCFF00' },
  { name: 'Varachha', abbr: 'VR', angle: 135, pcs: 22, status: 'All PCs live', color: '#00F0FF' },
];

/** Convert polar (angle, radius%) to percentage coords */
function polarToPercent(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  };
}

const ORBIT_RADIUS = 36; // % of container

export const CaseStudy: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Animate a clock tick for the live uptime counter
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Format a fake uptime string that ticks every second
  const uptimeBase = 47 * 86400 + 14 * 3600 + 32 * 60; // 47d 14h 32m base
  const totalSecs = uptimeBase + tick;
  const days = Math.floor(totalSecs / 86400);
  const hrs = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const uptime = `${days}d ${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;

  return (
    <section className="relative bg-[#0A0A0B] text-[#EDEDEF] py-24 md:py-36 overflow-hidden">
      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-tech-grid pointer-events-none" />

      {/* Large faint radial glow behind the orbit */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '800px',
          height: '800px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(204,255,0,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-xs text-arena-muted mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span className="font-mono uppercase tracking-widest">Live deployment</span>
          </div>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tight max-w-3xl mx-auto">
            One brand, live across{' '}
            <span className="text-[#CCFF00]">four branches</span>{' '}
            in Surat.
          </h2>
          <p className="text-arena-muted text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            Apple Esports runs every PC, every bill, and every shift on ArenaOS — real customers, real money, zero demo.
          </p>
        </div>

        {/* ─── Orbital Network Diagram ─── */}
        <div className="relative mx-auto max-w-xl md:max-w-2xl aspect-square">

          {/* SVG Layer: orbit ring + connection lines + data pulses */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full overflow-visible"
            style={{ filter: 'drop-shadow(0 0 2px rgba(204,255,0,0.15))' }}
          >
            {/* Outer orbit ring */}
            <circle
              cx="50"
              cy="50"
              r={ORBIT_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.3"
              strokeDasharray="1.2 2.4"
            />
            {/* Second inner orbit ring for depth */}
            <circle
              cx="50"
              cy="50"
              r={ORBIT_RADIUS * 0.55}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.2"
              strokeDasharray="0.8 3"
            />

            {/* Connection lines from hub to each branch */}
            {BRANCHES.map((b) => {
              const pos = polarToPercent(b.angle, ORBIT_RADIUS);
              const isActive = active === b.name || active === null;
              const isHighlighted = active === b.name;
              return (
                <g key={b.name}>
                  {/* Connection line */}
                  <line
                    x1={50}
                    y1={50}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isHighlighted ? b.color : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isHighlighted ? 0.5 : 0.25}
                    className="transition-all duration-500"
                    style={{ opacity: isActive ? 1 : 0.15 }}
                  />
                  {/* Animated data pulse dot traveling along the line */}
                  <circle r="0.6" fill={b.color} opacity={isActive ? 0.9 : 0.2}>
                    <animateMotion
                      dur={`${3 + BRANCHES.indexOf(b) * 0.7}s`}
                      repeatCount="indefinite"
                      path={`M50,50 L${pos.x},${pos.y}`}
                    />
                  </circle>
                  {/* Return pulse */}
                  <circle r="0.4" fill={b.color} opacity={isActive ? 0.5 : 0.1}>
                    <animateMotion
                      dur={`${4 + BRANCHES.indexOf(b) * 0.5}s`}
                      repeatCount="indefinite"
                      path={`M${pos.x},${pos.y} L50,50`}
                    />
                  </circle>
                </g>
              );
            })}

            {/* Cross-branch sync lines (mesh network effect) */}
            {BRANCHES.map((a, i) =>
              BRANCHES.slice(i + 1).map((b) => {
                const posA = polarToPercent(a.angle, ORBIT_RADIUS);
                const posB = polarToPercent(b.angle, ORBIT_RADIUS);
                return (
                  <line
                    key={`${a.name}-${b.name}`}
                    x1={posA.x}
                    y1={posA.y}
                    x2={posB.x}
                    y2={posB.y}
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="0.15"
                    strokeDasharray="0.6 2"
                  />
                );
              })
            )}
          </svg>

          {/* Central Hub Node */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: '50%', top: '50%' }}
          >
            {/* Glow ring */}
            <div className="absolute inset-0 -m-3 rounded-full bg-[#CCFF00]/5 blur-xl animate-pulse-slow" />
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#131316] to-[#0A0A0B] border border-white/10 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(204,255,0,0.08),0_8px_32px_rgba(0,0,0,0.5)]">
              <span className="font-display font-bold text-[#CCFF00] text-sm md:text-base leading-none">
                Apple
              </span>
              <span className="font-display font-bold text-[#CCFF00] text-xs md:text-sm leading-none mt-0.5">
                Esports
              </span>
              <span className="text-[8px] md:text-[9px] text-arena-muted mt-1.5 font-mono tracking-wider uppercase">
                Hub
              </span>
            </div>
          </div>

          {/* Branch Nodes */}
          {BRANCHES.map((b) => {
            const pos = polarToPercent(b.angle, ORBIT_RADIUS);
            const isHovered = active === b.name;

            return (
              <button
                key={b.name}
                onMouseEnter={() => {
                  setActive(b.name);
                  playHover();
                }}
                onMouseLeave={() => setActive(null)}
                onClick={() => playClick()}
                className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {/* Card */}
                <div
                  className="relative flex flex-col items-center transition-all duration-300"
                  style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                >
                  {/* Glassmorphism card */}
                  <div
                    className="relative rounded-2xl px-4 py-3 md:px-5 md:py-4 flex flex-col items-center gap-1.5 transition-all duration-300"
                    style={{
                      background: isHovered
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: `1px solid ${isHovered ? `${b.color}40` : 'rgba(255,255,255,0.06)'}`,
                      boxShadow: isHovered
                        ? `0 0 20px ${b.color}15, 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 4px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Live dot */}
                    <span className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="relative w-2 h-2 rounded-full" style={{ background: b.color }}>
                        <span
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{ background: b.color, opacity: 0.6 }}
                        />
                      </span>
                    </span>

                    {/* Abbreviation circle */}
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-display font-bold text-sm md:text-base transition-colors duration-300"
                      style={{
                        background: isHovered ? `${b.color}18` : 'rgba(255,255,255,0.05)',
                        color: isHovered ? b.color : '#EDEDEF',
                        border: `1px solid ${isHovered ? `${b.color}30` : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {b.abbr}
                    </div>

                    {/* Branch name */}
                    <span className="font-display font-semibold text-sm md:text-base text-white whitespace-nowrap">
                      {b.name}
                    </span>

                    {/* Stats row */}
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-arena-muted font-mono">
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        {b.pcs} PCs
                      </span>
                      <span className="text-white/10">|</span>
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" style={{ color: b.color }} />
                        Synced
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── Live Uptime Ticker ─── */}
        <div className="mt-14 md:mt-16 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Zap className="w-4 h-4 text-[#CCFF00]" />
            <span className="font-mono text-xs md:text-sm text-arena-muted tracking-wider">
              SYSTEM UPTIME
            </span>
            <span className="font-mono text-sm md:text-base text-[#CCFF00] tabular-nums tracking-wider font-medium">
              {uptime}
            </span>
          </div>
        </div>

        {/* ─── Bottom row: copy + CTA ─── */}
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center">
          <p className="text-arena-muted text-base md:text-lg max-w-md leading-relaxed">
            Every PC, every bill, every shift — running on this exact system,
            live since August 2026.
          </p>
          <a
            href="https://appleesports.in/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="inline-flex items-center gap-2 text-sm font-medium bg-[#CCFF00] text-black px-6 py-3 rounded-full hover:bg-[#d4ff33] transition-all duration-200 shrink-0 group shadow-[0_0_20px_rgba(204,255,0,0.15)]"
          >
            See Apple Esports
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
