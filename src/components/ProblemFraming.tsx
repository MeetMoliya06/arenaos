import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Clock, Banknote, UtensilsCrossed, WifiOff } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

interface ProblemFramingProps {
  onOpenDemo: () => void;
}

export const ProblemFraming: React.FC<ProblemFramingProps> = ({ onOpenDemo }) => {
  return (
    <section id="leakage" className="py-20 md:py-28 bg-[#0A0B0E] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>The Reality of Gaming Cafés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Spreadsheets and manual timers leak revenue every single shift.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9999A0] leading-relaxed">
            In busy gaming lounges, lost profits don't happen from major theft. They leak away silently through 15-minute unbilled extensions, unlogged off-duty gaming, and mismatched cash drawers at 2 AM.
          </p>
        </div>

        {/* 4 Core Pillars of Leakage vs ArenaOS Fix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          
          {/* Card 1: Unbilled Overtime */}
          <div className="p-6 bg-[#101116] border border-white/[0.08] rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Unbilled Extra Minutes</h3>
              <p className="text-xs text-[#8A8A93] leading-relaxed">
                Regulars ask counter staff for "just 5 more minutes" to finish a match. Without hardware enforcement, that turns into 20 unbilled minutes per PC every single day.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-xs">
              <span className="text-[#8A8A93]">ArenaOS Solution: </span>
              <span className="text-[#CCFF00] font-medium">Automatic hardware lock at 00:00:00</span>
            </div>
          </div>

          {/* Card 2: Cash Drawer Mismatches */}
          <div className="p-6 bg-[#101116] border border-white/[0.08] rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <Banknote className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Shift Handover Cash Leaks</h3>
              <p className="text-xs text-[#8A8A93] leading-relaxed">
                Cash drawers are counted haphazardly during shift swaps. When money falls short, neither cashier takes ownership and the owner absorbs the loss.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-xs">
              <span className="text-[#8A8A93]">ArenaOS Solution: </span>
              <span className="text-[#CCFF00] font-medium">Note-by-note denomination till audit</span>
            </div>
          </div>

          {/* Card 3: Unrecorded F&B */}
          <div className="p-6 bg-[#101116] border border-white/[0.08] rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Unbilled Drinks & Snacks</h3>
              <p className="text-xs text-[#8A8A93] leading-relaxed">
                Counter staff hand out energy drinks, chips, and water bottles without generating a bill, leading to kitchen stock depletion without matching revenue.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-xs">
              <span className="text-[#8A8A93]">ArenaOS Solution: </span>
              <span className="text-[#CCFF00] font-medium">In-seat digital orders linked to gamer bill</span>
            </div>
          </div>

          {/* Card 4: Internet Outages */}
          <div className="p-6 bg-[#101116] border border-white/[0.08] rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <WifiOff className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Cloud Disconnection Panic</h3>
              <p className="text-xs text-[#8A8A93] leading-relaxed">
                When local broadband drops, browser-based management tools freeze completely. Sessions can't be billed and players walk out without paying.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-xs">
              <span className="text-[#8A8A93]">ArenaOS Solution: </span>
              <span className="text-[#CCFF00] font-medium">100% offline local area network mesh</span>
            </div>
          </div>

        </div>

        {/* Side-by-Side Reality: Legacy vs ArenaOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left: The Legacy Café */}
          <div className="p-6 md:p-8 bg-[#101115] border border-rose-500/20 rounded-xl relative">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>The Legacy Café Model</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-6">
              Manual Notebooks & Loose Counter Trust
            </h3>

            <ul className="space-y-4 text-xs md:text-sm text-[#9999A0]">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Overtime Grace:</strong> Regulars beg for "just 5 more minutes" and staff leave the PC unlocked for 30 unbilled minutes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Cash Mismatches:</strong> Night shift till is short by ₹800, and nobody takes responsibility during handover.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Ghost Sessions:</strong> Off-duty staff or friends game for 3 hours while the owner is away from the venue.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span><strong>Internet Downtime:</strong> If Wi-Fi flickers, the billing crashes and ongoing games are lost.</span>
              </li>
            </ul>
          </div>

          {/* Right: The ArenaOS Standard */}
          <div className="p-6 md:p-8 bg-[#101115] border border-[#CCFF00]/30 rounded-xl relative shadow-[0_0_35px_rgba(204,255,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#CCFF00] uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>The ArenaOS Standard</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-6">
                Hardware-Enforced Control on Every Rig
              </h3>

              <ul className="space-y-4 text-xs md:text-sm text-[#EDEDEF]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                  <span><strong>Hardware Auto-Lock:</strong> Rig locks the exact millisecond time expires. Unlocking requires a registered transaction.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                  <span><strong>Denomination-Level Audit:</strong> ₹500, ₹200, ₹100 notes are verified at shift change with automatic variance logs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                  <span><strong>Tamper-Proof Audit Trail:</strong> Every discount, unlock, and override is permanently logged with cashier staff ID.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                  <span><strong>Local Offline Mesh:</strong> Every station and POS terminal keeps running smoothly even during complete ISP cuts.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-[#8A8A93]">
                Zero hardware replacements required. Works on any Windows PC.
              </span>
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="px-4 py-2 bg-[#CCFF00] text-black font-semibold text-xs rounded-md transition-all hover:bg-[#b8e600] active:scale-[0.98] flex items-center gap-1.5"
              >
                <span>Book Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
