import React, { useEffect, useRef, useState } from 'react';
import { Clock, Banknote, UtensilsCrossed, WifiOff, X, Check } from 'lucide-react';

interface ProblemFramingProps {
  onOpenDemo?: () => void;
}

const LEAKS = [
  {
    id: 'time',
    icon: Clock,
    title: 'Players play past their time',
    without: 'A gamer says "just 5 more minutes". Nobody stops them. You do not get paid.',
    with: 'The PC locks by itself when time ends. To play more, they pay first.',
  },
  {
    id: 'cash',
    icon: Banknote,
    title: 'Cash goes missing',
    without: 'Money is short at shift change. Nobody knows who made the mistake.',
    with: 'Staff count the cash on screen. A shortage always has a name next to it.',
  },
  {
    id: 'fnb',
    icon: UtensilsCrossed,
    title: 'Snacks leave without a bill',
    without: 'Staff give a drink or Maggi and forget to write it down.',
    with: 'Players order from their seat. The bill adds itself.',
  },
  {
    id: 'offline',
    icon: WifiOff,
    title: 'Internet stops, billing stops',
    without: 'Online tools freeze when the internet goes. Customers walk out without paying.',
    with: 'ArenaOS works online and offline. With no internet it keeps going and sends everything later.',
  },
];

/* Fades + slides an element in the first time it scrolls into view */
const Reveal: React.FC<{ delay?: number; className?: string; children: React.ReactNode }> = ({
  delay = 0,
  className = '',
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const ProblemFraming: React.FC<ProblemFramingProps> = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // The lime line on the left fills up as you scroll through the four problems
  useEffect(() => {
    const onScroll = () => {
      const el = listRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="leakage" className="relative border-t border-white/[0.08] pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 md:px-8 relative">
        {/* Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-rose-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Where café money goes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-white mb-5">
            Cafés lose money in 4 simple ways.
            <br />
            <span className="text-[#CCFF00]">ArenaOS stops all 4.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#9999A0] leading-relaxed">
            Here is what happens today, and what happens with ArenaOS.
          </p>
        </Reveal>

        {/* Column labels */}
        <div className="hidden md:grid grid-cols-2 gap-6 pl-16 mb-4 text-xs font-mono uppercase tracking-widest">
          <div className="flex items-center gap-2 text-rose-400">
            <X className="w-3.5 h-3.5" /> Without ArenaOS
          </div>
          <div className="flex items-center gap-2 text-[#CCFF00]">
            <Check className="w-3.5 h-3.5" /> With ArenaOS
          </div>
        </div>

        {/* The four problems */}
        <div ref={listRef} className="relative">
          {/* Scroll progress line */}
          <div aria-hidden="true" className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10 hidden md:block">
            <div
              className="w-full bg-[#CCFF00] shadow-[0_0_12px_rgba(204,255,0,0.6)]"
              style={{ height: `${progress * 100}%` }}
            />
          </div>

          <div className="space-y-8 md:space-y-10">
            {LEAKS.map((leak, i) => {
              const Icon = leak.icon;
              return (
                <div key={leak.id} className="md:pl-16 relative">
                  {/* Number badge on the line */}
                  <div
                    aria-hidden="true"
                    className="hidden md:flex absolute left-0 top-1 w-10 h-10 rounded-full items-center justify-center bg-[#0B0C0F] border border-white/15 text-sm font-mono text-white"
                  >
                    {i + 1}
                  </div>

                  <Reveal>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center md:hidden">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <Icon className="w-5 h-5 text-white hidden md:block" />
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{leak.title}</h3>
                    </div>
                  </Reveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Reveal delay={100}>
                      <div className="h-full rounded-2xl border border-rose-500/25 bg-rose-500/[0.05] p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 mb-3 md:hidden">
                          <X className="w-3.5 h-3.5" /> Without ArenaOS
                        </div>
                        <p className="text-base sm:text-lg text-[#D4D4D9] leading-relaxed">{leak.without}</p>
                      </div>
                    </Reveal>

                    <Reveal delay={350}>
                      <div className="h-full rounded-2xl border border-[#CCFF00]/30 bg-[#CCFF00]/[0.06] p-5 sm:p-6 shadow-[0_0_40px_rgba(204,255,0,0.05)]">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#CCFF00] mb-3 md:hidden">
                          <Check className="w-3.5 h-3.5" /> With ArenaOS
                        </div>
                        <p className="text-base sm:text-lg text-white leading-relaxed">{leak.with}</p>
                      </div>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
