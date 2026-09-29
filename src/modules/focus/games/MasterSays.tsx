import { useEffect, useRef, useState } from "react";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playCorrectSound, playChimeSound } from "../../../shared/sounds";
import { pick } from "../engine/random";
import { useCountdown } from "../engine/useCountdown";
import { RingTimer } from "./RingTimer";
import type { MiniGameProps } from "../types";

/**
 * "O Mestre Mandou" -- Simon-says impulse control, football-flavored. Only
 * act when the instruction starts with "O Mestre mandou"; a bare command
 * (no magic words) must be ignored. Trains stopping the automatic response.
 */

const TRIAL_COUNT = 10;
const FEEDBACK_PAUSE_MS = 850;

const ACTIONS = [
  "chutar a bola pro gol",
  "comemorar o gol",
  "levantar o braço como craque",
  "bater o pênalti",
  "fazer embaixadinha",
  "apitar como o juiz",
  "erguer a taça",
  "dar um passe rasteiro",
];

type Phase = "instruction" | "feedback";
type FeedbackStatus = "correct" | "retry";

function windowMsFor(difficulty: number): number {
  return Math.round(2000 - (difficulty - 1) * 220);
}

function buildTrials(difficulty: number): { action: string; valid: boolean }[] {
  const validChance = 0.55 + (difficulty - 1) * 0.03;
  return Array.from({ length: TRIAL_COUNT }, () => ({
    action: pick(ACTIONS),
    valid: Math.random() < validChance,
  }));
}

const ACT_CORRECT = ["Isso! O Mestre mandou e você fez na hora certa!", "Boa, você obedeceu o Mestre!"];
const HOLD_CORRECT = ["Muito bem, você parou e pensou antes de agir!", "Isso! Sem o comando do Mestre, você esperou."];
const FALSE_ALARM = ["Quase! Essa não tinha a palavra mágica do Mestre.", "Sem problema, vamos ficar de olho na próxima!"];
const MISS = ["Essa era do Mestre! Fica esperto na próxima.", "Quase lá, o comando do Mestre passou rapidinho."];

export function MasterSays({ difficulty, onComplete }: MiniGameProps) {
  const [trials] = useState(() => buildTrials(difficulty));
  const windowMs = windowMsFor(difficulty);

  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("instruction");
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string } | null>(null);

  const correctCountRef = useRef(0);
  const advanceTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    },
    [],
  );

  const trial = trials[trialIndex];

  function goToNextTrialOrFinish() {
    if (trialIndex + 1 >= TRIAL_COUNT) {
      onComplete({ accuracy: correctCountRef.current / TRIAL_COUNT, score: correctCountRef.current });
    } else {
      setTrialIndex((i) => i + 1);
      setPhase("instruction");
      setFeedback(null);
    }
  }

  function registerResult(kind: "tap" | "timeout") {
    if (phase !== "instruction") return;

    let isCorrect: boolean;
    let message: string;

    if (kind === "tap") {
      if (trial.valid) {
        isCorrect = true;
        message = pick(ACT_CORRECT);
        playCorrectSound();
      } else {
        isCorrect = false;
        message = pick(FALSE_ALARM);
      }
    } else {
      if (trial.valid) {
        isCorrect = false;
        message = pick(MISS);
      } else {
        isCorrect = true;
        message = pick(HOLD_CORRECT);
        playChimeSound();
      }
    }

    if (isCorrect) correctCountRef.current += 1;
    setFeedback({ status: isCorrect ? "correct" : "retry", message });
    setPhase("feedback");
    advanceTimeoutRef.current = window.setTimeout(goToNextTrialOrFinish, FEEDBACK_PAUSE_MS);
  }

  const { ratio } = useCountdown(windowMs, trialIndex, () => registerResult("timeout"), phase !== "instruction");

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={TRIAL_COUNT} current={trialIndex} />

      <p className="text-center font-body text-sm font-semibold text-ink-soft">
        ⚽ Só faça a ação se o Mestre tiver mandado!
      </p>

      <div className="flex items-center justify-center">
        <RingTimer ratio={ratio} icon="🎽" />
      </div>

      <Card tone="paper" className="flex min-h-[110px] flex-col items-center justify-center gap-1 text-center">
        <p className="font-display text-lg font-extrabold text-ink">
          {trial.valid ? "O Mestre mandou:" : "Aviso do estádio:"}
        </p>
        <p className="font-body text-base font-semibold text-ink-soft">{trial.action}!</p>
      </Card>

      <Button tone="focus" size="lg" disabled={phase !== "instruction"} onClick={() => registerResult("tap")} className="w-full">
        Fazer! ⚡
      </Button>

      <FeedbackBanner status={feedback?.status ?? null} message={feedback?.message ?? ""} />
    </div>
  );
}
