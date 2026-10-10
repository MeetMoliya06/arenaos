import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Wallet, 
  UtensilsCrossed, 
  Lock, 
  CheckCircle2, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { playHover, playClick } from '../audio/soundEffects';
import { LogoMark } from './Logo';

interface BranchInfo {
  id: string;
  name: string;
  tagline: string;
  est: string;
  location: string;
  rigs: number;
  specs: string;
  image: string;
  occupancy: number;
  highlight: string;
  features: string[];
}

const BRANCHES_DATA: BranchInfo[] = [
  {
    id: 'varachha',
    name: 'Varachha Mega Arena',
    tagline: "Surat's Most Advanced & Luxurious Esports Arena",
    est: 'Opened Sept 2025',
    location: 'Varachha Main Hub, Surat',
    rigs: 80,
    specs: 'RTX 4080 Rigs • 360Hz Pro Displays • VIP Bootcamp Lounges',
    image: '/branches/varachha.webp',
    occupancy: 96,
    highlight: '80 Flagship Stations with zero-latency lockscreen enforcement and in-seat gourmet F&B delivery.',
    features: ['80 Flagship Battle Stations', 'Dual VIP Bootcamp Suites', 'Dedicated In-Seat Café POS', '10G Fiber Redundancy'],
  },
  {
    id: 'adajan',
    name: 'Adajan Flagship (The OG)',
    tagline: 'The Legendary Institution of Surat Gaming',
    est: 'Est. Sept 29, 2011',
    location: 'Honey Park, Adajan, Surat',
    rigs: 65,
    specs: 'High-Refresh Esports PCs • Console Lounge • Gamer Café',
    image: '/branches/adajan.webp',
    occupancy: 92,
    highlight: 'Migrated 14 years of loyal gamer profiles into ArenaOS closed-loop cloud wallets without a second of downtime.',
    features: ['65 Esports Tournament PCs', 'PS5 & Console Arenas', 'Integrated Snack Bar Billing', '14+ Year Legacy Base'],
  },
  {
    id: 'citylight',
    name: 'Citylight Hub',
    tagline: 'Prime Social Gaming & Tournament Destination',
    est: 'Est. 2019',
    location: 'Citylight Road, Surat',
    rigs: 50,
    specs: 'RTX Series Esports Rigs • High-FPS Competitive Setups',
    image: '/branches/citylight.webp',
    occupancy: 88,
    highlight: 'Automated weekly LAN tournaments with instant seat reservation and real-time ledger accounting.',
    features: ['50 Tournament Ready Rigs', 'Surat Weekend LAN Hub', 'In-Seat Direct Snack Ordering', 'Fast Cashless Checkout'],
  },
  {
    id: 'katargam',
    name: 'Katargam Arena',
    tagline: 'High-Volume Competitive Ranked Grindhouse',
    est: 'Est. 2022',
    location: 'Katargam Circle, Surat',
    rigs: 55,
    specs: '240Hz Competitive Displays • Custom Mechanical Peripherals',
    image: '/branches/katargam.webp',
    occupancy: 94,
    highlight: 'Eliminated unauthorized staff free-play hours through immutable hardware-level session locks.',
    features: ['55 Competitive Grind Rigs', 'Automated Shift Cash Handovers', 'High-Traffic Rush Optimization', 'Instant UPI/Wallet Sync'],
  },
];

interface CaseStudyProps {
  onOpenDemo?: () => void;
}

export const CaseStudy: React.FC<CaseStudyProps> = ({ onOpenDemo }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('varachha');
  const [activeTab, setActiveTab] = useState<'branches' | 'architecture'>('architecture');
  const [simulatingType, setSimulatingType] = useState<'wallet' | 'fnb' | 'lock' | null>(null);
  const [telemetryLog, setTelemetryLog] = useState<string>('ArenaOS Core connected to 4 Apple Esports branches (Varachha, Adajan, Citylight, Katargam). Ping: 3.2ms.');

  const triggerSimulation = (type: 'wallet' | 'fnb' | 'lock') => {
    setSimulatingType(type);
    if (type === 'wallet') {
      playClick();
      setTelemetryLog('TOP-UP BROADCAST: ₹1,000 received at Adajan -> Instant ledger balance synced to Varachha & Citylight (OK 2.8ms)');
    } else if (type === 'fnb') {
      playClick();
      setTelemetryLog('F&B DISPATCH: Station #V-14 ordered 2x Red Bull -> Dispatched to café thermal printer #01 (OK 1.9ms)');
    } else {
      playClick();
      setTelemetryLog('EMERGENCY LOCKDOWN: Instant hardware kill-switch broadcast across 250 rigs (Enforced 4.1ms)');
    }
    setTimeout(() => {
      setSimulatingType(null);
    }, 2400);
  };

  const selectedBranch = BRANCHES_DATA.find((b) => b.id === selectedBranchId) || BRANCHES_DATA[0];

  return (
    <section id="proof" className="relative min-h-screen flex items-center text-[#EDEDEF] pt-20 pb-6 border-t border-white/[0.08] overflow-hidden">
      {/* Dynamic ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#CCFF00]/[0.035] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-[#00F0FF]/[0.03] blur-[140px] pointer-events-none rounded-full" />
      
      {/* Tech grid texture */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl w-full mx-auto px-4 md:px-8">
        {/* Top Proof Tag & Client Identification */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#CCFF00] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
            <span>Live Client Deployment</span>
            <span className="text-white/20">·</span>
            <span className="text-[#9999A0]">Surat, Gujarat</span>
          </div>

          {/* Official Client Brand Identification */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-3 text-sm text-[#9999A0]">
            <div className="flex items-center gap-2 text-white font-bold tracking-wide">
              <div className="w-7 h-7 rounded-md bg-black border border-white/15 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                  src="/appleesports-logo.svg" 
                  alt="Apple Esports Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(202,36,24,0.6)]" 
                />
              </div>
              <span>Apple Esports</span>
              <span className="text-[#9999A0] font-normal">· our client</span>
            </div>
            <span className="text-white/20">·</span>
            <span>4 Venues</span>
            <span className="text-white/20">·</span>
            <span>240+ High-Spec Rigs</span>
            <span className="text-white/20">·</span>
            <span className="text-white font-medium">100% Hardware Locked</span>
          </div>

          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-[1.1] text-white">
            ArenaOS, Deployed at Apple Esports.
          </h2>

        </div>

        {/* View Switcher: Interactive Branches vs Synchronized Architecture */}
        <div className="mt-3 flex justify-center">
          <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <button
              onClick={() => {
                setActiveTab('branches');
                playClick();
              }}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'branches'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Explore 4 Surat Branches
            </button>
            <button
              onClick={() => {
                setActiveTab('architecture');
                playClick();
              }}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'architecture'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#CCFF00]" />
              Live Mesh Architecture
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE BRANCH EXPLORER */}
        {activeTab === 'branches' && (
          <div className="mt-4 space-y-3">
            {/* Branch Selector Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {BRANCHES_DATA.map((branch) => {
                const isSelected = branch.id === selectedBranchId;
                return (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      playClick();
                    }}
                    onMouseEnter={() => playHover()}
                    className={`relative p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 border ${
                      isSelected
                        ? 'bg-white/[0.08] border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.15)] ring-1 ring-[#CCFF00]/50'
                        : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono tracking-wider text-white/50 uppercase">
                        {branch.est}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#CCFF00]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                        {branch.rigs} Rigs
                      </span>
                    </div>
                    <div className="font-display font-semibold text-white text-sm sm:text-base leading-tight">
                      {branch.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/50 mt-1">
                      <MapPin className="w-3 h-3 shrink-0 text-white/40" />
                      <span className="truncate">{branch.location}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Branch Deep-Dive Showcase */}
            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.1] overflow-hidden p-4 sm:p-5 backdrop-blur-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                
                {/* Branch Real Photography with Cyber HUD Overlays */}
                <div className="lg:col-span-7 relative group">
                  <div className="relative rounded-xl overflow-hidden border border-white/15 h-[clamp(170px,calc(100svh-600px),400px)] bg-black shadow-2xl">
                    <img 
                      src={selectedBranch.image} 
                      alt={selectedBranch.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Corner Crosshairs */}
                    <div className="absolute top-3 left-3 text-[11px] font-mono text-white/60 tracking-wider">
                      Location · {selectedBranch.name}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-xs font-mono text-white">
                      <Activity className="w-3 h-3 text-[#CCFF00] animate-pulse" />
                      PEAK LOAD: {selectedBranch.occupancy}%
                    </div>

                    {/* Bottom Branch Caption */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-block px-2.5 py-0.5 rounded bg-[#CCFF00] text-black text-[10px] font-mono font-bold uppercase mb-1">
                        LIVE VENUE PHOTO
                      </div>
                      <div className="text-white font-display font-semibold text-lg sm:text-xl">
                        {selectedBranch.tagline}
                      </div>
                      <div className="text-xs text-white/70 font-mono mt-0.5">
                        {selectedBranch.specs}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch Operations & ArenaOS Integration Details */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white/80">
                        {selectedBranch.location}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ArenaOS Active
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                      {selectedBranch.name}
                    </h3>

                    <p className="mt-2 text-white/70 text-xs sm:text-sm leading-relaxed">
                      {selectedBranch.highlight}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                    <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-2">
                      Controlled via ArenaOS:
                    </div>
                    {selectedBranch.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90">
                        <div className="w-4 h-4 rounded-full bg-[#CCFF00]/15 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-[#CCFF00]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live Telemetry Drawer */}
                  <div className="hidden p-3.5 rounded-xl bg-black/40 border border-white/[0.08] grid grid-cols-2 gap-3 text-left">
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase">Lockscreen State</div>
                      <div className="text-xs font-mono text-white font-medium flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3 text-[#CCFF00]" /> 100% Guarded
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase">Sync Ping</div>
                      <div className="text-xs font-mono text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <Zap className="w-3 h-3" /> &lt; 6ms to Cloud
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE MESH ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="mt-3 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.1] p-3 backdrop-blur-xl">
            <div className="hidden">
              <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest">
                Distributed High-Availability Topology
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                How 4 Independent Arenas Act as One Single Entity
              </h3>
              <p className="hidden">
                If the internet fluctuates in Katargam or power switches in Varachha, local client PCs remain strictly locked and billing timers tick offline, syncing back the moment connection restores.
              </p>
            </div>

            {/* Interactive Architecture Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 p-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#CCFF00]/10 text-[#CCFF00] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
                  SURAT_MESH_NET: ACTIVE
                </span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="font-mono text-white/60 hidden sm:inline">
                  TLS 1.3 End-to-End Encrypted
                </span>
              </div>

              {/* Simulation Interactive Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/50 hidden md:inline">TEST STREAM:</span>
                <button
                  onClick={() => triggerSimulation('wallet')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                    simulatingType === 'wallet'
                      ? 'bg-[#CCFF00] text-black font-semibold shadow-[0_0_15px_rgba(204,255,0,0.5)]'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border border-white/10'
                  }`}
                >
                  <Wallet className="w-3 h-3" />
                  Sync Wallet (₹1,000)
                </button>
                <button
                  onClick={() => triggerSimulation('fnb')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                    simulatingType === 'fnb'
                      ? 'bg-[#00F0FF] text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border border-white/10'
                  }`}
                >
                  <UtensilsCrossed className="w-3 h-3" />
                  F&B Order #89
                </button>
                <button
                  onClick={() => triggerSimulation('lock')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 ${
                    simulatingType === 'lock'
                      ? 'bg-rose-500 text-white font-semibold shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 border border-white/10'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Kill Signal
                </button>
              </div>
            </div>

            {/* Live Interactive Connecting Mesh Map */}
            <div className="relative w-full rounded-2xl bg-[#070709] border border-white/15 p-2 sm:p-3 overflow-hidden shadow-2xl">
              {/* Sci-Fi Grid Background */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(204,255,0,0.3) 1px, transparent 0)`,
                  backgroundSize: '28px 28px',
                }}
              />

              {/* Dynamic Connecting SVG Canvas */}
              <div className="relative w-full h-[clamp(230px,calc(100svh-520px),460px)]">
                <svg
                  viewBox="0 0 800 500"
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Glowing Core Linear Gradients */}
                    <linearGradient id="grad-adajan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="grad-varachha" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF3366" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="grad-citylight" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="grad-katargam" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#FFBB00" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Filter Glow Effects */}
                    <filter id="glow-lime" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-pulse" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Concentric Radar Wave Rings from Core (400, 250) */}
                  <circle cx="400" cy="250" r="85" fill="none" stroke="rgba(204,255,0,0.12)" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite]" />
                  <circle cx="400" cy="250" r="160" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="400" cy="250" r="235" fill="none" stroke="rgba(204,255,0,0.05)" strokeWidth="1" strokeDasharray="6 6" className="animate-[spin_60s_linear_infinite_reverse]" />
                  <circle cx="400" cy="250" r="310" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  {/* Outer Branch-to-Branch Cross-Mesh Failover Lines (Redundancy ring) */}
                  {/* Adajan (130, 85) to Varachha (670, 85) */}
                  <path
                    d="M 130 85 Q 400 35 670 85"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  {/* Varachha (670, 85) to Katargam (670, 415) */}
                  <path
                    d="M 670 85 Q 725 250 670 415"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  {/* Katargam (670, 415) to Citylight (130, 415) */}
                  <path
                    d="M 670 415 Q 400 465 130 415"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  {/* Citylight (130, 415) to Adajan (130, 85) */}
                  <path
                    d="M 130 415 Q 75 250 130 85"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />

                  {/* PRIMARY ACTIVE CONDUITS: Core (400, 250) to 4 Branches */}
                  {/* 1. Conduit: Core -> Adajan (130, 85) */}
                  <path
                    id="path-adajan"
                    d="M 400 250 C 310 250, 210 160, 130 85"
                    fill="none"
                    stroke="rgba(204,255,0,0.18)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 400 250 C 310 250, 210 160, 130 85"
                    fill="none"
                    stroke="url(#grad-adajan)"
                    strokeWidth="2"
                    strokeDasharray="8 12"
                    className="animate-[dash_1.5s_linear_infinite]"
                    filter="url(#glow-lime)"
                  />

                  {/* 2. Conduit: Core -> Varachha (670, 85) */}
                  <path
                    id="path-varachha"
                    d="M 400 250 C 490 250, 590 160, 670 85"
                    fill="none"
                    stroke="rgba(204,255,0,0.18)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 400 250 C 490 250, 590 160, 670 85"
                    fill="none"
                    stroke="url(#grad-varachha)"
                    strokeWidth="2"
                    strokeDasharray="8 12"
                    className="animate-[dash_1.5s_linear_infinite]"
                    filter="url(#glow-lime)"
                  />

                  {/* 3. Conduit: Core -> Citylight (130, 415) */}
                  <path
                    id="path-citylight"
                    d="M 400 250 C 310 250, 210 340, 130 415"
                    fill="none"
                    stroke="rgba(204,255,0,0.18)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 400 250 C 310 250, 210 340, 130 415"
                    fill="none"
                    stroke="url(#grad-citylight)"
                    strokeWidth="2"
                    strokeDasharray="8 12"
                    className="animate-[dash_1.5s_linear_infinite]"
                    filter="url(#glow-lime)"
                  />

                  {/* 4. Conduit: Core -> Katargam (670, 415) */}
                  <path
                    id="path-katargam"
                    d="M 400 250 C 490 250, 590 340, 670 415"
                    fill="none"
                    stroke="rgba(204,255,0,0.18)"
                    strokeWidth="3"
                  />
                  <path
                    d="M 400 250 C 490 250, 590 340, 670 415"
                    fill="none"
                    stroke="url(#grad-katargam)"
                    strokeWidth="2"
                    strokeDasharray="8 12"
                    className="animate-[dash_1.5s_linear_infinite]"
                    filter="url(#glow-lime)"
                  />

                  {/* Continuous Active Data Packets Flowing Along Wires */}
                  {/* Packet 1: Core -> Adajan */}
                  <circle r="4" fill="#00F0FF" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2.4s"
                      repeatCount="indefinite"
                      path="M 400 250 C 310 250, 210 160, 130 85"
                    />
                  </circle>
                  <circle r="3" fill="#CCFF00" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2.4s"
                      begin="1.2s"
                      repeatCount="indefinite"
                      path="M 130 85 C 210 160, 310 250, 400 250"
                    />
                  </circle>

                  {/* Packet 2: Core -> Varachha */}
                  <circle r="4" fill="#FF3366" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path="M 400 250 C 490 250, 590 160, 670 85"
                    />
                  </circle>
                  <circle r="3" fill="#CCFF00" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2s"
                      begin="1s"
                      repeatCount="indefinite"
                      path="M 670 85 C 590 160, 490 250, 400 250"
                    />
                  </circle>

                  {/* Packet 3: Core -> Citylight */}
                  <circle r="4" fill="#00FF88" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2.6s"
                      repeatCount="indefinite"
                      path="M 400 250 C 310 250, 210 340, 130 415"
                    />
                  </circle>
                  <circle r="3" fill="#CCFF00" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2.6s"
                      begin="1.3s"
                      repeatCount="indefinite"
                      path="M 130 415 C 210 340, 310 250, 400 250"
                    />
                  </circle>

                  {/* Packet 4: Core -> Katargam */}
                  <circle r="4" fill="#FFBB00" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2.2s"
                      repeatCount="indefinite"
                      path="M 400 250 C 490 250, 590 340, 670 415"
                    />
                  </circle>
                  <circle r="3" fill="#CCFF00" filter="url(#glow-pulse)">
                    <animateMotion
                      dur="2.2s"
                      begin="1.1s"
                      repeatCount="indefinite"
                      path="M 670 415 C 590 340, 490 250, 400 250"
                    />
                  </circle>

                  {/* Active Simulation Surge Pulses */}
                  {simulatingType && (
                    <circle 
                      r="7" 
                      fill={simulatingType === 'lock' ? '#FF0055' : simulatingType === 'wallet' ? '#CCFF00' : '#00F0FF'} 
                      filter="url(#glow-pulse)"
                    >
                      <animateMotion
                        dur="0.8s"
                        repeatCount="2"
                        path="M 400 250 C 490 250, 590 160, 670 85"
                      />
                    </circle>
                  )}
                  {simulatingType && (
                    <circle 
                      r="7" 
                      fill={simulatingType === 'lock' ? '#FF0055' : simulatingType === 'wallet' ? '#CCFF00' : '#00F0FF'} 
                      filter="url(#glow-pulse)"
                    >
                      <animateMotion
                        dur="0.8s"
                        repeatCount="2"
                        path="M 400 250 C 310 250, 210 160, 130 85"
                      />
                    </circle>
                  )}
                </svg>

                {/* DOM NODES: Central Core Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="relative group cursor-pointer">
                    {/* Pulsing Aura */}
                    <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-[#CCFF00]/30 via-red-500/20 to-[#00F0FF]/30 blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                    
                    {/* Main Core Container */}
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#18181D] to-[#0A0A0C] border-2 border-[#CCFF00] p-3 flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(204,255,0,0.3)] transition-transform duration-300 group-hover:scale-105">
                      
                      {/* ArenaOS Logo Emblem */}
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black border border-white/20 p-1.5 flex items-center justify-center shadow-md mb-1.5 group-hover:border-[#CCFF00]/50 transition-colors">
                        <LogoMark className="w-full h-full" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#CCFF00] ring-2 ring-black animate-ping" />
                      </div>

                      <div className="font-display font-bold text-white text-xs sm:text-sm tracking-tight leading-tight">
                        ArenaOS Core
                      </div>
                      <div className="text-[10px] sm:text-xs font-mono text-[#CCFF00] font-semibold mt-0.5">
                        Apple Esports Hub
                      </div>
                      <div className="text-[9px] font-mono text-white/40 mt-1 flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-emerald-400" />
                        250 Rigs Live
                      </div>
                    </div>
                  </div>
                </div>

                {/* NODE 1: TOP-LEFT — ADAJAN FLAGSHIP */}
                <div 
                  onClick={() => {
                    setSelectedBranchId('adajan');
                    playClick();
                  }}
                  className={`absolute top-2 left-2 sm:top-4 sm:left-4 z-20 cursor-pointer p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-all duration-300 border ${
                    selectedBranchId === 'adajan'
                      ? 'bg-white/[0.12] border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.3)] scale-105'
                      : 'bg-black/80 border-white/15 hover:border-white/30 hover:bg-black/95'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0FF]" />
                    </span>
                    <span className="font-display font-bold text-white text-xs sm:text-sm">
                      Adajan Flagship
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                      The OG • 2011
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-[#CCFF00]">65 PCs</span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> 3.2ms
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">Honey Park</span>
                  </div>
                  <div className="hidden">
                    <span>WALLETS: 14k+</span>
                    <span className="text-[#00F0FF]">SYNCHRONIZED</span>
                  </div>
                </div>

                {/* NODE 2: TOP-RIGHT — VARACHHA MEGA ARENA */}
                <div 
                  onClick={() => {
                    setSelectedBranchId('varachha');
                    playClick();
                  }}
                  className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 cursor-pointer p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-all duration-300 border text-right ${
                    selectedBranchId === 'varachha'
                      ? 'bg-white/[0.12] border-[#FF3366] shadow-[0_0_25px_rgba(255,51,102,0.3)] scale-105'
                      : 'bg-black/80 border-white/15 hover:border-white/30 hover:bg-black/95'
                  }`}
                >
                  <div className="flex items-center justify-end gap-2 mb-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                      FLAGSHIP • 2025
                    </span>
                    <span className="font-display font-bold text-white text-xs sm:text-sm">
                      Varachha Mega Arena
                    </span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3366] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3366]" />
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[11px] font-mono">
                    <span className="text-white/60">Main Hub</span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> 2.8ms
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-[#CCFF00]">80 RTX 4080s</span>
                  </div>
                  <div className="hidden">
                    <span className="text-rose-400">96% OCCUPANCY</span>
                    <span>VIP SUITES SYNCED</span>
                  </div>
                </div>

                {/* NODE 3: BOTTOM-LEFT — CITYLIGHT HUB */}
                <div 
                  onClick={() => {
                    setSelectedBranchId('citylight');
                    playClick();
                  }}
                  className={`absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 cursor-pointer p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-all duration-300 border ${
                    selectedBranchId === 'citylight'
                      ? 'bg-white/[0.12] border-[#00FF88] shadow-[0_0_25px_rgba(0,255,136,0.3)] scale-105'
                      : 'bg-black/80 border-white/15 hover:border-white/30 hover:bg-black/95'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF88]" />
                    </span>
                    <span className="font-display font-bold text-white text-xs sm:text-sm">
                      Citylight Hub
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                      LAN Center • 2019
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-[#CCFF00]">50 PCs</span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> 3.9ms
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">Citylight Rd</span>
                  </div>
                  <div className="hidden">
                    <span>TOURNAMENT MODE</span>
                    <span className="text-emerald-400">POS ONLINE</span>
                  </div>
                </div>

                {/* NODE 4: BOTTOM-RIGHT — KATARGAM ARENA */}
                <div 
                  onClick={() => {
                    setSelectedBranchId('katargam');
                    playClick();
                  }}
                  className={`absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 cursor-pointer p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-all duration-300 border text-right ${
                    selectedBranchId === 'katargam'
                      ? 'bg-white/[0.12] border-[#FFBB00] shadow-[0_0_25px_rgba(255,187,0,0.3)] scale-105'
                      : 'bg-black/80 border-white/15 hover:border-white/30 hover:bg-black/95'
                  }`}
                >
                  <div className="flex items-center justify-end gap-2 mb-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      RANKED • 2022
                    </span>
                    <span className="font-display font-bold text-white text-xs sm:text-sm">
                      Katargam Arena
                    </span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFBB00] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFBB00]" />
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[11px] font-mono">
                    <span className="text-white/60">Gajera Circle</span>
                    <span className="text-white/40">•</span>
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> 4.1ms
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-[#CCFF00]">55 High-Hz PCs</span>
                  </div>
                  <div className="hidden">
                    <span className="text-amber-400">HARDWARE LOCK</span>
                    <span>100% REVENUE AUDITED</span>
                  </div>
                </div>

              </div>

              {/* Live Mesh Console / Packet Telemetry Stream */}
              <div className="mt-2 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-white/80">
                  <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span className="text-white/40 font-mono">LIVE_LOG:</span>
                  <span className="text-[#CCFF00] truncate max-w-md sm:max-w-xl">
                    {telemetryLog}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-[11px] shrink-0">
                  <span>PACKETS: 4,892/s</span>
                  <span>•</span>
                  <span className="text-emerald-400">LOSS: 0.00%</span>
                  <span>•</span>
                  <span>ONLINE + OFFLINE: READY</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
