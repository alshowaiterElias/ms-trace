let sharedAudioContext: AudioContext | null = null;

/**
 * Plays a gentle, non-distracting acoustic tick when a tap is registered.
 * Fails gracefully if Web Audio API is unavailable or blocked.
 */
export function playSubtleTapTick(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!sharedAudioContext) {
      sharedAudioContext = new AudioCtx();
    }

    if (sharedAudioContext.state === 'suspended') {
      void sharedAudioContext.resume();
    }

    const now = sharedAudioContext.currentTime;
    const oscillator = sharedAudioContext.createOscillator();
    const gain = sharedAudioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(640, now);
    oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.02);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.024);

    oscillator.connect(gain);
    gain.connect(sharedAudioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.025);
  } catch {
    // Audio feedback is strictly optional; ignore browser restriction errors.
  }
}

