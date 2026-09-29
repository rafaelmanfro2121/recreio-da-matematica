/** Small random helpers, kept local to this module (same pattern as the other modules). */

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function sample<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
