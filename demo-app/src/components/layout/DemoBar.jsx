import { RotateCcw, Repeat, ArrowUpRight } from 'lucide-react';

// Demo build only: a small floating control so visitors can always reset, change role,
// or get back to the marketing site. Everything runs on in-browser sample data.
export default function DemoBar() {
  const base = import.meta.env.BASE_URL;

  const switchRole = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('activeBranchId');
      sessionStorage.clear();
    } catch { /* storage blocked */ }
    window.location.href = base;
  };

  const btn = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-text-2 hover:text-text hover:bg-white/5 transition-colors';

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded-full bg-bg-2/95 backdrop-blur border border-border shadow-xl shadow-black/60 max-w-[calc(100vw-1rem)]">
      <span className="flex items-center gap-1.5 pr-2 mr-1 border-r border-border text-[11px] font-mono uppercase tracking-wider text-accent whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Live demo
        <span className="hidden sm:inline text-text-3 normal-case tracking-normal">· sample data</span>
      </span>
      <button onClick={() => window.location.reload()} className={btn} title="Reload with fresh sample data">
        <RotateCcw className="w-3 h-3" /> <span className="hidden sm:inline">Reset</span>
      </button>
      <button onClick={switchRole} className={btn} title="Choose a different role">
        <Repeat className="w-3 h-3" /> <span className="hidden sm:inline">Switch role</span>
      </button>
      <a href="/" className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-black text-[11px] font-mono font-bold uppercase tracking-wider hover:opacity-90 whitespace-nowrap">
        Get ArenaOS <ArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
}
