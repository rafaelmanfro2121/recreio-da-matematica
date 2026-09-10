import { motion } from "framer-motion";
import type { PuzzleOption } from "../types";

/**
 * Shared tap-to-answer grid used by every puzzle type in this module.
 * Selecting an option answers immediately: the chosen card and the correct
 * card both light up, so the child always sees the right answer, even on a miss.
 */
export function ChoiceGrid({
  options,
  correctOptionId,
  selectedId,
  onSelect,
  columns,
}: {
  options: PuzzleOption[];
  correctOptionId: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  columns: 1 | 2;
}) {
  const revealed = selectedId !== null;

  return (
    <div className={`grid gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {options.map((option) => {
        const isCorrect = option.id === correctOptionId;
        const isSelected = option.id === selectedId;
        const showAsCorrect = revealed && isCorrect;
        const showAsWrong = revealed && isSelected && !isCorrect;

        return (
          <motion.button
            key={option.id}
            type="button"
            disabled={revealed}
            aria-pressed={isSelected}
            onClick={() => !revealed && onSelect(option.id)}
            whileHover={revealed ? undefined : { y: -2 }}
            whileTap={revealed ? undefined : { y: 3 }}
            animate={showAsWrong ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className={`flex min-h-[56px] items-center justify-center rounded-2xl border-[3px] px-4 py-3 text-center font-body text-base font-bold leading-snug shadow-pop transition-colors ${
              showAsCorrect
                ? "border-ink bg-leaf/40 text-ink"
                : showAsWrong
                  ? "border-ink bg-coral/35 text-ink"
                  : "border-ink bg-card text-ink"
            } ${revealed && !showAsCorrect && !showAsWrong ? "opacity-60" : ""} disabled:cursor-default`}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
