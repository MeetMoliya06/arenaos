import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, Monitor, Power, Clock, QrCode } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

export const PCSessionMockup: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [elapsedMins, setElapsedMins] = useState(47);
  const [activeZone, setActiveZone] = useState('VIP BOOTH 04');

  const toggleLock = () => {
    playClick();
    setIsLocked(!isLocked);
  };

  return (
    <div className="bg-[#0B0D14] border border-white/15 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Top Windows Shell / Client OS Bar */}
      <div className="bg-[#12141F] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-arena-muted">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-arena-lime/80" />
          <span className="text-white font-semibold ml-2">ARENA_CLIENT_LOCKSCREEN // WIN11_SHELL</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="text-arena-lime">SIGNALR: ENFORCED</span>
          <span>STATION_ID: BLR_RIG_14</span>
        </div>
      </div>

      {/* Screen Viewport */}
      <div className="p-6 md:p-8 bg-gradient-to-b from-[#0B0D14] to-[#07080C] relative min-h-[360px] flex flex-col justify-between">
        
        {/* Active Overlay Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="text-[10px] text-arena-lime uppercase tracking-wider mb-1">
              ACTIVE SESSION // {activeZone}
            </div>
            <div className="font-display font-black text-2xl md:text-3xl text-white">
              {isLocked ? 'SYSTEM LOCKED' : 'CURRENT USER: @GHOST_STRIKE'}
            </div>
            <div className="text-arena-subtle text-[11px] mt-0.5">
              HARDWARE: RYZEN 7 7800X3D · RTX 4080 · 360HZ BENQ ZOWIE
            </div>
          </div>

          <button
            onClick={toggleLock}
            onMouseEnter={() => playHover()}
            className={`px-4 py-2 rounded font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              isLocked
                ? 'bg-arena-lime text-black shadow-lime-sm'
                : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
            }`}
          >
            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isLocked ? 'REMOTE UNLOCK PC' : 'TRIGGER EMERGENCY FREEZE'}</span>
          </button>
        </div>

        {/* Center Widget: Lockscreen State vs Active HUD */}
        {isLocked ? (
          <div className="my-6 p-6 border border-red-500/30 bg-red-950/20 rounded-lg flex flex-col items-center justify-center text-center">
            <Lock className="w-10 h-10 text-red-400 mb-3 animate-pulse" />
            <div className="font-display font-bold text-lg text-white mb-1">
              ZERO-TRUST KERNEL LOCKSCREEN ENGAGED
            </div>
            <p className="text-arena-muted text-xs max-w-md font-sans">
              Task Manager, Windows keys, Alt+Tab, and USB mounting are hardware-blocked. Session timer stopped. No free minutes possible.
            </p>
          </div>
        ) : (
          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#121520] border border-white/10 rounded">
              <div className="text-arena-subtle text-[10px] mb-1">SESSION RUNTIME</div>
              <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                <span>00:{elapsedMins.toString().padStart(2, '0')}:18</span>
              </div>
              <div className="text-arena-lime text-[10px] mt-1">RATE: ₹140.00 / HR</div>
            </div>

            <div className="p-4 bg-[#121520] border border-white/10 rounded">
              <div className="text-arena-subtle text-[10px] mb-1">WALLET DEBIT RUNNING</div>
              <div className="text-2xl font-mono font-bold text-arena-lime">
                ₹{Math.round((elapsedMins / 60) * 140)}
                <span className="text-xs text-white/50 font-normal">.00</span>
              </div>
              <div className="text-arena-muted text-[10px] mt-1">REMAINING: ₹680.00</div>
            </div>

            <div className="p-4 bg-[#121520] border border-white/10 rounded flex flex-col justify-between">
              <div>
                <div className="text-arena-subtle text-[10px] mb-1">APP LAUNCH GUARD</div>
                <div className="text-xs text-white font-bold">VALORANT (STEAM)</div>
              </div>
              <div className="flex items-center gap-1.5 text-arena-lime text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>ANTI-CHEAT OK · 240 FPS LOCK</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Lockscreen QR and Operator Command Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center text-[11px] text-arena-muted">
          <div className="flex items-center gap-3">
            <QrCode className="w-4 h-4 text-arena-lime" />
            <span>GAMER QR AUTO-LOGIN READY</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-arena-subtle">DESK OPERATOR: RAHUL_S</span>
            <span className="text-white">FORCE REBOOT ALLOWED: NO</span>
          </div>
        </div>

      </div>
    </div>
  );
};
