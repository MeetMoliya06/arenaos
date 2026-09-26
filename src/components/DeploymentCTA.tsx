import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playConfirm, playHover } from '../audio/soundEffects';

interface DeploymentCTAProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const DeploymentCTA: React.FC<DeploymentCTAProps> = ({ isModal = false, onClose }) => {
  const [pcs, setPcs] = useState(40);
  const [branches, setBranches] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    arenaName: '',
    city: '',
    contact: '',
    notes: '',
  });

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

  return (
    <section id="deploy" className={`relative scroll-mt-20 ${isModal ? 'p-0' : 'py-10 md:py-16 bg-[#08080A] border-t border-white/10'}`}>
      <span id="demo" className="absolute -top-24 invisible pointer-events-none" />
      {toast && (
        <div role="status" className="fixed top-5 right-5 z-[100] flex items-center gap-3 bg-arena-lime text-black px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
          <CheckCircle2 className="w-5 h-5" />
          <span>Request sent. We will contact you soon.</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        {!isModal && (
          <div className="max-w-3xl mb-8">
            <div className="text-xs text-arena-lime mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
              <span>Get started</span>
            </div>
            <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
              Get ArenaOS for your café
            </h2>
            <p className="text-arena-muted text-base mt-2">
              Tell us about your café. We visit, set up ArenaOS on your PCs and cash counter, and train your staff. Pricing is discussed with you directly.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Capacity Configurator & Hardware Spec Recommendation */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="text-arena-lime text-sm mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Step 1: Your café size</span>
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-5">
              <div>
                <div className="flex justify-between text-white mb-1.5 text-sm">
                  <span>Gaming PCs</span>
                  <span className="text-arena-lime font-medium">{pcs} PCs</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={pcs}
                  onChange={(e) => {
                    setPcs(Number(e.target.value));
                    playHover();
                  }}
                  className="w-full accent-arena-lime bg-white/10 h-1.5 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-white mb-1.5 text-sm">
                  <span>Total venues / branches</span>
                  <span className="text-arena-lime font-medium">{branches} {branches === 1 ? 'branch' : 'branches'}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 8].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        playClick();
                        setBranches(b);
                      }}
                      className={`py-1.5 rounded-md text-sm font-medium border transition-colors ${
                        branches === b
                          ? 'bg-arena-lime text-black border-arena-lime'
                          : 'bg-white/5 border-white/10 text-arena-muted hover:border-white/30'
                      }`}
                    >
                      {b} {b === 1 ? 'loc' : 'locs'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware Deployment Spec Generated */}
            <div className="p-3.5 bg-black/30 border border-white/10 rounded-lg space-y-2 text-xs sm:text-sm">
              <div className="text-xs text-arena-subtle mb-1">
                What you get
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Timer and lock software on {pcs} PCs</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Local server at each branch, works offline</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Cash drawer and receipt printer setup</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Head Office sync and daily report to the owner</span>
              </div>
            </div>

          </div>

          {/* Right: VIP Inquiry Form or Submission State */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6">

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-arena-lime/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-arena-lime" />
                </div>
                <h3 className="font-semibold text-2xl md:text-3xl text-white mb-2">
                  Request sent
                </h3>
                <p className="text-arena-muted text-sm max-w-md leading-relaxed mb-6">
                  Our team will contact you soon on WhatsApp or phone to plan your setup.
                </p>
                <div className="p-4 bg-black/30 border border-white/10 rounded-lg text-left text-sm text-arena-lime space-y-1 w-full max-w-md">
                  <div>Request ID: #AR-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div>Owner: {formData.ownerName || 'Operator'}</div>
                  <div>Facility: {formData.arenaName || 'Esports venue'}</div>
                  <div>PCs: {pcs} · Branches: {branches}</div>
                </div>

                {isModal && onClose && (
                  <button
                    onClick={onClose}
                    className="mt-8 px-6 py-2.5 bg-arena-lime text-black font-medium rounded-md"
                  >
                    Return to dashboard
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
                  <span className="text-arena-lime text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>Step 2: Your details</span>
                  </span>
                  <span className="text-arena-subtle text-xs">All fields encrypted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-arena-muted mb-1 text-xs">
                      Owner / operator name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-arena-muted mb-1 text-xs">
                      Arena / café brand
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Velocity Gaming Lounge"
                      value={formData.arenaName}
                      onChange={(e) => setFormData({ ...formData, arenaName: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-arena-muted mb-1 text-xs">
                      Location / city
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adajan, Surat"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-arena-muted mb-1 text-xs">
                      WhatsApp / phone number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2 text-white text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-arena-muted mb-1 text-xs">
                    Anything else? (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Want to start in 2 weeks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2 text-white text-xs sm:text-sm outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => playHover()}
                  className="w-full py-2.5 bg-arena-lime hover:bg-arena-limeBright text-black font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send request</span>
                </button>

                <div className="text-[11px] text-arena-subtle text-center pt-1">
                  No pushy sales calls. Just a simple conversation.
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
