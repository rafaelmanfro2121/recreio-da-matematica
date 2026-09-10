/**
 * Picks a random challenge type + generator and builds one Challenge,
 * sizing the timer and option count to the current adaptive difficulty.
 */

import type { Challenge, ChallengeType } from "../types";
import { BEST_MOVE_GENERATORS } from "../data/bestMoveChallenges";
import { NEXT_STEP_GENERATORS } from "../data/whatsNextChallenges";
import { PATTERN_GENERATORS } from "../data/patternChallenges";
import { pickRandom } from "../data/utils";

const TYPES: ChallengeType[] = ["pattern", "bestMove", "whatsNext"];

/** 3 options at the two easiest levels, 4 (more distractors) from there up. */
export function optionCountForDifficulty(difficulty: number): number {
  return difficulty <= 2 ? 3 : 4;
}

/** Generous 4–7s window: 7s at the easiest level, shrinking gently as difficulty climbs. */
export function timerMsForDifficulty(difficulty: number): number {
  const seconds = 7 - (difficulty - 1) * 0.6;
  return Math.round(seconds * 1000);
}

let idCounter = 0;

export function generateChallenge(difficulty: number, avoidType?: ChallengeType): Challenge {
  let type = pickRandom(TYPES);
  let guard = 0;
  while (type === avoidType && guard < 5) {
    type = pickRandom(TYPES);
    guard += 1;
  }

  const generators =
    type === "pattern" ? PATTERN_GENERATORS : type === "bestMove" ? BEST_MOVE_GENERATORS : NEXT_STEP_GENERATORS;
  const generator = pickRandom(generators);
  const built = generator(optionCountForDifficulty(difficulty));

  idCounter += 1;
  return { id: `qt-${idCounter}`, type, ...built };
}
