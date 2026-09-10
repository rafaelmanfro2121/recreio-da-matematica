/**
 * A small, calm countdown timer hook. Polls every 100ms (not requestAnimationFrame)
 * so it's light on CPU — plenty smooth for an animated ring/bar since framer-motion
 * interpolates the visual between updates.
 *
 * Restarts whenever `durationMs` or `resetKey` changes. While `paused` is true it
 * reports full time remaining and never fires `onExpire` — used to freeze the timer
 * once a round has been answered.
 */

import { useEffect, useRef, useState } from "react";

const TICK_MS = 100;

export function useCountdown(
  durationMs: number,
  resetKey: string | number,
  onExpire: () => void,
  paused: boolean,
): { remainingMs: number; ratio: number } {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    setRemainingMs(durationMs);
    if (paused) return;

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const left = Math.max(0, durationMs - (Date.now() - startedAt));
      setRemainingMs(left);
      if (left <= 0) {
        window.clearInterval(interval);
        if (!firedRef.current) {
          firedRef.current = true;
          onExpireRef.current();
        }
      }
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [durationMs, resetKey, paused]);

  return { remainingMs, ratio: durationMs > 0 ? remainingMs / durationMs : 0 };
}
