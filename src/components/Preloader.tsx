import React, { useEffect, useState } from 'react';
import { playHover } from '../audio/soundEffects';

interface PreloaderProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING ARENA_OS CORE KERNEL [.NET 8]',
  'ESTABLISHING SECURE TLS WEBSOCKET REPLICATION',
  'SYNCING 4 FLEET NODES (INDIRANAGAR, KORAMANGALA, BANDRA, CYBERHUB)',
  'VERIFYING 106 HARDWARE PC RIG LOCKSCREENS... [OK]',
  'STARTING CASH DRAWER VAULT RECONCILIATION ENGINE',
  'ARENA_OS v2.4 ONLINE. ALL TELEMETRY ACTIVE.'
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Non-linear realistic loading step
        const step = Math.floor(Math.random() * 14) + 4;
        const next = Math.min(prev + step, 100);
        return next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logIndex = Math.min(
      Math.floor((progress / 100) * BOOT_LOGS.length),
      BOOT_LOGS.length - 1
    );
    if (logIndex !== currentLogIndex) {
      setCurrentLogIndex(logIndex);
      playHover();
    }

    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, 600);
      }, 350);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, currentLogIndex, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#060709] flex flex-col justify-between p-6 md:p-12 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isDone ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top telemetry bar */}
      <div className="flex justify-between items-center text-xs font-mono text-arena-muted border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-arena-lime animate-ping" />
          <span className="text-white font-semibold">ARENA_OS // SYSTEM_BOOT</span>
          <span className="hidden sm:inline text-arena-subtle">| ARCH: X64_R19</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>LOCATION: IN_BLR_01</span>
          <span className="text-arena-lime font-mono">STATUS: DIAGNOSTICS</span>
        </div>
      </div>

      {/* Center display */}
      <div className="max-w-3xl my-auto py-12">
        <div className="text-xs font-mono text-arena-lime uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>// BOOT TELEMETRY</span>
          <span className="h-[1px] w-16 bg-arena-lime/40 inline-block" />
        </div>

        <div className="min-h-[70px] mb-8 font-mono text-sm md:text-base text-arena-text">
          <p className="leading-relaxed">
            &gt; {BOOT_LOGS[currentLogIndex]}
            <span className="inline-block w-2 h-4 bg-arena-lime ml-2 animate-pulse align-middle" />
          </p>
        </div>

        {/* Numeric Gauge */}
        <div className="flex items-baseline justify-between mb-4 font-mono">
          <span className="text-5xl md:text-8xl font-black font-display tracking-tight text-white">
            {progress.toString().padStart(3, '0')}
            <span className="text-2xl md:text-4xl text-arena-lime font-mono ml-2">%</span>
          </span>
          <div className="text-right text-xs text-arena-muted space-y-1">
            <div>SIGNALR: SYNCHRONIZED</div>
            <div className="text-arena-lime">LATENCY: 4.2ms</div>
          </div>
        </div>

        {/* Progress line */}
        <div className="w-full h-1 bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-arena-lime transition-all duration-100 ease-out shadow-lime-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom status */}
      <div className="flex justify-between items-center text-[10px] md:text-xs font-mono text-arena-subtle pt-4 border-t border-white/10">
        <div>CORE PLATFORM BUILD: 2026.09.12_PROD</div>
        <div className="text-right">PRESS ANY KEY TO BYPASS DIAGNOSTICS</div>
      </div>
    </div>
  );
};
