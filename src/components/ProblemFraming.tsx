import React from 'react';

const PROBLEMS = [
  {
    tag: 'Problem 01',
    title: 'Free extra minutes',
    text: 'Staff let regulars play "just one more game" without billing. Across many PCs and two shifts, that adds up to hours of free play every day.',
    fix: 'A live timer and lock on every PC',
  },
  {
    tag: 'Problem 02',
    title: 'Cash that does not match',
    text: 'The drawer never matches the register. When the shift changes there is no clear record of who counted what.',
    fix: 'Note-by-note cash count at every shift',
  },
  {
    tag: 'Problem 03',
    title: 'Food that is not billed',
    text: 'Drinks and snacks handed over the counter without a bill. Stock goes missing and nobody knows where.',
    fix: 'Food orders and stock tracking',
  },
];

export const ProblemFraming: React.FC = () => {
  return (
    <section id="leakage" className="py-10 md:py-16 bg-[#08080A] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs text-red-400 mb-2">Why cafés need this</div>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white max-w-2xl leading-tight">
              Registers and spreadsheets miss money.
            </h2>
          </div>
          <div className="text-sm text-arena-muted max-w-sm leading-relaxed">
            Forgotten timers, unbilled food and cash that does not add up hurt your profit every day.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROBLEMS.map(p => (
            <div key={p.tag} className="p-5 bg-white/[0.02] border border-white/10 rounded-lg">
              <div className="text-red-400 font-medium text-xs mb-2">{p.tag}</div>
              <h3 className="font-display font-semibold text-lg text-white mb-1.5">{p.title}</h3>
              <p className="text-sm text-arena-muted leading-relaxed">{p.text}</p>
              <div className="mt-3 pt-2.5 border-t border-white/5 text-xs">
                <span className="text-arena-subtle">ArenaOS fix: </span>
                <span className="text-arena-lime font-medium">{p.fix}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
