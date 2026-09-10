/**
 * The shared interaction shell for every challenge type: a calm animated
 * countdown ring, an optional row of sequence chips (pattern challenges),
 * the prompt, and the choice buttons (vertical for 3 options, 2x2 grid for 4).
 */

import { motion } from "framer-motion";
import type { Challenge } from "../types";

const RING_SIZE = 68;
const RING_STROKE = 7;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimedChoiceGrid({
  challenge,
  ratio,
  status,
  selectedIndex,
  onSelect,
}: {
  challenge: Challenge;
  /** 1 = full time left, 0 = out of time. */
  ratio: number;
  status: "active" | "answered";
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) {
  const clampedRatio = Math.min(1, Math.max(0, ratio));
  const urgent = clampedRatio < 0.3;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="-rotate-90">
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(43,36,64,0.14)"
            strokeWidth={RING_STROKE}
          />
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={urgent ? "#ef5b4e" : "#16a34a"}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - clampedRatio) }}
            transition={{ duration: 0.15, ease: "linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl" aria-hidden="true">
          ⚡
        </span>
      </div>

      {challenge.sequence && (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border-[3px] border-ink bg-paper px-4 py-3 text-2xl shadow-pop">
          {challenge.sequence.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      )}

      <p className="text-center font-display text-lg font-bold leading-snug text-ink">{challenge.prompt}</p>

      <div className={`grid w-full gap-3 ${challenge.options.length > 3 ? "grid-cols-2" : "grid-cols-1"}`}>
        {challenge.options.map((option, i) => {
          const isSelected = selectedIndex === i;
          const isCorrectOption = status === "answered" && i === challenge.correctIndex;
          const isWrongSelected = status === "answered" && isSelected && i !== challenge.correctIndex;
          return (
            <motion.button
              key={i}
              type="button"
              disabled={status === "answered"}
              onClick={() => onSelect(i)}
              whileHover={status === "active" ? { y: -2 } : undefined}
              whileTap={status === "active" ? { y: 3 } : undefined}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`min-h-[56px] rounded-2xl border-[3px] border-ink px-4 py-3 text-center font-body text-base font-bold leading-snug text-ink shadow-pop transition-colors ${
                isCorrectOption ? "bg-leaf" : isWrongSelected ? "bg-coral" : "bg-card"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
