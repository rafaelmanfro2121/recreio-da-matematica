import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { LEVELS } from "../data/levels";
import { generateRound, QUESTIONS_PER_ROUND } from "../engine/generateQuestion";
import { useMathProgress } from "../engine/useMathProgress";
import { StoryStep } from "./StoryStep";
import { SolveStep } from "./SolveStep";
import { RoundSummaryScreen } from "./RoundSummaryScreen";
import type { Operation, Question } from "../types";

/** Practice flow for a level: StoryStep -> SolveStep, repeated for a round, then a summary. */
export function PracticeScreen() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { completeLevel } = useMathProgress();
  const level = LEVELS.find((l) => l.id === levelId);

  const [round, setRound] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [subStep, setSubStep] = useState<"story" | "solve">("story");
  const [chosenOp, setChosenOp] = useState<Operation | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    if (!level) return;
    setRound(generateRound(level.ops));
    setIndex(0);
    setSubStep("story");
    setChosenOp(null);
    setResults([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  if (!level) return <Navigate to="/matematica" replace />;
  if (round.length === 0) return null;

  const question = round[index];
  const finished = results.length === QUESTIONS_PER_ROUND;

  function startNewRound() {
    setRound(generateRound(level!.ops));
    setIndex(0);
    setSubStep("story");
    setChosenOp(null);
    setResults([]);
  }

  function handleStoryContinue(op: Operation) {
    setChosenOp(op);
    setSubStep("solve");
  }

  function handleSolveFinalize(numericCorrect: boolean) {
    const opCorrect = chosenOp === question.operation;
    const nextResults = [...results, opCorrect && numericCorrect];
    setResults(nextResults);
    if (nextResults.length === QUESTIONS_PER_ROUND) {
      completeLevel(level!.id, nextResults.filter(Boolean).length, QUESTIONS_PER_ROUND);
    } else {
      setIndex((i) => i + 1);
      setSubStep("story");
      setChosenOp(null);
    }
  }

  function goToNextLevel() {
    const idx = LEVELS.findIndex((l) => l.id === level!.id);
    const next = LEVELS[idx + 1];
    if (next) navigate(`/matematica/licao/${next.id}`);
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-5 py-8">
      <Link to="/matematica" className="w-fit">
        <Button tone="ink" variant="ghost" size="sm">
          ← Mapa
        </Button>
      </Link>

      {finished ? (
        <RoundSummaryScreen
          level={level}
          correctCount={results.filter(Boolean).length}
          total={QUESTIONS_PER_ROUND}
          onRetry={startNewRound}
          onNextLevel={goToNextLevel}
          hasNext={LEVELS.findIndex((l) => l.id === level.id) < LEVELS.length - 1}
        />
      ) : subStep === "story" ? (
        <StoryStep
          level={level}
          question={question}
          questionNumber={index + 1}
          totalQuestions={QUESTIONS_PER_ROUND}
          onContinue={handleStoryContinue}
        />
      ) : (
        <SolveStep
          question={question}
          questionNumber={index + 1}
          totalQuestions={QUESTIONS_PER_ROUND}
          isLast={index === QUESTIONS_PER_ROUND - 1}
          onFinalize={handleSolveFinalize}
        />
      )}
    </div>
  );
}
