import React, { useState } from 'react';
import { Monitor, Wallet, Utensils, KeySquare, FileText, Globe2, ChevronRight } from 'lucide-react';
import { ModuleId, ModuleInfo } from '../types';
import { PCSessionMockup } from './PCSessionMockup';
import { WalletMockup } from './WalletMockup';
import { FnBMockup } from './FnBMockup';
import { CashRegisterMockup } from './CashRegisterMockup';
import { EODAuditMockup } from './EODAuditMockup';
import { MultiBranchMockup } from './MultiBranchMockup';
import { playClick, playHover } from '../audio/soundEffects';

const MODULES: ModuleInfo[] = [
  {
    id: 'pc-session', code: '01', title: 'PC sessions',
    tagline: 'A live timer on every gaming PC.',
    description: 'Every PC shows a countdown. Staff can lock or unlock any PC from the counter. Sessions can be prepaid for a fixed time or pay-as-you-go, with different rates per zone.',
    stats: [{ label: 'Session types', value: '2' }, { label: 'Remote lock', value: 'Yes' }],
    features: [],
  },
  {
    id: 'digital-wallet', code: '02', title: 'Member wallet',
    tagline: 'Gamers keep a balance with you.',
    description: 'Members have a gaming wallet and a food wallet, plus loyalty points. They can log in from any gaming PC.',
    stats: [{ label: 'Wallets', value: '2' }, { label: 'Login', value: 'Any PC' }],
    features: [],
  },
  {
    id: 'fnb-ordering', code: '03', title: 'Food orders',
    tagline: 'Order food without leaving the game.',
    description: 'Manage your menu, see live order status and track stock, so nothing leaves the kitchen unrecorded.',
    stats: [{ label: 'Order status', value: 'Live' }, { label: 'Stock', value: 'Tracked' }],
    features: [],
  },
  {
    id: 'cash-register', code: '04', title: 'Billing and cash',
    tagline: 'A bill is made automatically when a session ends.',
    description: 'Split a payment across cash, UPI and wallet. Add discounts, and every change is saved in an audit trail.',
    stats: [{ label: 'Payment types', value: '3' }, { label: 'Audit trail', value: 'Full' }],
    features: [],
  },
  {
    id: 'eod-audit', code: '05', title: 'Shift and daily cash check',
    tagline: 'Count the cash at every shift change.',
    description: 'Staff count cash note by note. The system compares it with what was expected and asks for a reason if it does not match. Daily reports are ready any time.',
    stats: [{ label: 'Count', value: 'Note by note' }, { label: 'Report', value: 'Live' }],
    features: [],
  },
  {
    id: 'multi-branch', code: '06', title: 'All branches together',
    tagline: 'See every branch from Head Office.',
    description: 'Head Office sees live PC status, active sessions and shifts across Adajan, Katargam, Citylight and Varachha. Each branch also keeps working if its internet goes down, then catches up.',
    stats: [{ label: 'Branches', value: '4' }, { label: 'Offline mode', value: 'Yes' }],
    features: [],
  },
];

export const ProductWalkthrough: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('pc-session');
  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];

  const renderActiveMockup = () => {
    switch (activeModuleId) {
      case 'pc-session':
        return <PCSessionMockup />;
      case 'digital-wallet':
        return <WalletMockup />;
      case 'fnb-ordering':
        return <FnBMockup />;
      case 'cash-register':
        return <CashRegisterMockup />;
      case 'eod-audit':
        return <EODAuditMockup />;
      case 'multi-branch':
        return <MultiBranchMockup />;
      default:
        return <PCSessionMockup />;
    }
  };

  return (
    <section id="modules" className="py-10 md:py-16 bg-[#08080A] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="mb-8">
          <div className="text-xs text-arena-lime mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span>What it does</span>
          </div>
          <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white max-w-3xl leading-tight">
            Everything your café needs, in one system.
          </h2>
          <p className="text-arena-muted text-base max-w-2xl mt-2">
            Click a feature to try it.
          </p>
        </div>

        {/* Console Layout: Left Selector vs Right Live Interactive Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Module Switcher List */}
          <div className="lg:col-span-4 space-y-1.5">
            {MODULES.map(module => {
              const isActive = module.id === activeModuleId;
              return (
                <button
                  key={module.id}
                  onClick={() => {
                    playClick();
                    setActiveModuleId(module.id);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`w-full p-3 rounded-lg text-left transition-colors border flex items-center justify-between group ${
                    isActive
                      ? 'bg-white/[0.04] border-arena-lime/60 text-white'
                      : 'bg-white/[0.01] border-white/10 text-arena-muted hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs ${isActive ? 'text-arena-lime' : 'text-arena-subtle'}`}>
                        {module.code}
                      </span>
                    </div>
                    <div className="font-semibold text-sm tracking-tight text-white">
                      {module.title}
                    </div>
                    <div className="text-xs text-arena-muted line-clamp-1 mt-0.5">
                      {module.tagline}
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-arena-lime translate-x-1' : 'text-arena-subtle group-hover:text-white'
                  }`} />
                </button>
              );
            })}

            {/* Quick Summary Box */}
            <div className="mt-4 p-4 bg-white/[0.02] border border-white/10 rounded-lg">
              <div className="text-arena-lime text-xs mb-1.5">
                <span>{activeModule.code} overview</span>
              </div>
              <p className="text-arena-muted text-xs leading-relaxed mb-3">
                {activeModule.description}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10">
                {activeModule.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-white font-semibold text-sm">{stat.value}</div>
                    <div className="text-xs text-arena-subtle">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Mockup Viewport */}
          <div className="lg:col-span-8">
            <div className="relative">
              {renderActiveMockup()}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
