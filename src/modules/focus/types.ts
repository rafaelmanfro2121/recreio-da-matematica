/**
 * Shared types for "Modo Foco" (attention-training mode). A session is:
 * intro -> breathe -> goal -> three mini-games (sampled from three distinct
 * categories) -> self-rating -> summary. Every mini-game is a self-contained
 * component implementing MiniGameProps.
 *
 * No age split: every child starts every mini-game at difficulty 1 the first
 * time they play it, then climbs (or eases back) purely from performance --
 * "sempre do mais fácil para o mais difícil".
 */

/** The 4 attention skills from the spec -- used only for the summary/labels,
 * never shown to the child as jargon. Each mini-game maps to exactly one. */
export type AttentionType = "sustained" | "selective" | "impulse" | "memory";

/** The 6 content categories the mini-games are grouped into (visual, impulse
 * control, working memory, auditory, reasoning/math, body). A session always
 * draws its 3 games from 3 different categories. Several games lean on a
 * football/sports theme throughout, per the user's request. */
export type GameCategory = "visual" | "impulse" | "memory" | "auditory" | "reasoning" | "body";

export interface MiniGameProps {
  /** 1 (easiest) .. 5 (hardest) -- persisted per game id, adjusted after each run. */
  difficulty: number;
  onComplete: (result: MiniGameRunResult) => void;
}

export interface MiniGameRunResult {
  /** 0..1 */
  accuracy: number;
  /** Small integer, purely for the session recap total -- not shown as a "grade". */
  score: number;
}

export interface MiniGameDef {
  id: string;
  title: string;
  /** Short instruction shown once before the game starts. */
  instructions: string;
  category: GameCategory;
  attentionType: AttentionType;
  emoji: string;
  component: React.ComponentType<MiniGameProps>;
}

export interface SessionGameRecord {
  id: string;
  title: string;
  attentionType: AttentionType;
  accuracy: number;
  score: number;
}

export interface FocusSessionStats {
  goal: string;
  games: SessionGameRecord[];
  totalScore: number;
  averageAccuracy: number;
  goalMet: boolean;
  selfRating: number;
}
