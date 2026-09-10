/**
 * Shared types for the Matemática module.
 */

export type Operation = "add" | "subtract" | "multiply" | "divide";

export type NumberFormat = "count" | "money";

/** Matches the Tone union accepted by shared/components/Button.tsx. */
export type Tone = "add" | "subtract" | "multiply" | "divide" | "math" | "logic" | "quick" | "ink" | "sun";

export type OpTone = "add" | "subtract" | "multiply" | "divide";

export type LevelTone = OpTone | "sun";

export interface OpMeta {
  label: string;
  symbol: string;
  tone: OpTone;
}

/** What a word-problem template generator returns before operation/key metadata is attached. */
export interface BuiltProblem {
  text: string;
  question: string;
  a: number;
  b: number;
  answer: number;
  reason: string;
  aFormat?: NumberFormat;
  bFormat?: NumberFormat;
  answerFormat?: NumberFormat;
}

export type WordProblemTemplate = () => BuiltProblem;

export interface Question extends BuiltProblem {
  operation: Operation;
  key: string;
  aFormat: NumberFormat;
  bFormat: NumberFormat;
  answerFormat: NumberFormat;
}

export interface Level {
  id: string;
  title: string;
  symbolText: string;
  ops: Operation[];
  explainOps: Operation[];
  tone: LevelTone;
  description: string;
  contrastNote?: string;
}

export interface LessonExample {
  text: string;
  question: string;
  a: number;
  b: number;
  answer: number;
}

export interface LessonContent {
  title: string;
  whatItIs: string;
  whenToUse: string;
  keywords: string[];
  example: LessonExample;
  moneyNote?: string;
}

export interface QuizCue {
  text: string;
  keyword: string;
}

export interface QuizItem extends QuizCue {
  operation: Operation;
}

export interface MathProgress {
  unlockedLevelIndex: number;
  stars: Record<string, number>;
  /** Levels whose lesson has already been shown once — lets repeat plays skip straight to practice. */
  lessonSeen: string[];
}

export interface TabuadaFact {
  table: number;
  m: number;
  answer: number;
}

export interface TabuadaTableProgress {
  stars: number;
  bestTimeMs: number | null;
  missCounts: Record<number, number>;
}

export type TabuadaProgressMap = Record<number, TabuadaTableProgress>;
