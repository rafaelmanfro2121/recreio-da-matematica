/**
 * Shared types for the "Desafios da Mente" (logic/reasoning) module.
 * Every puzzle type below renders through the same ChoiceGrid interaction:
 * a heading + prompt, then a grid of tappable options with immediate feedback.
 */

export type PuzzleType = "sequence" | "odd-one-out" | "riddle" | "cause-effect" | "planning" | "figurative" | "emotion";

export interface PuzzleOption {
  /** Stable id, unique within this puzzle's options list. */
  id: string;
  /** What's shown on the option card — text, emoji, or a mix. */
  label: string;
}

export interface Puzzle {
  id: string;
  type: PuzzleType;
  /** Short instruction shown near the mascot, e.g. "O que vem depois?" */
  heading: string;
  /** The puzzle content itself — a sequence, a scenario, a riddle, a goal... */
  prompt: string;
  /** Optional big visual (emoji / short glyph string) shown above the prompt. */
  promptEmoji?: string;
  options: PuzzleOption[];
  correctOptionId: string;
  /** Kid-friendly explanation shown after answering, especially on a miss. */
  explanation: string;
  difficulty: number;
  /** Grid layout hint — 1 column for long text (e.g. planning orderings), 2 for short options. */
  columns: 1 | 2;
}

export interface LogicProgress {
  bestStreak: number;
  totalSolved: number;
  roundsCompleted: number;
}

export const DEFAULT_LOGIC_PROGRESS: LogicProgress = {
  bestStreak: 0,
  totalSolved: 0,
  roundsCompleted: 0,
};
