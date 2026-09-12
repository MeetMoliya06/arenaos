import React, { useState, useEffect } from 'react';
import { Terminal, Shield, ArrowUpRight } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

interface FooterProps {
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemo }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-[#050608] border-t border-white/10 pt-20 pb-12 font-mono text-xs text-arena-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Massive Editorial Closing Line */}
        <div className="pb-16 border-b border-white/10">
          <div className="text-[10px] text-arena-lime uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-arena-lime" />
            <span>EXECUTIVE SUMMARY</span>
          </div>
          <p className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase max-w-4xl">
            Built for owners who want control.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                playClick();
                onOpenDemo();
              }}
              onMouseEnter={() => playHover()}
              className="px-6 py-3 bg-arena-lime text-black font-bold uppercase rounded hover:bg-arena-limeBright shadow-lime-sm transition-all flex items-center gap-2"
              data-cursor="DEPLOY"
            >
              <Terminal className="w-4 h-4" />
              <span>REQUEST DEPLOYMENT DEMO</span>
            </button>
            <a
              href="#leakage"
              onClick={() => playClick()}
              className="px-5 py-3 border border-white/15 text-white uppercase rounded hover:border-arena-lime/50 transition-all"
            >
              REVIEW FINANCIAL AUDIT
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-b border-white/10 text-[11px]">
          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">// PLATFORM</div>
            <ul className="space-y-2">
              <li><a href="#modules" className="hover:text-arena-lime transition-colors">PC Session Lockscreen</a></li>
              <li><a href="#modules" className="hover:text-arena-lime transition-colors">Closed-Loop Wallet</a></li>
              <li><a href="#modules" className="hover:text-arena-lime transition-colors">In-Seat Steam Kiosk</a></li>
              <li><a href="#modules" className="hover:text-arena-lime transition-colors">Cash Drawer Sync</a></li>
              <li><a href="#modules" className="hover:text-arena-lime transition-colors">EOD Shift Handover</a></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">// INFRASTRUCTURE</div>
            <ul className="space-y-2">
              <li><span className="text-arena-subtle">.NET 8 High-Concurrency</span></li>
              <li><span className="text-arena-subtle">SignalR TLS WebSocket Cluster</span></li>
              <li><span className="text-arena-subtle">TimescaleDB Audit Streams</span></li>
              <li><span className="text-arena-subtle">Docker Edge Branch Nodes</span></li>
              <li><span className="text-arena-subtle">Windows Kernel Ring-0 Lock</span></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">// LIVE CLUSTERS</div>
            <ul className="space-y-2">
              <li><span className="text-white">BLR_01</span> Indiranagar (40 Rigs)</li>
              <li><span className="text-white">BLR_02</span> Koramangala (32 Rigs)</li>
              <li><span className="text-white">BOM_01</span> Bandra West (24 Rigs)</li>
              <li><span className="text-white">DEL_01</span> Cyberhub (30 Rigs)</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-bold mb-3 uppercase tracking-wider">// ENGINEERING CONTACT</div>
            <p className="text-arena-subtle leading-relaxed mb-3">
              Direct engineering deployments for arenas with 20+ PC battlestations.
            </p>
            <div className="text-arena-lime font-bold">ops@arenaos.network</div>
            <div className="text-arena-muted mt-1">+91 80 4920 8800</div>
          </div>
        </div>

        {/* Bottom Telemetry Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-arena-subtle">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">ARENAOS // V2.4_PROD</span>
            <span>BUILD: 2026.09.12</span>
            <span>SYSTEM CLOCK: {timeStr || '12-SEP-2026 UTC'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>COORDINATES: 12.9716° N, 77.5946° E</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
