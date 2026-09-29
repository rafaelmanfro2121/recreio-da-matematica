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
 * "Siga a Bola" -- football-framed shell game: the ball starts under one
 * cup, the cups swap places a few times (followable, not frantic), then the
 * child taps the cup they think hides the ball. A wrong guess just gets a
 * calm reveal of where the ball really was -- no buzzer, no penalty.
 */

const ROUNDS = 5;
// Number of swaps scales 2 -> 5 with difficulty.
const SWAPS_BY_DIFFICULTY = [2, 3, 3, 4, 5];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cupCountForDifficulty(difficulty: number): number {
  // 3 cups at difficulty 1, up to 5 cups at difficulty 5.
  return Math.min(5, 3 + Math.floor((difficulty - 1) / 2));
}

type Phase = "reveal" | "hidden" | "shuffling" | "guessing" | "result";

export function FollowBall({ difficulty, onComplete }: MiniGameProps) {
  const cupCount = cupCountForDifficulty(difficulty);
  const clampedDifficulty = Math.min(5, Math.max(1, difficulty));
  const swapsCount = SWAPS_BY_DIFFICULTY[clampedDifficulty - 1];

  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("reveal");
  const [slots, setSlots] = useState<number[]>(() => Array.from({ length: cupCount }, (_, i) => i));
  const [ballId, setBallId] = useState<number>(() => randInt(0, cupCount - 1));
  const [guessId, setGuessId] = useState<number | null>(null);

  // Drives one full round: reveal the ball, hide it, shuffle, then let the
  // child guess. Cancellable so it never sets state after the round moves on.
  useEffect(() => {
    let cancelled = false;
    const startingBall = randInt(0, cupCount - 1);
    const startingSlots = Array.from({ length: cupCount }, (_, i) => i);

    setBallId(startingBall);
    setSlots(startingSlots);
    setGuessId(null);
    setPhase("reveal");

    async function run() {
      await sleep(1100);
      if (cancelled) return;
      setPhase("hidden");

      await sleep(350);
      if (cancelled) return;
      setPhase("shuffling");

      let current = startingSlots;
      for (let step = 0; step < swapsCount; step++) {
        if (cancelled) return;
        const a = randInt(0, cupCount - 1);
        let b = randInt(0, cupCount - 1);
        while (b === a) b = randInt(0, cupCount - 1);
        current = current.slice();
        [current[a], current[b]] = [current[b], current[a]];
        setSlots(current);
        await sleep(750);
      }

      if (cancelled) return;
      setPhase("guessing");
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, cupCount, swapsCount]);

  function handleGuess(id: number) {
    if (phase !== "guessing") return;
    const isCorrect = id === ballId;
    setGuessId(id);
    setPhase("result");

    if (isCorrect) {
      playChimeSound();
      setCorrectCount((c) => c + 1);
    } else {
      playTapSound();
    }

    window.setTimeout(() => {
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      if (round + 1 >= ROUNDS) {
        onComplete({ accuracy: finalCorrect / ROUNDS, score: finalCorrect });
      } else {
        setRound((r) => r + 1);
      }
    }, 1100);
  }

  const orderedIds = [...slots.keys()].sort((idA, idB) => slots[idA] - slots[idB]);

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          {phase === "reveal" && "A bola está aqui, olha bem!"}
          {phase === "hidden" && "Prontinho, vamos embaralhar!"}
          {phase === "shuffling" && "Olha as trocas com atenção..."}
          {phase === "guessing" && "Onde a bola está?"}
          {phase === "result" && (guessId === ballId ? "Isso mesmo!" : "Vamos ver onde ela estava!")}
        </p>
      </Card>

      <div className="flex items-end justify-center gap-3 py-6">
        {orderedIds.map((id) => {
          const showBall = phase === "reveal" && id === ballId;
          const revealBall = phase === "result" && id === ballId;
          const isGuess = phase === "result" && id === guessId;
          const clickable = phase === "guessing";

          return (
            <motion.button
              key={id}
              type="button"
              layout
              transition={{ duration: 0.5, ease: "easeInOut" }}
              disabled={!clickable}
              onClick={() => handleGuess(id)}
              className={`relative flex h-20 w-16 flex-col items-center justify-end ${clickable ? "cursor-pointer" : "cursor-default"}`}
              whileTap={clickable ? { scale: 0.94 } : undefined}
            >
              {(showBall || revealBall) && (
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-2 text-2xl"
                  aria-hidden="true"
                >
                  ⚽
                </motion.span>
              )}
              <div
                className={`h-14 w-14 rounded-t-[28px] rounded-b-[6px] border shadow-soft ${
                  revealBall
                    ? "border-leaf/50 bg-leaf/15"
                    : isGuess && !revealBall
                      ? "border-line bg-card"
                      : "border-line bg-gradient-to-b from-world-focus-light/40 to-world-focus/30"
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      <FeedbackBanner
        status={phase === "result" ? "correct" : null}
        message={guessId === ballId ? correctPhrase() : "A bola estava aqui, olha!"}
      />
    </div>
  );
}
