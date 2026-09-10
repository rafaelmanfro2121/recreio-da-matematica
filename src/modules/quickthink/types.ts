/**
 * Shared types for the "Reflexo Rápido" (quick thinking) module.
 */

export type ChallengeType = "pattern" | "bestMove" | "whatsNext";

/**
 * The raw shape a content generator produces, before an id/type is attached.
 */
export type BuiltChallenge = {
  /** The question shown above the choices. */
  prompt: string;
  /** Optional row of emoji/shape chips shown above the prompt (pattern challenges). */
  sequence?: string[];
  /** Answer choices, already shuffled. */
  options: string[];
  /** Index into `options` that is correct. */
  correctIndex: number;
  /** One-line kid-friendly explanation shown after a miss or timeout. */
  reason: string;
};

export type Challenge = BuiltChallenge & {
  id: string;
  type: ChallengeType;
};

/** A single content generator: given how many options to produce, builds one challenge. */
export type ChallengeGenerator = (optionCount: number) => BuiltChallenge;

export type SessionStats = {
  totalRounds: number;
  correctCount: number;
  missedCount: number;
  bestStreakThisSession: number;
  isNewBestStreak: boolean;
  avgReactionMs: number;
  isNewBestAvg: boolean;
};
