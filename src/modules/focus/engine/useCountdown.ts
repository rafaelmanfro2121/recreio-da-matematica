/**
 * Same small countdown hook used by Reflexo Rápido, copied locally (modules
 * don't cross-import from each other in this codebase). Polls every 100ms,
 * restarts on `resetKey`/duration change, freezes while `paused`.
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
