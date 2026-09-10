import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mascot } from "../../../shared/components/Mascot";
import type { MascotMood } from "../../../shared/components/Mascot";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { useStoredState } from "../../../shared/storage";
import { correctPhrase, tryAgainPhrase } from "../../../shared/copy";
import { playCorrectSound, playWrongSound } from "../../../shared/sounds";
import { useAdaptiveDifficulty } from "../engine/useAdaptiveDifficulty";
import { useCountdown } from "../engine/useCountdown";
import { generateChallenge, timerMsForDifficulty } from "../engine/generateChallenge";
import { TimedChoiceGrid } from "./TimedChoiceGrid";
import type { Challenge, ChallengeType, SessionStats } from "../types";

const ROUNDS_PER_SESSION = 8;
const FEEDBACK_PAUSE_MS = 1700;

type Feedback = { status: "correct" | "retry"; message: string };

export function PlayScreen({ onFinish }: { onFinish: (stats: SessionStats) => void }) {
  const { difficulty, reportCorrect, reportMiss } = useAdaptiveDifficulty();
  const [bestStreak, setBestStreak] = useStoredState<number>("quickthink:bestStreak", 0);
  const [bestAvgMs, setBestAvgMs] = useStoredState<number>("quickthink:bestAvgMs", Number.POSITIVE_INFINITY);

  const [roundNumber, setRoundNumber] = useState(1);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [status, setStatus] = useState<"active" | "answered">("active");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const lastTypeRef = useRef<ChallengeType | undefined>(undefined);
  const roundStartRef = useRef<number>(Date.now());
  const correctCountRef = useRef(0);
  const currentStreakRef = useRef(0);
  const bestStreakSessionRef = useRef(0);
  const reactionTimesRef = useRef<number[]>([]);
  const advanceTimeoutRef = useRef<number | null>(null);

  // Start a fresh challenge whenever a new round begins.
  useEffect(() => {
    const next = generateChallenge(difficulty, lastTypeRef.current);
    lastTypeRef.current = next.type;
    setChallenge(next);
    setStatus("active");
    setSelectedIndex(null);
    setFeedback(null);
    roundStartRef.current = Date.now();
    // difficulty intentionally excluded: it may tick mid-round via reportCorrect/reportMiss,
    // but a challenge already on screen should not be swapped out from under the child.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundNumber]);

  useEffect(
    () => () => {
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    },
    [],
  );

  function goToNextRoundOrFinish() {
    if (roundNumber >= ROUNDS_PER_SESSION) {
      const times = reactionTimesRef.current;
      const avg = times.length > 0 ? times.reduce((sum, t) => sum + t, 0) / times.length : 0;
      const isNewBestStreak = bestStreakSessionRef.current > bestStreak;
      const isNewBestAvg = avg > 0 && avg < bestAvgMs;
      if (isNewBestStreak) setBestStreak(bestStreakSessionRef.current);
      if (isNewBestAvg) setBestAvgMs(avg);
      onFinish({
        totalRounds: ROUNDS_PER_SESSION,
        correctCount: correctCountRef.current,
        missedCount: ROUNDS_PER_SESSION - correctCountRef.current,
        bestStreakThisSession: bestStreakSessionRef.current,
        isNewBestStreak,
        avgReactionMs: avg,
        isNewBestAvg,
      });
    } else {
      setRoundNumber((n) => n + 1);
    }
  }

  function handleAnswer(index: number | null) {
    if (!challenge || status === "answered") return;
    const isCorrect = index !== null && index === challenge.correctIndex;
    const reactionMs = Date.now() - roundStartRef.current;

    setStatus("answered");
    setSelectedIndex(index);

    if (isCorrect) {
      correctCountRef.current += 1;
      currentStreakRef.current += 1;
      bestStreakSessionRef.current = Math.max(bestStreakSessionRef.current, currentStreakRef.current);
      reactionTimesRef.current.push(reactionMs);
      reportCorrect();
      playCorrectSound();
      setFeedback({ status: "correct", message: correctPhrase() });
    } else {
      currentStreakRef.current = 0;
      reportMiss();
      playWrongSound();
      setFeedback({ status: "retry", message: tryAgainPhrase() });
    }

    advanceTimeoutRef.current = window.setTimeout(goToNextRoundOrFinish, FEEDBACK_PAUSE_MS);
  }

  const timerMs = timerMsForDifficulty(difficulty);
  const { ratio } = useCountdown(
    timerMs,
    challenge?.id ?? roundNumber,
    () => handleAnswer(null),
    status === "answered" || !challenge,
  );

  if (!challenge) return null;

  const mascotMood: MascotMood =
    status === "answered" ? (selectedIndex === challenge.correctIndex ? "cheer" : "oops") : "thinking";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 font-body text-sm font-bold text-ink-soft underline">
          Sair
        </Link>
        <Ticks total={ROUNDS_PER_SESSION} current={roundNumber - 1} className="w-full" />
      </div>

      <Mascot name="b" mood={mascotMood} speech={status === "active" ? "Pensa rápido!" : undefined} />

      <TimedChoiceGrid
        challenge={challenge}
        ratio={ratio}
        status={status}
        selectedIndex={selectedIndex}
        onSelect={(i) => handleAnswer(i)}
      />

      <FeedbackBanner
        status={feedback?.status ?? null}
        message={feedback?.message ?? ""}
        detail={feedback?.status === "retry" ? challenge.reason : undefined}
      />
    </div>
  );
}
