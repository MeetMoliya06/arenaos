import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, ChevronRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

/* ─────────────── ArenaOS Module Definitions ─────────────── */

interface Module {
  id: string;
  label: string;
  description: string;
}

const MODULES: Module[] = [
  { id: 'pc-sessions', label: 'PC Sessions', description: 'Timer, lock & session management for gaming PCs' },
  { id: 'member-wallet', label: 'Member Wallet', description: 'Closed-loop gaming & food wallet with loyalty' },
  { id: 'food-orders', label: 'Food & Beverage', description: 'In-seat ordering, kitchen display & stock tracking' },
  { id: 'billing-cash', label: 'Billing & Cash', description: 'Automated billing with multi-payment & audit trail' },
  { id: 'eod-audit', label: 'Shift & EOD Audit', description: 'Cash counting, shift handover & mismatch reports' },
  { id: 'multi-branch', label: 'Multi-Branch HQ', description: 'Head Office dashboard across all your branches' },
  { id: 'custom-setup', label: 'Custom Setup', description: 'Tailored deployment, integration & configuration' },
  { id: 'training', label: 'Staff Training', description: 'On-site training for staff on all ArenaOS modules' },
  { id: 'maintenance', label: 'Ongoing Maintenance', description: 'Updates, monitoring & technical support' },
  { id: 'other', label: 'Other', description: 'Something else? Tell us about it' },
];

/* ─────────────── Steps ─────────────── */

type Step = 'modules' | 'details';

/* ─────────────── Component ─────────────── */

interface ContactUsProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const ContactUs: React.FC<ContactUsProps> = ({ isModal = false, onClose }) => {
  const [step, setStep] = useState<Step>('modules');
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    arenaName: '',
    city: '',
    contact: '',
    notes: '',
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  /* ─── toggle module selection ─── */
  const toggleModule = (id: string) => {
    playClick();
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  /* ─── remove pill ─── */
  const removePill = (id: string) => {
    playClick();
    setSelected(prev => prev.filter(s => s !== id));
  };

  /* ─── go to details step ─── */
  const goToDetails = () => {
    if (selected.length === 0) return;
    playClick();
    setStep('details');
    // Scroll to top of section on mobile
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /* ─── go back to modules step ─── */
  const goBackToModules = () => {
    playClick();
    setStep('modules');
  };

  /* ─── submit form ─── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playConfirm();
    setSubmitted(true);
    setToast(true);
    setTimeout(() => setToast(false), 5000);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#CCFF00', '#FFFFFF', '#00F0FF'],
      });
    } catch {
      // Safe fallback
    }
  };

  /* ─── pill bar entrance animation ─── */
  const [pillBarVisible, setPillBarVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPillBarVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  /* ─── get label by id ─── */
  const getLabel = (id: string) => MODULES.find(m => m.id === id)?.label ?? id;

  return (
    <section
      ref={sectionRef}
      id="deploy"
      className={`relative scroll-mt-20 ${isModal ? 'p-0' : 'py-16 md:py-24 bg-[#08080A] border-t border-white/10'}`}
    >
      <span id="demo" className="absolute -top-24 invisible pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed top-5 right-5 z-[100] flex items-center gap-3 bg-arena-lime text-black px-4 py-3 rounded-lg shadow-lg text-sm font-medium"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Request sent. We will contact you soon.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ─────────── Submitted State ─────────── */}
        {submitted ? (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-arena-lime/10 flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle2 className="w-9 h-9 text-arena-lime" />
            </div>
            <h3 className="font-semibold text-3xl md:text-4xl text-white mb-3 tracking-tight">
              We've got your request
            </h3>
            <p className="text-arena-muted text-sm max-w-md leading-relaxed mb-8">
              Our team will reach out on WhatsApp or phone to discuss your setup.
            </p>
            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl text-left text-sm space-y-2 w-full max-w-md">
              <div className="text-xs text-arena-subtle mb-2">Request summary</div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Request ID: #AR-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Owner: {formData.ownerName || 'Operator'}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Café: {formData.arenaName || 'Esports venue'}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>
                  Modules: {selected.length > 0 ? selected.map(getLabel).join(', ') : 'All'}
                </span>
              </div>
            </div>

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="mt-8 px-6 py-2.5 bg-arena-lime text-black font-medium rounded-md hover:bg-arena-limeBright transition-colors"
              >
                Return to site
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ─────────── Header ─────────── */}
            <div
              className={`text-center mb-10 transition-all duration-700 ${
                pillBarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-xs text-arena-lime tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                Start a project
              </div>
              <h2 className="font-semibold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white leading-[1.1]">
                Tell us what
                <br />
                you need.
              </h2>
            </div>

            {/* ─────────── Pill Bar ─────────── */}
            <div
              className={`mb-10 transition-all duration-700 delay-100 ${
                pillBarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full px-5 py-3 max-w-4xl mx-auto flex-wrap sm:flex-nowrap">
                {/* Prefix */}
                <span className="text-arena-muted text-sm whitespace-nowrap shrink-0">
                  I need
                </span>

                {/* Selected pills */}
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  {selected.length === 0 && (
                    <span className="text-arena-subtle text-sm italic">
                      select modules below…
                    </span>
                  )}
                  {selected.map(id => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 bg-arena-lime/15 text-arena-lime text-xs font-medium px-3 py-1.5 rounded-full border border-arena-lime/30 transition-all duration-200 hover:bg-arena-lime/25"
                    >
                      {getLabel(id)}
                      <button
                        type="button"
                        onClick={() => removePill(id)}
                        aria-label={`Remove ${getLabel(id)}`}
                        className="text-arena-lime/60 hover:text-arena-lime transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Next / Step indicator */}
                {step === 'modules' ? (
                  <button
                    type="button"
                    onClick={goToDetails}
                    disabled={selected.length === 0}
                    onMouseEnter={() => selected.length > 0 && playHover()}
                    className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                      selected.length > 0
                        ? 'bg-white text-black hover:bg-arena-lime hover:text-black cursor-pointer active:scale-[0.97]'
                        : 'bg-white/10 text-arena-subtle cursor-not-allowed'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goBackToModules}
                    onMouseEnter={() => playHover()}
                    className="shrink-0 px-4 py-2 rounded-full text-sm font-medium border border-white/20 text-white hover:border-arena-lime hover:text-arena-lime transition-colors cursor-pointer"
                  >
                    ← Edit
                  </button>
                )}
              </div>
            </div>

            {/* ─────────── Step 1: Module Grid ─────────── */}
            {step === 'modules' && (
              <div
                className={`transition-all duration-500 ${
                  pillBarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
                  {MODULES.map(mod => {
                    const isSelected = selected.includes(mod.id);
                    return (
                      <li key={mod.id}>
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.id)}
                          onMouseEnter={() => playHover()}
                          aria-pressed={isSelected}
                          className={`w-full text-left p-5 transition-all duration-200 group relative ${
                            isSelected
                              ? 'bg-[#0D0D0F]'
                              : 'bg-[#0A0A0C] hover:bg-[#0E0E11]'
                          }`}
                        >
                          {/* Top row: arrow + label + icon */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`text-base transition-transform duration-300 shrink-0 ${
                                  isSelected
                                    ? 'text-arena-lime rotate-0'
                                    : 'text-arena-subtle -rotate-45 group-hover:rotate-0 group-hover:text-white'
                                }`}
                              >
                                ↘
                              </span>
                              <span
                                className={`font-semibold text-sm tracking-tight truncate transition-colors ${
                                  isSelected ? 'text-white' : 'text-arena-muted group-hover:text-white'
                                }`}
                              >
                                {mod.label}
                              </span>
                            </div>

                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-medium shrink-0 transition-all duration-300 border ${
                                isSelected
                                  ? 'bg-arena-lime border-arena-lime text-black scale-110'
                                  : 'bg-transparent border-white/15 text-arena-subtle group-hover:border-white/30'
                              }`}
                            >
                              {isSelected ? '✓' : '+'}
                            </span>
                          </div>

                          {/* Description */}
                          <p
                            className={`text-xs leading-relaxed transition-colors ${
                              isSelected ? 'text-arena-muted' : 'text-arena-subtle group-hover:text-arena-muted'
                            }`}
                          >
                            {mod.description}
                          </p>

                          {/* Selected indicator bar */}
                          {isSelected && (
                            <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-arena-lime/50 rounded-full" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Module count indicator */}
                <div className="flex items-center justify-between mt-4 text-xs text-arena-subtle px-1">
                  <span>
                    {selected.length === 0
                      ? 'Select the modules your café needs'
                      : `${selected.length} module${selected.length !== 1 ? 's' : ''} selected`}
                  </span>
                  {selected.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setSelected([]);
                      }}
                      className="text-arena-muted hover:text-white transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ─────────── Step 2: Contact Details ─────────── */}
            {step === 'details' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sm:p-8">
                  {/* Step header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div>
                      <span className="text-arena-lime text-xs tracking-[0.15em] uppercase block mb-1">
                        Step 2 of 2
                      </span>
                      <h3 className="text-white text-lg font-semibold tracking-tight">
                        Your details
                      </h3>
                    </div>
                    <span className="text-arena-subtle text-xs flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-green-500" />
                      Encrypted
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-arena-muted mb-1.5 text-xs font-medium">
                          Owner / operator name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikram Malhotra"
                          value={formData.ownerName}
                          onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-lg p-3 text-white text-sm outline-none transition-colors placeholder:text-arena-subtle"
                        />
                      </div>
                      <div>
                        <label className="block text-arena-muted mb-1.5 text-xs font-medium">
                          Arena / café brand
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Velocity Gaming Lounge"
                          value={formData.arenaName}
                          onChange={e => setFormData({ ...formData, arenaName: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-lg p-3 text-white text-sm outline-none transition-colors placeholder:text-arena-subtle"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-arena-muted mb-1.5 text-xs font-medium">
                          Location / city
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Adajan, Surat"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-lg p-3 text-white text-sm outline-none transition-colors placeholder:text-arena-subtle"
                        />
                      </div>
                      <div>
                        <label className="block text-arena-muted mb-1.5 text-xs font-medium">
                          WhatsApp / phone number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98000 00000"
                          value={formData.contact}
                          onChange={e => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-lg p-3 text-white text-sm outline-none transition-colors placeholder:text-arena-subtle"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-arena-muted mb-1.5 text-xs font-medium">
                        Anything else? (optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. We have 60 PCs across 2 branches, want to start in 2 weeks…"
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-lg p-3 text-white text-sm outline-none transition-colors resize-none placeholder:text-arena-subtle"
                      />
                    </div>

                    {/* Selected modules recap */}
                    <div className="p-3.5 bg-black/30 border border-white/10 rounded-lg">
                      <div className="text-xs text-arena-subtle mb-2">Selected modules</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.map(id => (
                          <span
                            key={id}
                            className="text-xs bg-arena-lime/10 text-arena-lime px-2.5 py-1 rounded-full border border-arena-lime/20"
                          >
                            {getLabel(id)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      onMouseEnter={() => playHover()}
                      className="w-full py-3 bg-arena-lime hover:bg-arena-limeBright text-black font-semibold text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] mt-2 shadow-[0_0_24px_rgba(204,255,0,0.15)] hover:shadow-[0_0_36px_rgba(204,255,0,0.35)]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send request</span>
                    </button>

                    <div className="text-[11px] text-arena-subtle text-center pt-1">
                      No pushy sales calls. Just a simple conversation.
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
