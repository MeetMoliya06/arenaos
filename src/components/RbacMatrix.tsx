import React, { useState } from 'react';
import { Shield, Check, X } from 'lucide-react';
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
    name: 'Branch manager',
    clearance: 'Level 3 · Venue supervisor',
    badge: 'Branch enforcement',
    summary: 'Local operational lead. Oversees shift handovers, inventory restocking, and customer dispute resolution.',
    permissions: [
      { feature: 'Global tariff & zone pricing configuration', allowed: false, note: 'Locked to head office' },
      { feature: 'End-of-day (EOD) audit approval & vault override', allowed: true },
      { feature: 'Manual receipt voiding / refund sanction', allowed: true, note: 'Manager PIN required' },
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

export const RbacMatrix: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('superadmin');
  const activeRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];

  return (
    <section id="rbac" className="py-10 md:py-16 bg-[#08080A] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs text-arena-lime mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Role-based access control</span>
            </div>
            <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white max-w-2xl leading-tight">
              Zero-trust permission scopes
            </h2>
          </div>
          <div className="text-sm text-arena-muted max-w-sm leading-relaxed">
            Cashiers can never void a bill, edit an hourly rate, or pop a cash drawer without cryptographic authorization.
          </div>
        </div>

        {/* Interactive Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Role Switcher */}
          <div className="lg:col-span-4 space-y-2">
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
                  className={`w-full p-3 rounded-lg text-left border transition-colors ${
                    isActive
                      ? 'bg-white/[0.04] border-arena-lime/60 text-white'
                      : 'bg-white/[0.01] border-white/10 text-arena-muted hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs text-arena-lime">{role.clearance}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-arena-lime' : 'bg-white/20'}`} />
                  </div>
                  <div className="font-semibold text-sm sm:text-base text-white">{role.name}</div>
                  <div className="text-xs text-arena-subtle mt-0.5">{role.badge}</div>
                </button>
              );
            })}

            <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-lg text-xs text-arena-muted">
              <div className="text-white font-medium mb-1">Role architecture note</div>
              <p className="leading-relaxed text-xs">
                Every permission check happens server-side in the .NET 8 kernel via JWT cryptographic scopes. Even if a cashier inspects the frontend code, no unauthorized actions can be dispatched.
              </p>
            </div>
          </div>

          {/* Right: Permission Matrix Ledger */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6">

            <div className="flex flex-wrap justify-between items-start gap-4 pb-3 border-b border-white/10 mb-4">
              <div>
                <div className="text-xs text-arena-lime">{activeRole.clearance}</div>
                <div className="font-semibold text-xl sm:text-2xl text-white mt-0.5">{activeRole.name}</div>
                <p className="text-arena-muted text-xs sm:text-sm mt-0.5 max-w-xl">{activeRole.summary}</p>
              </div>
              <span className="px-2.5 py-1 bg-white/5 border border-white/15 text-white text-xs rounded-md font-medium">
                {activeRole.badge}
              </span>
            </div>

            {/* List of Permissions */}
            <div className="space-y-2">
              {activeRole.permissions.map((perm, idx) => (
                <div
                  key={idx}
                  className={`py-2 px-3 rounded-md border flex items-center justify-between transition-colors ${
                    perm.allowed
                      ? 'bg-white/[0.03] border-white/10 text-white'
                      : 'bg-black/20 border-white/5 text-arena-subtle'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                      perm.allowed
                        ? 'bg-arena-lime text-black'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {perm.allowed ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className={`text-xs sm:text-sm ${perm.allowed ? '' : 'line-through'}`}>
                      {perm.feature}
                    </span>
                  </div>

                  {perm.note && (
                    <span className="text-[11px] text-arena-lime bg-arena-lime/10 px-2 py-0.5 rounded hidden sm:inline">
                      {perm.note}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Security Guarantee */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-arena-subtle">
              <div>Tamper-resistant logs saved to immutable cluster</div>
              <div className="text-arena-lime">Audit status: zero cash drift</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
