import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, Monitor, LayoutGrid, Cpu, Check, Clock, Coffee, ShieldAlert, Sparkles } from 'lucide-react';
import { Hero3DScene } from './Hero3D/Scene';
import { playClick, playHover } from '../audio/soundEffects';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  // Interactive Hero Deck mode: '3d' | 'station' | 'pos'
  const [activeDeckView, setActiveDeckView] = useState<'3d' | 'station' | 'pos'>('3d');

  // Interactive Station state for the Gamer Lockscreen simulation
  const [sessionSeconds, setSessionSeconds] = useState(5820); // 1h 37m
  const [isLocked, setIsLocked] = useState(false);
  const [walletBalance, setWalletBalance] = useState(480);
  const [fnbOrders, setFnbOrders] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Live timer tick
  useEffect(() => {
    if (isLocked) return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddHour = () => {
    playClick();
    if (walletBalance < 80) {
      setToastMsg('Insufficient balance! Recharged ₹500 via UPI.');
      setWalletBalance((prev) => prev + 500);
      setTimeout(() => setToastMsg(null), 2500);
      return;
    }
    setSessionSeconds((prev) => prev + 3600);
    setWalletBalance((prev) => prev - 80);
    setIsLocked(false);
    setToastMsg('+1:00:00 added to Rig 07! (₹80 billed)');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleOrderSnack = (snack: string, price: number) => {
    playClick();
    if (walletBalance < price) {
      setToastMsg(`Top-up required for ${snack}!`);
      setTimeout(() => setToastMsg(null), 2000);
      return;
    }
    setWalletBalance((prev) => prev - price);
    setFnbOrders((prev) => [snack, ...prev]);
    setToastMsg(`Ordered ${snack} (₹${price}) — dispatched to kitchen!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleEmergencyLock = () => {
    playClick();
    setIsLocked((prev) => !prev);
    setToastMsg(isLocked ? 'Rig 07 Unlocked & Session Active' : 'Rig 07 Hardware Lock Engaged!');
    setTimeout(() => setToastMsg(null), 2000);
  };

  // Cashier POS state: 12 Stations
  const [stations, setStations] = useState([
    { id: '01', zone: 'VIP', status: 'OCCUPIED', time: '02:14:00', user: 'Rohan_K' },
    { id: '02', zone: 'VIP', status: 'OCCUPIED', time: '00:45:10', user: 'Siddharth' },
    { id: '03', zone: 'VIP', status: 'OCCUPIED', time: '01:12:40', user: 'Aman_99' },
    { id: '04', zone: 'VIP', status: 'AVAILABLE', time: '--:--', user: 'Ready' },
    { id: '05', zone: 'MAIN', status: 'OCCUPIED', time: '00:22:15', user: 'Vikram' },
    { id: '06', zone: 'MAIN', status: 'OCCUPIED', time: '03:10:00', user: 'GamerX' },
    { id: '07', zone: 'MAIN', status: isLocked ? 'LOCKED' : 'OCCUPIED', time: formatTimer(sessionSeconds), user: 'Kabir_V' },
    { id: '08', zone: 'MAIN', status: 'AVAILABLE', time: '--:--', user: 'Ready' },
    { id: '09', zone: 'MAIN', status: 'BILLING', time: '00:00:00', user: 'Harsh' },
    { id: '10', zone: 'MAIN', status: 'AVAILABLE', time: '--:--', user: 'Ready' },
    { id: '11', zone: 'SIM', status: 'OCCUPIED', time: '01:50:00', user: 'Nikhil' },
    { id: '12', zone: 'SIM', status: 'AVAILABLE', time: '--:--', user: 'Ready' },
  ]);

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden border-b border-white/[0.08]">
      {/* Background glow & subtle grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#CCFF00]/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Product Positioning & Value */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* Editorial Eyebrow */}
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-[#CCFF00] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>Gaming Lounge & Esports Arena OS</span>
              <span className="text-white/20">·</span>
              <span className="text-[#9999A0]">Surat Reference Deployment</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.06] mb-5">
              Stop unbilled gaming hours. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                Run every PC, bill & shift in complete control.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9999A0] max-w-xl mb-8 leading-relaxed">
              The operating system purpose-built for gaming cafés: hardware-enforced PC lockscreens, instant UPI wallet recharges, in-seat café orders, and ₹1-accurate shift till reconciliations.
            </p>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-6 py-3.5 bg-[#CCFF00] text-[#0A0A0B] font-semibold text-sm rounded-lg transition-all hover:bg-[#b8e600] active:scale-[0.98] flex items-center gap-2.5 shadow-[0_0_30px_rgba(204,255,0,0.25)]"
              >
                <Terminal className="w-4 h-4" />
                <span>Book Live Demo</span>
              </button>

              <a
                href="#modules"
                onClick={() => playClick()}
                className="px-5 py-3.5 border border-white/10 hover:border-white/20 text-[#EDEDEF] text-sm font-medium rounded-lg transition-colors bg-white/[0.03] hover:bg-white/[0.06] flex items-center gap-2"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4 text-[#9999A0]" />
              </a>
            </div>

            {/* Social Proof & Metrics Strip */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
              <div>
                <div className="text-white font-mono text-xl sm:text-2xl font-bold tabular-nums">240+ Rigs</div>
                <div className="text-xs text-[#8A8A93] mt-0.5">Live across 4 Surat arenas</div>
              </div>
              <div>
                <div className="text-[#CCFF00] font-mono text-xl sm:text-2xl font-bold tabular-nums">₹0 Leakage</div>
                <div className="text-xs text-[#8A8A93] mt-0.5">Auto-lock on timer zero</div>
              </div>
              <div>
                <div className="text-white font-mono text-xl sm:text-2xl font-bold tabular-nums">Online + Offline</div>
                <div className="text-xs text-[#8A8A93] mt-0.5">Works with or without internet</div>
              </div>
            </div>

          </div>

          {/* Right Column: The Interactive Arena Command Station */}
          <div className="lg:col-span-6 relative">
            
            {/* Interactive Mode Switcher Tabs */}
            <div className="flex items-center justify-between p-1 bg-[#101115] border border-white/[0.08] rounded-t-xl">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    playClick();
                    setActiveDeckView('3d');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    activeDeckView === '3d'
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-[#8A8A93] hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Hardware Rig</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveDeckView('station');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    activeDeckView === 'station'
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-[#8A8A93] hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Station 07 (Player View)</span>
                </button>

                <button
                  onClick={() => {
                    playClick();
                    setActiveDeckView('pos');
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    activeDeckView === 'pos'
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-[#8A8A93] hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cashier POS Desk</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 pr-2 text-[11px] text-[#5C5C66] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                <span>INTERACTIVE DEMO</span>
              </div>
            </div>

            {/* Container Card */}
            <div className="bg-[#0C0D11] border-x border-b border-white/[0.08] rounded-b-xl overflow-hidden shadow-2xl relative min-h-[460px] flex flex-col justify-between p-5 md:p-6">
              
              {/* Toast alert */}
              {toastMsg && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 bg-[#181920] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono rounded shadow-lg animate-fade-in flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* VIEW 1: STATION LOCKSCREEN (Gamer Screen) */}
              {activeDeckView === 'station' && (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                      <div>
                        <div className="text-[11px] font-mono text-[#8A8A93]">RIG 07 // ADAJAN ARENA</div>
                        <div className="text-white text-base font-semibold">VIP Booth · RTX 4080 · 360Hz</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-mono text-[#8A8A93]">ACTIVE GAMER</div>
                        <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <span>Kabir_V</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-mono">VIP</span>
                        </div>
                      </div>
                    </div>

                    {/* Central Countdown Timer / Lock Display */}
                    <div className="my-6 p-6 rounded-xl bg-gradient-to-b from-[#121318] to-[#0E0F14] border border-white/[0.06] text-center relative overflow-hidden">
                      {isLocked ? (
                        <div className="py-4">
                          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-2 animate-bounce" />
                          <div className="font-mono text-2xl font-bold text-rose-400">SESSION EXPIRED & LOCKED</div>
                          <p className="text-xs text-[#8A8A93] mt-1">Scan QR or ask cashier to add time to unlock PC input</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] uppercase tracking-wider font-mono text-[#8A8A93] mb-1">
                            Time Remaining Before Lock
                          </div>
                          <div className="font-mono text-5xl sm:text-6xl font-black text-[#CCFF00] tracking-tight tabular-nums drop-shadow-[0_0_20px_rgba(204,255,0,0.25)]">
                            {formatTimer(sessionSeconds)}
                          </div>
                          <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#8A8A93] mt-2">
                            <span>Rate: ₹80/hr</span>
                            <span>·</span>
                            <span>Wallet Balance: <strong className="text-white font-semibold">₹{walletBalance}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Controls Bar */}
                  <div className="pt-4 border-t border-white/[0.08] space-y-3">
                    <div className="text-[11px] text-[#8A8A93] font-mono uppercase">
                      Simulate Gamer / Cashier Actions:
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={handleAddHour}
                        className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-semibold text-white transition-all text-center"
                      >
                        <Clock className="w-3.5 h-3.5 text-[#CCFF00] mx-auto mb-1" />
                        <span>+1 Hour (₹80)</span>
                      </button>

                      <button
                        onClick={() => handleOrderSnack('Red Bull (Ice)', 120)}
                        className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-semibold text-white transition-all text-center"
                      >
                        <Coffee className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
                        <span>Red Bull (₹120)</span>
                      </button>

                      <button
                        onClick={() => handleOrderSnack('Cheese Maggi', 70)}
                        className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-xs font-semibold text-white transition-all text-center"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                        <span>Maggi (₹70)</span>
                      </button>

                      <button
                        onClick={toggleEmergencyLock}
                        className={`p-2.5 border rounded-lg text-xs font-semibold transition-all text-center ${
                          isLocked
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5 mx-auto mb-1" />
                        <span>{isLocked ? 'Unlock Rig' : 'Force Lock'}</span>
                      </button>
                    </div>

                    {fnbOrders.length > 0 && (
                      <div className="text-[11px] text-[#8A8A93] flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="text-[#CCFF00]">Active F&B Queue:</span>
                        <span>{fnbOrders.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 2: CASHIER POS DESK (Multi-PC Grid) */}
              {activeDeckView === 'pos' && (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Header stats */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg mb-4 text-xs font-mono">
                      <div>
                        <div className="text-[#8A8A93] text-[10px]">ACTIVE OCCUPANCY</div>
                        <div className="text-white text-sm font-semibold">9 / 12 Stations (75%)</div>
                      </div>
                      <div>
                        <div className="text-[#8A8A93] text-[10px]">CURRENT SHIFT CASH</div>
                        <div className="text-[#CCFF00] text-sm font-semibold">₹14,280.00</div>
                      </div>
                      <div>
                        <div className="text-[#8A8A93] text-[10px]">TILL VARIANCE</div>
                        <div className="text-emerald-400 text-sm font-semibold">₹0.00 (Balanced)</div>
                      </div>
                    </div>

                    {/* 12-Station Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {stations.map((st) => (
                        <div
                          key={st.id}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            st.status === 'OCCUPIED'
                              ? 'bg-emerald-950/20 border-emerald-500/30'
                              : st.status === 'AVAILABLE'
                              ? 'bg-cyan-950/20 border-cyan-500/20'
                              : st.status === 'LOCKED'
                              ? 'bg-rose-950/30 border-rose-500/40'
                              : 'bg-amber-950/20 border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A8A93]">
                            <span>PC {st.id}</span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                st.status === 'OCCUPIED'
                                  ? 'bg-emerald-400'
                                  : st.status === 'AVAILABLE'
                                  ? 'bg-cyan-400'
                                  : st.status === 'LOCKED'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-400'
                              }`}
                            />
                          </div>
                          <div className="text-xs font-mono font-semibold text-white mt-1 tabular-nums">
                            {st.time}
                          </div>
                          <div className="text-[10px] text-[#8A8A93] truncate mt-0.5">
                            {st.user}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                    <span className="text-[#8A8A93]">
                      Clicking any station lets counter staff extend time, charge UPI, or print thermal bill.
                    </span>
                    <button
                      onClick={() => {
                        playClick();
                        onOpenDemo();
                      }}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded text-xs transition-colors shrink-0"
                    >
                      Try Full POS
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 3: 3D HARDWARE TOURNAMENT RIG */}
              {activeDeckView === '3d' && (
                <div className="h-full flex flex-col justify-between">
                  <div className="relative h-[410px] md:h-[430px] rounded-lg overflow-hidden border border-white/[0.06]">
                    <Hero3DScene />
                  </div>
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#8A8A93]">
                    <span>Interactive WebGL 3D Model: Click & drag to rotate esports rig</span>
                    <span className="font-mono text-[#CCFF00]">Direct GPU Sync</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
