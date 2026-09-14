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
    <section id="demo" className={`relative ${isModal ? 'p-0' : 'py-20 md:py-32 bg-[#08080A] border-t border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        {!isModal && (
          <div className="max-w-3xl mb-14">
            <div className="text-xs text-arena-lime mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
              <span>Custom enterprise rollout</span>
            </div>
            <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white leading-tight">
              Request ArenaOS deployment
            </h2>
            <p className="text-arena-muted text-base mt-4">
              ArenaOS is enterprise-grade hardware infrastructure, not self-serve generic SaaS. We evaluate your network topology, install the zero-trust Windows client shell, and integrate your physical cash drawers on-site.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Capacity Configurator & Hardware Spec Recommendation */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/10 rounded-xl p-6 md:p-8">
            <div className="text-arena-lime text-sm mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Step 1: Fleet capacity profile</span>
            </div>

            {/* Sliders */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between text-white mb-2 text-sm">
                  <span>Gaming rigs to control</span>
                  <span className="text-arena-lime font-medium">{pcs} rigs</span>
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
                <div className="flex justify-between text-white mb-2 text-sm">
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
                      className={`py-2 rounded-md text-sm font-medium border transition-colors ${
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
            <div className="p-4 bg-black/30 border border-white/10 rounded-lg space-y-2.5 text-sm">
              <div className="text-xs text-arena-subtle mb-1">
                System deployment includes
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>{pcs}x Windows zero-trust shell client licenses</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>{branches}x local edge Docker node (offline resilient)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>RJ11 cash drawer + thermal printer drivers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Central cloud sync & Telegram EOD dispatch</span>
              </div>
            </div>

          </div>

          {/* Right: VIP Inquiry Form or Submission State */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-xl p-6 md:p-8">

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-arena-lime/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-arena-lime" />
                </div>
                <h3 className="font-semibold text-2xl md:text-3xl text-white mb-2">
                  Deployment request sent
                </h3>
                <p className="text-arena-muted text-sm max-w-md leading-relaxed mb-6">
                  Our systems architect will contact you within 4 business hours via WhatsApp/phone to review your hardware floor plan and configure your trial cluster.
                </p>
                <div className="p-4 bg-black/30 border border-white/10 rounded-lg text-left text-sm text-arena-lime space-y-1 w-full max-w-md">
                  <div>Dispatch ID: #AR-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div>Owner: {formData.ownerName || 'Operator'}</div>
                  <div>Facility: {formData.arenaName || 'Esports venue'}</div>
                  <div>Nodes queued: {pcs} rigs / {branches} locations</div>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-arena-lime text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>Step 2: Arena & owner details</span>
                  </span>
                  <span className="text-arena-subtle text-xs">All fields encrypted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arena-muted mb-1 text-sm">
                      Owner / operator name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2.5 text-white text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-arena-muted mb-1 text-sm">
                      Arena / café brand
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Velocity Gaming Lounge"
                      value={formData.arenaName}
                      onChange={(e) => setFormData({ ...formData, arenaName: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2.5 text-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arena-muted mb-1 text-sm">
                      Location / city
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2.5 text-white text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-arena-muted mb-1 text-sm">
                      WhatsApp / phone number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2.5 text-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-arena-muted mb-1 text-sm">
                    Specific pain points or timeline (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Currently bleeding money on unbilled hours, looking to deploy in 2 weeks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 focus:border-arena-lime rounded-md p-2.5 text-white text-sm outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => playHover()}
                  className="w-full py-3.5 bg-arena-lime hover:bg-arena-limeBright text-black font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 active:scale-[0.98] mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch deployment application</span>
                </button>

                <div className="text-xs text-arena-subtle text-center pt-2">
                  No automated pushy sales calls. Direct technical discovery with our engineering team.
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
