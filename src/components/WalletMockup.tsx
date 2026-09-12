import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

export const WalletMockup: React.FC = () => {
  const [balance, setBalance] = useState(1450);
  const [bonusAdded, setBonusAdded] = useState(false);

  const handleTopup = (amount: number, bonus: number) => {
    playConfirm();
    setBalance(prev => prev + amount + bonus);
    setBonusAdded(true);
    setTimeout(() => setBonusAdded(false), 2500);
  };

  return (
    <div className="bg-[#0B0D14] border border-white/15 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Header */}
      <div className="bg-[#12141F] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-arena-muted">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-semibold">CLOSED-LOOP GAMER PASSBOOK // V2.4</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-arena-lime">AUTO-SETTLE: UPI / RAZORPAY</span>
          <span className="text-arena-subtle">MEMBER: #AR-9402</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-b from-[#0B0D14] to-[#07080C] min-h-[360px] flex flex-col justify-between">
        
        {/* Balance Card & Member Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          
          <div className="sm:col-span-7 bg-[#141724] border border-white/15 rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] text-arena-muted uppercase tracking-wider">
                  TOTAL STORED VALUE
                </div>
                <div className="font-display font-black text-3xl sm:text-4xl text-white mt-1">
                  ₹{balance.toLocaleString('en-IN')}<span className="text-arena-lime text-xl">.00</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-arena-lime/10 border border-arena-lime/40 text-arena-lime text-[10px] font-bold rounded">
                TIER: ELITE PRO
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-arena-muted pt-4 border-t border-white/10">
              <span>MEMBER: @SHADOW_OPERATOR</span>
              <span className="text-arena-lime">PASS ROAMING: 4 BRANCHES</span>
            </div>

            {bonusAdded && (
              <div className="absolute inset-0 bg-arena-lime/95 flex items-center justify-center text-black font-bold font-display text-sm gap-2 animate-fadeIn">
                <CheckCircle className="w-5 h-5" />
                <span>WALLET RECHARGED WITH BONUS CREDITS!</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="sm:col-span-5 space-y-3 font-mono text-[11px]">
            <div className="p-3 bg-white/[0.03] border border-white/10 rounded flex justify-between items-center">
              <span className="text-arena-muted">HOURLY VIP DISCOUNT:</span>
              <span className="text-arena-lime font-bold">15% APPLIED</span>
            </div>
            <div className="p-3 bg-white/[0.03] border border-white/10 rounded flex justify-between items-center">
              <span className="text-arena-muted">CROSS-BRANCH SYNC:</span>
              <span className="text-white font-bold">INSTANT (&lt;4ms)</span>
            </div>
            <div className="p-3 bg-white/[0.03] border border-white/10 rounded flex justify-between items-center">
              <span className="text-arena-muted">UNBILLED PLAY PERMITTED:</span>
              <span className="text-red-400 font-bold">0.00 SEC</span>
            </div>
          </div>

        </div>

        {/* Bonus Incentive Selector (Interactive simulation) */}
        <div className="my-6">
          <div className="text-[11px] text-white font-bold mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-arena-lime" />
            <span>TEST CLOSED-LOOP RECHARGE (CLICK TO SIMULATE TOP-UP):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleTopup(500, 50)}
              onMouseEnter={() => playHover()}
              className="p-3 bg-[#11131C] border border-white/10 hover:border-arena-lime/60 rounded text-left transition-all group"
            >
              <div className="flex justify-between text-white font-bold">
                <span>+ ₹500</span>
                <span className="text-arena-lime text-[10px]">+₹50 FREE</span>
              </div>
              <div className="text-[10px] text-arena-subtle mt-1">Gamer gets 4.5 Hours</div>
            </button>

            <button
              onClick={() => handleTopup(1000, 200)}
              onMouseEnter={() => playHover()}
              className="p-3 bg-[#11131C] border border-arena-lime/40 hover:border-arena-lime rounded text-left transition-all group shadow-lime-sm"
            >
              <div className="flex justify-between text-white font-bold">
                <span>+ ₹1,000</span>
                <span className="text-arena-lime text-[10px]">+₹200 FREE</span>
              </div>
              <div className="text-[10px] text-arena-subtle mt-1">Most Popular VIP Pack</div>
            </button>

            <button
              onClick={() => handleTopup(2500, 600)}
              onMouseEnter={() => playHover()}
              className="p-3 bg-[#11131C] border border-white/10 hover:border-arena-lime/60 rounded text-left transition-all group"
            >
              <div className="flex justify-between text-white font-bold">
                <span>+ ₹2,500</span>
                <span className="text-arena-lime text-[10px]">+₹600 FREE</span>
              </div>
              <div className="text-[10px] text-arena-subtle mt-1">All-Night Tournament Pass</div>
            </button>
          </div>
        </div>

        {/* Security verification stamp */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-arena-subtle">
          <div>PCI-DSS COMPLIANT & NO CASH HANDLING LEAKAGE</div>
          <div className="text-arena-lime font-mono">SIGNALR TRANSACTION LOGGED // HASH: #9C82A</div>
        </div>

      </div>
    </div>
  );
};
