let audioCtx: AudioContext | null = null;
let muted = typeof window !== "undefined" && window.localStorage.getItem("recreio:muted") === "1";

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  window.localStorage.setItem("recreio:muted", value ? "1" : "0");
}

function getContext(): AudioContext | null {
  if (muted) return null;
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function playTone(frequencies: number[], duration: number, type: OscillatorType = "sine") {
  const ctx = getContext();
  if (!ctx) return;

  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    const startTime = ctx.currentTime + i * duration;
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
}

export const playCorrectSound = () => playTone([523.25, 659.25, 783.99], 0.12, "triangle");
export const playWrongSound = () => playTone([311.13, 233.08], 0.18, "sawtooth");
export const playLevelUpSound = () => playTone([523.25, 659.25, 783.99, 1046.5], 0.15, "triangle");
export const playTapSound = () => playTone([440], 0.05, "square");
export const playChimeSound = () => playTone([659.25, 987.77], 0.14, "sine");
