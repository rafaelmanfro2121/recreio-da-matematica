import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playCorrectSound, playTapSound } from "../../../shared/sounds";
import { correctPhrase } from "../../../shared/copy";
import { shuffle, randInt } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Caça ao Alvo" -- football-themed selective attention: a target ball is
 * shown, then the child hunts for the one matching tile in a grid of
 * similar-looking decoys (other sports balls / other colors). Wrong taps
 * just wobble gently and the round continues -- no punishment, no timer.
 */

const ROUNDS = 6;

// A small "ball" palette: emoji + a color tint, so decoys can be either a
// different ball shape (🏀🎾🏐🏈) or the same ball shape in a different tint.
const BALL_SHAPES = ["⚽", "🏀", "🎾", "🏐", "🏈"] as const;
const TINTS = ["#0891b2", "#f59e0b", "#e11d48", "#22c55e", "#8b5cf6", "#64748b"] as const;

type Tile = { id: string; shape: string; tint: string; isTarget: boolean };

function gridSizeForDifficulty(difficulty: number): number {
  // 3x3 at difficulty 1 up to 5x5 at difficulty 5
  return Math.min(5, 3 + Math.floor((difficulty - 1) / 2));
}

function buildRound(difficulty: number): { tiles: Tile[]; cols: number; target: Tile } {
  const size = gridSizeForDifficulty(difficulty);
  const cellCount = size * size;

  const targetShape = BALL_SHAPES[randInt(0, BALL_SHAPES.length - 1)];
  const targetTint = TINTS[randInt(0, TINTS.length - 1)];
  const target: Tile = { id: "target", shape: targetShape, tint: targetTint, isTarget: true };

  // Higher difficulty -> decoys are more similar to the target (share shape
  // OR share tint, rather than differing in both).
  const similarity = Math.min(1, (difficulty - 1) / 4); // 0..1

  const decoys: Tile[] = [];
  for (let i = 0; i < cellCount - 1; i++) {
    let shape = targetShape;
    let tint = targetTint;
    const makeSimilar = Math.random() < similarity;

    if (makeSimilar) {
      // Share exactly one attribute with the target so it's a near-miss.
      if (Math.random() < 0.5) {
        tint = TINTS.filter((t) => t !== targetTint)[randInt(0, TINTS.length - 2)];
      } else {
        shape = BALL_SHAPES.filter((s) => s !== targetShape)[randInt(0, BALL_SHAPES.length - 2)];
      }
    } else {
      shape = BALL_SHAPES.filter((s) => s !== targetShape)[randInt(0, BALL_SHAPES.length - 2)];
      tint = TINTS.filter((t) => t !== targetTint)[randInt(0, TINTS.length - 2)];
    }

    decoys.push({ id: `decoy-${i}-${shape}-${tint}`, shape, tint, isTarget: false });
  }

  const tiles = shuffle([target, ...decoys]);
  return { tiles, cols: size, target };
}

export function TargetHunt({ difficulty, onComplete }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [status, setStatus] = useState<"correct" | null>(null);

  const roundData = useMemo(() => buildRound(difficulty), [round, difficulty]);

  function handleTap(tile: Tile) {
    if (status) return;
    if (tile.isTarget) {
      playCorrectSound();
      setHits((h) => h + 1);
      setStatus("correct");
      window.setTimeout(() => {
        setStatus(null);
        if (round + 1 >= ROUNDS) {
          const totalTaps = hits + 1 + misses;
          const accuracy = totalTaps > 0 ? (hits + 1) / totalTaps : 1;
          onComplete({ accuracy, score: hits + 1 });
        } else {
          setRound((r) => r + 1);
        }
      }, 500);
    } else {
      playTapSound();
      setMisses((m) => m + 1);
      setWobbleId(tile.id);
      window.setTimeout(() => setWobbleId(null), 320);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="flex flex-col items-center gap-2 text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">Ache a bola igual a essa!</p>
        <div
          className="flex h-16 w-16 items-center justify-center rounded-[14px] border border-line shadow-soft"
          style={{ backgroundColor: `${roundData.target.tint}22` }}
        >
          <span className="text-3xl" style={{ filter: `drop-shadow(0 0 0 ${roundData.target.tint})` }}>
            {roundData.target.shape}
          </span>
        </div>
      </Card>

      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${roundData.cols}, minmax(0, 1fr))` }}
      >
        {roundData.tiles.map((tile) => (
          <motion.button
            key={tile.id}
            type="button"
            onClick={() => handleTap(tile)}
            className="flex aspect-square items-center justify-center rounded-[14px] border border-line bg-card shadow-soft"
            style={{ backgroundColor: `${tile.tint}18` }}
            animate={wobbleId === tile.id ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.32 }}
            whileTap={{ scale: 0.92 }}
          >
            <span className="text-2xl">{tile.shape}</span>
          </motion.button>
        ))}
      </div>

      <FeedbackBanner status={status} message={correctPhrase()} />
    </div>
  );
}
