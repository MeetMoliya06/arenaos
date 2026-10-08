import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Monitor, Wallet, Utensils, KeySquare, FileText, Globe2 } from 'lucide-react';
import { ModuleId, ModuleInfo } from '../types';
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

const ICONS: Record<ModuleId, React.ReactNode> = {
  'pc-session': <Monitor className="w-4 h-4" />,
  'digital-wallet': <Wallet className="w-4 h-4" />,
  'fnb-ordering': <Utensils className="w-4 h-4" />,
  'cash-register': <KeySquare className="w-4 h-4" />,
  'eod-audit': <FileText className="w-4 h-4" />,
  'multi-branch': <Globe2 className="w-4 h-4" />,
};

const RealClip: React.FC<{ name: string; title?: string; children?: React.ReactNode }> = ({ name, title, children }) => (
  <div className="bg-[#111114] border border-white/10 rounded-xl overflow-hidden relative left-1/2 -translate-x-1/2" style={{ width: 'min(calc(100vw - 32px), 1560px, calc((100svh - 335px) * 16 / 9))' }}>
    <div className="bg-[#161619] px-4 py-2.5 border-b border-white/10 flex items-center gap-2 text-sm text-arena-muted">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      <span className="ml-3 font-mono text-xs truncate">ArenaOS{title ? ` — ${title}` : ''}</span>
    </div>
    <div className="relative">
      <video
        key={name}
        src={`/demo/${name}.mp4`}
        poster={`/demo/${name}.jpg`}
        autoPlay
        muted
        loop
        playsInline
        className="block w-full aspect-[16/9] object-cover bg-[#0A0B0E]"
      />
      {children}
    </div>
  </div>
);

export const ProductWalkthrough: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [local, setLocal] = useState(0); // 0..1 progress inside current step
  const fitRef = useRef<HTMLDivElement>(null);
  const activeModule = MODULES[idx];
  const N = MODULES.length;

  // Drive the active step from scroll position through the tall track
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-el.getBoundingClientRect().top / total, 0), 0.9999) : 0;
      const i = Math.floor(p * N);
      setIdx(prev => (prev === i ? prev : i));
      setLocal(p * N - i);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [N]);

  // Shrink the pinned stage so it always fits the screen height
  useLayoutEffect(() => {
    const fit = () => {
      const el = fitRef.current;
      if (!el) return;
      el.style.zoom = '1';
      const avail = window.innerHeight - 112; // navbar + breathing room
      const need = el.offsetHeight;
      el.style.zoom = '1';
      void need; void avail;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [idx]);

  // Keep the active step visible in the scrollable stepper on small screens
  useEffect(() => {
    const b = document.querySelector<HTMLElement>(`[data-step="${idx}"]`);
    const sc = b?.closest<HTMLElement>('.overflow-x-auto');
    if (b && sc && sc.scrollWidth > sc.clientWidth) {
      sc.scrollTo({ left: b.offsetLeft - sc.clientWidth / 2 + b.clientWidth / 2, behavior: 'smooth' });
    }
  }, [idx]);

  const select = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    playClick();
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / N) * total, behavior: 'smooth' });
  };

  const CLIPS: Record<string, string> = {
    'pc-session': 'pc-session',
    'digital-wallet': 'wallet',
    'fnb-ordering': 'fnb',
    'cash-register': 'billing',
    'eod-audit': 'cash-register',
    'multi-branch': 'multi-branch',
  };
  const renderActiveMockup = () => (
    <RealClip name={CLIPS[activeModule.id] ?? 'pc-session'} title={activeModule.title}>
      <div key={activeModule.id + 'c'} className="md:absolute md:inset-x-0 md:bottom-0 px-4 md:px-7 py-4 md:pt-24 md:pb-5 bg-[#0D0D0F] md:bg-transparent md:bg-gradient-to-t md:from-black/95 md:via-black/75 md:to-transparent flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4" style={{ animation: 'wtIn 400ms ease' }}>
        <div className="max-w-2xl">
          <div className="flex items-baseline gap-3">
            <span className="text-[#CCFF00] font-mono text-sm">{activeModule.code}</span>
            <h3 className="text-lg md:text-2xl font-semibold text-white tracking-tight">{activeModule.tagline}</h3>
          </div>
          <p className="text-sm md:text-base text-white/75 leading-relaxed mt-1.5">{activeModule.description}</p>
        </div>
        <div className="flex gap-2 md:gap-2.5 shrink-0">
          {activeModule.stats.map(st => (
            <div key={st.label} className="px-4 py-2 rounded-lg bg-black/50 backdrop-blur border border-white/15">
              <div className="text-white font-semibold text-sm">{st.value}</div>
              <div className="text-[11px] text-white/60">{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </RealClip>
  );

  return (
    <section id="modules" className="bg-[#08080A] border-t border-white/10 relative">
      <style>{`@keyframes wtIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Tall track: scrolling through it walks through the steps */}
      <div ref={trackRef} style={{ height: `${N * 90 + 60}vh` }} className="relative">
        <div className="sticky top-0 min-h-screen flex flex-col justify-center pt-20 pb-6 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#CCFF00]/[0.04] blur-[140px] rounded-full pointer-events-none" />

          <div ref={fitRef} className="max-w-6xl w-full mx-auto px-4 md:px-8 relative">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight text-white leading-tight">
                Everything your café needs, in one system.
              </h2>
              <p className="text-arena-muted text-sm mt-2">Keep scrolling to follow one night at the counter.</p>
            </div>

        {/* Stepper */}
        <div className="overflow-x-auto md:overflow-visible pt-4 -mt-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="relative flex min-w-[640px] md:min-w-0">
            {MODULES.map((m, i) => {
              const done = i < idx;
              const active = i === idx;
              return (
                <button
                  key={m.id}
                  data-step={i}
                  onClick={() => select(i)}
                  onMouseEnter={() => playHover()}
                  className="relative flex-1 flex flex-col items-center gap-2 group px-1"
                >
                  {/* connector to next */}
                  {i < MODULES.length - 1 && (
                    <span className="absolute top-5 left-1/2 w-full h-px bg-white/10">
                      <span
                        className="block h-full bg-[#CCFF00]"
                        style={{ width: done ? '100%' : active ? `${local * 100}%` : '0%' }}
                      />
                    </span>
                  )}
                  <span
                    className={`relative z-10 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      active
                        ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_24px_rgba(204,255,0,0.4)] scale-110'
                        : done
                        ? 'bg-[#13150A] border-[#CCFF00]/50 text-[#CCFF00]'
                        : 'bg-[#0E0F14] border-white/15 text-[#8A8A93] group-hover:text-white group-hover:border-white/30'
                    }`}
                  >
                    {ICONS[m.id]}
                  </span>
                  <span className={`text-xs font-medium text-center leading-tight transition-colors ${active ? 'text-white' : 'text-[#8A8A93] group-hover:text-white'}`}>
                    {m.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-b from-[#CCFF00]/[0.07] to-transparent blur-xl pointer-events-none" />
            <div key={activeModule.id} className="relative" style={{ animation: 'wtIn 400ms ease' }}>
              {renderActiveMockup()}
            </div>
          </div>

        </div>
      </div>
        </div>
      </div>
    </section>
  );
};
