import React, { useState } from 'react';
import { Wallet, Sparkles, CheckCircle } from 'lucide-react';
import { playConfirm, playHover } from '../audio/soundEffects';

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
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-medium">Closed-loop gamer passbook</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">Auto-settle · UPI / Razorpay</span>
          <span className="text-arena-subtle">Member #AR-9402</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#0D0D0F] min-h-[360px] flex flex-col justify-between">

        {/* Balance Card & Member Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

          <div className="sm:col-span-7 bg-white/[0.03] border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-arena-muted">
                  Total stored value
                </div>
                <div className="font-semibold text-3xl sm:text-4xl text-white mt-1">
                  ₹{balance.toLocaleString('en-IN')}<span className="text-arena-lime text-xl">.00</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-arena-lime/10 text-arena-lime text-xs font-medium rounded-md">
                Tier: Elite Pro
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-arena-muted pt-4 border-t border-white/10">
              <span>@shadow_operator</span>
              <span className="text-arena-lime">Roaming: 4 branches</span>
            </div>

            {bonusAdded && (
              <div className="absolute inset-0 bg-arena-lime/95 flex items-center justify-center text-black font-medium text-sm gap-2 animate-fadeIn">
                <CheckCircle className="w-5 h-5" />
                <span>Wallet recharged with bonus credits</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="sm:col-span-5 space-y-3 text-sm">
            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-md flex justify-between items-center">
              <span className="text-arena-muted">Hourly VIP discount</span>
              <span className="text-arena-lime font-medium">15% applied</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-md flex justify-between items-center">
              <span className="text-arena-muted">Cross-branch sync</span>
              <span className="text-white font-medium">Instant (&lt;4ms)</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-md flex justify-between items-center">
              <span className="text-arena-muted">Unbilled play permitted</span>
              <span className="text-red-400 font-medium">0.00 sec</span>
            </div>
          </div>

        </div>

        {/* Bonus Incentive Selector (Interactive simulation) */}
        <div className="my-6">
          <div className="text-sm text-white mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-arena-lime" />
            <span>Try a closed-loop recharge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleTopup(500, 50)}
              onMouseEnter={() => playHover()}
              className="p-3 bg-white/[0.02] border border-white/10 hover:border-white/25 rounded-lg text-left transition-colors"
            >
              <div className="flex justify-between text-white font-medium text-sm">
                <span>+ ₹500</span>
                <span className="text-arena-lime text-xs">+₹50 free</span>
              </div>
              <div className="text-xs text-arena-subtle mt-1">Gamer gets 4.5 hours</div>
            </button>

            <button
              onClick={() => handleTopup(1000, 200)}
              onMouseEnter={() => playHover()}
              className="p-3 bg-white/[0.02] border border-arena-lime/40 hover:border-arena-lime rounded-lg text-left transition-colors"
            >
              <div className="flex justify-between text-white font-medium text-sm">
                <span>+ ₹1,000</span>
                <span className="text-arena-lime text-xs">+₹200 free</span>
              </div>
              <div className="text-xs text-arena-subtle mt-1">Most popular VIP pack</div>
            </button>

            <button
              onClick={() => handleTopup(2500, 600)}
              onMouseEnter={() => playHover()}
              className="p-3 bg-white/[0.02] border border-white/10 hover:border-white/25 rounded-lg text-left transition-colors"
            >
              <div className="flex justify-between text-white font-medium text-sm">
                <span>+ ₹2,500</span>
                <span className="text-arena-lime text-xs">+₹600 free</span>
              </div>
              <div className="text-xs text-arena-subtle mt-1">All-night tournament pass</div>
            </button>
          </div>
        </div>

        {/* Security verification stamp */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
          <div>PCI-DSS compliant, no cash handling leakage</div>
          <div className="text-arena-lime">Transaction logged · hash #9C82A</div>
        </div>

      </div>
    </div>
  );
};
