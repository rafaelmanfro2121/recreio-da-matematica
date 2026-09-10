/**
 * Streak-based adaptive difficulty for the Reflexo Rápido module.
 *
 * Difficulty is a number from 1 (easiest) to 5 (hardest), persisted across
 * sessions. It climbs one step after 3 correct answers in a row (resetting
 * the streak counter), and eases back down one step — never below 1 — after
 * any miss or timeout. The number itself is never shown to the child; it
 * only feeds the timer length and option count (see generateChallenge.ts).
 */

import { useCallback, useRef } from "react";
import { useStoredState } from "../../../shared/storage";

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;
const STREAK_TO_LEVEL_UP = 3;

export function useAdaptiveDifficulty() {
  const [difficulty, setDifficulty] = useStoredState<number>("quickthink:difficulty", MIN_DIFFICULTY);
  const streakRef = useRef(0);

  const reportCorrect = useCallback(() => {
    streakRef.current += 1;
    if (streakRef.current >= STREAK_TO_LEVEL_UP) {
      streakRef.current = 0;
      setDifficulty((prev) => Math.min(MAX_DIFFICULTY, prev + 1));
    }
  }, [setDifficulty]);

  const reportMiss = useCallback(() => {
    streakRef.current = 0;
    setDifficulty((prev) => Math.max(MIN_DIFFICULTY, prev - 1));
  }, [setDifficulty]);

  return { difficulty, reportCorrect, reportMiss };
}
