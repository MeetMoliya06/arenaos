import React, { useEffect, useState, useRef } from 'react';
import { Activity, ShieldCheck, Zap, Server, MapPin } from 'lucide-react';

export const LiveProof: React.FC = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Counter states
  const [branchesCount, setBranchesCount] = useState(0);
  const [pcsCount, setPcsCount] = useState(0);
  const [zonesCount, setZonesCount] = useState(0);
  const [volumeCount, setVolumeCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    // Branches: 0 -> 4
    const bTimer = setInterval(() => {
      setBranchesCount(prev => (prev < 4 ? prev + 1 : 4));
    }, 150);

    // PCs: 0 -> 106
    const pcTimer = setInterval(() => {
      setPcsCount(prev => {
        if (prev >= 106) {
          clearInterval(pcTimer);
          return 106;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 40);

    // Zones: 0 -> 10
    const zTimer = setInterval(() => {
      setZonesCount(prev => (prev < 10 ? prev + 1 : 10));
    }, 90);

    // Volume: 0 -> 1420000
    const vTimer = setInterval(() => {
      setVolumeCount(prev => {
        if (prev >= 1420000) {
          clearInterval(vTimer);
          return 1420000;
        }
        return prev + 65000;
      });
    }, 35);

    return () => {
      clearInterval(bTimer);
      clearInterval(pcTimer);
      clearInterval(zTimer);
      clearInterval(vTimer);
    };
  }, [inView]);

  return (
    <section id="telemetry" ref={sectionRef} className="py-20 md:py-32 bg-[#060709] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs text-arena-lime mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
              <span>Battle-tested telemetry</span>
            </div>
            <h2 className="font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white max-w-2xl leading-tight">
              Live network proof
            </h2>
          </div>
          <div className="text-sm text-arena-muted max-w-md leading-relaxed">
            Operating real-world esports arenas across tier-1 metros. Every session, wallet debit, and cashier handover is verified by our distributed edge cluster.
          </div>
        </div>

        {/* The 4 Big Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            <div className="text-xs text-arena-subtle mb-2 flex items-center gap-2">
              <Building2Icon />
              <span>Metro branches</span>
            </div>
            <div className="text-4xl sm:text-5xl font-semibold text-white">
              {branchesCount}
              <span className="text-arena-lime text-xl ml-1">loc</span>
            </div>
            <div className="text-xs text-arena-muted mt-2">
              Bengaluru (2), Mumbai (1), Delhi (1)
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            <div className="text-xs text-arena-subtle mb-2 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-arena-lime" />
              <span>PC rig clients</span>
            </div>
            <div className="text-4xl sm:text-5xl font-semibold text-arena-lime">
              {pcsCount}
              <span className="text-white text-xl ml-1">rigs</span>
            </div>
            <div className="text-xs text-arena-muted mt-2">
              Under 100% zero-trust client lock
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            <div className="text-xs text-arena-subtle mb-2 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-arena-lime" />
              <span>Pricing zones</span>
            </div>
            <div className="text-4xl sm:text-5xl font-semibold text-white">
              {zonesCount}
              <span className="text-arena-lime text-xl ml-1">zones</span>
            </div>
            <div className="text-xs text-arena-muted mt-2">
              VIP, pods, simulators, lounge
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            <div className="text-xs text-arena-subtle mb-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-arena-lime" />
              <span>Monthly volume</span>
            </div>
            <div className="text-3xl sm:text-4xl font-semibold text-white">
              ₹{(volumeCount / 100000).toFixed(1)}L+
            </div>
            <div className="text-xs text-arena-muted mt-2">
              Audited transactions without cash leakage
            </div>
          </div>

        </div>

        {/* Live Network Fleet Map Bar */}
        <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl text-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white font-medium">
              <MapPin className="w-4 h-4 text-arena-lime" />
              <span>Active metro cluster status</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-arena-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
                Online (99.98% SLA)
              </span>
              <span>Edge replication: instant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-black/30 border border-white/5 rounded-md">
              <div className="flex justify-between text-white font-medium text-sm">
                <span>Indiranagar, BLR</span>
                <span className="text-arena-lime">4ms</span>
              </div>
              <div className="text-arena-subtle text-xs mt-1">40 rigs · 90% occupancy</div>
            </div>

            <div className="p-3 bg-black/30 border border-white/5 rounded-md">
              <div className="flex justify-between text-white font-medium text-sm">
                <span>Koramangala, BLR</span>
                <span className="text-arena-lime">5ms</span>
              </div>
              <div className="text-arena-subtle text-xs mt-1">32 rigs · 87% occupancy</div>
            </div>

            <div className="p-3 bg-black/30 border border-white/5 rounded-md">
              <div className="flex justify-between text-white font-medium text-sm">
                <span>Bandra West, BOM</span>
                <span className="text-arena-lime">11ms</span>
              </div>
              <div className="text-arena-subtle text-xs mt-1">24 rigs · 91% occupancy</div>
            </div>

            <div className="p-3 bg-black/30 border border-white/5 rounded-md">
              <div className="flex justify-between text-white font-medium text-sm">
                <span>Cyberhub, DEL</span>
                <span className="text-arena-lime">14ms</span>
              </div>
              <div className="text-arena-subtle text-xs mt-1">30 rigs · 86% occupancy</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const Building2Icon = () => (
  <svg className="w-3.5 h-3.5 text-arena-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
