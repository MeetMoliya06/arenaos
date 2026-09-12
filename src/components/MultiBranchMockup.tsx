import React, { useState } from 'react';
import { Network, Globe2, Building2, Check, RefreshCw, Cpu } from 'lucide-react';
import { BranchInfo } from '../types';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

const BRANCH_DATA: BranchInfo[] = [
  {
    id: 'indiranagar',
    name: 'BLR_01 // INDIRANAGAR',
    city: 'Bengaluru',
    totalPcs: 40,
    activePcs: 36,
    occupancy: 90,
    pingMs: 4,
    revenueToday: 58400,
    zones: ['VIP Arena (10)', 'Main Battlefloor (24)', 'Racing Pods (6)'],
  },
  {
    id: 'koramangala',
    name: 'BLR_02 // KORAMANGALA',
    city: 'Bengaluru',
    totalPcs: 32,
    activePcs: 28,
    occupancy: 87,
    pingMs: 5,
    revenueToday: 44200,
    zones: ['Tournament Stage (12)', 'Main Floor (20)'],
  },
  {
    id: 'bandra',
    name: 'BOM_01 // BANDRA WEST',
    city: 'Mumbai',
    totalPcs: 24,
    activePcs: 22,
    occupancy: 91,
    pingMs: 11,
    revenueToday: 49100,
    zones: ['Ultra VIP (8)', 'Esports Deck (16)'],
  },
  {
    id: 'cyberhub',
    name: 'DEL_01 // CYBERHUB',
    city: 'Gurugram',
    totalPcs: 30,
    activePcs: 26,
    occupancy: 86,
    pingMs: 14,
    revenueToday: 41800,
    zones: ['Sim Rigs (6)', 'Console Lounge (8)', 'PC Fleet (16)'],
  },
];

export const MultiBranchMockup: React.FC = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('indiranagar');
  const [synced, setSynced] = useState(false);

  const activeBranch = BRANCH_DATA.find(b => b.id === selectedBranchId) || BRANCH_DATA[0];

  const handleGlobalSync = () => {
    playConfirm();
    setSynced(true);
    setTimeout(() => setSynced(false), 2500);
  };

  return (
    <div className="bg-[#0B0D14] border border-white/15 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      {/* Top Bar */}
      <div className="bg-[#12141F] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-arena-muted">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-semibold">MULTI-BRANCH FLEET COMMAND // CENTRAL HQ</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-arena-lime">GLOBAL NODES: 4 ONLINE</span>
          <span className="text-arena-subtle">TOTAL RIGS: 126 ACTIVE</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-b from-[#0B0D14] to-[#07080C] min-h-[360px] flex flex-col justify-between">
        
        {/* Branch Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {BRANCH_DATA.map(branch => {
            const isSelected = branch.id === selectedBranchId;
            return (
              <button
                key={branch.id}
                onClick={() => {
                  playClick();
                  setSelectedBranchId(branch.id);
                }}
                onMouseEnter={() => playHover()}
                className={`p-3 rounded text-left border transition-all ${
                  isSelected
                    ? 'bg-arena-lime/10 border-arena-lime text-white shadow-lime-sm'
                    : 'bg-[#11131E] border-white/10 text-arena-muted hover:border-white/30'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-arena-subtle">{branch.city}</span>
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-arena-lime' : 'bg-white/20'}`} />
                </div>
                <div className="font-bold text-xs truncate text-white">{branch.name.split('//')[1]}</div>
                <div className="text-[10px] text-arena-lime mt-1 font-mono">{branch.occupancy}% FULL</div>
              </button>
            );
          })}
        </div>

        {/* Selected Branch Real-time Deep Dive */}
        <div className="p-6 bg-[#131623] border border-white/10 rounded-xl mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs text-arena-lime font-bold uppercase">{activeBranch.name}</div>
              <div className="text-2xl font-display font-black text-white mt-0.5">
                ₹{activeBranch.revenueToday.toLocaleString('en-IN')}
                <span className="text-xs font-mono text-arena-muted ml-2 font-normal">TODAY'S GROSS</span>
              </div>
            </div>

            <button
              onClick={handleGlobalSync}
              onMouseEnter={() => playHover()}
              className="px-4 py-2 bg-white/10 hover:bg-arena-lime hover:text-black rounded font-mono font-bold text-xs uppercase tracking-wider text-white transition-all flex items-center gap-2"
            >
              {synced ? <Check className="w-3.5 h-3.5 text-black" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{synced ? 'RATES PUSHED TO 4 BRANCHES' : 'PUSH GLOBAL TARIFF UPDATE'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
            <div>
              <div className="text-arena-subtle">RIG UTILIZATION:</div>
              <div className="text-white font-bold text-sm">{activeBranch.activePcs} / {activeBranch.totalPcs} PCs</div>
            </div>
            <div>
              <div className="text-arena-subtle">SIGNALR PING:</div>
              <div className="text-arena-lime font-bold text-sm">{activeBranch.pingMs}ms TLS</div>
            </div>
            <div>
              <div className="text-arena-subtle">ZONE PROFILES:</div>
              <div className="text-white font-bold text-sm">{activeBranch.zones.length} TARIFFS</div>
            </div>
            <div>
              <div className="text-arena-subtle">EOD AUDIT STATUS:</div>
              <div className="text-arena-lime font-bold text-sm">IN-SYNC [0 ERRORS]</div>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-arena-subtle">
          <div>CENTRALIZED MEMBER ROAMING: GAMER PASS CREDITS WORK ACROSS ALL VENUES</div>
          <div className="text-arena-lime">ONE FINANCIAL AUDIT FOR THE ENTIRE CHAIN</div>
        </div>

      </div>
    </div>
  );
};
