import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { Confetti } from "../../../shared/components/Confetti";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Mascot } from "../../../shared/components/Mascot";
import type { MascotMood } from "../../../shared/components/Mascot";
import { Ticks } from "../../../shared/components/Ticks";
import { correctPhrase, tryAgainPhrase } from "../../../shared/copy";
import { playChimeSound, playCorrectSound, playWrongSound } from "../../../shared/sounds";
import { useStoredState } from "../../../shared/storage";
import { generatePuzzle } from "../engine/generatePuzzle";
import { useAdaptiveDifficulty } from "../engine/useAdaptiveDifficulty";
import { DEFAULT_LOGIC_PROGRESS } from "../types";
import type { LogicProgress, Puzzle } from "../types";
import { ChoiceGrid } from "./ChoiceGrid";

const ROUND_SIZE = 8;
const STREAK_MILESTONE = 8;

export interface RoundStats {
  correct: number;
  total: number;
  bestStreak: number;
  totalSolved: number;
}

type Feedback = { status: "correct" | "retry"; message: string };

export function PlayScreen({ onRoundComplete }: { onRoundComplete: (stats: RoundStats) => void }) {
  const { difficulty, registerResult } = useAdaptiveDifficulty();
  const [progress, setProgress] = useStoredState<LogicProgress>("logic:progress", DEFAULT_LOGIC_PROGRESS);

  const [puzzle, setPuzzle] = useState<Puzzle>(() => generatePuzzle(difficulty));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);

  const mascotMood: MascotMood = !feedback ? "thinking" : feedback.status === "correct" ? "cheer" : "oops";

  function handleSelect(optionId: string) {
    if (selectedId !== null) return;
    const correct = optionId === puzzle.correctOptionId;
    setSelectedId(optionId);
    setFeedback({ status: correct ? "correct" : "retry", message: correct ? correctPhrase() : tryAgainPhrase() });

    if (correct) playCorrectSound();
    else playWrongSound();
    registerResult(correct);

    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    if (correct && newStreak > 0 && newStreak % STREAK_MILESTONE === 0) {
      playChimeSound();
      setShowMilestone(true);
      setTimeout(() => setShowMilestone(false), 1800);
    }

    setAnsweredCount((c) => c + 1);
    if (correct) setRoundCorrect((c) => c + 1);

    setProgress((prev) => ({
      bestStreak: Math.max(prev.bestStreak, newStreak),
      totalSolved: prev.totalSolved + (correct ? 1 : 0),
      roundsCompleted: prev.roundsCompleted,
    }));
  }

  function handleContinue() {
    if (answeredCount >= ROUND_SIZE) {
      setProgress((prev) => ({ ...prev, roundsCompleted: prev.roundsCompleted + 1 }));
      onRoundComplete({
        correct: roundCorrect,
        total: ROUND_SIZE,
        bestStreak: progress.bestStreak,
        totalSolved: progress.totalSolved,
      });
      return;
    }
    setPuzzle(generatePuzzle(difficulty, puzzle.type));
    setSelectedId(null);
    setFeedback(null);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-5 py-8">
      {showMilestone && <Confetti count={40} />}

      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 font-body text-sm font-bold text-ink-soft underline-offset-4 hover:underline">
          Sair
        </Link>
        <Ticks total={ROUND_SIZE} current={answeredCount} className="w-full" />
      </div>

      <Mascot name="a" mood={mascotMood} speech={feedback ? feedback.message : puzzle.heading} />

      <Card tone="paper">
        {puzzle.promptEmoji && <p className="mb-2 text-center text-4xl">{puzzle.promptEmoji}</p>}
        <p className="whitespace-pre-line text-center font-display text-xl font-bold leading-snug text-ink">
          {puzzle.prompt}
        </p>
      </Card>

      <ChoiceGrid
        options={puzzle.options}
        correctOptionId={puzzle.correctOptionId}
        selectedId={selectedId}
        onSelect={handleSelect}
        columns={puzzle.columns}
      />

      <FeedbackBanner
        status={feedback?.status ?? null}
        message={feedback?.message ?? ""}
        detail={feedback ? puzzle.explanation : undefined}
      />

      {feedback && (
        <Button tone="logic" size="lg" onClick={handleContinue} className="w-full">
          {answeredCount >= ROUND_SIZE ? "Ver resultado" : "Continuar"}
        </Button>
      )}
    </div>
  );
}
