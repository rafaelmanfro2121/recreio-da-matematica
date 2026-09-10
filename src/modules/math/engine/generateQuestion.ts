import { pick, shuffle } from "./random";
import { TEMPLATES } from "../data/templates";
import type { Operation, Question } from "../types";

export const QUESTIONS_PER_ROUND = 8;

export function generateWordProblem(operation: Operation): Question {
  const templates = TEMPLATES[operation];
  const built = pick(templates)();
  const key = `${operation}|${built.text}|${built.question}`;
  return {
    aFormat: "count",
    bFormat: "count",
    answerFormat: "count",
    ...built,
    operation,
    key,
  };
}

/** Spreads the round's operations as evenly as possible, then shuffles the order. */
export function balancedOps(ops: Operation[], count: number): Operation[] {
  const arr: Operation[] = [];
  for (let i = 0; i < count; i++) arr.push(ops[i % ops.length]);
  return shuffle(arr);
}

/**
 * Builds one round of questions, avoiding repeating the exact same generated
 * problem (same text+question) within the set already seen this round.
 */
export function generateRound(ops: Operation[]): Question[] {
  const usedKeys = new Set<string>();
  const seq = balancedOps(ops, QUESTIONS_PER_ROUND);
  const round: Question[] = [];
  seq.forEach((op) => {
    let q: Question | null = null;
    for (let i = 0; i < 40; i++) {
      const candidate = generateWordProblem(op);
      if (!usedKeys.has(candidate.key)) {
        q = candidate;
        break;
      }
    }
    if (!q) q = generateWordProblem(op);
    usedKeys.add(q.key);
    round.push(q);
  });
  return round;
}
