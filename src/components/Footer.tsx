import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { playClick, playHover } from '../audio/soundEffects';

interface FooterProps {
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemo }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-[#08080A] border-t border-white/10 pt-10 pb-6 text-sm text-arena-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Closing Line */}
        <div className="pb-6 border-b border-white/10">
          <div className="text-xs text-arena-lime mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-arena-lime" />
            <span>Executive summary</span>
          </div>
          <p className="font-semibold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none max-w-4xl">
            Built for café owners who want to see everything.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                playClick();
                onOpenDemo();
              }}
              onMouseEnter={() => playHover()}
              className="px-4 py-2.5 bg-arena-lime text-black font-medium text-sm rounded-md hover:bg-arena-limeBright transition-colors flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>Get a demo</span>
            </button>
            <a
              href="#leakage"
              onClick={() => playClick()}
              className="px-4 py-2.5 border border-white/15 text-white text-sm rounded-md hover:border-white/30 transition-colors"
            >
              See problems we solve
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-white/10 text-sm">
          <div>
            <div className="text-white font-medium mb-2.5">Platform</div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li><a href="#modules" className="hover:text-white transition-colors">PC session lockscreen</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Closed-loop wallet</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">In-seat food kiosk</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">Cash drawer sync</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">EOD shift handover</a></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-medium mb-2.5">Contact</div>
            <p className="text-arena-subtle leading-relaxed mb-2 text-xs">
              Talk to us about setting up ArenaOS at your café.
            </p>
            <a href="mailto:connect@p3q.in" className="text-arena-lime text-xs sm:text-sm block">connect@p3q.in</a>
            <a href="tel:+919173676680" className="text-arena-muted mt-0.5 text-xs sm:text-sm block hover:text-white">+91 9173676680</a>
            <a href="tel:+918238482880" className="text-arena-muted mt-0.5 text-xs sm:text-sm block hover:text-white">+91 82384 82880</a>
            <a href="tel:+919664812556" className="text-arena-muted mt-0.5 text-xs sm:text-sm block hover:text-white">+91 96648 12556</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-arena-subtle">
          <div className="flex items-center gap-4">
            <span className="text-white">ArenaOS v2.4</span>
            <span>{timeStr || '12 Sep 2026 UTC'}</span>
          </div>
          <div>All rights reserved</div>
        </div>

      </div>
    </footer>
  );
};
