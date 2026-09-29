import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playChimeSound, playTapSound } from "../../../shared/sounds";
import { correctPhrase } from "../../../shared/copy";
import { randInt } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Sequência Luminosa" -- Simon-pattern working memory: tiles on a football
 * scoreboard light up one at a time, then the child repeats the order by
 * tapping. Length grows with difficulty. A wrong tap ends that round calmly
 * (no buzzer) and the next sequence begins.
 */

const ROUNDS = 4;

const TILES = [
  { emoji: "⚽", tint: "#0891b2" },
  { emoji: "🥅", tint: "#f59e0b" },
  { emoji: "🟨", tint: "#e11d48" },
  { emoji: "🏆", tint: "#22c55e" },
  { emoji: "🧤", tint: "#8b5cf6" },
  { emoji: "👟", tint: "#64748b" },
] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function sequenceLengthFor(difficulty: number): number {
  return Math.min(7, 3 + (difficulty - 1));
}

type Phase = "showing" | "input" | "result";

export function LightSequence({ difficulty, onComplete }: MiniGameProps) {
  const length = sequenceLengthFor(difficulty);

  const [round, setRound] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("showing");
  const [inputIndex, setInputIndex] = useState(0);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const [roundOk, setRoundOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const seq = Array.from({ length }, () => randInt(0, TILES.length - 1));
    setSequence(seq);
    setInputIndex(0);
    setRoundOk(null);
    setPhase("showing");

    async function run() {
      await sleep(500);
      for (const tileIdx of seq) {
        if (cancelled) return;
        setActiveTile(tileIdx);
        await sleep(600);
        if (cancelled) return;
        setActiveTile(null);
        await sleep(250);
      }
      if (cancelled) return;
      setPhase("input");
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, length]);

  function finishRound(success: boolean) {
    setRoundOk(success);
    setPhase("result");
    if (success) {
      playChimeSound();
      setSuccessCount((s) => s + 1);
    }
    window.setTimeout(() => {
      const finalSuccess = success ? successCount + 1 : successCount;
      if (round + 1 >= ROUNDS) {
        onComplete({ accuracy: finalSuccess / ROUNDS, score: finalSuccess });
      } else {
        setRound((r) => r + 1);
      }
    }, 1100);
  }

  function handleTap(tileIdx: number) {
    if (phase !== "input") return;
    if (tileIdx === sequence[inputIndex]) {
      playChimeSound();
      const nextIndex = inputIndex + 1;
      if (nextIndex >= sequence.length) {
        finishRound(true);
      } else {
        setInputIndex(nextIndex);
      }
    } else {
      playTapSound();
      setWrongTile(tileIdx);
      window.setTimeout(() => setWrongTile(null), 320);
      finishRound(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          {phase === "showing" && "Decore a ordem que acende!"}
          {phase === "input" && "Agora toque na mesma ordem!"}
          {phase === "result" && (roundOk ? "Isso aí, sequência completa!" : "Vamos tentar outra sequência!")}
        </p>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {TILES.map((tile, idx) => {
          const isActive = activeTile === idx;
          const isWrong = wrongTile === idx;
          return (
            <motion.button
              key={idx}
              type="button"
              disabled={phase !== "input"}
              onClick={() => handleTap(idx)}
              whileTap={phase === "input" ? { scale: 0.92 } : undefined}
              animate={isWrong ? { x: [0, -4, 4, -3, 3, 0] } : { scale: isActive ? 1.08 : 1 }}
              transition={{ duration: isWrong ? 0.32 : 0.15 }}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[16px] border shadow-soft"
              style={{
                backgroundColor: isActive ? tile.tint : `${tile.tint}18`,
                borderColor: isActive ? tile.tint : "var(--color-line)",
              }}
            >
              <span className="text-2xl">{tile.emoji}</span>
            </motion.button>
          );
        })}
      </div>

      <FeedbackBanner status={phase === "result" ? (roundOk ? "correct" : "retry") : null} message={roundOk ? correctPhrase() : "Quase! Na próxima a gente decora de novo."} />
    </div>
  );
}
