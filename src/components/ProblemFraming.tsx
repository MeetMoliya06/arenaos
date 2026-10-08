import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Banknote, UtensilsCrossed, WifiOff, Lock, Monitor, Check, X, Loader2 } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

interface ProblemFramingProps {
  onOpenDemo: () => void;
}

const LEAKS = [
  {
    id: 'time',
    icon: Clock,
    title: 'Players stay past their time',
    problem: 'A gamer says "just 5 more minutes" and nobody stops them. A few minutes a day, on every PC, adds up to real money.',
    solution: 'The PC locks by itself when time ends',
    summary: 'Every extra minute they play is a minute you don\'t get paid for.',
    fix: 'The screen locks. To keep playing, they pay first.',
  },
  {
    id: 'cash',
    icon: Banknote,
    title: 'Cash goes missing at shift change',
    problem: 'The drawer is counted by eye when staff swap. If money is short, nobody knows who is responsible, so you pay for it.',
    solution: 'Staff count every note on screen, so shortages have a name',
    summary: 'Money is short and nobody can say whose mistake it was.',
    fix: 'The shortage is caught on the spot and saved against the cashier.',
  },
  {
    id: 'fnb',
    icon: UtensilsCrossed,
    title: 'Snacks leave without a bill',
    problem: 'Staff hand out a drink or a Maggi and forget to write it down. Stock goes down, but your sales don\'t go up.',
    solution: 'Players order from their seat and it lands on their bill',
    summary: 'Stuff leaves the shelf, but no money comes in.',
    fix: 'Every order is added to that player\'s bill automatically.',
  },
  {
    id: 'offline',
    icon: WifiOff,
    title: 'Internet drops, billing stops',
    problem: 'Online tools freeze when the internet goes down. Customers leave without paying because you can\'t make a bill.',
    solution: 'Works without internet and syncs later',
    summary: 'Your billing tool needs the internet, so it stops with it.',
    fix: 'Everything keeps running inside the café. It syncs when the internet is back.',
  },
];

const PHASE_MS = 2500;
const TICK_MS = 100;

/* ───────── Visuals ───────── */

const TimeVisual: React.FC<{ on: boolean; tick: number }> = ({ on, tick }) => {
  const over = Math.min(tick * 60, 1200);
  const mm = String(Math.floor(over / 60)).padStart(2, '0');
  const ss = String(over % 60).padStart(2, '0');
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-3">
      <div className="text-xs text-[#8A8A93]">Example: PC 7 · ₹80 per hour</div>
      {on ? (
        <>
          <Lock className="w-14 h-14 text-[#CCFF00]" style={{ animation: 'pfPop 400ms ease' }} />
          <div className="text-xl md:text-2xl font-semibold text-white">Time is up. The PC locks.</div>
          <div className="px-4 py-2 rounded-lg border border-[#CCFF00]/30 bg-[#CCFF00]/[0.07] text-sm text-[#CCFF00]">
            Player pays at the counter to unlock
          </div>
        </>
      ) : (
        <>
          <Monitor className="w-14 h-14 text-rose-400 pf-blink" />
          <div className="text-xl md:text-2xl font-semibold text-white">Time is up, but they keep playing</div>
          <div className="font-mono text-3xl font-bold text-rose-400 tabular-nums">+{mm}:{ss} free play</div>
          <div className="px-4 py-2 rounded-lg border border-rose-500/30 bg-rose-500/[0.07] text-sm text-rose-300">
            You lose ₹{Math.round((over / 3600) * 80)} on this PC
          </div>
        </>
      )}
    </div>
  );
};

const NOTES = [
  { d: 500, n: 18 },
  { d: 200, n: 12 },
  { d: 100, n: 16 },
  { d: 50, n: 9 },
  { d: 10, n: 3 },
];

const CashVisual: React.FC<{ on: boolean; tick: number }> = ({ on, tick }) => {
  const shown = on ? Math.min(Math.floor(tick / 2.5), NOTES.length) : 0;
  return (
    <div className="h-full flex flex-col justify-center gap-3">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#5C5C66]">
        <span>Staff change · 2:00 am</span>
        <span>Drawer should have ₹14,280</span>
      </div>
      {on ? (
        <>
          <div className="space-y-1.5">
            {NOTES.map((r, i) => (
              <div
                key={r.d}
                className="flex items-center justify-between px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs font-mono transition-opacity duration-300"
                style={{ opacity: i < shown ? 1 : 0.15 }}
              >
                <span className="text-[#B4B4BB]">₹{r.d} × {r.n}</span>
                <span className="flex items-center gap-2 text-white">
                  ₹{(r.d * r.n).toLocaleString('en-IN')}
                  {i < shown && <Check className="w-3 h-3 text-[#CCFF00]" />}
                </span>
              </div>
            ))}
          </div>
          <div
            className="px-3 py-2 rounded-md border border-[#CCFF00]/30 bg-[#CCFF00]/[0.07] text-xs font-mono text-[#CCFF00] transition-opacity duration-300"
            style={{ opacity: shown >= NOTES.length ? 1 : 0 }}
          >
            Found ₹800 short right away. It is saved against Rahul, who counted.
          </div>
        </>
      ) : (
        <>
          <div className="py-6 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
            <div className="text-sm text-[#8A8A93]">Cashier counts by eye and guesses</div>
            <div className="font-mono text-3xl font-bold text-white mt-1">≈ ₹13,480</div>
          </div>
          <div className="px-3 py-2.5 rounded-md border border-rose-500/30 bg-rose-500/[0.07] flex items-center justify-between text-xs font-mono text-rose-300">
            <span>Money missing</span>
            <span className="pf-blink text-base font-bold">−₹800</span>
          </div>
          <div className="text-xs text-[#8A8A93] text-center">Nobody knows whose mistake it was. You pay for it.</div>
        </>
      )}
    </div>
  );
};

const ORDERS = [
  { pc: 'PC 09', item: 'Monster Energy', amt: '₹150' },
  { pc: 'PC 04', item: 'Water × 2', amt: '₹40' },
  { pc: 'PC 12', item: 'Cheese Maggi', amt: '₹70' },
  { pc: 'PC 07', item: 'Peri Nachos', amt: '₹90' },
];

const FnbVisual: React.FC<{ on: boolean; tick: number }> = ({ on, tick }) => {
  const shown = on ? Math.min(Math.floor(tick / 3) + 1, ORDERS.length) : 0;
  const taken = 14;
  const billed = on ? taken : 9;
  return (
    <div className="h-full flex flex-col justify-center gap-4">
      <div className="space-y-2.5">
        {[
          { label: 'Items taken off the shelf', val: taken, color: '#8A8A93' },
          { label: 'Items put on a bill', val: billed, color: on ? '#CCFF00' : '#FB7185' },
        ].map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#8A8A93]">{b.label}</span>
              <span className="font-mono text-white">{b.val}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(b.val / taken) * 100}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
      {on ? (
        <div className="space-y-1.5">
          {ORDERS.map((o, i) => (
            <div
              key={o.pc}
              className="flex items-center justify-between px-3 py-1.5 rounded-md bg-[#CCFF00]/[0.05] border border-[#CCFF00]/20 text-xs transition-opacity duration-300"
              style={{ opacity: i < shown ? 1 : 0.12 }}
            >
              <span className="text-[#B4B4BB]"><span className="font-mono text-[#5C5C66]">{o.pc}</span> · {o.item}</span>
              <span className="font-mono text-[#CCFF00]">{o.amt} added to bill</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-3 py-3 rounded-md border border-rose-500/30 bg-rose-500/[0.07] text-xs font-mono text-rose-300 text-center">
          5 items gone and not billed. You lose that money.
        </div>
      )}
    </div>
  );
};

const OfflineVisual: React.FC<{ on: boolean; tick: number }> = ({ on, tick }) => {
  const queued = Math.min(tick * 2, 14);
  return (
    <div className="h-full flex flex-col justify-center gap-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8A8A93] font-mono uppercase tracking-widest text-[10px]">Internet · 9:12 pm</span>
        <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
          <WifiOff className="w-3 h-3" /> No internet
        </span>
      </div>

      {on ? (
        <>
          <div className="p-4 rounded-lg bg-[#CCFF00]/[0.04] border border-[#CCFF00]/20">
            <div className="grid grid-cols-6 gap-2 mb-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-7 rounded border border-[#CCFF00]/30 bg-[#CCFF00]/[0.07] flex items-center justify-center">
                  <Monitor className="w-3 h-3 text-[#CCFF00]" />
                </div>
              ))}
            </div>
            <div className="h-1 rounded-full bg-[#CCFF00]/60" />
            <div className="mt-1.5 text-[10px] font-mono text-[#CCFF00] text-center">ALL PCs + COUNTER TALK TO EACH OTHER</div>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#CCFF00]" /> Billing keeps working</span>
            <span className="text-[#CCFF00]">{queued} bills waiting to upload</span>
          </div>
        </>
      ) : (
        <>
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.08] flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
            <div className="text-sm text-white">Billing tool is stuck</div>
            <div className="text-xs text-[#8A8A93]">Waiting for the internet…</div>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-md border border-rose-500/30 bg-rose-500/[0.07] text-xs font-mono text-rose-300">
            <span>Can't make bills</span>
            <span className="flex gap-1">
              {[0, 1, 2].map(i => (
                <X key={i} className="w-3.5 h-3.5" style={{ opacity: tick > 4 + i * 4 ? 1 : 0.2 }} />
              ))}
            </span>
          </div>
          <div className="text-xs text-[#8A8A93] text-center">3 players walk out without paying.</div>
        </>
      )}
    </div>
  );
};

const VISUALS: Record<string, React.FC<{ on: boolean; tick: number }>> = {
  time: TimeVisual,
  cash: CashVisual,
  fnb: FnbVisual,
  offline: OfflineVisual,
};

/* ───────── Section ───────── */

export const ProblemFraming: React.FC<ProblemFramingProps> = ({ onOpenDemo }) => {
  const [idx, setIdx] = useState(0);
  const [on, setOn] = useState(false);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => setTick(t => t + 1), TICK_MS);
    return () => clearInterval(iv);
  }, [paused]);

  // Walk through: problem, then solution, then the next leak
  useEffect(() => {
    if (tick * TICK_MS < PHASE_MS) return;
    setTick(0);
    if (!on) {
      setOn(true);
    } else {
      setOn(false);
      setIdx(i => (i + 1) % LEAKS.length);
    }
  }, [tick, on]);

  const pick = (i: number) => {
    playClick();
    setIdx(i);
    setOn(false);
    setTick(0);
  };

  const flip = (v: boolean) => {
    if (v === on) return;
    playClick();
    setOn(v);
    setTick(0);
  };

  const Visual = VISUALS[LEAKS[idx].id];
  const accent = on ? '#CCFF00' : '#FB7185';

  return (
    <section id="leakage" className="min-h-screen flex items-center pt-20 pb-8 bg-[#0A0B0E] border-t border-white/[0.08] relative overflow-hidden">
      <style>{`
        @keyframes pfBlink { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes pfPop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pf-blink { animation: pfBlink 1.2s ease-in-out infinite; }
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ background: `radial-gradient(60% 50% at 70% 60%, ${on ? 'rgba(204,255,0,0.06)' : 'rgba(251,113,133,0.07)'}, transparent 70%)` }}
      />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Where your money goes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
              Money quietly slips out of your café every day.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#9999A0] leading-relaxed">
              It is not theft. It is four small things nobody is watching. Tap each one to see it.
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              onOpenDemo();
            }}
            onMouseEnter={() => playHover()}
            className="self-start lg:self-end shrink-0 px-4 py-2.5 bg-[#CCFF00] text-black font-semibold text-sm rounded-md transition-all hover:bg-[#b8e600] active:scale-[0.98] flex items-center gap-1.5"
          >
            <span>Book Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[clamp(380px,calc(100svh-300px),500px)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Four leaks */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {LEAKS.map((l, i) => {
              const Icon = l.icon;
              const active = i === idx;
              return (
                <button
                  key={l.id}
                  onClick={() => pick(i)}
                  onMouseEnter={() => playHover()}
                  className={`flex-1 text-left p-3.5 rounded-xl border transition-colors flex gap-3 ${
                    active ? 'bg-white/[0.05] border-white/20' : 'bg-white/[0.015] border-white/[0.07] hover:border-white/15'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-500"
                    style={{
                      color: active ? accent : '#8A8A93',
                      background: active ? (on ? 'rgba(204,255,0,0.1)' : 'rgba(244,63,94,0.1)') : 'rgba(255,255,255,0.03)',
                      borderColor: active ? (on ? 'rgba(204,255,0,0.25)' : 'rgba(244,63,94,0.25)') : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${active ? 'text-white' : 'text-[#B4B4BB]'}`}>{l.title}</div>
                    <p className={`text-xs leading-relaxed mt-1 ${active ? 'text-[#8A8A93]' : 'text-[#6B6B77] line-clamp-1'}`}>{l.problem}</p>
                    {active && (
                      <div className="mt-2 text-xs">
                        <span className="text-[#8A8A93]">With ArenaOS: </span>
                        <span className="text-[#CCFF00] font-medium">{l.solution}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scene */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.1] bg-[#0C0D11] overflow-hidden flex flex-col min-h-[340px]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0E0F14]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A93]">
                <span className="w-1.5 h-1.5 rounded-full pf-blink" style={{ background: accent }} />
                {on ? 'With ArenaOS' : 'How it works today'}
              </div>
              <div className="relative grid grid-cols-2 p-0.5 rounded-full bg-black/40 border border-white/[0.08] text-[11px] font-medium">
                <span
                  className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full transition-all duration-300"
                  style={{ left: on ? '50%' : '2px', background: on ? '#CCFF00' : '#F43F5E' }}
                />
                <button onClick={() => flip(false)} className={`relative z-10 px-4 py-1 rounded-full text-center whitespace-nowrap transition-colors ${!on ? 'text-white' : 'text-[#8A8A93]'}`}>
                  Today
                </button>
                <button onClick={() => flip(true)} className={`relative z-10 px-4 py-1 rounded-full text-center whitespace-nowrap transition-colors ${on ? 'text-black' : 'text-[#8A8A93]'}`}>
                  With ArenaOS
                </button>
              </div>
            </div>
            <div className="flex-1 p-5 md:p-6">
              <Visual key={`${LEAKS[idx].id}-${on}`} on={on} tick={tick} />
            </div>
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-3 text-sm" style={{ background: on ? 'rgba(204,255,0,0.05)' : 'rgba(244,63,94,0.06)' }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: accent }}>
                {on ? <Check className="w-3.5 h-3.5 text-black" /> : <X className="w-3.5 h-3.5 text-black" />}
              </span>
              <span className="text-white">{on ? LEAKS[idx].fix : LEAKS[idx].summary}</span>
            </div>
            <div className="h-[2px] bg-white/[0.05]">
              <div className="h-full transition-none" style={{ width: `${Math.min((tick * TICK_MS) / PHASE_MS, 1) * 100}%`, background: accent }} />
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-[#6B6B77]">No new equipment needed. Works on the Windows PCs you already have.</p>
      </div>
    </section>
  );
};
