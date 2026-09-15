import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { playHover } from '../audio/soundEffects';

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
    <section id="leakage" className="py-10 md:py-16 bg-[#08080A] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs text-red-400 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>The financial leakage audit</span>
            </div>
            <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white max-w-2xl leading-tight">
              Most gaming cafés bleed 18% of revenue before it reaches the bank.
            </h2>
          </div>
          <div className="text-sm text-arena-muted max-w-sm leading-relaxed">
            Staff "forgetting" to start timers, rebooting PCs into Windows safe mode to bypass timer apps, and end-of-shift cash counting discrepancies are killing your margins.
          </div>
        </div>

        {/* Asymmetric Split: 3 Hard Truths vs Interactive Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: The 3 Unvarnished Pain Points */}
          <div className="lg:col-span-5 space-y-3">

            {/* Leak 01 */}
            <div className="p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-red-400 font-medium">Leak 01</span>
                <span className="text-arena-subtle">Time drift</span>
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-white mb-1.5">
                The "friendly 15 minutes"
              </h3>
              <p className="text-sm text-arena-muted leading-relaxed">
                Staff let regulars play "just one more round" without billing. Multiply 15 unbilled minutes across 40 PCs over two shifts — that's 20 hours of free electricity and wear every day.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-arena-subtle">ArenaOS fix</span>
                <span className="text-arena-lime font-medium">Zero-trust lockscreen shell</span>
              </div>
            </div>

            {/* Leak 02 */}
            <div className="p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-red-400 font-medium">Leak 02</span>
                <span className="text-arena-subtle">Cash discrepancy</span>
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-white mb-1.5">
                Shift handover "rounding"
              </h3>
              <p className="text-sm text-arena-muted leading-relaxed">
                Cash drawer totals never match the Excel sheet. Cashiers pocket small notes, blame "system glitches," and leave no paper trail when the 11 PM shift operator swaps out.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-arena-subtle">ArenaOS fix</span>
                <span className="text-arena-lime font-medium">Mandatory dual-sign EOD audit</span>
              </div>
            </div>

            {/* Leak 03 */}
            <div className="p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-red-400 font-medium">Leak 03</span>
                <span className="text-arena-subtle">Ghost orders</span>
              </div>
              <h3 className="font-semibold text-base sm:text-lg text-white mb-1.5">
                Unbilled energy drinks & snacks
              </h3>
              <p className="text-sm text-arena-muted leading-relaxed">
                Energy drinks and instant noodles handed over the counter without hitting the POS. Inventory disappears, margins vanish, and stock audits fail every week.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-arena-subtle">ArenaOS fix</span>
                <span className="text-arena-lime font-medium">In-seat kiosk ordering</span>
              </div>
            </div>

          </div>

          {/* Right: Interactive Revenue Leakage Simulator */}
          <div className="lg:col-span-7 bg-[#0D0D0F] border border-white/10 rounded-xl p-5 md:p-6">

            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span className="font-semibold text-white text-base">
                  Live revenue leakage calculator
                </span>
              </div>
              <span className="text-xs text-arena-muted">
                Updates in real time
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-4 mb-6">

              {/* Slider 1: PC Count */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white">Total gaming rigs</span>
                  <span className="text-arena-lime font-medium">{pcCount} PCs</span>
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
                  <span>10 rigs</span>
                  <span>75 rigs</span>
                  <span>150 rigs</span>
                </div>
              </div>

              {/* Slider 2: Hourly Rate */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white">Average hourly rate</span>
                  <span className="text-arena-lime font-medium">₹{hourlyRate} / hr</span>
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
                  <span className="text-white">Unbilled minutes per rig / day</span>
                  <span className="text-red-400 font-medium">{unbilledMinutes} min</span>
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
                  className="w-full accent-red-400 bg-white/10 h-1.5 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-arena-subtle mt-1">
                  <span>10 min (tightly run)</span>
                  <span>45 min (average café)</span>
                  <span>90 min (severe bleed)</span>
                </div>
              </div>

              {/* Slider 4: Cash Skim Discrepancy */}
              <div>
                <div className="flex justify-between text-xs text-arena-muted mb-2">
                  <span className="text-white">Estimated cash desk discrepancy</span>
                  <span className="text-red-400 font-medium">{cashLossPct}%</span>
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
                  className="w-full accent-red-400 bg-white/10 h-1.5 rounded appearance-none cursor-pointer"
                />
              </div>

            </div>

            {/* Bleed Summary Output */}
            <div className="p-4 sm:p-5 bg-black/40 border border-white/10 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-arena-muted mb-1">
                    Monthly unbilled loss
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-red-400">
                    ₹{monthlyUnbilledLoss.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-arena-subtle mt-0.5">
                    Free play & late session stops
                  </div>
                </div>

                <div>
                  <div className="text-xs text-arena-muted mb-1">
                    Monthly cash register leakage
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-red-400">
                    ₹{monthlyCashSkimLoss.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-arena-subtle mt-0.5">
                    Shift handover discrepancy & ghost snacks
                  </div>
                </div>
              </div>

              {/* Total Bleed Metric */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div>
                  <div className="text-xs text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Total capital vanishing annually
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mt-1">
                    ₹{annualBleed.toLocaleString('en-IN')}
                    <span className="text-xs sm:text-sm text-arena-muted ml-2 font-normal">/ year</span>
                  </div>
                </div>

                <span className="inline-block px-3 py-1.5 bg-arena-lime text-black font-medium text-xs rounded-md w-fit">
                  100% recoverable with ArenaOS
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
