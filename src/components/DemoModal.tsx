import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { DeploymentCTA } from './DeploymentCTA';
import { playClick } from '../audio/soundEffects';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fadeIn"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0D0D0F] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-arena-lime hover:text-black text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-4 border-b border-white/10">
          <div className="text-arena-lime text-xs mb-1">
            On-site hardware audit
          </div>
          <h2 className="font-semibold text-2xl sm:text-3xl text-white">
            Deploy ArenaOS to your arena fleet
          </h2>
        </div>

        <DeploymentCTA isModal={true} onClose={onClose} />
      </div>
    </div>
  );
};
