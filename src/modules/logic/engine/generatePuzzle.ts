import type { Puzzle, PuzzleType } from "../types";
import { generateCauseEffectPuzzle } from "../data/causeEffect";
import { generateEmotionPuzzle } from "../data/emotions";
import { generateFigurativePuzzle } from "../data/figurativeLanguage";
import { generateOddOneOutPuzzle } from "../data/oddOneOut";
import { generatePlanningPuzzle } from "../data/planning";
import { generateRiddlePuzzle } from "../data/riddles";
import { generateSequencePuzzle } from "../data/sequences";
import { generateSocialPuzzle } from "../data/socialSkills";
import { pick } from "./random";

// "figurative", "emotion" and "social" are woven into the same rotation as
// everything else on purpose — they must never read as a separate, labeled section.
const ALL_TYPES: PuzzleType[] = [
  "sequence",
  "odd-one-out",
  "riddle",
  "cause-effect",
  "planning",
  "figurative",
  "emotion",
  "social",
];

function buildByType(type: PuzzleType, difficulty: number): Puzzle {
  switch (type) {
    case "sequence":
      return generateSequencePuzzle(difficulty);
    case "odd-one-out":
      return generateOddOneOutPuzzle(difficulty);
    case "riddle":
      return generateRiddlePuzzle(difficulty);
    case "cause-effect":
      return generateCauseEffectPuzzle(difficulty);
    case "planning":
      return generatePlanningPuzzle(difficulty);
    case "figurative":
      return generateFigurativePuzzle(difficulty);
    case "emotion":
      return generateEmotionPuzzle(difficulty);
    case "social":
      return generateSocialPuzzle(difficulty);
  }
}

/**
 * Picks a puzzle type (avoiding an immediate repeat of the previous one when possible)
 * and delegates to that type's generator, scaled to the given difficulty level.
 */
export function generatePuzzle(difficulty: number, avoidType?: PuzzleType): Puzzle {
  const pool = avoidType ? ALL_TYPES.filter((t) => t !== avoidType) : ALL_TYPES;
  const type = pick(pool.length ? pool : ALL_TYPES);
  return buildByType(type, difficulty);
}
