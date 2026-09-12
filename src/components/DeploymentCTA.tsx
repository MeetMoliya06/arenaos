import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, ShieldAlert, Cpu, Building, PhoneCall } from 'lucide-react';
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
    <section id="demo" className={`relative ${isModal ? 'p-0' : 'py-20 md:py-32 bg-[#08090E] border-t border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        {!isModal && (
          <div className="max-w-3xl mb-14">
            <div className="font-mono text-xs text-arena-lime uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-arena-lime" />
              <span>CUSTOM ENTERPRISE ROLLOUT</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase leading-tight">
              REQUEST ARENAOS DEPLOYMENT
            </h2>
            <p className="font-sans text-arena-muted text-base mt-4">
              ArenaOS is enterprise-grade hardware infrastructure, not self-serve generic SaaS. We evaluate your network topology, install the zero-trust Windows client shell, and integrate your physical cash drawers on-site.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Capacity Configurator & Hardware Spec Recommendation */}
          <div className="lg:col-span-5 bg-[#0B0C12] border border-white/10 rounded-xl p-6 md:p-8 font-mono text-xs">
            <div className="text-arena-lime font-bold uppercase text-[11px] mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>STEP 1: FLEET CAPACITY PROFILE</span>
            </div>

            {/* Sliders */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between text-white mb-2">
                  <span className="font-medium">GAMING RIGS TO CONTROL:</span>
                  <span className="text-arena-lime font-bold text-sm">{pcs} RIGS</span>
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
                <div className="flex justify-between text-white mb-2">
                  <span className="font-medium">TOTAL VENUES / BRANCHES:</span>
                  <span className="text-arena-lime font-bold text-sm">{branches} {branches === 1 ? 'BRANCH' : 'BRANCHES'}</span>
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
                      className={`py-2 rounded font-bold border transition-all ${
                        branches === b
                          ? 'bg-arena-lime text-black border-arena-lime shadow-lime-sm'
                          : 'bg-white/5 border-white/10 text-arena-muted hover:border-white/30'
                      }`}
                    >
                      {b} {b === 1 ? 'Loc' : 'Locs'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hardware Deployment Spec Generated */}
            <div className="p-4 bg-black/60 border border-white/10 rounded-lg space-y-2.5">
              <div className="text-[10px] text-arena-subtle uppercase mb-1">
                SYSTEM DEPLOYMENT INCLUDES:
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>{pcs}x Windows Zero-Trust Shell Client Licenses</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>{branches}x Local Edge Docker Node (Offline Resilient)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>RJ11 Cash Drawer + Thermal Printer Drivers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                <span>Central Cloud Sync & Telegram EOD Dispatch</span>
              </div>
            </div>

          </div>

          {/* Right: VIP Inquiry Form or Submission State */}
          <div className="lg:col-span-7 bg-[#0E1018] border border-white/15 rounded-xl p-6 md:p-8 font-mono text-xs shadow-2xl">
            
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-arena-lime/20 border border-arena-lime flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-arena-lime" />
                </div>
                <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-2 uppercase">
                  DEPLOYMENT REQUEST TRANSMITTED
                </h3>
                <p className="text-arena-muted text-xs max-w-md font-sans leading-relaxed mb-6">
                  Our systems architect will contact you within 4 business hours via WhatsApp/Phone to review your hardware floor plan and configure your trial cluster.
                </p>
                <div className="p-4 bg-black/60 border border-white/10 rounded text-left font-mono text-[11px] text-arena-lime space-y-1 w-full max-w-md">
                  <div>DISPATCH_ID: #AR-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div>OWNER: {formData.ownerName.toUpperCase() || 'OPERATOR'}</div>
                  <div>FACILITY: {formData.arenaName.toUpperCase() || 'ESPORTS VENUE'}</div>
                  <div>NODES_QUEUED: {pcs} RIGS / {branches} LOCATIONS</div>
                </div>

                {isModal && onClose && (
                  <button
                    onClick={onClose}
                    className="mt-8 px-6 py-2.5 bg-arena-lime text-black font-bold uppercase rounded"
                  >
                    RETURN TO DASHBOARD
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="text-arena-lime font-bold uppercase text-[11px] flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>STEP 2: ARENA & OWNER CREDENTIALS</span>
                  </span>
                  <span className="text-arena-subtle text-[10px]">ALL FIELDS ENCRYPTED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arena-muted mb-1 text-[11px]">
                      OWNER / OPERATOR NAME:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full bg-[#141624] border border-white/10 focus:border-arena-lime rounded p-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-arena-muted mb-1 text-[11px]">
                      ARENA / CAFÉ BRAND:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Velocity Gaming Lounge"
                      value={formData.arenaName}
                      onChange={(e) => setFormData({ ...formData, arenaName: e.target.value })}
                      className="w-full bg-[#141624] border border-white/10 focus:border-arena-lime rounded p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-arena-muted mb-1 text-[11px]">
                      LOCATION / CITY:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#141624] border border-white/10 focus:border-arena-lime rounded p-2.5 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-arena-muted mb-1 text-[11px]">
                      WHATSAPP / PHONE NUMBER:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-[#141624] border border-white/10 focus:border-arena-lime rounded p-2.5 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-arena-muted mb-1 text-[11px]">
                    SPECIFIC PAIN POINTS OR TIMELINE (OPTIONAL):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Currently bleeding money on unbilled hours, looking to deploy in 2 weeks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#141624] border border-white/10 focus:border-arena-lime rounded p-2.5 text-white outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => playHover()}
                  className="w-full py-3.5 bg-arena-lime hover:bg-arena-limeBright text-black font-mono font-bold text-xs uppercase tracking-wider rounded transition-all shadow-lime-md flex items-center justify-center gap-2 active:scale-98 mt-4"
                  data-cursor="TRANSMIT"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH DEPLOYMENT APPLICATION</span>
                </button>

                <div className="text-[10px] text-arena-subtle text-center pt-2">
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
