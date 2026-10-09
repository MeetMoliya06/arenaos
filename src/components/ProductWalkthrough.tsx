import React from 'react';
import { ModuleInfo } from '../types';

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

const FastVideo: React.FC<{ name: string }> = ({ name }) => (
  <video
    src={`/demo/${name}.mp4`}
    poster={`/demo/${name}.jpg`}
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    ref={v => { if (v) v.playbackRate = 1.75; }}
    onLoadedMetadata={e => { e.currentTarget.playbackRate = 1.75; }}
    onPlay={e => { e.currentTarget.playbackRate = 1.75; }}
    className="block w-full aspect-[16/9] object-contain"
  />
);

const CLIPS: Record<string, string> = {
  'pc-session': 'pc-session',
  'digital-wallet': 'wallet',
  'fnb-ordering': 'fnb',
  'cash-register': 'billing',
  'eod-audit': 'cash-register',
  'multi-branch': 'multi-branch',
};

// Card colour: the website's own background, the same on every card. Borders separate the stack.
const THEMES = [
  { bg: '#08090B', fg: '#F5F5F7', chip: 'rgba(255,255,255,0.06)' },
  { bg: '#08090B', fg: '#F5F5F7', chip: 'rgba(255,255,255,0.06)' },
  { bg: '#08090B', fg: '#F5F5F7', chip: 'rgba(255,255,255,0.06)' },
  { bg: '#08090B', fg: '#F5F5F7', chip: 'rgba(255,255,255,0.06)' },
  { bg: '#08090B', fg: '#F5F5F7', chip: 'rgba(255,255,255,0.06)' },
  { bg: '#08090B', fg: '#F5F5F7', chip: 'rgba(255,255,255,0.06)' },
];

export const ProductWalkthrough: React.FC = () => {
  const N = MODULES.length;
  return (
    <section id="modules" className="border-t border-white/10 relative pt-16 md:pt-24">
      <style>{`
        #modules { --nav: 64px; --strip: 46px; }
        @media (min-width: 768px) { #modules { --nav: 76px; --strip: 52px; } }
        .wt-card { position: sticky; top: calc(var(--nav) + var(--i) * var(--strip)); }
        @media (min-width: 768px) {
          .wt-card { min-height: max(480px, calc(100svh - var(--nav) - ${N - 1} * var(--strip))); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#CCFF00] mb-2">What you get</div>
        <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight max-w-3xl">
          Everything your café needs, in one system.
        </h2>
        <p className="text-arena-muted text-sm md:text-base mt-3">Scroll down. Each card shows the real software at work.</p>
      </div>

      <div className="relative pb-16 md:pb-24">
        {MODULES.map((m, i) => {
          const t = THEMES[i % THEMES.length];
          return (
            <article
              key={m.id}
              className="wt-card overflow-hidden border-t border-white/[0.14]"
              style={{ ['--i' as string]: i, background: t.bg, color: t.fg, zIndex: i + 1 }}
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Strip: always visible once the next card stacks over */}
                <div className="flex items-center justify-between" style={{ height: 'var(--strip)' }}>
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="font-mono text-xs md:text-sm text-[#CCFF00]">{m.code}</span>
                    <h3 className="text-xl md:text-3xl font-semibold tracking-tight truncate">{m.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.9fr] gap-4 md:gap-10 pb-5 md:pb-8 md:pt-2">
                  <div className="order-2 md:order-1 flex flex-col justify-between gap-3 md:gap-6">
                    <h4 className="text-lg md:text-3xl font-semibold leading-snug tracking-tight">{m.tagline}</h4>
                    <div>
                      <p className="text-sm md:text-base leading-relaxed opacity-80 max-w-md">{m.description}</p>
                      <div className="hidden md:flex gap-2.5 mt-5">
                        {m.stats.map(st => (
                          <div key={st.label} className="px-4 py-2.5 rounded-lg" style={{ background: t.chip }}>
                            <div className="font-semibold text-sm text-[#CCFF00]">{st.value}</div>
                            <div className="text-[11px] opacity-70">{st.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="order-1 md:order-2 rounded-xl overflow-hidden border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.5)] bg-[#0A0B0E] self-start md:ml-auto w-full md:w-[min(100%,calc(max(280px,calc(100svh-var(--nav)-var(--strip)*6-24px))*16/9))]">
                    <FastVideo name={CLIPS[m.id]} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
