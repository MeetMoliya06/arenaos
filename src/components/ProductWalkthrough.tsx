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
    id: 'pc-session',
    code: 'MOD_01',
    title: 'PC Session Management',
    tagline: 'Zero-trust lockscreen. No unbilled seconds. No task manager bypasses.',
    description: 'Hardware-level Windows client wrapper that stops free play. Automatically freezes sessions when time expires, locks keyboard/mouse, and prevents safe-mode workarounds.',
    stats: [
      { label: 'Unbilled Minute Recovery', value: '100%' },
      { label: 'Lockscreen Response', value: '<10ms' },
    ],
    features: ['QR Code Auto-Login', 'Emergency Fleet Freeze', 'Anti-Cheat App Watchdog', 'Dynamic Zone Pricing'],
  },
  {
    id: 'digital-wallet',
    code: 'MOD_02',
    title: 'Closed-Loop Digital Wallet',
    tagline: 'Gamer credit locked into your arena ecosystem.',
    description: 'Turn pay-as-you-go visitors into pre-funded loyal members. Gamers load ₹1,000+ into their digital passbook via UPI/card to unlock VIP tiers and night packs.',
    stats: [
      { label: 'Pre-Funded Cashflow', value: '+42%' },
      { label: 'Counter Cash Handling', value: '-85%' },
    ],
    features: ['Bonus Recharge Tiers', 'Cross-Branch Roaming', 'Auto-Debit Session Rates', 'Instant UPI Webhook'],
  },
  {
    id: 'fnb-ordering',
    code: 'MOD_03',
    title: 'In-Seat F&B Ordering',
    tagline: 'Gamers order energy drinks and food without leaving the game.',
    description: 'Steam/Discord-style tray widget running on the PC. Gamers order Monster Energy, hot meals, and snacks directly to their station. Dispatched to kitchen display immediately.',
    stats: [
      { label: 'F&B Basket Lift', value: '+34%' },
      { label: 'Ghost Snack Loss', value: '0.00%' },
    ],
    features: ['In-Game Tray Widget', 'Pantry KDS Dispatch', 'Wallet One-Click Charge', 'Barcode Inventory Lock'],
  },
  {
    id: 'cash-register',
    code: 'MOD_04',
    title: 'POS & Cash Drawer Hardware Sync',
    tagline: 'Physical cash drawer pops only when an audited ticket is created.',
    description: 'Full hardware POS integration with RJ11 cash drawers and thermal receipt printers. Stops unauthorized till openings and creates an electronic audit trail for every rupee.',
    stats: [
      { label: 'Drawer Pulse Audits', value: '100%' },
      { label: 'Print Latency', value: '0.2s' },
    ],
    features: ['RJ11 Kick Pulse Sync', 'Thermal Slip Formatting', 'Split UPI / Cash Tender', 'GST Compliant Invoicing'],
  },
  {
    id: 'eod-audit',
    code: 'MOD_05',
    title: 'Automated EOD Shift Handover',
    tagline: 'Cash counted matches SignalR transaction totals to the single rupee.',
    description: 'End the nightmare of shift transitions. Outgoing and incoming cashiers must complete a dual-signature denomination tally. Discrepancies trigger instant alerts to the owner.',
    stats: [
      { label: 'Till Reconciliation Delta', value: '₹0.00' },
      { label: 'Audit Handover Time', value: '< 3 mins' },
    ],
    features: ['Denomination Breakdown', 'Dual-Sign Digital Lock', 'Instant Owner Telegram/PDF', 'Audit Immutable Log'],
  },
  {
    id: 'multi-branch',
    code: 'MOD_06',
    title: 'Multi-Branch Fleet Command',
    tagline: 'Run 10 gaming cafés from a single central command dashboard.',
    description: 'Monitor live PC occupancy, today\'s gross revenue, and staff audits across all locations. Push global pricing changes and let members roam with their single gamer wallet.',
    stats: [
      { label: 'Central Command Latency', value: '<12ms' },
      { label: 'Cross-Branch Roaming', value: 'Global' },
    ],
    features: ['Central Fleet Map', 'Global Zone Pricing Sync', 'Unified Member Directory', 'Chain-Wide P&L Rollup'],
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
    <section id="modules" className="py-20 md:py-32 bg-[#08080A] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs text-arena-lime mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span>The core engine architecture</span>
          </div>
          <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white max-w-3xl leading-tight">
            Six mission-critical modules. Zero room for error.
          </h2>
          <p className="text-arena-muted text-base max-w-2xl mt-4">
            Every module is designed specifically for high-velocity gaming arenas where seconds count and cash discrepancies ruin owner peace of mind.
          </p>
        </div>

        {/* Console Layout: Left Selector vs Right Live Interactive Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Module Switcher List */}
          <div className="lg:col-span-4 space-y-2">
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
                  className={`w-full p-4 rounded-lg text-left transition-colors border flex items-center justify-between group ${
                    isActive
                      ? 'bg-white/[0.04] border-arena-lime/60 text-white'
                      : 'bg-white/[0.01] border-white/10 text-arena-muted hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
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
            <div className="mt-6 p-5 bg-white/[0.02] border border-white/10 rounded-lg">
              <div className="text-arena-lime text-xs mb-2">
                <span>{activeModule.code} overview</span>
              </div>
              <p className="text-arena-muted text-xs leading-relaxed mb-4">
                {activeModule.description}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
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
