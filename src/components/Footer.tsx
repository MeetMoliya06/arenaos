import React, { useState } from 'react';
import { 
  Terminal, 
  ArrowUpRight, 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  MessageSquare,
  Layers,
  Sparkles
} from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';
import { Logo } from './Logo';

interface FooterProps {
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemo }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    playClick();
    navigator.clipboard.writeText('connect@p3q.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleScrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchor = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <footer className="relative pt-16 pb-8 text-sm text-[#8A8A93] overflow-hidden">
      {/* Ambient background glow accents */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.07),transparent_70%)] blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[250px] bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.04),transparent_70%)] blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">

        {/* ─── Hero Action Deck / Conversion Banner ─── */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#111216] to-[#0A0B0E] border border-white/10 p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden mb-14">
          {/* Subtle architectural dot grid inside card */}
          <div className="absolute inset-0 bg-tech-dots opacity-40 pointer-events-none" />
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              {/* Executive Telemetry Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/25 text-[#CCFF00] text-xs font-mono tracking-wider mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]" />
                </span>
                <span>MADE FOR GAMING CAFÉS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                Stop losing money in your café.
              </h2>
              
              <p className="text-[#9999A0] text-sm sm:text-base leading-relaxed max-w-xl">
                ArenaOS counts every minute, every snack and every rupee. So no money goes missing.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center shrink-0">
              <button
                onClick={() => {
                  playClick();
                  onOpenDemo();
                }}
                onMouseEnter={() => playHover()}
                className="whitespace-nowrap px-6 py-3.5 bg-[#CCFF00] hover:bg-[#d8ff33] text-black font-semibold text-sm rounded-lg shadow-lg hover:shadow-[#CCFF00]/20 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Terminal className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Book a free demo</span>
                <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>

              <a
                href="https://wa.me/919173676680?text=Hi%20ArenaOS%20team,%20I'm%20interested%20in%20a%20demo%20for%20my%20caf%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="whitespace-nowrap px-5 py-3.5 border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#25D366]/40 text-white hover:text-[#25D366] text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>

            </div>
          </div>
        </div>

        {/* ─── Telemetry Value Badges ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-12 mb-12 relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-screen after:h-px after:bg-white/10">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 text-xs text-[#5C5C66] mb-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>MONEY</span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight">0%</div>
            <div className="text-xs text-[#8A8A93] mt-0.5">Money that goes missing</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 text-xs text-[#5C5C66] mb-1 font-mono">
              <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>TIME'S UP</span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Instant</div>
            <div className="text-xs text-[#8A8A93] mt-0.5">PC locks when time ends</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 text-xs text-[#5C5C66] mb-1 font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>REAL CAFÉ</span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight">40+ PCs</div>
            <div className="text-xs text-[#8A8A93] mt-0.5">Running at Apple Esports</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-2 text-xs text-[#5C5C66] mb-1 font-mono">
              <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>NO WIFI?</span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight">Still works</div>
            <div className="text-xs text-[#8A8A93] mt-0.5">Even without internet</div>
          </div>
        </div>

        {/* ─── 4-Column Navigation & Identity Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-12 pb-14 items-start relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-screen after:h-px after:bg-white/10">
          
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleScrollToTop(); }}
                className="inline-block transition-opacity hover:opacity-90"
              >
                <Logo markClassName="w-8 h-8 sm:w-9 sm:h-9" wordmarkClassName="h-5 sm:h-6" />
              </a>

              <p className="mt-3 text-xs sm:text-sm text-[#8A8A93] leading-relaxed max-w-sm">
                The full-stack operating system for modern esports arenas, gaming cafés, and cyber lounges. Zero-trust lockscreens, instant in-seat F&amp;B, and airtight audit reconciliation.
              </p>

              {/* HQ Badge */}
              <div className="mt-5 flex items-center gap-2 text-xs text-[#5C5C66]">
                <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span>Headquarters: Surat, Gujarat, India</span>
              </div>
            </div>

            {/* Quick Copy Email Widget */}
            <div className="mt-8">
              <div className="text-xs font-mono uppercase tracking-wider text-[#5C5C66] mb-2">Direct Inquiry</div>
              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => playHover()}
                className="w-full sm:w-auto inline-flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#CCFF00]/40 transition-colors text-xs text-white group cursor-pointer"
                title="Click to copy email address"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span className="font-mono text-xs">connect@p3q.in</span>
                </div>
                {copiedEmail ? (
                  <span className="flex items-center gap-1 text-[11px] text-[#CCFF00] font-medium animate-fadeIn">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-[#5C5C66] group-hover:text-white transition-colors">
                    <Copy className="w-3 h-3" /> Copy
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Col 2: Platform Modules (3 cols) */}
          <div className="lg:col-span-4">
            <div className="text-xs font-mono uppercase tracking-wider text-white h-9 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              <span>Platform Modules</span>
            </div>
            <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06] text-sm">
              <li>
                <a 
                  href="#modules" 
                  onClick={(e) => handleAnchor('modules', e)}
                  className="hover:text-white transition-colors flex items-center justify-between gap-4 py-3.5 group"
                >
                  <span>PC Session Lockscreen</span>
                  <span className="text-[10px] font-mono text-[#5C5C66] px-2 py-0.5 rounded-full border border-white/[0.08] group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">Client</span>
                </a>
              </li>
              <li>
                <a 
                  href="#modules" 
                  onClick={(e) => handleAnchor('modules', e)}
                  className="hover:text-white transition-colors flex items-center justify-between gap-4 py-3.5 group"
                >
                  <span>In-Seat Food &amp; Beverage</span>
                  <span className="text-[10px] font-mono text-[#5C5C66] px-2 py-0.5 rounded-full border border-white/[0.08] group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">Kiosk</span>
                </a>
              </li>
              <li>
                <a 
                  href="#modules" 
                  onClick={(e) => handleAnchor('modules', e)}
                  className="hover:text-white transition-colors flex items-center justify-between gap-4 py-3.5 group"
                >
                  <span>Closed-Loop Member Wallet</span>
                  <span className="text-[10px] font-mono text-[#5C5C66] px-2 py-0.5 rounded-full border border-white/[0.08] group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">Fintech</span>
                </a>
              </li>
              <li>
                <a 
                  href="#modules" 
                  onClick={(e) => handleAnchor('modules', e)}
                  className="hover:text-white transition-colors flex items-center justify-between gap-4 py-3.5 group"
                >
                  <span>Cash Drawer Sync</span>
                  <span className="text-[10px] font-mono text-[#5C5C66] px-2 py-0.5 rounded-full border border-white/[0.08] group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">Audit</span>
                </a>
              </li>
              <li>
                <a 
                  href="#modules" 
                  onClick={(e) => handleAnchor('modules', e)}
                  className="hover:text-white transition-colors flex items-center justify-between gap-4 py-3.5 group"
                >
                  <span>EOD Shift Handover Protocol</span>
                  <span className="text-[10px] font-mono text-[#5C5C66] px-2 py-0.5 rounded-full border border-white/[0.08] group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">Shift</span>
                </a>
              </li>
              <li>
                <a 
                  href="#modules" 
                  onClick={(e) => handleAnchor('modules', e)}
                  className="hover:text-white transition-colors flex items-center justify-between gap-4 py-3.5 group"
                >
                  <span>Multi-Branch HQ Dashboard</span>
                  <span className="text-[10px] font-mono text-[#5C5C66] px-2 py-0.5 rounded-full border border-white/[0.08] group-hover:text-[#CCFF00] group-hover:border-[#CCFF00]/30 transition-colors">Cloud</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Dispatch Lines (3 cols) */}
          <div className="lg:col-span-4">
            <div className="text-xs font-mono uppercase tracking-wider text-white h-9 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Direct Phone Lines</span>
            </div>
            <p className="text-xs text-[#5C5C66] mb-4 leading-relaxed">
              Speak directly with our technical leads regarding on-site installation and hardware readiness:
            </p>
            <div className="space-y-2.5">
              <a 
                href="tel:+919173676680" 
                onClick={() => playClick()}
                className="group flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
              >
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium tracking-tight group-hover:text-[#CCFF00] transition-colors">+91 91736 76680</div>
                  <div className="text-[11px] text-[#5C5C66]">Deployments &amp; Demos</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-[#5C5C66] group-hover:text-[#CCFF00] transition-colors" />
              </a>

              <a 
                href="tel:+918238482880" 
                onClick={() => playClick()}
                className="group flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
              >
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium tracking-tight group-hover:text-[#CCFF00] transition-colors">+91 82384 82880</div>
                  <div className="text-[11px] text-[#5C5C66]">Hardware &amp; Setup</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-[#5C5C66] group-hover:text-[#CCFF00] transition-colors" />
              </a>

              <a 
                href="tel:+919664812556" 
                onClick={() => playClick()}
                className="group flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
              >
                <div>
                  <div className="text-white text-xs sm:text-sm font-medium tracking-tight group-hover:text-[#CCFF00] transition-colors">+91 96648 12556</div>
                  <div className="text-[11px] text-[#5C5C66]">Operations Support</div>
                </div>
                <Phone className="w-3.5 h-3.5 text-[#5C5C66] group-hover:text-[#CCFF00] transition-colors" />
              </a>
            </div>
          </div>

        </div>

        {/* ─── Massive Typographic Background Watermark ─── */}
        <div aria-hidden="true" className="select-none pointer-events-none flex justify-center py-8 sm:py-12">
          <img
            src="/logo-wordmark-trim.png"
            alt=""
            className="w-[80vw] max-w-6xl h-auto object-contain drop-shadow-[0_0_40px_rgba(204,255,0,0.12)]"
          />
        </div>


      </div>
    </footer>
  );
};
