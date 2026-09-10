/**
 * Static class-name lookup tables keyed by tone. Kept as literal strings (not
 * template-built) so Tailwind's static scanner can find them at build time.
 */
import type { LevelTone } from "./types";

export const TONE_BG: Record<LevelTone, string> = {
  add: "bg-op-add",
  subtract: "bg-op-subtract",
  multiply: "bg-op-multiply",
  divide: "bg-op-divide",
  sun: "bg-sun",
};

export const TONE_TEXT: Record<LevelTone, string> = {
  add: "text-op-add",
  subtract: "text-op-subtract",
  multiply: "text-op-multiply",
  divide: "text-op-divide",
  sun: "text-sun",
};
