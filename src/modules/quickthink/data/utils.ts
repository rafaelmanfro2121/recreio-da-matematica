/**
 * Small helpers shared by the challenge generators.
 */

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Picks two distinct random items from a pool. */
export function pickTwoDistinct<T>(items: T[]): [T, T] {
  const [a, b] = shuffle(items);
  return [a, b];
}

/**
 * Builds a shuffled options list containing `correct` plus up to
 * `optionCount - 1` distractors drawn from `distractorPool` (duplicates and
 * the correct value itself are ignored), and returns the correct index
 * after shuffling.
 */
export function buildOptions(
  correct: string,
  distractorPool: string[],
  optionCount: number,
): { options: string[]; correctIndex: number } {
  const uniquePool = Array.from(new Set(distractorPool.filter((item) => item !== correct)));
  const distractors = shuffle(uniquePool).slice(0, Math.max(0, optionCount - 1));
  const options = shuffle([correct, ...distractors]);
  return { options, correctIndex: options.indexOf(correct) };
}
