import React, { useState } from 'react';
import { AlertOctagon, TrendingDown, CheckCircle2, ShieldX, DollarSign, RefreshCw } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

export const ProblemFraming: React.FC = () => {
  // Simulator State
  const [pcCount, setPcCount] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(120);
  const [unbilledMinutes, setUnbilledMinutes] = useState(35); // mins unbilled per PC/day
  const [cashLossPct, setCashLossPct] = useState(5); // 5% cash register discrepancy

  // Calculations
  const dailyUnbilledHoursPerPc = unbilledMinutes / 60;
  const monthlyUnbilledLoss = Math.round(pcCount * dailyUnbilledHoursPerPc * hourlyRate * 30);
  const estimatedGrossRevenue = pcCount * 6 * hourlyRate * 30; // approx 6 hrs avg utilization/day
  const monthlyCashSkimLoss = Math.round(estimatedGrossRevenue * (cashLossPct / 100));
  const totalMonthlyBleed = monthlyUnbilledLoss + monthlyCashSkimLoss;
  const annualBleed = totalMonthlyBleed * 12;

  return (
    <section id="leakage" className="py-20 md:py-32 bg-[#060709] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="font-mono text-xs text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>THE FINANCIAL LEAKAGE AUDIT</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase max-w-2xl leading-tight">
              Most gaming cafés bleed 18% of revenue before it reaches the bank.
            </h2>
          </div>
          <div className="font-mono text-xs text-arena-muted max-w-sm">
            Staff "forgetting" to start timers, rebooting PCs into Windows safe mode to bypass timer apps, and end-of-shift cash counting discrepancies are killing your margins.
          </div>
        </div>

        {/* Asymmetric Split: 3 Hard Truths vs Interactive Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: The 3 Unvarnished Pain Points (Editorial High-Contrast List) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Leak 01 */}
            <div className="p-6 bg-[#0B0D12] border border-red-500/20 rounded-lg hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="text-red-400 font-bold">// LEAK_01</span>
                <span className="text-arena-subtle">TIME DRIFT</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                The "Friendly 15 Minutes"
              </h3>
              <p className="text-xs text-arena-muted leading-relaxed font-sans">
                Staff let regulars play "just one more round" without billing. Multiply 15 unbilled minutes across 40 PCs over two shifts — that's 20 hours of free electricity and wear every day.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center font-mono text-[11px]">
                <span className="text-arena-subtle">ARENA_OS FIX:</span>
                <span className="text-arena-lime font-semibold">Zero-Trust Lockscreen Shell</span>
              </div>
            </div>

            {/* Leak 02 */}
            <div className="p-6 bg-[#0B0D12] border border-red-500/20 rounded-lg hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="text-red-400 font-bold">// LEAK_02</span>
                <span className="text-arena-subtle">CASH DISCREPANCY</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Shift Handover "Rounding"
              </h3>
              <p className="text-xs text-arena-muted leading-relaxed font-sans">
                Cash drawer totals never match the Excel sheet. Cashiers pocket small notes, blame "system glitches," and leave no paper trail when the 11 PM shift operator swaps out.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center font-mono text-[11px]">
                <span className="text-arena-subtle">ARENA_OS FIX:</span>
                <span className="text-arena-lime font-semibold">Mandatory Dual-Sign EOD Audit</span>
              </div>
            </div>

            {/* Leak 03 */}
            <div className="p-6 bg-[#0B0D12] border border-red-500/20 rounded-lg hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="text-red-400 font-bold">// LEAK_03</span>
                <span className="text-arena-subtle">GHOST ORDERS</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Unbilled Monster Energy & Snacks
              </h3>
              <p className="text-xs text-arena-muted leading-relaxed font-sans">
                Energy drinks and instant noodles handed over the counter without hitting the POS. Inventory disappears, margins vanish, and stock audits fail every week.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center font-mono text-[11px]">
                <span className="text-arena-subtle">ARENA_OS FIX:</span>
                <span className="text-arena-lime font-semibold">In-Seat Steam-Style Tray Kiosk</span>
              </div>
            </div>

          </div>

          {/* Right: Interactive Revenue Leakage Simulator */}
          <div className="lg:col-span-7 bg-[#0E1017] border border-white/15 rounded-xl p-6 md:p-8 shadow-hud">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                <span className="font-display font-bold text-white text-lg uppercase tracking-tight">
                  LIVE REVENUE LEAKAGE CALCULATOR
                </span>
              </div>
              <span className="font-mono text-[10px] text-arena-lime px-2 py-0.5 bg-arena-lime/10 border border-arena-lime/30 rounded">
                REAL-TIME SIMULATION
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-6 mb-8 font-mono">
              
              {/* Slider 1: PC Count */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white font-medium">TOTAL GAMING RIGS:</span>
                  <span className="text-arena-lime font-bold text-sm">{pcCount} PCs</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={pcCount}
                  onChange={(e) => {
                    setPcCount(Number(e.target.value));
                    playHover();
                  }}
                  className="w-full accent-arena-lime bg-white/10 h-1.5 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-arena-subtle mt-1">
                  <span>10 Rigs</span>
                  <span>75 Rigs</span>
                  <span>150 Rigs</span>
                </div>
              </div>

              {/* Slider 2: Hourly Rate */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white font-medium">AVERAGE HOURLY RATE:</span>
                  <span className="text-arena-lime font-bold text-sm">₹{hourlyRate} / hr</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="300"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => {
                    setHourlyRate(Number(e.target.value));
                    playHover();
                  }}
                  className="w-full accent-arena-lime bg-white/10 h-1.5 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-arena-subtle mt-1">
                  <span>₹60/hr</span>
                  <span>₹180/hr</span>
                  <span>₹300/hr</span>
                </div>
              </div>

              {/* Slider 3: Unbilled Minutes */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white font-medium">UNBILLED MINUTES PER RIG / DAY:</span>
                  <span className="text-red-400 font-bold text-sm">{unbilledMinutes} min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={unbilledMinutes}
                  onChange={(e) => {
                    setUnbilledMinutes(Number(e.target.value));
                    playHover();
                  }}
                  className="w-full accent-red-500 bg-white/10 h-1.5 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-arena-subtle mt-1">
                  <span>10 mins (Tightly Run)</span>
                  <span>45 mins (Average Café)</span>
                  <span>90 mins (Severe Bleed)</span>
                </div>
              </div>

              {/* Slider 4: Cash Skim Discrepancy */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white font-medium">ESTIMATED CASH DESK DISCREPANCY:</span>
                  <span className="text-red-400 font-bold text-sm">{cashLossPct}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={cashLossPct}
                  onChange={(e) => {
                    setCashLossPct(Number(e.target.value));
                    playHover();
                  }}
                  className="w-full accent-red-500 bg-white/10 h-1.5 rounded appearance-none cursor-pointer"
                />
              </div>

            </div>

            {/* Bleed Summary Output Matrix */}
            <div className="p-6 bg-black/60 border border-red-500/30 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-[11px] font-mono text-arena-muted uppercase mb-1">
                    MONTHLY UNBILLED LOSS
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-red-400">
                    ₹{monthlyUnbilledLoss.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] font-mono text-arena-subtle mt-1">
                    Free play & late session stops
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-arena-muted uppercase mb-1">
                    MONTHLY CASH REGISTER LEAKAGE
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-red-400">
                    ₹{monthlyCashSkimLoss.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] font-mono text-arena-subtle mt-1">
                    Shift handover discrepancy & ghost snacks
                  </div>
                </div>
              </div>

              {/* Total Bleed Metric */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="text-xs font-mono text-white font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    TOTAL CAPITAL VANISHING ANNUALLY:
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight mt-1">
                    ₹{annualBleed.toLocaleString('en-IN')}
                    <span className="text-xs font-mono text-arena-muted ml-2 font-normal">/ YEAR</span>
                  </div>
                </div>

                <div className="text-right sm:text-right font-mono">
                  <span className="inline-block px-3 py-1 bg-arena-lime text-black font-bold text-xs rounded uppercase shadow-lime-sm">
                    100% RECOVERABLE WITH ARENAOS
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
