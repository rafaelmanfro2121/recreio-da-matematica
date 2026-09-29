/**
 * "Verde Vai, Vermelho Para" -- a referee/race-start themed go/no-go game.
 * A big signal card flashes green (tap!) or red (hold back!) for a short,
 * generous window each trial. Trains: tapping fast on green, and -- just as
 * important -- NOT tapping on red. No punitive sound or red-alert flashing
 * anywhere; a false alarm or a missed green just fades calmly into the next
 * trial with a brief, skill-praising note.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playChimeSound, playCorrectSound } from "../../../shared/sounds";
import { pick } from "../engine/random";
import { useCountdown } from "../engine/useCountdown";
import { RingTimer } from "./RingTimer";
import type { MiniGameProps } from "../types";

const TRIAL_COUNT = 10;
const FEEDBACK_PAUSE_MS = 850;

type SignalColor = "green" | "red";
type Phase = "signal" | "feedback";
type FeedbackStatus = "correct" | "retry";

/** Flash window: generous at difficulty 1, still comfortable but brisker at 5. */
function windowMsFor(difficulty: number): number {
  return Math.round(2200 - (difficulty - 1) * 150);
}

/** Share of trials that are RED (hold back). Slightly higher at high difficulty. */
function redRatioFor(difficulty: number): number {
  return 0.3 + (difficulty - 1) * 0.035;
}

function buildTrials(difficulty: number): SignalColor[] {
  const redRatio = redRatioFor(difficulty);
  return Array.from({ length: TRIAL_COUNT }, () => (Math.random() < redRatio ? "red" : "green"));
}

const GO_CORRECT_PHRASES = [
  "Você viu o verde e foi rápido! ⚽",
  "Boa! Sinal verde, você tocou na hora certa!",
  "Show, reflexo rápido no sinal do juiz!",
];

const STOP_CORRECT_PHRASES = [
  "Isso! Você parou e pensou antes de tocar.",
  "Muito bem, sinal vermelho e você segurou a mão!",
  "Boa, você esperou o momento certo!",
];

const FALSE_ALARM_PHRASES = [
  "Quase! No vermelho é para esperar um pouquinho.",
  "Sem problema, o juiz mandou parar dessa vez.",
  "Tudo bem, vamos ficar de olho no sinal!",
];

const MISS_PHRASES = [
  "Foi rápido demais pra você! Fica de olho no verde.",
  "Quase lá, o sinal verde passou rapidinho.",
  "Sem problema, na próxima você pega o verde!",
];

export function GreenGoRedStop({ difficulty, onComplete }: MiniGameProps) {
  const [trials] = useState(() => buildTrials(difficulty));
  const windowMs = windowMsFor(difficulty);

  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("signal");
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string } | null>(null);

  const correctCountRef = useRef(0);
  const advanceTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    },
    [],
  );

  const color = trials[trialIndex];

  function goToNextTrialOrFinish() {
    if (trialIndex + 1 >= TRIAL_COUNT) {
      onComplete({ accuracy: correctCountRef.current / TRIAL_COUNT, score: correctCountRef.current });
    } else {
      setTrialIndex((i) => i + 1);
      setPhase("signal");
      setFeedback(null);
    }
  }

  function registerResult(kind: "tap" | "timeout") {
    if (phase !== "signal") return;

    let isCorrect: boolean;
    let message: string;

    if (kind === "tap") {
      if (color === "green") {
        isCorrect = true;
        message = pick(GO_CORRECT_PHRASES);
        playCorrectSound();
      } else {
        isCorrect = false;
        message = pick(FALSE_ALARM_PHRASES);
      }
    } else {
      if (color === "green") {
        isCorrect = false;
        message = pick(MISS_PHRASES);
      } else {
        isCorrect = true;
        message = pick(STOP_CORRECT_PHRASES);
        playChimeSound();
      }
    }

    if (isCorrect) correctCountRef.current += 1;
    setFeedback({ status: isCorrect ? "correct" : "retry", message });
    setPhase("feedback");
    advanceTimeoutRef.current = window.setTimeout(goToNextTrialOrFinish, FEEDBACK_PAUSE_MS);
  }

  const { ratio } = useCountdown(windowMs, trialIndex, () => registerResult("timeout"), phase !== "signal");

  const isGreen = color === "green";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Ticks total={TRIAL_COUNT} current={trialIndex} className="w-full" />
      </div>

      <p className="text-center font-body text-sm font-semibold text-ink-soft">
        🏁 O juiz apitou! Toque só quando o sinal estiver verde.
      </p>

      <div className="flex items-center justify-center">
        <RingTimer ratio={ratio} icon={isGreen ? "🟢" : "🔴"} />
      </div>

      <motion.button
        type="button"
        onClick={() => registerResult("tap")}
        disabled={phase !== "signal"}
        whileTap={{ scale: 0.96 }}
        className={`flex min-h-[180px] w-full flex-col items-center justify-center gap-2 rounded-[20px] border p-6 text-center shadow-soft transition-colors ${
          isGreen ? "border-leaf bg-leaf/10" : "border-coral bg-coral/10"
        }`}
      >
        <span className="text-6xl">{isGreen ? "🟢" : "🔴"}</span>
        <span className="font-display text-lg font-extrabold text-ink">
          {isGreen ? "Toque agora!" : "Espere..."}
        </span>
      </motion.button>

      <FeedbackBanner status={feedback?.status ?? null} message={feedback?.message ?? ""} />
    </div>
  );
}
