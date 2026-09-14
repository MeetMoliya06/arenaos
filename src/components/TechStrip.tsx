import React from 'react';
import { Cpu, Database, Network, Box, Code2, ShieldCheck } from 'lucide-react';
import { playHover } from '../audio/soundEffects';

const TECH_ITEMS = [
  {
    name: '.NET 8',
    role: 'Sub-millisecond state machine',
    detail: 'Compiled native performance for zero-latency timer enforcement and transaction locking.',
    icon: Cpu,
  },
  {
    name: 'React 19',
    role: 'Concurrent client UI',
    detail: 'Instantaneous response times for gamer lockscreens and touch POS terminals.',
    icon: Code2,
  },
  {
    name: 'PostgreSQL',
    role: 'ACID financial ledgers',
    detail: 'Immutable transaction trails and TimescaleDB telemetry logging for 100% auditability.',
    icon: Database,
  },
  {
    name: 'SignalR',
    role: 'Real-time WebSockets',
    detail: 'Push PC freeze commands, wallet top-ups, and F&B tickets across all nodes in under 12ms.',
    icon: Network,
  },
  {
    name: 'Docker edge',
    role: 'Local offline survival',
    detail: 'Local branch nodes continue billing and PC timers even during full internet blackouts.',
    icon: Box,
  },
];

export const TechStrip: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0A0A0B] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-arena-lime font-medium">Infrastructure stack</span>
            <span className="text-arena-subtle">·</span>
            <span className="text-arena-muted">Designed for hardware fault tolerance</span>
          </div>
          <div className="text-sm text-arena-subtle flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-arena-lime" />
            <span>Offline local replication survives ISP outages</span>
          </div>
        </div>

        {/* Minimalist Tech Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TECH_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onMouseEnter={() => playHover()}
                className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/15 rounded-lg transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">
                    {item.name}
                  </span>
                  <Icon className="w-4 h-4 text-arena-subtle group-hover:text-arena-lime transition-colors" />
                </div>
                <div className="text-xs text-arena-lime mb-1">{item.role}</div>
                <p className="text-xs text-arena-muted line-clamp-2 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
