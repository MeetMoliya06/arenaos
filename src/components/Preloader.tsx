import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 18) + 8, 100);
      });
    }, 70);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, 400);
      }, 200);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#0A0A0B] flex flex-col items-center justify-center transition-opacity duration-500 ease-out ${
        isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <span className="font-semibold text-lg tracking-tight text-white mb-6">
        Arena<span className="text-arena-lime">OS</span>
      </span>
      <div className="w-40 h-[2px] bg-white/10 overflow-hidden rounded-full">
        <div
          className="h-full bg-arena-lime transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
