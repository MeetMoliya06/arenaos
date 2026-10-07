import React, { useState, useEffect, useRef } from 'react';
import { Shield, Check, X, Lock, Unlock, Tag, FileCheck2, ReceiptText, Snowflake, Banknote, Users, ScrollText, Utensils } from 'lucide-react';
import { RoleId, RoleScope } from '../types';
import { playClick, playHover } from '../audio/soundEffects';

const ROLES: RoleScope[] = [
  {
    id: 'superadmin',
    name: 'Superadmin',
    clearance: 'Level 4 · Franchise owner',
    badge: 'Unrestricted access',
    summary: 'Complete executive authority. Global tariff configuration, multi-branch financial P&L rollups, and system audit logs.',
    permissions: [
      { feature: 'Global tariff & zone pricing configuration', allowed: true },
      { feature: 'End-of-day (EOD) audit approval & vault override', allowed: true },
      { feature: 'Manual receipt voiding / refund sanction', allowed: true },
      { feature: 'Emergency fleet kill switch & remote freeze', allowed: true },
      { feature: 'Cash drawer open without active transaction', allowed: true, note: 'Requires 2FA SMS' },
      { feature: 'Staff access creation & shift reassignment', allowed: true },
      { feature: 'Direct database audit log inspection', allowed: true },
    ],
  },
  {
    id: 'manager',
    name: 'Admin',
    clearance: 'Level 3 · Venue supervisor',
    badge: 'Branch enforcement',
    summary: 'Local operational lead. Oversees shift handovers, inventory restocking, and customer dispute resolution.',
    permissions: [
      { feature: 'Global tariff & zone pricing configuration', allowed: false, note: 'Locked to head office' },
      { feature: 'End-of-day (EOD) audit approval & vault override', allowed: true },
      { feature: 'Manual receipt voiding / refund sanction', allowed: true, note: 'Admin PIN required' },
      { feature: 'Emergency fleet kill switch & remote freeze', allowed: true },
      { feature: 'Cash drawer open without active transaction', allowed: false, note: 'Triggers audit flag' },
      { feature: 'Staff access creation & shift reassignment', allowed: true },
      { feature: 'Direct database audit log inspection', allowed: false },
    ],
  },
  {
    id: 'operator',
    name: 'Floor operator',
    clearance: 'Level 2 · Desk cashier',
    badge: 'Strict zero-trust',
    summary: 'Counter operator. Can start sessions, take UPI/cash payments, and print slips. Cannot alter pricing or delete records.',
    permissions: [
      { feature: 'Global tariff & zone pricing configuration', allowed: false },
      { feature: 'End-of-day (EOD) audit approval & vault override', allowed: false, note: 'Can only submit counts' },
      { feature: 'Manual receipt voiding / refund sanction', allowed: false, note: 'Cannot delete bills' },
      { feature: 'Emergency fleet kill switch & remote freeze', allowed: false, note: 'Individual PC only' },
      { feature: 'Cash drawer open without active transaction', allowed: false, note: 'Hardware blocked' },
      { feature: 'Staff access creation & shift reassignment', allowed: false },
      { feature: 'Direct database audit log inspection', allowed: false },
    ],
  },
  {
    id: 'member',
    name: 'Member gamer',
    clearance: 'Level 1 · Verified gamer',
    badge: 'Self-service client',
    summary: 'Customer profile. Top up closed-loop wallet via UPI, order in-seat food, roam across venues, and view play history.',
    permissions: [
      { feature: 'Global tariff & zone pricing configuration', allowed: false },
      { feature: 'End-of-day (EOD) audit approval & vault override', allowed: false },
      { feature: 'Manual receipt voiding / refund sanction', allowed: false },
      { feature: 'Emergency fleet kill switch & remote freeze', allowed: false },
      { feature: 'Cash drawer open without active transaction', allowed: false },
      { feature: 'Staff access creation & shift reassignment', allowed: false },
      { feature: 'In-seat food ordering', allowed: true },
    ],
  },
];

const ACTIONS: Record<string, { label: string; icon: React.ReactNode }> = {
  'Global tariff & zone pricing configuration': { label: 'Change prices', icon: <Tag className="w-5 h-5" /> },
  'End-of-day (EOD) audit approval & vault override': { label: 'Approve day-end', icon: <FileCheck2 className="w-5 h-5" /> },
  'Manual receipt voiding / refund sanction': { label: 'Void a bill', icon: <ReceiptText className="w-5 h-5" /> },
  'Emergency fleet kill switch & remote freeze': { label: 'Freeze all PCs', icon: <Snowflake className="w-5 h-5" /> },
  'Cash drawer open without active transaction': { label: 'Open cash drawer', icon: <Banknote className="w-5 h-5" /> },
  'Staff access creation & shift reassignment': { label: 'Manage staff', icon: <Users className="w-5 h-5" /> },
  'Direct database audit log inspection': { label: 'Read audit logs', icon: <ScrollText className="w-5 h-5" /> },
  'In-seat food ordering': { label: 'Order food', icon: <Utensils className="w-5 h-5" /> },
};

interface LogLine { id: number; text: string; ok: boolean }

export const RbacMatrix: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('operator');
  const [log, setLog] = useState<LogLine[]>([]);
  const [tried, setTried] = useState<number | null>(null);
  const [flash, setFlash] = useState<{ i: number; ok: boolean; k: number } | null>(null);
  const [counts, setCounts] = useState({ ok: 0, no: 0 });
  const [paused, setPaused] = useState(false);
  const stepRef = useRef(0);
  const activeRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];
  const allowedCount = activeRole.permissions.filter(p => p.allowed).length;

  // fresh log when switching role
  useEffect(() => {
    setLog([]);
    setTried(null);
    setFlash(null);
    setCounts({ ok: 0, no: 0 });
    stepRef.current = 0;
  }, [selectedRoleId]);

  // Auto demo: try a few actions as this role, then move to the next role
  useEffect(() => {
    if (paused) return;
    const seq = [0, 2, 4, 6];
    const order = [...ROLES].reverse().map(r => r.id);
    const iv = setInterval(() => {
      const st = stepRef.current;
      if (st < seq.length) {
        attempt(seq[st], true);
        stepRef.current = st + 1;
      } else {
        const next = order[(order.indexOf(selectedRoleId) + 1) % order.length];
        setSelectedRoleId(next);
      }
    }, 750);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId, paused]);

  const attempt = (i: number, auto = false) => {
    const perm = activeRole.permissions[i];
    const label = ACTIONS[perm.feature]?.label ?? perm.feature;
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const who = activeRole.id === 'operator' ? 'rahul_s' : activeRole.id === 'member' ? 'kabir_v' : activeRole.id === 'manager' ? 'priya_m' : 'owner';
    const text = perm.allowed
      ? `${time}  ${who} · ${label} · approved${perm.note ? ` (${perm.note.toLowerCase()})` : ''}`
      : `${time}  ${who} · ${label} · blocked${perm.note ? ` (${perm.note.toLowerCase()})` : ''}. Logged.`;
    if (!auto) playClick();
    setTried(i);
    setFlash({ i, ok: perm.allowed, k: Date.now() });
    setCounts(c => (perm.allowed ? { ...c, ok: c.ok + 1 } : { ...c, no: c.no + 1 }));
    setLog(l => [{ id: Date.now(), text, ok: perm.allowed }, ...l].slice(0, 3));
  };

  return (
    <section id="rbac" className="min-h-screen flex items-center pt-20 pb-8 bg-[#08080A] border-t border-white/10 relative overflow-hidden">
      <style>{`
        @keyframes rbFlip { from { opacity: 0; transform: perspective(500px) rotateX(-40deg) translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes rbShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        @keyframes rbStamp { 0% { opacity: 0; transform: scale(1.4); } 18% { opacity: 1; transform: scale(1); } 75% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes rbRing { 0% { box-shadow: 0 0 0 0 var(--rb-c); } 100% { box-shadow: 0 0 0 14px transparent; } }
        @keyframes rbScan { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes rbIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="max-w-5xl w-full mx-auto px-4 md:px-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="text-center max-w-2xl mx-auto mb-5">
          <div className="text-xs text-arena-lime mb-2 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Who can do what</span>
          </div>
          <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight text-white leading-tight">
            Give staff a job, not the keys.
          </h2>
          <p className="text-arena-muted text-sm mt-2">
            Pick a role, then try to do something. A cashier can't cancel a bill, change a rate or open the drawer without approval.
          </p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
          {[...ROLES].reverse().map(role => {
            const active = role.id === selectedRoleId;
            const level = Number(role.clearance.match(/\d/)?.[0] ?? 1);
            return (
              <button
                key={role.id}
                onClick={() => { playClick(); setSelectedRoleId(role.id); }}
                onMouseEnter={() => playHover()}
                className={`relative overflow-hidden p-3 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-[#CCFF00]/[0.07] border-[#CCFF00]/50 shadow-[0_0_28px_rgba(204,255,0,0.08)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map(n => (
                    <span key={n} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <span
                        className={`block h-full rounded-full origin-left transition-transform duration-300 ${active ? 'bg-[#CCFF00]' : 'bg-white/40'}`}
                        style={{ transform: n <= level ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${active ? n * 60 : 0}ms` }}
                      />
                    </span>
                  ))}
                </div>
                <div className={`font-semibold text-sm ${active ? 'text-white' : 'text-[#B4B4BB]'}`}>{role.name}</div>
                <div className="text-[11px] text-arena-subtle mt-0.5">{role.clearance.split('·')[1]?.trim()}</div>
                {active && !paused && (
                  <span key={selectedRoleId} className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#CCFF00]/10 to-transparent pointer-events-none" style={{ animation: 'rbScan 0.8s ease-out' }} />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-xs sm:text-sm text-arena-muted sm:min-h-[20px]">
            <span className="text-white font-medium">{activeRole.name}:</span> {activeRole.summary}
          </p>
          <span className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-arena-subtle shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-white/30' : 'bg-[#CCFF00] animate-pulse'}`} />
            {paused ? 'Paused' : 'Live demo'}
          </span>
        </div>

        {/* Action tiles */}
        <div key={selectedRoleId} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {activeRole.permissions.map((perm, i) => {
            const meta = ACTIONS[perm.feature] ?? { label: perm.feature, icon: <Shield className="w-5 h-5" /> };
            const isTried = tried === i;
            return (
              <button
                key={perm.feature}
                onClick={() => attempt(i)}
                className={`relative p-3 rounded-xl border text-left flex flex-col gap-2 transition-colors ${
                  perm.allowed
                    ? 'bg-[#CCFF00]/[0.05] border-[#CCFF00]/30 hover:bg-[#CCFF00]/[0.09]'
                    : 'bg-white/[0.015] border-white/[0.08] hover:border-rose-500/40'
                }`}
                style={{
                  animation: `rbFlip 300ms ease ${i * 35}ms backwards${isTried && !perm.allowed ? ', rbShake 220ms ease' : ''}`,
                }}
              >
                {flash?.i === i && (
                  <>
                    <span key={`r${flash.k}`} className="absolute inset-0 rounded-xl pointer-events-none" style={{ ['--rb-c' as string]: flash.ok ? 'rgba(204,255,0,0.5)' : 'rgba(244,63,94,0.5)', animation: 'rbRing 500ms ease-out' }} />
                    <span
                      key={`s${flash.k}`}
                      className={`absolute inset-0 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold tracking-wider backdrop-blur-[2px] pointer-events-none ${flash.ok ? 'bg-[#0B1000]/85 text-[#CCFF00]' : 'bg-[#16060A]/85 text-rose-400'}`}
                      style={{ animation: 'rbStamp 650ms ease forwards' }}
                    >
                      {flash.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {flash.ok ? 'APPROVED' : 'DENIED'}
                    </span>
                  </>
                )}
                <div className="flex items-start justify-between">
                  <span className={perm.allowed ? 'text-[#CCFF00]' : 'text-[#5C5C66]'}>{meta.icon}</span>
                  {perm.allowed ? <Unlock className="w-3.5 h-3.5 text-[#CCFF00]" /> : <Lock className="w-3.5 h-3.5 text-rose-400/80" />}
                </div>
                <div>
                  <div className={`text-sm font-medium ${perm.allowed ? 'text-white' : 'text-[#6B6B77]'}`}>{meta.label}</div>
                  <div className="text-[11px] mt-0.5 text-arena-subtle min-h-[16px]">{perm.note ?? (perm.allowed ? 'Allowed' : 'Not allowed')}</div>
                </div>
              </button>
            );
          })}
          {activeRole.permissions.length % 4 !== 0 && (
            <div className="rounded-xl border border-white/10 bg-[#0C0D11] p-3 flex flex-col justify-between">
              <div className="text-[10px] font-mono uppercase tracking-widest text-arena-subtle">Attempts</div>
              <div className="flex items-end gap-4 mt-1">
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-[#CCFF00]">{counts.ok}</div>
                  <div className="text-[11px] text-arena-subtle">approved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-rose-400">{counts.no}</div>
                  <div className="text-[11px] text-arena-subtle">blocked</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audit trail */}
        <div className="mt-4 rounded-xl border border-white/10 bg-[#0C0D11] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0E0F14] border-b border-white/[0.06] text-xs">
            <span className="text-arena-muted font-mono">Audit trail</span>
            <span className="text-arena-subtle">{allowedCount} of {activeRole.permissions.length} actions open to this role</span>
          </div>
          <div className="p-3 font-mono text-xs space-y-1 min-h-[84px]">
            {log.length === 0 ? (
              <div className="text-arena-subtle">Watch the demo, or tap a tile to try it yourself. Every attempt is written here, allowed or not.</div>
            ) : (
              log.map(l => (
                <div key={l.id} className={l.ok ? 'text-[#CCFF00]' : 'text-rose-400'} style={{ animation: 'rbIn 250ms ease' }}>
                  {l.ok ? '✓' : '✕'} {l.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
