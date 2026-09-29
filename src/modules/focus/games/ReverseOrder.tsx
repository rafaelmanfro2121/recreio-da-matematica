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
 * "Ordem ao Contrário" -- working memory with a twist: jersey numbers flash
 * one at a time, then the child must tap them back in REVERSE order. Options
 * are shuffled on screen so it can't be solved by position alone.
 */

const ROUNDS = 4;
const NUMBER_POOL = Array.from({ length: 30 }, (_, i) => i + 1);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function sequenceLengthFor(difficulty: number): number {
  return Math.min(6, 3 + Math.floor((difficulty - 1) / 1.3));
}

type Phase = "showing" | "input" | "result";

export function ReverseOrder({ difficulty, onComplete }: MiniGameProps) {
  const length = sequenceLengthFor(difficulty);

  const [round, setRound] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [shownIndex, setShownIndex] = useState(-1);
  const [phase, setPhase] = useState<Phase>("showing");
  const [inputIndex, setInputIndex] = useState(0);
  const [wrongValue, setWrongValue] = useState<number | null>(null);
  const [roundOk, setRoundOk] = useState<boolean | null>(null);

  const optionOrder = useMemo(() => shuffle(sequence), [sequence]);
  const targetOrder = useMemo(() => [...sequence].reverse(), [sequence]);

  useEffect(() => {
    let cancelled = false;
    const seq = sample(NUMBER_POOL, length);
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
        await sleep(750);
        if (cancelled) return;
        setShownIndex(-1);
        await sleep(200);
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

  function handleTap(value: number) {
    if (phase !== "input") return;
    if (value === targetOrder[inputIndex]) {
      playChimeSound();
      const nextIndex = inputIndex + 1;
      if (nextIndex >= targetOrder.length) {
        finishRound(true);
      } else {
        setInputIndex(nextIndex);
      }
    } else {
      playTapSound();
      setWrongValue(value);
      window.setTimeout(() => setWrongValue(null), 320);
      finishRound(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          {phase === "showing" && "Decore os números da camisa, na ordem!"}
          {phase === "input" && "Agora toque de trás pra frente!"}
          {phase === "result" && (roundOk ? "Isso aí, ordem contrária certinha!" : "Vamos tentar outra sequência!")}
        </p>
      </Card>

      <div className="flex min-h-[72px] items-center justify-center">
        {phase === "showing" && shownIndex >= 0 && (
          <motion.span
            key={shownIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-5xl font-extrabold text-world-focus"
          >
            {sequence[shownIndex]}
          </motion.span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {optionOrder.map((value) => {
          const isWrong = wrongValue === value;
          return (
            <motion.button
              key={value}
              type="button"
              disabled={phase !== "input"}
              onClick={() => handleTap(value)}
              whileTap={phase === "input" ? { scale: 0.92 } : undefined}
              animate={isWrong ? { x: [0, -4, 4, -3, 3, 0] } : {}}
              transition={{ duration: 0.32 }}
              className="flex aspect-square items-center justify-center rounded-[16px] border border-line bg-card font-display text-2xl font-extrabold text-ink shadow-soft"
            >
              {value}
            </motion.button>
          );
        })}
      </div>

      <FeedbackBanner status={phase === "result" ? (roundOk ? "correct" : "retry") : null} message={roundOk ? correctPhrase() : "Quase! Vamos decorar de novo."} />
    </div>
  );
}
