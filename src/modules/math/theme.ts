/**
 * Static class-name lookup tables keyed by tone. Kept as literal strings (not
 * template-built) so Tailwind's static scanner can find them at build time.
 */
import type { LevelTone } from "./types";

export const TONE_BG: Record<LevelTone, string> = {
  add: "bg-gradient-to-br from-op-add-light to-op-add",
  subtract: "bg-gradient-to-br from-op-subtract-light to-op-subtract",
  multiply: "bg-gradient-to-br from-op-multiply-light to-op-multiply",
  divide: "bg-gradient-to-br from-op-divide-light to-op-divide",
  sun: "bg-gradient-to-br from-sun to-sun",
};

export const TONE_TEXT: Record<LevelTone, string> = {
  add: "text-op-add",
  subtract: "text-op-subtract",
  multiply: "text-op-multiply",
  divide: "text-op-divide",
  sun: "text-sun",
};
