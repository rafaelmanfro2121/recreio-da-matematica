/**
 * "Reação ao padrão" generators — a short sequence of shapes/emoji is shown,
 * then the child picks what continues the pattern (or which one breaks it),
 * under the round timer.
 */

import type { BuiltChallenge, ChallengeGenerator } from "../types";
import { buildOptions, pickRandom, pickTwoDistinct, shuffle } from "./utils";

const SHAPES = ["🔵", "🟡", "🟢", "🔺", "🟣"];
const FRUITS = ["🍎", "🍌", "🍇", "🍊", "🍓"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐻", "🦊"];
const SPORT_ICONS = ["⚽", "🏀", "🎾", "🏐", "🏈"];
const WEATHER = ["☀️", "🌧️", "⛅", "❄️", "⚡"];
const VEHICLES = ["🚗", "🚲", "✈️", "🚀", "⛵"];
const THEMES = [SHAPES, FRUITS, ANIMALS, SPORT_ICONS, WEATHER, VEHICLES];

function randomTheme(exclude?: string[]): string[] {
  const pool = exclude ? THEMES.filter((theme) => theme !== exclude) : THEMES;
  return pickRandom(pool);
}

// 1. A B A B A -> B
function alternatingTwo(optionCount: number): BuiltChallenge {
  const theme = randomTheme();
  const [a, b] = pickTwoDistinct(theme);
  const sequence = [a, b, a, b, a];
  const correct = b;
  const distractorPool = [...theme.filter((item) => item !== a && item !== b), a];
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "O que continua o padrão?",
    sequence,
    options,
    correctIndex,
    reason: `O padrão alterna entre dois símbolos, então o próximo é ${correct}.`,
  };
}

// 2. A B C A B -> C (repeats every 3)
function repeatingThree(optionCount: number): BuiltChallenge {
  const theme = randomTheme();
  const [a, b, c] = shuffle(theme).slice(0, 3);
  const sequence = [a, b, c, a, b];
  const correct = c;
  const distractorPool = theme.filter((item) => item !== c);
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "Qual símbolo continua a sequência?",
    sequence,
    options,
    correctIndex,
    reason: `A sequência se repete de 3 em 3: ${a} ${b} ${c}.`,
  };
}

// 3. growing count of the same shape: 1, 2, 3 -> 4
function growingCount(optionCount: number): BuiltChallenge {
  const theme = randomTheme();
  const shape = pickRandom(theme);
  const sequence = [1, 2, 3].map((n) => shape.repeat(n));
  const correctCount = 4;
  const correct = shape.repeat(correctCount);
  const distractorPool = [2, 3, 5, 6].filter((n) => n !== correctCount).map((n) => shape.repeat(n));
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "Quantos símbolos vêm a seguir?",
    sequence,
    options,
    correctIndex,
    reason: `A quantidade cresce de 1 em 1, então depois de 3 vem ${correctCount}.`,
  };
}

// 4. Odd one out among 4 shown items.
function oddOneOut(optionCount: number): BuiltChallenge {
  const theme = randomTheme();
  const other = randomTheme(theme);
  const same = shuffle(theme).slice(0, 3);
  const odd = pickRandom(other);
  const sequence = shuffle([...same, odd]);
  const { options, correctIndex } = buildOptions(odd, same, Math.min(optionCount, 4));
  return {
    prompt: "Qual desses é diferente dos outros?",
    sequence,
    options,
    correctIndex,
    reason: "Os outros símbolos fazem parte do mesmo grupo — só esse é diferente.",
  };
}

// 5. A B ❓ A B -> the gap follows the same alternating pattern.
function missingMiddle(optionCount: number): BuiltChallenge {
  const theme = randomTheme();
  const [a, b] = pickTwoDistinct(theme);
  const sequence = [a, b, "❓", a, b];
  const correct = a;
  const distractorPool = [...theme.filter((item) => item !== a && item !== b), b];
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "O que fica no lugar da interrogação?",
    sequence,
    options,
    correctIndex,
    reason: `O padrão alterna, então no lugar da ❓ entra ${correct}.`,
  };
}

// 6. Rotating arrows, always turning the same direction.
const ARROWS = ["➡️", "⬇️", "⬅️", "⬆️"];
function rotatingArrows(optionCount: number): BuiltChallenge {
  const start = Math.floor(Math.random() * ARROWS.length);
  const sequence = [0, 1, 2, 3].map((i) => ARROWS[(start + i) % ARROWS.length]);
  const correct = ARROWS[(start + 4) % ARROWS.length];
  const distractorPool = ARROWS.filter((arrow) => arrow !== correct);
  const { options, correctIndex } = buildOptions(correct, distractorPool, Math.min(optionCount, 4));
  return {
    prompt: "Para onde a seta aponta a seguir?",
    sequence,
    options,
    correctIndex,
    reason: "As setas sempre giram na mesma direção.",
  };
}

// 7. Small, big, small, big -> big.
const SIZE_PAIRS: Array<[string, string]> = [
  ["🐜", "🐘"],
  ["🔹", "🔷"],
  ["🟢", "🟩"],
  ["🔸", "🔶"],
];
function sizeAlternating(optionCount: number): BuiltChallenge {
  const pairs = shuffle(SIZE_PAIRS);
  const [small, big] = pairs[0];
  const sequence = [small, big, small, big, small];
  const correct = big;
  const distractorPool = [small, ...pairs.slice(1).flat()];
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "O que vem a seguir no padrão de tamanhos?",
    sequence,
    options,
    correctIndex,
    reason: "O padrão alterna entre pequeno e grande, então depois do pequeno vem o grande.",
  };
}

// 8. A A B A A -> group of two-same-then-different.
function colorRuleGroup(optionCount: number): BuiltChallenge {
  const theme = randomTheme();
  const [a, b] = pickTwoDistinct(theme);
  const sequence = [a, a, b, a, a];
  const correct = b;
  const distractorPool = [...theme.filter((item) => item !== a && item !== b), a];
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "Qual símbolo vem a seguir?",
    sequence,
    options,
    correctIndex,
    reason: "O padrão se repete em grupos: dois iguais e depois um diferente.",
  };
}

// 9. Dice counting from 1 to 6, in order.
const DICE = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
function diceCounting(optionCount: number): BuiltChallenge {
  const start = Math.floor(Math.random() * 2); // 0 or 1, leaves room for start + 4
  const sequence = DICE.slice(start, start + 4);
  const correct = DICE[start + 4];
  const distractorPool = DICE.filter((die) => die !== correct);
  const { options, correctIndex } = buildOptions(correct, distractorPool, Math.min(optionCount, 4));
  return {
    prompt: "Qual dado vem a seguir na contagem?",
    sequence,
    options,
    correctIndex,
    reason: "Os dados estão contando na ordem certa, de 1 até 6.",
  };
}

// 10. Skip-counting with number keycaps (odds or evens).
const KEYCAPS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
function skipCounting(optionCount: number): BuiltChallenge {
  const useOdds = Math.random() < 0.5;
  const sequence = useOdds ? ["1️⃣", "3️⃣", "5️⃣", "7️⃣"] : ["2️⃣", "4️⃣", "6️⃣", "8️⃣"];
  const correct = useOdds ? "9️⃣" : "🔟";
  const distractorPool = KEYCAPS.filter((keycap) => !sequence.includes(keycap) && keycap !== correct);
  const { options, correctIndex } = buildOptions(correct, distractorPool, optionCount);
  return {
    prompt: "Qual número vem a seguir na contagem?",
    sequence,
    options,
    correctIndex,
    reason: `A contagem pula de 2 em 2, então depois vem o ${correct}.`,
  };
}

export const PATTERN_GENERATORS: ChallengeGenerator[] = [
  alternatingTwo,
  repeatingThree,
  growingCount,
  oddOneOut,
  missingMiddle,
  rotatingArrows,
  sizeAlternating,
  colorRuleGroup,
  diceCounting,
  skipCounting,
];
