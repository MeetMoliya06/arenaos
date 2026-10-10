import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useTour } from './TourContext';

const PAD = 6;
const CARD_W = 440;
const GAP = 18;

// Target elements appear and move as the visitor clicks around (a panel opens, a tile changes
// colour), so the rect is re-measured on a short interval rather than once.
function useTargetRect(selector) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!selector) { setRect(null); return undefined; }
    let scrolled = false;
    const measure = () => {
      const el = document.querySelector(selector);
      if (!el) { setRect(null); return; }
      if (!scrolled) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); scrolled = true; }
      const r = el.getBoundingClientRect();
      setRect((p) => (p && p.x === r.x && p.y === r.y && p.width === r.width && p.height === r.height ? p : r));
    };
    measure();
    const id = setInterval(measure, 150);
    return () => { clearInterval(id); scrolled = false; };
  }, [selector]);
  return rect;
}

function place(rect, placement, cardH) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(CARD_W, vw - 24);
  if (!rect || placement === 'center') {
    return { left: (vw - w) / 2, top: Math.max(12, (vh - cardH) / 2), w };
  }
  let left; let top;
  if (placement === 'right' && rect.right + GAP + w < vw) { left = rect.right + GAP; top = rect.top; }
  else if (placement === 'left' && rect.left - GAP - w > 0) { left = rect.left - GAP - w; top = rect.top; }
  else if (placement === 'top' || rect.bottom + GAP + cardH > vh) { left = rect.left; top = rect.top - GAP - cardH; }
  else { left = rect.left; top = rect.bottom + GAP; }
  return {
    left: Math.min(Math.max(12, left), vw - w - 12),
    top: Math.min(Math.max(12, top), vh - cardH - 12),
    w,
  };
}

export default function TourOverlay() {
  const { step, index, total, next, back, stop } = useTour();
  const rect = useTargetRect(step.target);
  const cardRef = useRef(null);
  const [cardH, setCardH] = useState(220);
  const [, force] = useState(0);

  useLayoutEffect(() => { if (cardRef.current) setCardH(cardRef.current.offsetHeight); }, [step, rect]);
  useEffect(() => {
    const on = () => force((n) => n + 1);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  // 'click' steps advance when the visitor clicks the highlighted element. Capture phase and a
  // deferred advance so their click still performs its normal job (open panel, start session).
  useEffect(() => {
    if (step.advance !== 'click' || !step.target) return undefined;
    const onClick = (e) => {
      const el = document.querySelector(step.target);
      if (el && el.contains(e.target)) setTimeout(next, 350);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [step, next]);

  const waiting = step.target && !rect;
  const pos = place(waiting ? null : rect, step.placement, cardH);
  const isLast = index === total - 1;
  const interactive = step.advance === 'click' || step.advance === 'route';

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-live="polite">
      {rect && !waiting ? (
        <div
          className="absolute rounded-lg ring-2 ring-accent transition-all duration-200"
          style={{
            left: rect.left - PAD, top: rect.top - PAD,
            width: rect.width + PAD * 2, height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.62), 0 0 24px rgba(204,255,0,0.35)',
          }}
        >
          {interactive && <span className="absolute inset-0 rounded-lg ring-2 ring-accent animate-ping" />}
        </div>
      ) : (
        <div className="absolute inset-0 bg-black/60" />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-label={step.title}
        className="absolute pointer-events-auto rounded-xl border border-accent/50 bg-bg-2 shadow-2xl shadow-black/70 p-6 transition-all duration-200"
        style={{ left: pos.left, top: pos.top, width: pos.w }}
      >
        <button onClick={stop} aria-label="End tour" className="absolute top-4 right-4 p-1 text-text-3 hover:text-text">
          <X className="w-5 h-5" />
        </button>
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">
          Step {index + 1} of {total}
        </div>
        <h3 className="font-heading text-xl font-bold text-text pr-8">{step.title}</h3>
        <p className="text-base text-text-2 leading-relaxed mt-2">
          {waiting ? 'Waiting for this part of the screen — try the previous step, or skip ahead.' : step.body}
        </p>
        {step.hint && !waiting && (
          <p className="mt-3 text-sm font-mono text-accent">👆 {step.hint}</p>
        )}
        <div className="flex items-center justify-between mt-6">
          <button onClick={stop} className="text-sm text-text-3 hover:text-text underline-offset-2 hover:underline">
            End tour
          </button>
          <div className="flex gap-2">
            {index > 0 && (
              <button onClick={back} className="px-4 py-2 rounded border border-border text-sm text-text-2 hover:text-text">Back</button>
            )}
            {(!interactive || waiting) && (
              <button onClick={isLast ? stop : next} className="px-5 py-2 rounded bg-accent text-black text-sm font-bold hover:opacity-90">
                {isLast ? 'Finish' : 'Next'}
              </button>
            )}
            {interactive && !waiting && (
              <button onClick={next} className="px-4 py-2 rounded border border-border text-sm text-text-3 hover:text-text">Skip</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
