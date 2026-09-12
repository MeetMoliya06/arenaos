import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, FileText, AlertTriangle, Send } from 'lucide-react';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

export const EODAuditMockup: React.FC = () => {
  const [signed, setSigned] = useState(false);
  const [physicalCount, setPhysicalCount] = useState(24350);
  const systemExpectedCash = 24350;
  const delta = physicalCount - systemExpectedCash;

  const handleSignShift = () => {
    playConfirm();
    setSigned(true);
    setTimeout(() => setSigned(false), 3000);
  };

  return (
    <div className="bg-[#0B0D14] border border-white/15 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Top OS Bar */}
      <div className="bg-[#12141F] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-arena-muted">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-semibold">END-OF-DAY (EOD) SHIFT RECONCILIATION LEDGER</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-arena-lime">SHIFT: 14:00 - 22:00 [EVENING PEAK]</span>
          <span className="text-arena-subtle">TERMINAL: POS_01</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-b from-[#0B0D14] to-[#07080C] min-h-[360px] flex flex-col justify-between">
        
        {/* Ledger Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-[#121422] border border-white/10 rounded">
            <div className="text-[10px] text-arena-muted uppercase mb-1">
              SYSTEM EXPECTED CASH
            </div>
            <div className="font-display font-black text-2xl text-white">
              ₹{systemExpectedCash.toLocaleString('en-IN')}
              <span className="text-arena-subtle text-xs font-mono">.00</span>
            </div>
            <div className="text-[10px] text-arena-lime mt-1">Logged by SignalR Transactions</div>
          </div>

          <div className="p-4 bg-[#121422] border border-white/10 rounded">
            <div className="text-[10px] text-arena-muted uppercase mb-1">
              PHYSICAL CASH COUNTED
            </div>
            <div className="font-display font-black text-2xl text-white">
              ₹{physicalCount.toLocaleString('en-IN')}
              <span className="text-arena-subtle text-xs font-mono">.00</span>
            </div>
            <div className="text-[10px] text-arena-subtle mt-1">Physical bills in till drawer</div>
          </div>

          <div className={`p-4 rounded border ${
            delta === 0
              ? 'bg-arena-lime/10 border-arena-lime/40 text-arena-lime'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}>
            <div className="text-[10px] uppercase font-bold mb-1">
              CASH RECONCILIATION DELTA
            </div>
            <div className="font-display font-black text-2xl">
              ₹{delta.toLocaleString('en-IN')}
              <span className="text-xs font-mono">.00</span>
            </div>
            <div className="text-[10px] font-bold mt-1">
              {delta === 0 ? '✓ 100% BALANCED (PERFECT AUDIT)' : '⚠️ DISCREPANCY DETECTED'}
            </div>
          </div>
        </div>

        {/* Currency Denominations Matrix */}
        <div className="p-4 bg-[#0F111A] border border-white/10 rounded-lg mb-6">
          <div className="text-[10px] text-arena-subtle uppercase mb-2">
            PHYSICAL NOTE COUNT BREAKDOWN
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹500 x 38</span>
              <span className="text-white font-bold">₹19,000</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹200 x 18</span>
              <span className="text-white font-bold">₹3,600</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹100 x 15</span>
              <span className="text-white font-bold">₹1,500</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-arena-muted">₹50 x 5</span>
              <span className="text-white font-bold">₹250</span>
            </div>
          </div>
        </div>

        {/* Dual Signature Lock & Owner Dispatch */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
          <div className="text-[11px] text-arena-muted space-y-0.5">
            <div>OUTGOING OPERATOR: <span className="text-white font-bold">RAHUL S.</span> [SIGNED 21:58]</div>
            <div>INCOMING SUPERVISOR: <span className="text-white font-bold">PRIYA K.</span> [PENDING VERIFY]</div>
          </div>

          <button
            onClick={handleSignShift}
            onMouseEnter={() => playHover()}
            className={`px-5 py-3 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              signed
                ? 'bg-arena-lime text-black shadow-lime-md'
                : 'bg-white/10 hover:bg-arena-lime hover:text-black text-white'
            }`}
          >
            {signed ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>SHIFT SEALED & DISPATCHED TO OWNER</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-arena-lime" />
                <span>SEAL SHIFT & PUSH AUDIT TO OWNER</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
