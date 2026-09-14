import React, { useState } from 'react';
import { Globe2, Check, RefreshCw } from 'lucide-react';
import { BranchInfo } from '../types';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

const BRANCH_DATA: BranchInfo[] = [
  {
    id: 'indiranagar',
    name: 'Indiranagar',
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
    name: 'Koramangala',
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
    name: 'Bandra West',
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
    name: 'Cyberhub',
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
    <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-sm text-arena-muted">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-arena-lime" />
          <span className="text-white font-medium">Multi-branch fleet command</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-arena-lime">4 nodes online</span>
          <span className="text-arena-subtle">126 rigs active</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-[#0D0D0F] min-h-[360px] flex flex-col justify-between">

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
                className={`p-3 rounded-lg text-left border transition-colors ${
                  isSelected
                    ? 'bg-arena-lime/10 border-arena-lime/60 text-white'
                    : 'bg-white/[0.01] border-white/10 text-arena-muted hover:border-white/25'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-arena-subtle">{branch.city}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-arena-lime' : 'bg-white/20'}`} />
                </div>
                <div className="font-medium text-sm truncate text-white">{branch.name}</div>
                <div className="text-xs text-arena-lime mt-1">{branch.occupancy}% full</div>
              </button>
            );
          })}
        </div>

        {/* Selected Branch Real-time Deep Dive */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs text-arena-lime">{activeBranch.name}</div>
              <div className="text-2xl font-semibold text-white mt-0.5">
                ₹{activeBranch.revenueToday.toLocaleString('en-IN')}
                <span className="text-xs text-arena-muted ml-2 font-normal">today's gross</span>
              </div>
            </div>

            <button
              onClick={handleGlobalSync}
              onMouseEnter={() => playHover()}
              className="px-4 py-2 bg-white/10 hover:bg-arena-lime hover:text-black rounded-md font-medium text-sm text-white transition-colors flex items-center gap-2"
            >
              {synced ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{synced ? 'Rates pushed to 4 branches' : 'Push global tariff update'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-arena-subtle text-xs">Rig utilization</div>
              <div className="text-white font-medium">{activeBranch.activePcs} / {activeBranch.totalPcs} PCs</div>
            </div>
            <div>
              <div className="text-arena-subtle text-xs">Network ping</div>
              <div className="text-arena-lime font-medium">{activeBranch.pingMs}ms</div>
            </div>
            <div>
              <div className="text-arena-subtle text-xs">Zone profiles</div>
              <div className="text-white font-medium">{activeBranch.zones.length} tariffs</div>
            </div>
            <div>
              <div className="text-arena-subtle text-xs">EOD audit status</div>
              <div className="text-arena-lime font-medium">In sync, 0 errors</div>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
          <div>Centralized member roaming — gamer pass credits work across all venues</div>
          <div className="text-arena-lime">One financial audit for the entire chain</div>
        </div>

      </div>
    </div>
  );
};
