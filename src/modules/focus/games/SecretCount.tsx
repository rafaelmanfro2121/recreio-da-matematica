import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { RingTimer } from "./RingTimer";
import { playFocusTargetSound, playFocusDecoySound } from "../../../shared/sounds";
import { randInt } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Contagem Secreta" -- auditory sustained attention: over a short training
 * window, "gol" (target) events and more frequent "passe" (decoy) events
 * fire at random-ish intervals. No counter or tally is ever shown while it
 * plays -- the child counts the goals silently in their head, then submits
 * a guess at the end. Scored by closeness rather than exact-or-nothing, so
 * a near miss still feels like progress.
 */

const TARGET_PROB = 0.3;
const MAX_GUESS = 12;

function windowMsForDifficulty(difficulty: number): number {
  // 20s at difficulty 1 up to ~55s at difficulty 5.
  return Math.round(20000 + ((difficulty - 1) / 4) * 35000);
}

function gapRangeForDifficulty(difficulty: number): [number, number] {
  // Pace tightens a bit with difficulty so more events fit in the window.
  const center = Math.round(1900 - ((difficulty - 1) / 4) * 700);
  return [Math.max(700, center - 450), center + 450];
}

type Phase = "idle" | "playing" | "guessing" | "done";
type PulseKind = "target" | "decoy" | null;

export function SecretCount({ difficulty, onComplete }: MiniGameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pulse, setPulse] = useState<PulseKind>(null);
  const [ratio, setRatio] = useState(0);
  const [guess, setGuess] = useState(0);
  const [actualCount, setActualCount] = useState<number | null>(null);

  const targetCountRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const windowMs = windowMsForDifficulty(difficulty);
  const [gapMin, gapMax] = gapRangeForDifficulty(difficulty);

  function clearTimer() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function scheduleNext(startedAt: number) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= windowMs) {
      setRatio(1);
      setPulse(null);
      setPhase("guessing");
      setActualCount(targetCountRef.current);
      return;
    }
    const gap = randInt(gapMin, gapMax);
    timeoutRef.current = window.setTimeout(() => {
      const isTarget = Math.random() < TARGET_PROB;
      if (isTarget) {
        targetCountRef.current += 1;
        playFocusTargetSound();
        setPulse("target");
      } else {
        playFocusDecoySound();
        setPulse("decoy");
      }
      window.setTimeout(() => setPulse(null), 380);
      setRatio(Math.min(1, (Date.now() - startedAt) / windowMs));
      scheduleNext(startedAt);
    }, gap);
  }

  function start() {
    targetCountRef.current = 0;
    setActualCount(null);
    setGuess(0);
    setPhase("playing");
    setRatio(0);
    scheduleNext(Date.now());
  }

  function submitGuess() {
    const actual = actualCount ?? 0;
    const diff = Math.abs(guess - actual);
    const accuracy = diff === 0 ? 1 : diff === 1 ? 0.7 : diff === 2 ? 0.4 : diff <= 4 ? 0.2 : 0;
    setPhase("done");
    window.setTimeout(() => onComplete({ accuracy, score: Math.round(accuracy * 10) }), 600);
  }

  useEffect(() => clearTimer, []);

  return (
    <div className="flex flex-col gap-5">
      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          {phase === "guessing" || phase === "done"
            ? "Quantos gols o time marcou nesse treino?"
            : "Fique de olho (e ouvido) no treino e conte em silêncio quantos GOLS o time marca. Não mostramos o placar!"}
        </p>
      </Card>

      {phase === "idle" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <span className="text-4xl" aria-hidden="true">
            ⚽
          </span>
          <Button tone="focus" size="lg" onClick={start}>
            Começar o treino
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div className="flex flex-col items-center gap-6 py-4">
          <RingTimer ratio={ratio} icon="🤫" />
          <div className="relative flex h-28 w-28 items-center justify-center">
            <AnimatePresence>
              {pulse && (
                <motion.div
                  key="pulse"
                  className={`absolute inset-0 rounded-full ${pulse === "target" ? "bg-leaf/30" : "bg-world-focus/20"}`}
                  initial={{ scale: 0.5, opacity: 0.7 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-card shadow-soft text-3xl"
              animate={pulse ? { scale: [1, 1.14, 1] } : { scale: 1 }}
              transition={{ duration: 0.36 }}
              aria-hidden="true"
            >
              {pulse === "target" ? "🥅" : pulse === "decoy" ? "🏃" : "🤐"}
            </motion.div>
          </div>
          <p className="font-body text-xs font-semibold text-ink-soft">Continue contando em silêncio...</p>
        </div>
      )}

      {(phase === "guessing" || phase === "done") && (
        <div className="flex flex-col items-center gap-5 py-2">
          <motion.div
            key={guess}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="font-display text-5xl font-extrabold text-world-focus"
          >
            {guess}
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: MAX_GUESS + 1 }, (_, n) => n).map((n) => (
              <button
                key={n}
                type="button"
                disabled={phase === "done"}
                onClick={() => setGuess(n)}
                className={`h-10 w-10 rounded-[12px] border font-display text-sm font-bold shadow-soft transition-colors ${
                  guess === n ? "border-world-focus bg-world-focus text-white" : "border-line bg-card text-ink"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {phase === "guessing" && (
            <Button tone="focus" size="lg" onClick={submitGuess}>
              Confirmar palpite
            </Button>
          )}
          {phase === "done" && actualCount !== null && (
            <p className="font-body text-sm font-semibold text-ink-soft">O time marcou {actualCount} gol(s).</p>
          )}
        </div>
      )}
    </div>
  );
}
