import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Monitor, Wallet, Utensils, KeySquare, Globe2,
  Lock, Unlock, ShieldCheck, Clock, Coffee,
  Sparkles, CheckCircle, FileText, Play, Pause
} from 'lucide-react';
import { playClick } from '../audio/soundEffects';

/* ─────────────────────────────────────────────
   SCENE DEFINITIONS
   Each scene is either:
     • type: 'animated' → code-driven animated mockup
     • type: 'video'    → placeholder for a real recording
   ───────────────────────────────────────────── */

interface SceneDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'animated' | 'video';
  /** If type === 'video', put your .mp4 / .webm / .gif URL here */
  videoSrc?: string;
  /** poster image for video scenes (shown before playback) */
  videoPoster?: string;
  durationMs: number;
}

const SCENES: SceneDef[] = [
  {
    id: 'pc-session',
    label: 'PC Sessions',
    icon: <Monitor className="w-3.5 h-3.5" />,
    type: 'animated',
    durationMs: 7000,
  },
  {
    id: 'wallet',
    label: 'Member Wallet',
    icon: <Wallet className="w-3.5 h-3.5" />,
    type: 'animated',
    durationMs: 6000,
  },
  {
    id: 'fnb',
    label: 'Food Orders',
    icon: <Utensils className="w-3.5 h-3.5" />,
    type: 'animated',
    durationMs: 7000,
  },
  {
    id: 'billing',
    label: 'Billing & Cash',
    icon: <KeySquare className="w-3.5 h-3.5" />,
    type: 'animated',
    durationMs: 6000,
  },
  {
    id: 'multi-branch',
    label: 'All Branches',
    icon: <Globe2 className="w-3.5 h-3.5" />,
    type: 'animated',
    durationMs: 6000,
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */

export const AppShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  const activeScene = SCENES[activeIdx];

  const goToScene = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setProgress(0);
      startTimeRef.current = Date.now();
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [activeIdx]);

  const nextScene = useCallback(() => {
    const next = (activeIdx + 1) % SCENES.length;
    goToScene(next);
  }, [activeIdx, goToScene]);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return;
    startTimeRef.current = Date.now() - (progress / 100) * activeScene.durationMs;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / activeScene.durationMs) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        nextScene();
      }
    }, 30);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIdx, isPaused, activeScene.durationMs, nextScene]);

  const handleTabClick = (idx: number) => {
    playClick();
    goToScene(idx);
  };

  const togglePause = () => {
    playClick();
    setIsPaused(p => !p);
  };

  return (
    <div className="relative group">
      {/* Ambient glow behind the window */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#CCFF00]/[0.05] via-transparent to-cyan-500/[0.03] rounded-3xl blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* ──── Window Chrome ──── */}
      <div className="relative bg-[#0C0D11] border border-white/[0.1] rounded-xl overflow-hidden shadow-[0_28px_70px_rgba(0,0,0,0.35),0_14px_32px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.04)]">
        
        {/* Title Bar */}
        <div className="relative flex items-center h-9 px-3 bg-[#111216] border-b border-white/[0.06] select-none">
          {/* macOS traffic lights */}
          <div className="flex items-center gap-1.5 mr-3">
            <span className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] ring-1 ring-black/10" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E] ring-1 ring-black/10" />
            <span className="w-[10px] h-[10px] rounded-full bg-[#28C840] ring-1 ring-black/10" />
          </div>

          {/* Center title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] text-[#6B6B77] font-medium tracking-wide truncate max-w-[200px]">
            ArenaOS — Live Demo
          </div>

          {/* Play/Pause */}
          <button
            onClick={togglePause}
            className="ml-auto p-1 rounded hover:bg-white/[0.06] text-[#6B6B77] hover:text-white transition-colors"
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        {/* ──── Scene Tab Bar with Progress Indicators ──── */}
        <div className="flex items-stretch bg-[#0E0F14] border-b border-white/[0.06] overflow-x-auto">
          {SCENES.map((scene, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={scene.id}
                onClick={() => handleTabClick(idx)}
                className={`relative flex-1 min-w-0 px-2.5 py-2 flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.04]'
                    : 'text-[#5C5C66] hover:text-[#8A8A93] hover:bg-white/[0.02]'
                }`}
              >
                <span className={isActive ? 'text-[#CCFF00]' : ''}>{scene.icon}</span>
                <span className="hidden sm:inline truncate">{scene.label}</span>

                {/* Progress bar under active tab */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06]">
                    <div
                      className="h-full bg-[#CCFF00] transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ──── Scene Viewport ──── */}
        <div className="relative min-h-[420px] md:min-h-[460px] bg-[#0A0B0E] overflow-hidden">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
            }`}
            style={{ transition: 'opacity 300ms ease, transform 300ms ease' }}
          >
            {activeScene.type === 'video' && activeScene.videoSrc ? (
              <VideoScene src={activeScene.videoSrc} poster={activeScene.videoPoster} />
            ) : (
              <AnimatedScene sceneId={activeScene.id} />
            )}
          </div>
        </div>

        {/* ──── Bottom Status Bar ──── */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0E0F14] border-t border-white/[0.06] text-[10px] text-[#5C5C66] font-mono select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span>INTERACTIVE DEMO</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{activeIdx + 1}/{SCENES.length}</span>
            <span className="hidden sm:inline">ArenaOS v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VIDEO SCENE (placeholder for real recordings)
   Drop your .mp4/.webm/.gif URL into the SCENES
   config above and they'll render here.
   ───────────────────────────────────────────── */

const VideoScene: React.FC<{ src: string; poster?: string }> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [src]);

  // Support for GIFs
  if (src.endsWith('.gif')) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0A0B0E]">
        <img src={src} alt="Demo" className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      className="w-full h-full object-contain bg-[#0A0B0E]"
    />
  );
};

/* ─────────────────────────────────────────────
   ANIMATED SCENES (code-driven mockups)
   Each renders a mini animated UI that simulates
   the real ArenaOS feature in action.
   ───────────────────────────────────────────── */

const AnimatedScene: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  switch (sceneId) {
    case 'pc-session':
      return <PCSessionScene />;
    case 'wallet':
      return <WalletScene />;
    case 'fnb':
      return <FnBScene />;
    case 'billing':
      return <BillingScene />;
    case 'multi-branch':
      return <MultiBranchScene />;
    default:
      return null;
  }
};

/* ═════════════════════════════════════════════
   SCENE 1: PC Session — Live Countdown
   ═════════════════════════════════════════════ */

const PCSessionScene: React.FC = () => {
  const [seconds, setSeconds] = useState(5412);
  const [isLocked, setIsLocked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isLocked) return;
    const iv = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [isLocked]);

  // Auto-demo: lock at 3s elapsed, unlock after 2s
  useEffect(() => {
    const t1 = setTimeout(() => {
      setIsLocked(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }, 3000);
    const t2 = setTimeout(() => {
      setIsLocked(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const formatTimer = (t: number) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-5 md:p-6 h-full flex flex-col">
      {/* Toast */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-[#181920] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono rounded shadow-lg animate-[fadeSlideIn_0.3s_ease]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isLocked ? 'Hardware Lock Engaged — KB/Mouse disabled' : 'Rig Unlocked — Session resumed'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <div className="text-[10px] font-mono text-[#5C5C66] uppercase tracking-widest">RIG 07 // ADAJAN ARENA</div>
          <div className="text-white text-sm font-semibold mt-0.5">VIP Booth · RTX 4080 · 360Hz</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-[#5C5C66]">GAMER</div>
          <div className="text-sm font-medium text-white flex items-center gap-1.5">
            Kabir_V
            <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-mono">VIP</span>
          </div>
        </div>
      </div>

      {/* Central Timer / Lock Display */}
      <div className="flex-1 flex items-center justify-center my-4">
        <div className="w-full p-6 rounded-xl bg-gradient-to-b from-[#121318] to-[#0E0F14] border border-white/[0.06] text-center relative overflow-hidden">
          {isLocked ? (
            <div className="py-2">
              <Lock className="w-10 h-10 text-rose-500 mx-auto mb-2 animate-bounce" />
              <div className="font-mono text-xl font-bold text-rose-400">SESSION EXPIRED & LOCKED</div>
              <p className="text-[11px] text-[#8A8A93] mt-1">Keyboard & mouse input disabled. Scan QR or ask cashier.</p>
            </div>
          ) : (
            <div>
              <div className="text-[10px] uppercase tracking-wider font-mono text-[#8A8A93] mb-1">Time Remaining</div>
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#CCFF00] tracking-tight tabular-nums drop-shadow-[0_0_20px_rgba(204,255,0,0.25)]">
                {formatTimer(seconds)}
              </div>
              <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[#8A8A93] mt-2">
                <span>Rate: ₹80/hr</span>
                <span>·</span>
                <span>Wallet: <strong className="text-white">₹480</strong></span>
              </div>
            </div>
          )}

          {/* Animated scan line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#CCFF00]/20 to-transparent animate-[scanline_3s_linear_infinite]" />
          </div>
        </div>
      </div>

      {/* Station Grid Mini */}
      <div className="grid grid-cols-6 gap-1 pt-3 border-t border-white/[0.08]">
        {Array.from({ length: 12 }).map((_, i) => {
          const isThis = i === 6;
          const occupied = [0, 1, 2, 4, 5, 6, 8, 10].includes(i);
          return (
            <div
              key={i}
              className={`h-6 rounded text-[8px] font-mono flex items-center justify-center border transition-colors ${
                isThis && isLocked
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : isThis
                  ? 'bg-[#CCFF00]/10 border-[#CCFF00]/40 text-[#CCFF00]'
                  : occupied
                  ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400/60'
                  : 'bg-white/[0.02] border-white/[0.06] text-[#5C5C66]'
              }`}
            >
              {(i + 1).toString().padStart(2, '0')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   SCENE 2: Member Wallet
   ═════════════════════════════════════════════ */

const WalletScene: React.FC = () => {
  const [balance, setBalance] = useState(480);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Auto-demo: recharge animation
  useEffect(() => {
    const t1 = setTimeout(() => setShowRecharge(true), 1500);
    const t2 = setTimeout(() => {
      setShowRecharge(false);
      setBalance(980);
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 2000);
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="p-5 md:p-6 h-full flex flex-col">
      {/* Confirm toast */}
      {showConfirm && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-[#181920] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono rounded shadow-lg animate-[fadeSlideIn_0.3s_ease]">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            ₹500 credited via UPI — bonus ₹50 added
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        {/* Wallet Card */}
        <div className="relative bg-gradient-to-br from-[#141518] to-[#0D0E12] border border-white/[0.08] rounded-xl p-5 overflow-hidden">
          {/* Decorative mesh */}
          <div className="absolute inset-0 bg-tech-dots opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="text-[10px] font-mono text-[#5C5C66] uppercase tracking-widest">MEMBER WALLET</div>
                <div className="text-sm text-white font-medium mt-1">@shadow_operator</div>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-mono rounded border border-amber-500/20">
                VIP TIER
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <div className="text-[10px] text-[#5C5C66]">Gaming Balance</div>
                <div className={`text-2xl font-bold tabular-nums mt-1 transition-all duration-500 ${showConfirm ? 'text-[#CCFF00] scale-105' : 'text-white'}`}>
                  ₹{balance}
                </div>
              </div>
              <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <div className="text-[10px] text-[#5C5C66]">Food Balance</div>
                <div className="text-2xl font-bold text-white tabular-nums mt-1">₹320</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#8A8A93]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#CCFF00]" />
                1,240 loyalty points
              </span>
              <span>·</span>
              <span>Works at all 4 branches</span>
            </div>
          </div>

          {/* Recharge overlay animation */}
          {showRecharge && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 animate-[fadeSlideIn_0.3s_ease]">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#CCFF00] animate-pulse" />
                </div>
                <div className="text-white font-medium text-sm">Processing UPI Recharge...</div>
                <div className="text-[#8A8A93] text-xs mt-1">₹500 + ₹50 bonus</div>
                <div className="mt-3 w-32 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-[#CCFF00] rounded-full animate-[progressFill_2s_ease_forwards]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction log */}
        <div className="mt-4 space-y-1.5">
          {[
            { label: 'UPI Recharge', amount: '+₹500', time: 'Just now', accent: true },
            { label: 'PC Session (2.5h)', amount: '-₹200', time: '2m ago', accent: false },
            { label: 'Red Bull (Ice)', amount: '-₹120', time: '15m ago', accent: false },
          ].map((tx, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-[11px] transition-all ${
                i === 0 && showConfirm
                  ? 'bg-[#CCFF00]/[0.06] border-[#CCFF00]/20'
                  : 'bg-white/[0.02] border-white/[0.06]'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-[#8A8A93]">{tx.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#5C5C66]">{tx.time}</span>
                <span className={`font-mono font-medium ${tx.accent ? 'text-[#CCFF00]' : 'text-white'}`}>
                  {tx.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   SCENE 3: Food & Beverage Orders
   ═════════════════════════════════════════════ */

const FnBScene: React.FC = () => {
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [kitchenStatus, setKitchenStatus] = useState<'idle' | 'sent' | 'preparing' | 'ready'>('idle');

  // Auto-demo: add items then send to kitchen
  useEffect(() => {
    const t1 = setTimeout(() => setOrderItems(['Monster Energy']), 1000);
    const t2 = setTimeout(() => setOrderItems(['Monster Energy', 'Cheese Maggi']), 2000);
    const t3 = setTimeout(() => setOrderItems(['Monster Energy', 'Cheese Maggi', 'Peri Nachos']), 3000);
    const t4 = setTimeout(() => setKitchenStatus('sent'), 4000);
    const t5 = setTimeout(() => setKitchenStatus('preparing'), 5000);
    const t6 = setTimeout(() => setKitchenStatus('ready'), 6500);
    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout); };
  }, []);

  const menuItems = [
    { name: 'Monster Energy', price: '₹150', cat: 'Cold drink', emoji: '⚡' },
    { name: 'Cheese Maggi', price: '₹70', cat: 'Snacks', emoji: '🍜' },
    { name: 'Peri Nachos', price: '₹90', cat: 'Snacks', emoji: '🌶️' },
    { name: 'Cold Brew Coffee', price: '₹120', cat: 'Drinks', emoji: '☕' },
  ];

  return (
    <div className="p-5 md:p-6 h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Menu */}
        <div className="md:col-span-7 space-y-2">
          <div className="text-[10px] font-mono text-[#5C5C66] uppercase tracking-widest mb-2">IN-SEAT MENU · PC 09</div>
          {menuItems.map((item, i) => {
            const isOrdered = orderItems.includes(item.name);
            return (
              <div
                key={i}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${
                  isOrdered
                    ? 'bg-[#CCFF00]/[0.05] border-[#CCFF00]/20'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.emoji}</span>
                  <div>
                    <div className="text-white text-xs font-medium">{item.name}</div>
                    <div className="text-[10px] text-[#5C5C66]">{item.cat}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A8A93] font-mono">{item.price}</span>
                  {isOrdered && (
                    <span className="w-4 h-4 rounded-full bg-[#CCFF00] flex items-center justify-center animate-[scaleIn_0.3s_ease]">
                      <CheckCircle className="w-3 h-3 text-black" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kitchen Ticket */}
        <div className="md:col-span-5 bg-[#111114] border border-white/[0.08] rounded-xl p-4 flex flex-col">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.06] mb-3">
            <span className="text-white font-medium text-xs">Order #418</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              kitchenStatus === 'ready'
                ? 'bg-[#CCFF00]/10 text-[#CCFF00]'
                : kitchenStatus === 'preparing'
                ? 'bg-amber-500/10 text-amber-400'
                : kitchenStatus === 'sent'
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'bg-white/[0.06] text-[#5C5C66]'
            }`}>
              {kitchenStatus === 'ready' ? '✓ READY' : kitchenStatus === 'preparing' ? '🔥 COOKING' : kitchenStatus === 'sent' ? '→ SENT' : 'DRAFT'}
            </span>
          </div>

          <div className="flex-1">
            {orderItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#5C5C66] text-xs">
                Waiting for order...
              </div>
            ) : (
              <div className="space-y-2">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs animate-[fadeSlideIn_0.3s_ease]">
                    <span className="text-[#8A8A93]">1x {item}</span>
                    <span className="text-white font-mono">
                      {menuItems.find(m => m.name === item)?.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status progress */}
          {kitchenStatus !== 'idle' && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                {['sent', 'preparing', 'ready'].map((step, i) => {
                  const stepIdx = ['sent', 'preparing', 'ready'].indexOf(kitchenStatus);
                  const isDone = i <= stepIdx;
                  return (
                    <React.Fragment key={step}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-mono transition-colors ${
                        isDone ? 'bg-[#CCFF00] text-black' : 'bg-white/[0.06] text-[#5C5C66]'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      {i < 2 && (
                        <div className={`flex-1 h-px ${isDone && i < stepIdx ? 'bg-[#CCFF00]' : 'bg-white/[0.06]'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="flex justify-between text-[9px] text-[#5C5C66] mt-1">
                <span>Sent</span>
                <span>Cooking</span>
                <span>Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   SCENE 4: Billing & Cash Register
   ═════════════════════════════════════════════ */

const BillingScene: React.FC = () => {
  const [paymentStep, setPaymentStep] = useState<'review' | 'split' | 'done'>('review');

  useEffect(() => {
    const t1 = setTimeout(() => setPaymentStep('split'), 2500);
    const t2 = setTimeout(() => setPaymentStep('done'), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="p-5 md:p-6 h-full flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bill Details */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium text-xs">Bill #AR-2026-8941</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#CCFF00]/10 text-[#CCFF00] font-mono">
              PC 07 · VIP
            </span>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg space-y-2.5 text-xs">
            {[
              { label: 'VIP Gaming (3.5 hrs)', value: '₹280' },
              { label: 'Monster Energy (1)', value: '₹150' },
              { label: 'Loaded Nachos (1)', value: '₹90' },
              { label: 'GST @18%', value: '₹93.60' },
            ].map((line, i) => (
              <div key={i} className="flex justify-between text-[#8A8A93]">
                <span>{line.label}</span>
                <span className="text-white font-mono">{line.value}</span>
              </div>
            ))}
            <div className="pt-2.5 border-t border-white/[0.08] flex justify-between font-medium">
              <span className="text-white">Total</span>
              <span className="text-[#CCFF00] font-mono text-sm">₹613.60</span>
            </div>
          </div>

          {/* Payment method animation */}
          <div className={`p-3 rounded-lg border transition-all duration-500 ${
            paymentStep === 'done'
              ? 'bg-[#CCFF00]/[0.06] border-[#CCFF00]/30'
              : paymentStep === 'split'
              ? 'bg-cyan-500/[0.05] border-cyan-500/20'
              : 'bg-white/[0.02] border-white/[0.06]'
          }`}>
            <div className="text-[10px] text-[#5C5C66] mb-2">PAYMENT METHOD</div>
            {paymentStep === 'review' && (
              <div className="text-xs text-[#8A8A93]">Calculating bill...</div>
            )}
            {paymentStep === 'split' && (
              <div className="space-y-1.5 animate-[fadeSlideIn_0.3s_ease]">
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-400">Cash</span>
                  <span className="text-white font-mono">₹300</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-400">UPI (PhonePe)</span>
                  <span className="text-white font-mono">₹313.60</span>
                </div>
              </div>
            )}
            {paymentStep === 'done' && (
              <div className="flex items-center gap-2 text-[#CCFF00] text-xs animate-[fadeSlideIn_0.3s_ease]">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">PAID — Receipt #TX9842 printed</span>
              </div>
            )}
          </div>
        </div>

        {/* Thermal Receipt */}
        <div className="md:col-span-5">
          <div className={`bg-[#F4F4F2] text-black font-mono text-[9px] p-3.5 rounded-lg select-none transition-all duration-500 ${
            paymentStep === 'done' ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
          }`}>
            <div className="text-center font-bold text-[10px] pb-1 border-b border-black/15">
              *** APPLE ESPORTS · ADAJAN ***
            </div>
            <div className="text-center text-[8px] text-neutral-500 pb-1">SURAT</div>
            <div className="flex justify-between pt-1">
              <span>DATE: 12-SEP-2026 21:40</span>
              <span>PC: #07</span>
            </div>
            <div className="flex justify-between">
              <span>OPERATOR: RAHUL_S</span>
              <span>TX: #9842</span>
            </div>
            <div className="border-b border-dashed border-black/30 my-1" />
            <div className="flex justify-between font-bold">
              <span>ITEM</span><span>AMT</span>
            </div>
            <div className="flex justify-between"><span>PC TIME (210 MIN)</span><span>₹280</span></div>
            <div className="flex justify-between"><span>MONSTER ENERGY</span><span>₹150</span></div>
            <div className="flex justify-between"><span>LOADED NACHOS</span><span>₹90</span></div>
            <div className="flex justify-between"><span>GST @18%</span><span>₹93.60</span></div>
            <div className="border-b border-dashed border-black/30 my-1" />
            <div className="flex justify-between font-bold text-[10px]">
              <span>TOTAL:</span><span>₹613.60</span>
            </div>
            <div className="flex justify-between font-bold text-[10px] mt-0.5">
              <span>STATUS:</span><span>PAID ✓</span>
            </div>
            <div className="text-center text-[7px] text-neutral-500 pt-2">POWERED BY ARENAOS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════
   SCENE 5: Multi-Branch Overview
   ═════════════════════════════════════════════ */

const MultiBranchScene: React.FC = () => {
  const [activeBranch, setActiveBranch] = useState(0);
  const [syncPulse, setSyncPulse] = useState(false);

  const branches = [
    { name: 'Varachha', rigs: 80, active: 77, occ: 96, ping: '4ms', color: 'text-[#CCFF00]' },
    { name: 'Adajan', rigs: 65, active: 60, occ: 92, ping: '4ms', color: 'text-cyan-400' },
    { name: 'Citylight', rigs: 50, active: 44, occ: 88, ping: '5ms', color: 'text-amber-400' },
    { name: 'Katargam', rigs: 55, active: 52, occ: 94, ping: '6ms', color: 'text-emerald-400' },
  ];

  // Auto-cycle branches
  useEffect(() => {
    const iv = setInterval(() => setActiveBranch(p => (p + 1) % 4), 1500);
    return () => clearInterval(iv);
  }, []);

  // Sync pulse
  useEffect(() => {
    const t = setTimeout(() => {
      setSyncPulse(true);
      setTimeout(() => setSyncPulse(false), 1500);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-5 md:p-6 h-full flex flex-col">
      {/* Sync toast */}
      {syncPulse && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-[#181920] border border-[#CCFF00] text-[#CCFF00] text-xs font-mono rounded shadow-lg animate-[fadeSlideIn_0.3s_ease]">
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" />
            All 4 branches synced — 250 rigs online
          </span>
        </div>
      )}

      <div className="text-[10px] font-mono text-[#5C5C66] uppercase tracking-widest mb-3">HEAD OFFICE DASHBOARD</div>

      {/* Branch Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {branches.map((b, i) => (
          <div
            key={i}
            className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer ${
              i === activeBranch
                ? 'bg-white/[0.04] border-white/[0.15] ring-1 ring-[#CCFF00]/20'
                : 'bg-white/[0.01] border-white/[0.06] hover:border-white/[0.12]'
            }`}
            onClick={() => setActiveBranch(i)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-xs font-medium">{b.name}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${i === activeBranch ? 'bg-[#CCFF00] animate-pulse' : 'bg-white/20'}`} />
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-[#5C5C66]">{b.active}/{b.rigs} PCs</span>
              <span className={b.color}>{b.occ}%</span>
            </div>
            {/* Mini occupancy bar */}
            <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  i === activeBranch ? 'bg-[#CCFF00]' : 'bg-white/20'
                }`}
                style={{ width: `${b.occ}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Active branch detail */}
      <div className="flex-1 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="text-[#CCFF00] text-xs font-medium">{branches[activeBranch].name} Arena</div>
            <div className="text-white text-lg font-semibold mt-0.5">
              {branches[activeBranch].active} PCs Active
            </div>
          </div>
          <div className="text-right text-[10px] text-[#5C5C66] font-mono">
            <div>PING: <span className="text-[#CCFF00]">{branches[activeBranch].ping}</span></div>
            <div>OFFLINE: <span className="text-[#CCFF00]">Ready</span></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-[10px]">
          <div>
            <div className="text-[#5C5C66]">Shift Cash</div>
            <div className="text-white font-mono font-medium">₹14,280</div>
          </div>
          <div>
            <div className="text-[#5C5C66]">Variance</div>
            <div className="text-[#CCFF00] font-mono font-medium">₹0.00</div>
          </div>
          <div>
            <div className="text-[#5C5C66]">F&B Orders</div>
            <div className="text-white font-mono font-medium">42 today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
