import { useRef } from "react";
import { useStoredState } from "../../../shared/storage";

const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;
const STREAK_TO_LEVEL_UP = 3;

/**
 * Invisible pacing mechanic: tracks a 1-5 difficulty level, persisted across visits.
 * Three correct answers in a row bump it up by one step; a single miss eases it back
 * down by one step (never below 1). The numeric level itself is never shown to the child —
 * puzzle generators read it to scale number ranges, option counts, and subtlety.
 */
export function useAdaptiveDifficulty() {
  const [difficulty, setDifficulty] = useStoredState<number>("logic:difficulty", MIN_DIFFICULTY);
  const streakRef = useRef(0);

  function registerResult(correct: boolean) {
    if (correct) {
      streakRef.current += 1;
      if (streakRef.current >= STREAK_TO_LEVEL_UP) {
        streakRef.current = 0;
        setDifficulty((d) => Math.min(MAX_DIFFICULTY, d + 1));
      }
    } else {
      streakRef.current = 0;
      setDifficulty((d) => Math.max(MIN_DIFFICULTY, d - 1));
    }
  }

  return { difficulty, registerResult };
}
