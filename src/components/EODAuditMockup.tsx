import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, FileText } from 'lucide-react';
import { playConfirm, playHover } from '../audio/soundEffects';

export const EODAuditMockup: React.FC = () => {
  const [signed, setSigned] = useState(false);

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
          <span className="text-white font-medium">End-of-day cash check</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">14:00 – 22:00 shift</span>
          <span className="text-arena-subtle">POS 01</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#0D0D0F] min-h-[360px] flex flex-col justify-between">

        {/* Ledger */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
            <div className="text-xs text-arena-muted mb-1">Cash the system expects</div>
            <div className="font-semibold text-xl text-white">Recorded</div>
            <div className="text-xs text-arena-lime mt-1">From every bill of the shift</div>
          </div>
          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
            <div className="text-xs text-arena-muted mb-1">Cash counted by staff</div>
            <div className="font-semibold text-xl text-white">Counted</div>
            <div className="text-xs text-arena-subtle mt-1">Note by note</div>
          </div>
          <div className="p-4 rounded-lg bg-arena-lime/10 text-arena-lime">
            <div className="text-xs mb-1">Difference</div>
            <div className="font-semibold text-xl">Matched</div>
            <div className="text-xs mt-1">Any mismatch needs a reason</div>
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
                <span>Shift closed and sent to owner</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-arena-lime" />
                <span>Close shift and send to owner</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
