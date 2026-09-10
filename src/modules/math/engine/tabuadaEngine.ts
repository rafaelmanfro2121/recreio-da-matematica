/**
 * Tabuada spaced-repetition drill logic, ported from the proven old build:
 * facts are drawn in randomized (not sequential 1x-10x) order, and facts the
 * child has historically missed are weighted to appear earlier via a persisted
 * per-table missCounts map. A miss within a round requeues that fact a few
 * questions later instead of moving straight on.
 */
import { randInt } from "./random";
import { TABUADA_REQUEUE_MAX, TABUADA_REQUEUE_MIN, TABUADA_TABLES } from "../data/tabuada";
import type { TabuadaFact } from "../types";

export function buildTabuadaQueue(table: number, missCounts: Record<number, number>): TabuadaFact[] {
  const facts: TabuadaFact[] = TABUADA_TABLES.map((m) => ({ table, m, answer: table * m }));
  return facts
    .map((f) => ({ f, sortKey: Math.random() - (missCounts[f.m] || 0) * 0.15 }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((x) => x.f);
}

export function requeueInsertIndex(queueLength: number): number {
  return Math.min(queueLength, randInt(TABUADA_REQUEUE_MIN, TABUADA_REQUEUE_MAX));
}

/** Stars are only ever "best-time" quality on a zero-miss run. */
export function computeStars(misses: number): number {
  return misses === 0 ? 3 : misses <= 3 ? 2 : 1;
}
