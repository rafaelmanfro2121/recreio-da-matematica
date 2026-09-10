import type { TabuadaProgressMap, TabuadaTableProgress } from "../types";

export const TABUADA_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const TABUADA_REQUEUE_MIN = 2;
export const TABUADA_REQUEUE_MAX = 4;

export function tabuadaTableProgress(all: TabuadaProgressMap, table: number): TabuadaTableProgress {
  return all[table] ?? { stars: 0, bestTimeMs: null, missCounts: {} };
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${String(seconds).padStart(2, "0")}s` : `${seconds}s`;
}
