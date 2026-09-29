/**
 * Per-mini-game adaptive difficulty (1..5), persisted separately for every
 * game id so each one finds its own level over time. Every game starts
 * everyone at 1 (easiest) the first time it's ever played -- there's no age
 * split, just "sempre do mais fácil para o mais difícil": the child climbs
 * on their own performance.
 *   accuracy >= 85%  -> one step harder
 *   accuracy <  60%  -> one step easier
 *   otherwise        -> stays put ("difícil mas possível")
 * Call `reportRun(accuracy)` once, at the end of a mini-game's run.
 */

import { useCallback } from "react";
import { useStoredState } from "../../../shared/storage";

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;

export function useGameDifficulty(gameId: string) {
  const [difficulty, setDifficulty] = useStoredState<number>(`focus:difficulty:${gameId}`, MIN_DIFFICULTY);

  const reportRun = useCallback(
    (accuracy: number) => {
      if (accuracy >= 0.85) setDifficulty((d) => Math.min(MAX_DIFFICULTY, d + 1));
      else if (accuracy < 0.6) setDifficulty((d) => Math.max(MIN_DIFFICULTY, d - 1));
    },
    [setDifficulty],
  );

  return { difficulty, reportRun };
}
