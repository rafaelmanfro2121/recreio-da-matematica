import type { GameCategory, MiniGameDef } from "../types";
import { pick, sample } from "./random";

/** Always exactly 3 games, from 3 different categories, one random pick per category. */
export function pickSessionGames(registry: MiniGameDef[]): MiniGameDef[] {
  const categories = Array.from(new Set(registry.map((g) => g.category))) as GameCategory[];
  const chosenCategories = sample(categories, Math.min(3, categories.length));
  return chosenCategories.map((cat) => pick(registry.filter((g) => g.category === cat)));
}

export const SESSION_GOALS = [
  "Não desistir",
  "Ir até o fim sem pressa",
  "Ficar de boa mesmo se errar",
  "Prestar atenção até o apito final",
  "Pensar antes de agir",
];
