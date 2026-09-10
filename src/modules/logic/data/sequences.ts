import type { Puzzle, PuzzleOption } from "../types";
import { chance, pick, sample, shuffle, uid } from "../engine/random";

/** Builds 4 shuffled numeric options around the correct answer (no duplicates). */
function numericOptions(correct: number, spread: number): PuzzleOption[] {
  const values = new Set<number>([correct]);
  let guard = 0;
  while (values.size < 4 && guard < 50) {
    guard++;
    const delta = pick([-2, -1, 1, 2, spread, -spread]);
    const candidate = correct + delta * (1 + Math.floor(guard / 6));
    if (candidate !== correct) values.add(candidate);
  }
  return shuffle([...values]).map((v) => ({ id: uid(), label: String(v) }));
}

interface NumericTemplate {
  minDifficulty: number;
  build: () => { terms: number[]; next: number; explanation: string; spread: number };
}

const NUMERIC_TEMPLATES: NumericTemplate[] = [
  {
    // small ascending step
    minDifficulty: 1,
    build: () => {
      const start = 1 + Math.floor(Math.random() * 8);
      const step = 1 + Math.floor(Math.random() * 3);
      const terms = [0, 1, 2, 3].map((i) => start + i * step);
      return {
        terms,
        next: start + 4 * step,
        explanation: `A cada número, some ${step}.`,
        spread: step,
      };
    },
  },
  {
    // skip counting by 5s or 10s
    minDifficulty: 1,
    build: () => {
      const step = pick([5, 10]);
      const start = step * (1 + Math.floor(Math.random() * 4));
      const terms = [0, 1, 2, 3].map((i) => start + i * step);
      return {
        terms,
        next: start + 4 * step,
        explanation: `É a contagem de ${step} em ${step}.`,
        spread: step,
      };
    },
  },
  {
    // descending small step
    minDifficulty: 2,
    build: () => {
      const step = 1 + Math.floor(Math.random() * 3);
      const start = 20 + Math.floor(Math.random() * 20);
      const terms = [0, 1, 2, 3].map((i) => start - i * step);
      return {
        terms,
        next: start - 4 * step,
        explanation: `A cada número, diminui ${step}.`,
        spread: step,
      };
    },
  },
  {
    // bigger ascending step
    minDifficulty: 2,
    build: () => {
      const step = 4 + Math.floor(Math.random() * 6);
      const start = 1 + Math.floor(Math.random() * 10);
      const terms = [0, 1, 2, 3].map((i) => start + i * step);
      return {
        terms,
        next: start + 4 * step,
        explanation: `A cada número, some ${step}.`,
        spread: step,
      };
    },
  },
  {
    // bigger descending step
    minDifficulty: 3,
    build: () => {
      const step = 4 + Math.floor(Math.random() * 6);
      const start = 60 + Math.floor(Math.random() * 30);
      const terms = [0, 1, 2, 3].map((i) => start - i * step);
      return {
        terms,
        next: start - 4 * step,
        explanation: `A cada número, diminui ${step}.`,
        spread: step,
      };
    },
  },
  {
    // doubling
    minDifficulty: 3,
    build: () => {
      const start = 1 + Math.floor(Math.random() * 5);
      const terms = [0, 1, 2, 3].map((i) => start * 2 ** i);
      return {
        terms,
        next: start * 2 ** 4,
        explanation: "Cada número é o dobro do anterior.",
        spread: Math.max(2, start),
      };
    },
  },
  {
    // alternating +a / +b
    minDifficulty: 4,
    build: () => {
      const a = 1 + Math.floor(Math.random() * 4);
      const b = a + 2 + Math.floor(Math.random() * 4);
      const start = 1 + Math.floor(Math.random() * 6);
      const steps = [a, b, a, b];
      const terms = [start];
      for (const s of steps.slice(0, 3)) terms.push(terms[terms.length - 1] + s);
      return {
        terms,
        next: terms[terms.length - 1] + steps[3],
        explanation: `O padrão alterna: some ${a}, depois some ${b}, e repete.`,
        spread: b,
      };
    },
  },
  {
    // fibonacci-ish (each term = sum of the two before it)
    minDifficulty: 5,
    build: () => {
      const a = 1 + Math.floor(Math.random() * 3);
      const b = 1 + Math.floor(Math.random() * 3);
      const terms = [a, b, a + b, a + 2 * b];
      return {
        terms,
        next: terms[2] + terms[3],
        explanation: "Cada número é a soma dos dois números anteriores.",
        spread: terms[3],
      };
    },
  },
];

function buildNumericSequencePuzzle(difficulty: number): Puzzle {
  const eligible = NUMERIC_TEMPLATES.filter((t) => t.minDifficulty <= difficulty + 1);
  const template = pick(eligible.length ? eligible : NUMERIC_TEMPLATES.filter((t) => t.minDifficulty === 1));
  const { terms, next, explanation, spread } = template.build();
  const options = numericOptions(next, spread || 3);
  const correct = options.find((o) => Number(o.label) === next)!;

  return {
    id: uid(),
    type: "sequence",
    heading: "O que vem depois?",
    prompt: `${terms.join(", ")}, ?`,
    options,
    correctOptionId: correct.id,
    explanation,
    difficulty,
    columns: 2,
  };
}

interface EmojiPool {
  symbols: string[];
  distractors: string[];
}

const EMOJI_POOLS: EmojiPool[] = [
  { symbols: ["🔴", "🔵"], distractors: ["🟡", "🟢", "🟣"] },
  { symbols: ["⭐", "🌙"], distractors: ["☀️", "☁️", "⚡"] },
  { symbols: ["🍎", "🍌"], distractors: ["🍇", "🍊", "🍉"] },
  { symbols: ["🐶", "🐱"], distractors: ["🐰", "🐻", "🐸"] },
  { symbols: ["🔺", "🟦"], distractors: ["🟩", "⚪", "🔶"] },
  { symbols: ["🟢", "🟡", "🔴"], distractors: ["🔵", "🟣", "⚫"] },
  { symbols: ["🍓", "🍇", "🍋"], distractors: ["🍒", "🍑", "🍍"] },
];

function buildEmojiPatternPuzzle(difficulty: number): Puzzle {
  const unitLength = difficulty >= 3 && chance(0.6) ? 3 : 2;
  const pools = EMOJI_POOLS.filter((p) => p.symbols.length === unitLength);
  const poolChoice = pick(pools.length ? pools : EMOJI_POOLS);
  const unit = poolChoice.symbols;
  const visibleTerms = difficulty >= 4 ? 7 : 5;

  const sequence: string[] = [];
  for (let i = 0; i < visibleTerms; i++) sequence.push(unit[i % unit.length]);
  const next = unit[visibleTerms % unit.length];

  const distractorPool = poolChoice.distractors.length ? poolChoice.distractors : ["⬜", "🔶", "🟤"];
  const wrongChoices = sample(
    unit.filter((s) => s !== next).concat(distractorPool),
    3,
  );
  const options = shuffle([next, ...wrongChoices]).map((label) => ({ id: uid(), label }));
  const correct = options.find((o) => o.label === next)!;

  return {
    id: uid(),
    type: "sequence",
    heading: "O que vem depois?",
    prompt: sequence.join(" "),
    options,
    correctOptionId: correct.id,
    explanation: `O desenho se repete de ${unitLength} em ${unitLength} — olha o padrão de novo desde o começo.`,
    difficulty,
    columns: 2,
  };
}

export function generateSequencePuzzle(difficulty: number): Puzzle {
  return chance(0.55) ? buildNumericSequencePuzzle(difficulty) : buildEmojiPatternPuzzle(difficulty);
}
