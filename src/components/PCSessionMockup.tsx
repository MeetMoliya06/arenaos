import React, { useState } from 'react';
import { Lock, Unlock, QrCode } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

export const PCSessionMockup: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [elapsedMins] = useState(47);
  const [activeZone] = useState('VIP Booth 04');

  const toggleLock = () => {
    playClick();
    setIsLocked(!isLocked);
  };

  return (
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Top Client Bar */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-arena-lime/60" />
          <span className="text-white font-medium ml-2">Arena client lockscreen</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-arena-lime">Enforced</span>
          <span>Rig BLR-14</span>
        </div>
      </div>

      {/* Screen Viewport */}
      <div className="p-6 md:p-8 bg-[#0D0D0F] relative min-h-[360px] flex flex-col justify-between">

        {/* Active Overlay Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="text-xs text-arena-lime mb-1">
              Active session — {activeZone}
            </div>
            <div className="font-semibold text-2xl md:text-3xl text-white">
              {isLocked ? 'System locked' : 'Current user: @ghost_strike'}
            </div>
            <div className="text-arena-subtle text-sm mt-0.5">
              Ryzen 7 7800X3D · RTX 4080 · 360Hz BenQ Zowie
            </div>
          </div>

          <button
            onClick={toggleLock}
            onMouseEnter={() => playHover()}
            className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors ${
              isLocked
                ? 'bg-arena-lime text-black'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
            }`}
          >
            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isLocked ? 'Remote unlock PC' : 'Trigger emergency freeze'}</span>
          </button>
        </div>

        {/* Center Widget: Lockscreen State vs Active HUD */}
        {isLocked ? (
          <div className="my-6 p-6 border border-red-500/20 bg-red-500/[0.03] rounded-lg flex flex-col items-center justify-center text-center">
            <Lock className="w-8 h-8 text-red-400 mb-3" />
            <div className="font-semibold text-lg text-white mb-1">
              Zero-trust lockscreen engaged
            </div>
            <p className="text-arena-muted text-sm max-w-md">
              Task Manager, Windows keys, Alt+Tab, and USB mounting are hardware-blocked. Session timer stopped. No free minutes possible.
            </p>
          </div>
        ) : (
          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
              <div className="text-arena-subtle text-xs mb-1">Session runtime</div>
              <div className="text-2xl font-semibold text-white">
                00:{elapsedMins.toString().padStart(2, '0')}:18
              </div>
              <div className="text-arena-lime text-xs mt-1">Rate: ₹140.00 / hr</div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
              <div className="text-arena-subtle text-xs mb-1">Wallet debit running</div>
              <div className="text-2xl font-semibold text-arena-lime">
                ₹{Math.round((elapsedMins / 60) * 140)}
                <span className="text-sm text-white/50 font-normal">.00</span>
              </div>
              <div className="text-arena-muted text-xs mt-1">Remaining: ₹680.00</div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg flex flex-col justify-between">
              <div>
                <div className="text-arena-subtle text-xs mb-1">App launch guard</div>
                <div className="text-sm text-white font-medium">Valorant (Steam)</div>
              </div>
              <div className="flex items-center gap-1.5 text-arena-lime text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Anti-cheat OK · 240 FPS lock</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Lockscreen QR and Operator Command Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center text-sm text-arena-muted">
          <div className="flex items-center gap-3">
            <QrCode className="w-4 h-4 text-arena-lime" />
            <span>Gamer QR auto-login ready</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-arena-subtle">Desk operator: Rahul S.</span>
            <span className="text-white">Force reboot allowed: No</span>
          </div>
        </div>

      </div>
    </div>
  );
};
