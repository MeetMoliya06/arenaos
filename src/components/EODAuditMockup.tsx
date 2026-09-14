import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, FileText } from 'lucide-react';
import { playConfirm, playHover } from '../audio/soundEffects';

export const EODAuditMockup: React.FC = () => {
  const [signed, setSigned] = useState(false);
  const [physicalCount] = useState(24350);
  const systemExpectedCash = 24350;
  const delta = physicalCount - systemExpectedCash;

  const handleSignShift = () => {
    playConfirm();
    setSigned(true);
    setTimeout(() => setSigned(false), 3000);
  };

  return (
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-medium">EOD shift reconciliation</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">14:00 – 22:00 shift</span>
          <span className="text-arena-subtle">POS 01</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#0D0D0F] min-h-[360px] flex flex-col justify-between">

        {/* Ledger Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
            <div className="text-xs text-arena-muted mb-1">
              System expected cash
            </div>
            <div className="font-semibold text-2xl text-white">
              ₹{systemExpectedCash.toLocaleString('en-IN')}
              <span className="text-arena-subtle text-sm">.00</span>
            </div>
            <div className="text-xs text-arena-lime mt-1">Logged by transaction ledger</div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
            <div className="text-xs text-arena-muted mb-1">
              Physical cash counted
            </div>
            <div className="font-semibold text-2xl text-white">
              ₹{physicalCount.toLocaleString('en-IN')}
              <span className="text-arena-subtle text-sm">.00</span>
            </div>
            <div className="text-xs text-arena-subtle mt-1">Physical bills in till drawer</div>
          </div>

          <div className={`p-4 rounded-lg ${
            delta === 0
              ? 'bg-arena-lime/10 text-arena-lime'
              : 'bg-red-500/10 text-red-400'
          }`}>
            <div className="text-xs mb-1">
              Cash reconciliation delta
            </div>
            <div className="font-semibold text-2xl">
              ₹{delta.toLocaleString('en-IN')}
              <span className="text-sm">.00</span>
            </div>
            <div className="text-xs mt-1">
              {delta === 0 ? 'Balanced — perfect audit' : 'Discrepancy detected'}
            </div>
          </div>
        </div>

        {/* Currency Denominations Matrix */}
        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg mb-6">
          <div className="text-xs text-arena-subtle mb-2">
            Physical note count breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹500 x 38</span>
              <span className="text-white font-medium">₹19,000</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹200 x 18</span>
              <span className="text-white font-medium">₹3,600</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹100 x 15</span>
              <span className="text-white font-medium">₹1,500</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹50 x 5</span>
              <span className="text-white font-medium">₹250</span>
            </div>
          </div>
        </div>

        {/* Dual Signature Lock & Owner Dispatch */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
          <div className="text-sm text-arena-muted space-y-0.5">
            <div>Outgoing: <span className="text-white font-medium">Rahul S.</span> · signed 21:58</div>
            <div>Incoming: <span className="text-white font-medium">Priya K.</span> · pending verify</div>
          </div>

          <button
            onClick={handleSignShift}
            onMouseEnter={() => playHover()}
            className={`px-5 py-3 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${
              signed
                ? 'bg-arena-lime text-black'
                : 'bg-white/10 hover:bg-arena-lime hover:text-black text-white'
            }`}
          >
            {signed ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Shift sealed & dispatched to owner</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-arena-lime" />
                <span>Seal shift & push audit to owner</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
