import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playChimeSound, playTapSound } from "../../../shared/sounds";
import { correctPhrase } from "../../../shared/copy";
import { shuffle, sample } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Movimento Espelho" -- body + working memory: a sequence of movements is
 * shown one at a time; the child is invited to actually perform each one
 * (honesty-based, unmeasured) while also memorizing the order, then taps
 * the movement icons back in the SAME order they appeared.
 */

const ROUNDS = 4;

const MOVES = [
  { emoji: "🤸", label: "pular" },
  { emoji: "🙆", label: "levantar os braços" },
  { emoji: "🔄", label: "girar" },
  { emoji: "🧍", label: "ficar em pé" },
  { emoji: "👏", label: "bater palma" },
  { emoji: "🦵", label: "chutar o ar" },
] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function sequenceLengthFor(difficulty: number): number {
  return Math.min(6, 3 + Math.floor((difficulty - 1) / 1.3));
}

type Phase = "showing" | "input" | "result";

export function MirrorMovement({ difficulty, onComplete }: MiniGameProps) {
  const length = sequenceLengthFor(difficulty);

  const [round, setRound] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [sequence, setSequence] = useState<(typeof MOVES)[number][]>([]);
  const [shownIndex, setShownIndex] = useState(-1);
  const [phase, setPhase] = useState<Phase>("showing");
  const [inputIndex, setInputIndex] = useState(0);
  const [wrongLabel, setWrongLabel] = useState<string | null>(null);
  const [roundOk, setRoundOk] = useState<boolean | null>(null);

  const optionOrder = useMemo(() => shuffle(sequence), [sequence]);

  useEffect(() => {
    let cancelled = false;
    const seq = sample(MOVES, length);
    setSequence(seq);
    setInputIndex(0);
    setRoundOk(null);
    setPhase("showing");
    setShownIndex(-1);

    async function run() {
      await sleep(400);
      for (let i = 0; i < seq.length; i++) {
        if (cancelled) return;
        setShownIndex(i);
        await sleep(900);
        if (cancelled) return;
        setShownIndex(-1);
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

  function handleTap(move: (typeof MOVES)[number]) {
    if (phase !== "input") return;
    if (move.label === sequence[inputIndex].label) {
      playChimeSound();
      const nextIndex = inputIndex + 1;
      if (nextIndex >= sequence.length) {
        finishRound(true);
      } else {
        setInputIndex(nextIndex);
      }
    } else {
      playTapSound();
      setWrongLabel(move.label);
      window.setTimeout(() => setWrongLabel(null), 320);
      finishRound(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          {phase === "showing" && "Faça o movimento e decore a ordem!"}
          {phase === "input" && "Toque nos movimentos na mesma ordem!"}
          {phase === "result" && (roundOk ? "Isso aí, ordem certinha!" : "Vamos tentar outra sequência!")}
        </p>
      </Card>

      <div className="flex min-h-[110px] flex-col items-center justify-center gap-2">
        {phase === "showing" && shownIndex >= 0 && (
          <motion.div
            key={shownIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-6xl">{sequence[shownIndex].emoji}</span>
            <span className="font-body text-sm font-bold text-ink-soft">{sequence[shownIndex].label}</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {optionOrder.map((move) => {
          const isWrong = wrongLabel === move.label;
          return (
            <motion.button
              key={move.label}
              type="button"
              disabled={phase !== "input"}
              onClick={() => handleTap(move)}
              whileTap={phase === "input" ? { scale: 0.92 } : undefined}
              animate={isWrong ? { x: [0, -4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.32 }}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[16px] border border-line bg-card shadow-soft"
            >
              <span className="text-3xl">{move.emoji}</span>
            </motion.button>
          );
        })}
      </div>

      <FeedbackBanner status={phase === "result" ? (roundOk ? "correct" : "retry") : null} message={roundOk ? correctPhrase() : "Quase! Vamos decorar de novo."} />
    </div>
  );
}
