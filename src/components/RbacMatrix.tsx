import React, { useState } from 'react';
import { Shield, ShieldAlert, Check, X, UserCheck, Lock } from 'lucide-react';
import { RoleId, RoleScope } from '../types';
import { playClick, playHover } from '../audio/soundEffects';

const ROLES: RoleScope[] = [
  {
    id: 'superadmin',
    name: 'SUPERADMIN',
    clearance: 'LEVEL 4 // FRANCHISE OWNER',
    badge: 'UNRESTRICTED ACCESS',
    summary: 'Complete executive authority. Global tariff configuration, multi-branch financial P&L rollups, and system audit logs.',
    permissions: [
      { feature: 'Global Tariff & Zone Pricing Configuration', allowed: true },
      { feature: 'End-of-Day (EOD) Audit Approval & Vault Override', allowed: true },
      { feature: 'Manual Receipt Voiding / Refund Sanction', allowed: true },
      { feature: 'Emergency Fleet Kill Switch & Remote Freeze', allowed: true },
      { feature: 'Cash Drawer Open Without Active Transaction', allowed: true, note: 'Requires 2FA SMS' },
      { feature: 'Staff Access Creation & Shift Reassignment', allowed: true },
      { feature: 'Direct Database Audit Log Inspection', allowed: true },
    ],
  },
  {
    id: 'manager',
    name: 'BRANCH MANAGER',
    clearance: 'LEVEL 3 // VENUE SUPERVISOR',
    badge: 'BRANCH ENFORCEMENT',
    summary: 'Local operational lead. Oversees shift handovers, inventory restocking, and customer dispute resolution.',
    permissions: [
      { feature: 'Global Tariff & Zone Pricing Configuration', allowed: false, note: 'Locked to Head Office' },
      { feature: 'End-of-Day (EOD) Audit Approval & Vault Override', allowed: true },
      { feature: 'Manual Receipt Voiding / Refund Sanction', allowed: true, note: 'Manager PIN required' },
      { feature: 'Emergency Fleet Kill Switch & Remote Freeze', allowed: true },
      { feature: 'Cash Drawer Open Without Active Transaction', allowed: false, note: 'Triggers audit flag' },
      { feature: 'Staff Access Creation & Shift Reassignment', allowed: true },
      { feature: 'Direct Database Audit Log Inspection', allowed: false },
    ],
  },
  {
    id: 'operator',
    name: 'FLOOR OPERATOR',
    clearance: 'LEVEL 2 // DESK CASHIER',
    badge: 'STRICT ZERO-TRUST',
    summary: 'Counter operator. Can start sessions, take UPI/cash payments, and print slips. Cannot alter pricing or delete records.',
    permissions: [
      { feature: 'Global Tariff & Zone Pricing Configuration', allowed: false },
      { feature: 'End-of-Day (EOD) Audit Approval & Vault Override', allowed: false, note: 'Can only submit counts' },
      { feature: 'Manual Receipt Voiding / Refund Sanction', allowed: false, note: 'Cannot delete bills' },
      { feature: 'Emergency Fleet Kill Switch & Remote Freeze', allowed: false, note: 'Individual PC only' },
      { feature: 'Cash Drawer Open Without Active Transaction', allowed: false, note: 'Hardware blocked' },
      { feature: 'Staff Access Creation & Shift Reassignment', allowed: false },
      { feature: 'Direct Database Audit Log Inspection', allowed: false },
    ],
  },
  {
    id: 'member',
    name: 'MEMBER GAMER',
    clearance: 'LEVEL 1 // VERIFIED GAMER',
    badge: 'SELF-SERVICE CLIENT',
    summary: 'Customer profile. Top up closed-loop wallet via UPI, order in-seat food, roam across venues, and view play history.',
    permissions: [
      { feature: 'Global Tariff & Zone Pricing Configuration', allowed: false },
      { feature: 'End-of-Day (EOD) Audit Approval & Vault Override', allowed: false },
      { feature: 'Manual Receipt Voiding / Refund Sanction', allowed: false },
      { feature: 'Emergency Fleet Kill Switch & Remote Freeze', allowed: false },
      { feature: 'Cash Drawer Open Without Active Transaction', allowed: false },
      { feature: 'Staff Access Creation & Shift Reassignment', allowed: false },
      { feature: 'In-Seat Steam-Style Food Ordering', allowed: true },
    ],
  },
];

export const RbacMatrix: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('superadmin');
  const activeRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];

  return (
    <section id="rbac" className="py-20 md:py-32 bg-[#060709] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="font-mono text-xs text-arena-lime uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-arena-lime" />
              <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase max-w-2xl leading-tight">
              ZERO-TRUST PERMISSION SCOPES
            </h2>
          </div>
          <div className="font-mono text-xs text-arena-muted max-w-sm">
            Cashiers can never void a bill, edit an hourly rate, or pop a cash drawer without cryptographic authorization.
          </div>
        </div>

        {/* Interactive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Role Switcher */}
          <div className="lg:col-span-4 space-y-3 font-mono">
            {ROLES.map(role => {
              const isActive = role.id === selectedRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    playClick();
                    setSelectedRoleId(role.id);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`w-full p-4 rounded-lg text-left border transition-all ${
                    isActive
                      ? 'bg-[#131623] border-arena-lime text-white shadow-lime-sm'
                      : 'bg-[#0A0B10] border-white/10 text-arena-muted hover:border-white/20 hover:text-white'
                  }`}
                  data-cursor="SCOPE"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-arena-lime font-bold">{role.clearance}</span>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-arena-lime' : 'bg-white/20'}`} />
                  </div>
                  <div className="font-display font-black text-base text-white">{role.name}</div>
                  <div className="text-[10px] text-arena-subtle mt-1">{role.badge}</div>
                </button>
              );
            })}

            <div className="p-4 bg-[#0E1018] border border-white/10 rounded-lg text-[11px] text-arena-muted">
              <div className="text-white font-bold mb-1">ROLE ARCHITECTURE NOTE:</div>
              <p className="font-sans leading-relaxed text-xs">
                Every permission check happens server-side in .NET 8 kernel via JWT cryptographic scopes. Even if a cashier inspects the frontend code, no unauthorized actions can be dispatched.
              </p>
            </div>
          </div>

          {/* Right: Permission Matrix Ledger */}
          <div className="lg:col-span-8 bg-[#0B0D14] border border-white/15 rounded-xl p-6 md:p-8 font-mono text-xs">
            
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-white/10 mb-6">
              <div>
                <div className="text-[10px] text-arena-lime uppercase font-bold">{activeRole.clearance}</div>
                <div className="font-display font-black text-2xl text-white mt-0.5">{activeRole.name}</div>
                <p className="text-arena-muted text-xs font-sans mt-1 max-w-xl">{activeRole.summary}</p>
              </div>
              <span className="px-3 py-1 bg-white/5 border border-white/15 text-white text-[11px] rounded font-bold">
                {activeRole.badge}
              </span>
            </div>

            {/* List of Permissions */}
            <div className="space-y-3">
              {activeRole.permissions.map((perm, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border flex items-center justify-between transition-colors ${
                    perm.allowed
                      ? 'bg-[#10131F] border-white/10 text-white'
                      : 'bg-black/40 border-white/5 text-arena-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      perm.allowed
                        ? 'bg-arena-lime text-black'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {perm.allowed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={perm.allowed ? 'font-medium' : 'line-through'}>
                      {perm.feature}
                    </span>
                  </div>

                  {perm.note && (
                    <span className="text-[10px] text-arena-lime bg-arena-lime/10 px-2 py-0.5 rounded border border-arena-lime/20 hidden sm:inline">
                      {perm.note}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Security Guarantee */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-arena-subtle">
              <div>TAMPER-RESISTANT LOGS SAVED TO IMMUTABLE CLUSTER</div>
              <div className="text-arena-lime">AUDIT STATUS: ZERO CASH DRIFT</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
