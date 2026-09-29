import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { playChimeSound, playTapSound } from "../../../shared/sounds";
import { randInt } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Jogo dos Erros" -- football-themed selective attention: two near-identical
 * grids of field-related emoji, stacked (mobile-first). The child hunts the
 * cells in "Time B" that differ from the matching cell in "Time A". Wrong
 * taps just wobble gently -- no punishment, no timer, one focused round.
 */

const FIELD_EMOJI = ["⚽", "🏃", "🥅", "🚩", "🧢", "👕"] as const;

// K (number of differences) scales 2 -> 5 with difficulty.
const K_BY_DIFFICULTY = [2, 3, 4, 4, 5];
// Grid size scales roughly 3x3 -> 5x5 with difficulty.
function gridSizeForDifficulty(difficulty: number): number {
  return Math.min(5, 3 + Math.floor((difficulty - 1) / 2));
}

function buildScene(difficulty: number) {
  const size = gridSizeForDifficulty(difficulty);
  const cellCount = size * size;
  const clampedDifficulty = Math.min(5, Math.max(1, difficulty));
  const k = Math.min(cellCount - 1, K_BY_DIFFICULTY[clampedDifficulty - 1]);

  const top = Array.from({ length: cellCount }, () => FIELD_EMOJI[randInt(0, FIELD_EMOJI.length - 1)]);
  const bottom = [...top];

  const diffIndices = new Set<number>();
  while (diffIndices.size < k) {
    diffIndices.add(randInt(0, cellCount - 1));
  }
  diffIndices.forEach((idx) => {
    const alternatives = FIELD_EMOJI.filter((e) => e !== top[idx]);
    bottom[idx] = alternatives[randInt(0, alternatives.length - 1)];
  });

  return { size, top, bottom, diffIndices };
}

export function SpotDifference({ difficulty, onComplete }: MiniGameProps) {
  const scene = useMemo(() => buildScene(difficulty), [difficulty]);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [falseTaps, setFalseTaps] = useState(0);
  const [wobbleIdx, setWobbleIdx] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const total = scene.diffIndices.size;

  function handleTap(idx: number) {
    if (done || found.has(idx)) return;

    if (scene.diffIndices.has(idx)) {
      playChimeSound();
      const next = new Set(found);
      next.add(idx);
      setFound(next);

      if (next.size >= total) {
        setDone(true);
        const accuracy = total / (total + falseTaps);
        window.setTimeout(() => onComplete({ accuracy, score: total }), 650);
      }
    } else {
      playTapSound();
      setFalseTaps((f) => f + 1);
      setWobbleIdx(idx);
      window.setTimeout(() => setWobbleIdx(null), 320);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          Encontre as diferenças no Time B! Faltam {Math.max(0, total - found.size)}.
        </p>
      </Card>

      <div className="flex flex-col gap-2">
        <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-soft">Time A</span>
        <div className="grid gap-2 rounded-[16px] border border-line bg-card p-2 shadow-soft" style={{ gridTemplateColumns: `repeat(${scene.size}, minmax(0, 1fr))` }}>
          {scene.top.map((emoji, idx) => (
            <div key={idx} className="flex aspect-square items-center justify-center rounded-[10px] bg-paper text-xl">
              {emoji}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-soft">Time B</span>
        <div className="grid gap-2 rounded-[16px] border border-line bg-card p-2 shadow-soft" style={{ gridTemplateColumns: `repeat(${scene.size}, minmax(0, 1fr))` }}>
          {scene.bottom.map((emoji, idx) => {
            const isFound = found.has(idx);
            return (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleTap(idx)}
                className={`flex aspect-square items-center justify-center rounded-[10px] text-xl ${
                  isFound ? "border border-leaf/40 bg-leaf/15" : "bg-paper"
                }`}
                animate={wobbleIdx === idx ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.32 }}
                whileTap={{ scale: 0.9 }}
              >
                {emoji}
              </motion.button>
            );
          })}
        </div>
      </div>

      <FeedbackBanner status={done ? "correct" : null} message="Você achou tudo! Show de bola." />
    </div>
  );
}
