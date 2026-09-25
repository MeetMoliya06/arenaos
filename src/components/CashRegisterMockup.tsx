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
          <span className="text-white font-medium">Billing & cash drawer</span>
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
              <span className="text-white font-medium text-sm">Bill #AR-2026-8941</span>
              <span className="text-arena-lime bg-arena-lime/10 px-2 py-0.5 rounded-md text-xs">
                PC 07 · VIP lounge
              </span>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between text-arena-muted">
                <span>VIP gaming</span>
                <span className="text-white">3.5 hrs</span>
              </div>
              <div className="flex justify-between text-arena-muted">
                <span>Food (energy drink + nachos)</span>
                <span className="text-white">2 items</span>
              </div>
              <div className="flex justify-between text-arena-muted">
                <span>GST</span>
                <span className="text-white">Included</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between">
                <span className="text-white">Payment</span>
                <span className="text-arena-lime font-semibold">Cash + UPI</span>
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
              *** APPLE ESPORTS · ADAJAN ***
            </div>
            <div className="text-center text-[9px] text-neutral-600 pb-1">
              SURAT
            </div>
            <div className="flex justify-between pt-1">
              <span>DATE: 12-SEP-2026 21:40</span>
              <span>PC: #07</span>
            </div>
            <div className="flex justify-between">
              <span>OPERATOR: RAHUL_S</span>
              <span>TX: #9842</span>
            </div>
            <div className="border-b border-dashed border-black/40 my-1" />
            <div className="flex justify-between font-bold">
              <span>ITEM</span>
              <span>QTY</span>
            </div>
            <div className="flex justify-between">
              <span>PC TIME (210 MINS)</span>
              <span>210 MIN</span>
            </div>
            <div className="flex justify-between">
              <span>MONSTER ENERGY (1)</span>
              <span>1</span>
            </div>
            <div className="flex justify-between">
              <span>LOADED NACHOS (1)</span>
              <span>1</span>
            </div>
            <div className="border-b border-dashed border-black/40 my-1" />
            <div className="flex justify-between font-bold text-xs">
              <span>STATUS:</span>
              <span>PAID</span>
            </div>
            <div className="text-center text-[8px] text-neutral-600 pt-2">
              POWERED BY ARENAOS
            </div>
          </div>

        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
          <div>Every drawer opening is recorded</div>
          <div className="text-arena-lime">Bills cannot be deleted</div>
        </div>

      </div>
    </div>
  );
};
