import React, { useState } from 'react';
import { Printer, ShieldCheck, DollarSign, Check, KeySquare, HardDrive } from 'lucide-react';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

export const CashRegisterMockup: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [printed, setPrinted] = useState(false);

  const triggerDrawerKick = () => {
    playClick();
    setDrawerOpen(true);
    setTimeout(() => setDrawerOpen(false), 3000);
  };

  const handlePrintSlip = () => {
    playConfirm();
    setPrinted(true);
    setTimeout(() => setPrinted(false), 2500);
  };

  return (
    <div className="bg-[#0B0D14] border border-white/15 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Top Header */}
      <div className="bg-[#12141F] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-arena-muted">
        <div className="flex items-center gap-2">
          <KeySquare className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-semibold">HARDWARE POS & CASH DRAWER INTERFACE</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-arena-lime">HARDWARE: EPSON TM-T88VI + CASH_BOX_01</span>
          <span className="text-arena-subtle">DESK_01</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-b from-[#0B0D14] to-[#07080C] min-h-[360px] flex flex-col justify-between">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left: Terminal POS Bill & Split Breakdown */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">INVOICE #AR-2026-8941</span>
              <span className="text-arena-lime bg-arena-lime/10 px-2 py-0.5 rounded text-[10px]">
                STATION 07 · VIP LOUNGE
              </span>
            </div>

            <div className="p-4 bg-[#131522] border border-white/10 rounded space-y-2">
              <div className="flex justify-between text-arena-muted">
                <span>VIP Gaming (3.5 hrs @ ₹160/hr)</span>
                <span className="text-white font-mono">₹560.00</span>
              </div>
              <div className="flex justify-between text-arena-muted">
                <span>In-Seat F&B (Monster + Loaded Nachos)</span>
                <span className="text-white font-mono">₹270.00</span>
              </div>
              <div className="flex justify-between text-arena-muted">
                <span>Platform GST (18% inclusive)</span>
                <span className="text-white font-mono">₹149.40</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold">
                <span className="text-white">NET INVOICE DUE:</span>
                <span className="text-arena-lime font-display font-black text-xl">₹830.00</span>
              </div>
            </div>

            {/* Hardware Controls */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={triggerDrawerKick}
                onMouseEnter={() => playHover()}
                className={`p-3 rounded border font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  drawerOpen
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-[#12141F] border-white/15 hover:border-arena-lime text-white'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>{drawerOpen ? 'DRAWER POPPED (LOGGED)' : 'TEST DRAWER POP'}</span>
              </button>

              <button
                onClick={handlePrintSlip}
                onMouseEnter={() => playHover()}
                className="p-3 bg-arena-lime text-black font-mono font-bold uppercase rounded hover:bg-arena-limeBright shadow-lime-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{printed ? 'PRINTED SLIP' : 'PRINT THERMAL SLIP'}</span>
              </button>
            </div>
          </div>

          {/* Right: Thermal Receipt Slip Simulation */}
          <div className="md:col-span-5 bg-[#F4F4F2] text-black font-mono text-[10px] p-4 rounded shadow-2xl space-y-1.5 select-none border border-white/40">
            <div className="text-center font-bold text-xs pb-1 border-b border-black/20">
              *** ARENA ESPORTS BLR_01 ***
            </div>
            <div className="text-center text-[9px] text-neutral-600 pb-1">
              100 FT ROAD, INDIRANAGAR · GSTIN: 29AAAAA0000A1Z5
            </div>
            <div className="flex justify-between pt-1">
              <span>DATE: 12-SEP-2026 21:40</span>
              <span>RIG: #07</span>
            </div>
            <div className="flex justify-between">
              <span>OPERATOR: RAHUL_S</span>
              <span>TX: #9842</span>
            </div>
            <div className="border-b border-dashed border-black/40 my-1" />
            <div className="flex justify-between font-bold">
              <span>ITEM</span>
              <span>AMT</span>
            </div>
            <div className="flex justify-between">
              <span>PC TIME (210 MINS)</span>
              <span>₹560.00</span>
            </div>
            <div className="flex justify-between">
              <span>MONSTER ENERGY (1)</span>
              <span>₹150.00</span>
            </div>
            <div className="flex justify-between">
              <span>LOADED NACHOS (1)</span>
              <span>₹120.00</span>
            </div>
            <div className="border-b border-dashed border-black/40 my-1" />
            <div className="flex justify-between font-bold text-xs">
              <span>TOTAL PAID:</span>
              <span>₹830.00</span>
            </div>
            <div className="text-center text-[8px] text-neutral-600 pt-2">
              POWERED BY ARENAOS // ZERO LEAKAGE PLATFORM
            </div>
          </div>

        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-arena-subtle">
          <div>PHYSICAL DRAWER ELECTRONIC PULSE AUDITED VIA LOG STREAM</div>
          <div className="text-arena-lime">NO MANUAL RECEIPT DELETIONS ALLOWED</div>
        </div>

      </div>
    </div>
  );
};
