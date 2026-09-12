import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if touch device or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('[data-cursor]');
        if (interactiveEl) {
          const text = interactiveEl.getAttribute('data-cursor') || '';
          setCursorText(text);
          setIsHovered(true);
        } else if (target.closest('button, a, input, select, [role="button"]')) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  // Smooth lerp for trailing ring
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setTrailingPos(prev => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="custom-cursor pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Precision center dot */}
      <div
        className="fixed w-1.5 h-1.5 bg-arena-lime rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.5 : 1})`,
        }}
      />

      {/* Trailing interactive ring */}
      <div
        className={`fixed rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200 flex items-center justify-center font-mono text-[9px] uppercase tracking-wider ${
          cursorText
            ? 'w-16 h-16 bg-arena-lime text-black font-bold shadow-lime-md border-none'
            : isHovered
            ? 'w-10 h-10 border border-arena-lime/80 bg-arena-lime/10'
            : 'w-6 h-6 border border-white/20'
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : 1})`,
        }}
      >
        {cursorText && (
          <span className="select-none animate-pulse">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
