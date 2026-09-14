import React, { useState } from 'react';
import { Printer, KeySquare, HardDrive } from 'lucide-react';
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
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Top Header */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <KeySquare className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-medium">Hardware POS & cash drawer</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">Epson TM-T88VI</span>
          <span className="text-arena-subtle">Desk 01</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#0D0D0F] min-h-[360px] flex flex-col justify-between">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Left: Terminal POS Bill & Split Breakdown */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium text-sm">Invoice #AR-2026-8941</span>
              <span className="text-arena-lime bg-arena-lime/10 px-2 py-0.5 rounded-md text-xs">
                Station 07 · VIP lounge
              </span>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between text-arena-muted">
                <span>VIP gaming (3.5 hrs @ ₹160/hr)</span>
                <span className="text-white">₹560.00</span>
              </div>
              <div className="flex justify-between text-arena-muted">
                <span>In-seat F&amp;B (Monster + loaded nachos)</span>
                <span className="text-white">₹270.00</span>
              </div>
              <div className="flex justify-between text-arena-muted">
                <span>Platform GST (18% inclusive)</span>
                <span className="text-white">₹149.40</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between">
                <span className="text-white">Net invoice due</span>
                <span className="text-arena-lime font-semibold text-lg">₹830.00</span>
              </div>
            </div>

            {/* Hardware Controls */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={triggerDrawerKick}
                onMouseEnter={() => playHover()}
                className={`p-3 rounded-md border font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                  drawerOpen
                    ? 'bg-amber-500/10 border-amber-400/40 text-amber-300'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-white'
                }`}
              >
                <HardDrive className="w-4 h-4" />
                <span>{drawerOpen ? 'Drawer popped (logged)' : 'Test drawer pop'}</span>
              </button>

              <button
                onClick={handlePrintSlip}
                onMouseEnter={() => playHover()}
                className="p-3 bg-arena-lime text-black font-medium text-sm rounded-md hover:bg-arena-limeBright transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{printed ? 'Printed slip' : 'Print thermal slip'}</span>
              </button>
            </div>
          </div>

          {/* Right: Thermal Receipt Slip Simulation */}
          <div className="md:col-span-5 bg-[#F4F4F2] text-black font-mono text-[10px] p-4 rounded-lg space-y-1.5 select-none">
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
              POWERED BY ARENAOS
            </div>
          </div>

        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
          <div>Physical drawer pulses are audited via log stream</div>
          <div className="text-arena-lime">No manual receipt deletions allowed</div>
        </div>

      </div>
    </div>
  );
};
