// Synthesized Web Audio API sound generator for tactile control-room feedback

let audioCtx: AudioContext | null = null;
let isAudioEnabled = false;

export const toggleAudio = (enable?: boolean): boolean => {
  if (enable !== undefined) {
    isAudioEnabled = enable;
  } else {
    isAudioEnabled = !isAudioEnabled;
  }
  
  if (isAudioEnabled && !audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (isAudioEnabled && audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  if (isAudioEnabled) {
    playConfirm();
  }
  
  return isAudioEnabled;
};

export const getAudioState = (): boolean => isAudioEnabled;

const initContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
};

export const playHover = () => {
  if (!isAudioEnabled) return;
  try {
    initContext();
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch {
    // Graceful silence
  }
};

export const playClick = () => {
  if (!isAudioEnabled) return;
  try {
    initContext();
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.06);
  } catch {
    // Graceful silence
  }
};

export const playConfirm = () => {
  if (!isAudioEnabled) return;
  try {
    initContext();
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {
    // Graceful silence
  }
};
