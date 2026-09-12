import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemFraming } from './components/ProblemFraming';
import { ProductWalkthrough } from './components/ProductWalkthrough';
import { LiveProof } from './components/LiveProof';
import { TechStrip } from './components/TechStrip';
import { RbacMatrix } from './components/RbacMatrix';
import { DeploymentCTA } from './components/DeploymentCTA';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';

export function App() {
  const [loading, setLoading] = useState(true);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F4F4F2] selection:bg-[#CCFF00] selection:text-black relative">
      {/* Custom Morphing Cursor */}
      <Cursor />

      {/* Preloader / System Bootloader HUD */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Main Architectural Navigation */}
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      {/* Hero with 3D WebGL Rig Scene & Live Marquee */}
      <Hero onOpenDemo={() => setDemoModalOpen(true)} />

      {/* The Financial Leakage Audit & Interactive Calculator */}
      <ProblemFraming />

      {/* The Core Engine: 6 Mission-Critical Modules Walkthrough */}
      <ProductWalkthrough />

      {/* Battle-Tested Live Proof Counters & Branch Grid */}
      <LiveProof />

      {/* Tech Credibility Infrastructure Strip */}
      <TechStrip />

      {/* Role-Based Access Control Scope Matrix */}
      <RbacMatrix />

      {/* Custom Enterprise Rollout Configurator & Form */}
      <DeploymentCTA />

      {/* Minimal Confident Editorial Footer */}
      <Footer onOpenDemo={() => setDemoModalOpen(true)} />

      {/* VIP Demo & Deployment Modal Dialog */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  );
}

export default App;
