import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { Ticks } from "../../../shared/components/Ticks";
import { Button } from "../../../shared/components/Button";
import { playFocusTargetSound, playFocusDecoySound, playTapSound, isMuted } from "../../../shared/sounds";
import type { MiniGameProps } from "../types";

/**
 * "Escuta Atenta" -- auditory sustained attention: a sequence of audio
 * events (a referee whistle among crowd noise) fires on its own pace. The
 * child listens for the TARGET sound and taps "Ouvi o apito!" only during
 * that event's short response window. Every event shows the exact same
 * neutral visual pulse regardless of which sound played, so this is
 * genuinely a listening task, not a "watch for the different circle" task.
 */

type EventKind = "target" | "decoyA" | "decoyB";

const TARGET_RATIO = 0.3;
const RESPONSE_WINDOW_MS = 1400;

function eventsForDifficulty(difficulty: number): number {
  // 10 events at difficulty 1 up to 14 at difficulty 5.
  return 10 + Math.round(((difficulty - 1) / 4) * 4);
}

function gapMsForDifficulty(difficulty: number): number {
  // Pace tightens slightly with difficulty: ~2.4s gap down to ~1.7s.
  return Math.round(2400 - ((difficulty - 1) / 4) * 700);
}

function buildSequence(difficulty: number): EventKind[] {
  const total = eventsForDifficulty(difficulty);
  const targetCount = Math.max(2, Math.round(total * TARGET_RATIO));
  const seq: EventKind[] = [];
  for (let i = 0; i < targetCount; i++) seq.push("target");
  // At higher difficulty, alternate between two decoy timbres to make the
  // "not the whistle" sounds less uniform and harder to tune out passively.
  const useTwoDecoys = difficulty >= 3;
  for (let i = targetCount; i < total; i++) {
    seq.push(useTwoDecoys && i % 2 === 0 ? "decoyB" : "decoyA");
  }
  // Shuffle, but avoid two targets landing back-to-back (keeps it fair).
  let attempts = 0;
  let arr = seq;
  do {
    arr = [...seq];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    attempts++;
  } while (attempts < 20 && arr.some((k, i) => k === "target" && arr[i + 1] === "target"));
  return arr;
}

type EventOutcome = "hit" | "correctIgnore" | "falseAlarm" | "miss";

export function ListenTarget({ difficulty, onComplete }: MiniGameProps) {
  const sequence = useMemo(() => buildSequence(difficulty), [difficulty]);
  const gapMs = gapMsForDifficulty(difficulty);

  const [index, setIndex] = useState(-1); // -1 = not started
  const [pulsing, setPulsing] = useState(false);
  const [responded, setResponded] = useState(false);
  const [finished, setFinished] = useState(false);
  const outcomesRef = useRef<EventOutcome[]>([]);
  const respondedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  const muted = isMuted();

  function clearTimers() {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  }

  function finishGame(outcomes: EventOutcome[]) {
    const hits = outcomes.filter((o) => o === "hit").length;
    const correctIgnores = outcomes.filter((o) => o === "correctIgnore").length;
    const accuracy = outcomes.length > 0 ? (hits + correctIgnores) / outcomes.length : 1;
    setFinished(true);
    window.setTimeout(() => onComplete({ accuracy, score: hits + correctIgnores }), 550);
  }

  function fireEvent(i: number) {
    const kind = sequence[i];
    respondedRef.current = false;
    setResponded(false);
    setPulsing(true);
    if (kind === "target") playFocusTargetSound();
    else if (kind === "decoyB") playFocusDecoySound();
    else playTapSound();

    const pulseOff = window.setTimeout(() => setPulsing(false), 420);
    const resolveEvent = window.setTimeout(() => {
      const tapped = respondedRef.current;
      const outcome: EventOutcome = kind === "target" ? (tapped ? "hit" : "miss") : tapped ? "falseAlarm" : "correctIgnore";
      outcomesRef.current = [...outcomesRef.current, outcome];

      if (i + 1 >= sequence.length) {
        finishGame(outcomesRef.current);
      } else {
        const next = window.setTimeout(() => {
          setIndex(i + 1);
          fireEvent(i + 1);
        }, gapMs);
        timeoutsRef.current.push(next);
      }
    }, RESPONSE_WINDOW_MS);

    timeoutsRef.current.push(pulseOff, resolveEvent);
  }

  function start() {
    setIndex(0);
    fireEvent(0);
  }

  function handleTap() {
    if (index < 0 || finished || respondedRef.current) return;
    respondedRef.current = true;
    setResponded(true);
    playTapSound();
  }

  useEffect(() => clearTimers, []);

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={sequence.length} current={Math.max(0, index)} />

      <Card tone="paper" className="flex flex-col items-center gap-1 text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          Fique de ouvido atento: toque só quando ouvir o apito do juiz entre o barulho da torcida.
        </p>
        {muted && (
          <p className="font-body text-xs font-semibold text-coral">
            O som está desligado -- dá pra jogar só pelo pulso na tela, mas fica mais difícil assim.
          </p>
        )}
      </Card>

      <div className="flex flex-col items-center gap-6 py-4">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <AnimatePresence>
            {pulsing && (
              <motion.div
                key="pulse"
                className="absolute inset-0 rounded-full bg-world-focus/25"
                initial={{ scale: 0.5, opacity: 0.7 }}
                animate={{ scale: 1.3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-card shadow-soft"
            animate={pulsing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-3xl" aria-hidden="true">
              🏟️
            </span>
          </motion.div>
        </div>

        {index < 0 ? (
          <Button tone="focus" size="lg" onClick={start}>
            Começar a escutar
          </Button>
        ) : (
          <Button
            tone="focus"
            size="lg"
            onClick={handleTap}
            disabled={finished || responded}
            className={responded ? "opacity-60" : ""}
          >
            {responded ? "Respondido" : "Ouvi o apito!"}
          </Button>
        )}
      </div>
    </div>
  );
}
