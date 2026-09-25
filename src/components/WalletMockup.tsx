import React, { useState } from 'react';
import { Wallet, Sparkles, CheckCircle } from 'lucide-react';
import { playConfirm, playHover } from '../audio/soundEffects';

export const WalletMockup: React.FC = () => {
  const [bonusAdded, setBonusAdded] = useState(false);

  const handleTopup = () => {
    playConfirm();
    setBonusAdded(true);
    setTimeout(() => setBonusAdded(false), 2500);
  };

  return (
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-medium">Member wallet</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">Cash / UPI / wallet</span>
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
                  Gaming wallet and food wallet
                </div>
                <div className="font-semibold text-2xl sm:text-3xl text-white mt-1">
                  Two separate balances
                </div>
              </div>
              <span className="px-2 py-0.5 bg-arena-lime/10 text-arena-lime text-xs font-medium rounded-md">
                Loyalty points
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-arena-muted pt-4 border-t border-white/10">
              <span>@shadow_operator</span>
              <span className="text-arena-lime">Works at all 4 branches</span>
            </div>

            {bonusAdded && (
              <div className="absolute inset-0 bg-arena-lime/95 flex items-center justify-center text-black font-medium text-sm gap-2 animate-fadeIn">
                <CheckCircle className="w-5 h-5" />
                <span>Wallet recharged</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="sm:col-span-5 space-y-3 text-sm">
            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-md flex justify-between items-center">
              <span className="text-arena-muted">Member discount</span>
              <span className="text-arena-lime font-medium">Applied</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-md flex justify-between items-center">
              <span className="text-arena-muted">Cross-branch sync</span>
              <span className="text-white font-medium">Instant</span>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/10 rounded-md flex justify-between items-center">
              <span className="text-arena-muted">Free play allowed</span>
              <span className="text-red-400 font-medium">None</span>
            </div>
          </div>

        </div>

        {/* Recharge demo */}
        <div className="my-6">
          <div className="text-sm text-white mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-arena-lime" />
            <span>Try a wallet recharge</span>
          </div>
          <button
            onClick={handleTopup}
            onMouseEnter={() => playHover()}
            className="w-full p-3 bg-white/[0.02] border border-arena-lime/40 hover:border-arena-lime rounded-lg text-left transition-colors"
          >
            <div className="text-white font-medium text-sm">Recharge wallet with UPI / cash</div>
            <div className="text-xs text-arena-subtle mt-1">Bonus credits can be set per branch</div>
          </button>
        </div>

        {/* Security verification stamp */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
          <div>Every top-up is recorded</div>
          <div className="text-arena-lime">Transaction logged · hash #9C82A</div>
        </div>

      </div>
    </div>
  );
};
