import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MonitorStop, Shield, ShieldAlert, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { DEMO_USERS } from '../../mock/seed';
import { armTour } from '../../components/tour/TourContext';

// Demo build: one-click entry. No credentials — pick a role and land inside the real product UI,
// running on seeded data entirely in the browser.
const ROLES = [
  {
    id: 'operator', title: 'OPERATOR', user: DEMO_USERS.operator,
    description: 'Run the counter: start sessions, take payments, order food, manage the cash drawer.',
    badge: 'Start here', icon: MonitorStop,
  },
  {
    id: 'admin', title: 'ADMIN', user: DEMO_USERS.admin,
    description: 'Branch manager view: dashboard, members & wallets, menu, reports and PC status.',
    icon: Shield,
  },
  {
    id: 'superadmin', title: 'SUPER ADMIN', user: DEMO_USERS.superadmin,
    description: 'Owner view across all 4 branches: switch branches, audit trail, pricing and settings.',
    icon: ShieldAlert,
  },
];

export default function LandingGatewayPage() {
  const navigate = useNavigate();
  const [pendingRole, setPendingRole] = useState(null); // role waiting on the "guided tour?" answer

  const enter = (role, guided) => {
    try {
      if (guided) armTour(); else sessionStorage.removeItem('arenaos_tour');
      localStorage.setItem('user', JSON.stringify(role.user));
      if (role.id === 'superadmin') localStorage.removeItem('activeBranchId');
      else localStorage.setItem('activeBranchId', role.user.branchId);
      sessionStorage.setItem(`shift_start_done_${role.user.id || role.user.username}`, 'true');
    } catch { /* storage blocked — the app will simply show the portal again */ }
    // Full navigation so AuthContext boots with the new user.
    window.location.href = `${import.meta.env.BASE_URL}app/${role.id === 'operator' ? 'sessions' : 'dashboard'}`;
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full">
        <a href="/" className="inline-flex items-center gap-2 text-text-2 hover:text-text text-sm font-mono mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to ArenaOS
        </a>

        <div className="text-center mb-12">
          <motion.img
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
            src={`${import.meta.env.BASE_URL}logo.png`} alt="ArenaOS"
            className="h-20 w-auto mx-auto mb-5 drop-shadow-[0_0_15px_rgba(204, 255, 0,0.5)]"
          />
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-bold tracking-wide text-text mb-3">
            LIVE PRODUCT DEMO
          </motion.h1>
          <p className="text-text-2 max-w-xl mx-auto text-sm leading-relaxed">
            This is the real ERP running a gaming café chain in Surat — 4 branches, 100+ stations — loaded with sample data.
            Pick a role and click around. Nothing is saved; refresh to reset.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.03, translateY: -5 }} whileTap={{ scale: 0.97 }}
              onClick={() => setPendingRole(role)}
              className="card group relative flex flex-col items-center text-center p-8 bg-bg-2/80 backdrop-blur-xl border-border/60 shadow-xl shadow-black/50 hover:border-accent hover:shadow-[0_0_20px_rgba(204, 255, 0,0.15)] cursor-pointer transition-all duration-300"
            >
              {role.badge && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/40 rounded-full px-2 py-0.5">
                  <Sparkles className="w-3 h-3" /> {role.badge}
                </span>
              )}
              <role.icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="font-heading text-xl font-bold text-text mb-3 tracking-wider">{role.title}</h2>
              <p className="text-text-2 text-sm leading-relaxed">{role.description}</p>
              <span className="mt-5 text-xs font-mono uppercase tracking-widest text-accent">Enter demo →</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {pendingRole && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-sm"
            onClick={() => setPendingRole(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              role="dialog" aria-label="Guided tour"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-accent/40 bg-bg-2 p-8 text-center shadow-2xl shadow-black/70"
            >
              <Compass className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-text mb-2">Want a guided tour?</h2>
              <p className="text-text-2 text-base leading-relaxed mb-7">
                We'll walk you through the {pendingRole.title.toLowerCase()} view step by step and show you where to click.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => enter(pendingRole, true)}
                  className="flex-1 py-3 rounded-lg bg-accent text-black font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Yes, guide me
                </button>
                <button
                  onClick={() => enter(pendingRole, false)}
                  className="flex-1 py-3 rounded-lg border border-border text-text-2 hover:text-text hover:border-text-3 font-semibold text-sm uppercase tracking-wider transition-colors"
                >
                  No, I'll explore
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
