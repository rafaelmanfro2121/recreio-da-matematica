import { useEffect, useRef, useState } from "react";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playChimeSound, playCorrectSound } from "../../../shared/sounds";
import { pick } from "../engine/random";
import { useCountdown } from "../engine/useCountdown";
import { RingTimer } from "./RingTimer";
import type { MiniGameProps } from "../types";

/**
 * "Desafio de Estátua" -- impulse/body control off-screen: on "CONGELA!"
 * rounds the child must hold still and not touch the screen at all until the
 * timer runs out on its own; on "PODE SE MEXER!" rounds they confirm they
 * moved by tapping. No camera, so screen stillness is an honest proxy for
 * physical stillness -- the phone itself becomes the thing not to touch.
 */

const TRIAL_COUNT = 8;
const FEEDBACK_PAUSE_MS = 900;

type Kind = "freeze" | "move";
type Phase = "active" | "feedback";
type FeedbackStatus = "correct" | "retry";

function windowMsFor(kind: Kind, difficulty: number): number {
  // Freeze gets HARDER by holding still LONGER as difficulty climbs; move
  // gets harder by giving a shorter reaction window -- opposite directions,
  // so they can't share one formula.
  if (kind === "freeze") return Math.round(1800 + (difficulty - 1) * 350);
  return Math.round(2000 - (difficulty - 1) * 150);
}

function buildTrials(difficulty: number): Kind[] {
  const freezeRatio = 0.6 + (difficulty - 1) * 0.02;
  return Array.from({ length: TRIAL_COUNT }, () => (Math.random() < freezeRatio ? "freeze" : "move"));
}

const FREEZE_HELD = ["Uau, você ficou paradinho igual uma estátua! 🗿", "Isso! Nem uma tremidinha!", "Perfeito, você segurou até o fim!"];
const FREEZE_BROKE = ["Quase! Dessa vez o corpo quis se mexer antes da hora.", "Sem problema, congelar é difícil! Tenta de novo."];
const MOVE_DONE = ["Boa, você se mexeu na hora certa! 🏃", "Isso aí, corpo solto!"];
const MOVE_MISSED = ["Quase, essa era pra se mexer!", "Na próxima, pode soltar o corpo assim que aparecer!"];

export function StatueChallenge({ difficulty, onComplete }: MiniGameProps) {
  const [trials] = useState(() => buildTrials(difficulty));

  const [trialIndex, setTrialIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("active");
  const [feedback, setFeedback] = useState<{ status: FeedbackStatus; message: string } | null>(null);

  const correctCountRef = useRef(0);
  const advanceTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    },
    [],
  );

  const kind = trials[trialIndex];
  const windowMs = windowMsFor(kind, difficulty);

  function goToNextTrialOrFinish() {
    if (trialIndex + 1 >= TRIAL_COUNT) {
      onComplete({ accuracy: correctCountRef.current / TRIAL_COUNT, score: correctCountRef.current });
    } else {
      setTrialIndex((i) => i + 1);
      setPhase("active");
      setFeedback(null);
    }
  }

  function registerResult(source: "tap" | "timeout") {
    if (phase !== "active") return;

    let isCorrect: boolean;
    let message: string;

    if (kind === "freeze") {
      // Freeze is won by NOT tapping until the timer expires on its own.
      if (source === "timeout") {
        isCorrect = true;
        message = pick(FREEZE_HELD);
        playChimeSound();
      } else {
        isCorrect = false;
        message = pick(FREEZE_BROKE);
      }
    } else {
      // Move is won by tapping before the timer expires.
      if (source === "tap") {
        isCorrect = true;
        message = pick(MOVE_DONE);
        playCorrectSound();
      } else {
        isCorrect = false;
        message = pick(MOVE_MISSED);
      }
    }

    if (isCorrect) correctCountRef.current += 1;
    setFeedback({ status: isCorrect ? "correct" : "retry", message });
    setPhase("feedback");
    advanceTimeoutRef.current = window.setTimeout(goToNextTrialOrFinish, FEEDBACK_PAUSE_MS);
  }

  const { ratio } = useCountdown(windowMs, trialIndex, () => registerResult("timeout"), phase !== "active");

  const freezeBreakHandlers =
    kind === "freeze" && phase === "active" ? { onClick: () => registerResult("tap"), onTouchStart: () => registerResult("tap") } : {};

  return (
    <div className="flex flex-col gap-5" {...freezeBreakHandlers}>
      <Ticks total={TRIAL_COUNT} current={trialIndex} />

      <p className="text-center font-body text-sm font-semibold text-ink-soft">
        {kind === "freeze" ? "🗿 Congela! Não toque em nada até o tempo acabar." : "🏃 Pode se mexer! Toque para confirmar."}
      </p>

      <div className="flex items-center justify-center">
        <RingTimer ratio={ratio} icon={kind === "freeze" ? "🗿" : "🏃"} />
      </div>

      <Card tone="paper" className="flex min-h-[130px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-5xl">{kind === "freeze" ? "🗿" : "🏃"}</p>
        <p className="font-display text-lg font-extrabold text-ink">{kind === "freeze" ? "Fique paradinho como uma estátua!" : "Levante e sacoda o corpo!"}</p>
      </Card>

      {kind === "move" && (
        <Button tone="focus" size="lg" disabled={phase !== "active"} onClick={() => registerResult("tap")} className="w-full">
          Balancei! ⚡
        </Button>
      )}

      <FeedbackBanner status={feedback?.status ?? null} message={feedback?.message ?? ""} />
    </div>
  );
}
