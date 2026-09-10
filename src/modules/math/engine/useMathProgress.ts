import { useCallback } from "react";
import { useStoredState } from "../../../shared/storage";
import { LEVELS } from "../data/levels";
import type { MathProgress } from "../types";

function defaultProgress(): MathProgress {
  return {
    unlockedLevelIndex: 0,
    stars: Object.fromEntries(LEVELS.map((l) => [l.id, 0])),
    lessonSeen: [],
  };
}

export function useMathProgress() {
  const [progress, setProgress] = useStoredState<MathProgress>("math:progress", defaultProgress());

  const completeLevel = useCallback(
    (levelId: string, correctCount: number, total: number) => {
      setProgress((prev) => {
        const levelIndex = LEVELS.findIndex((l) => l.id === levelId);
        const stars = correctCount === total ? 3 : correctCount >= total * 0.7 ? 2 : correctCount > 0 ? 1 : 0;
        const nextUnlocked =
          correctCount === total ? Math.max(prev.unlockedLevelIndex, levelIndex + 1) : prev.unlockedLevelIndex;
        const prevStars = prev.stars[levelId] ?? 0;
        return {
          ...prev,
          unlockedLevelIndex: Math.min(nextUnlocked, LEVELS.length - 1),
          stars: { ...prev.stars, [levelId]: Math.max(prevStars, stars) },
        };
      });
    },
    [setProgress],
  );

  const markLessonSeen = useCallback(
    (levelId: string) => {
      setProgress((prev) => (prev.lessonSeen.includes(levelId) ? prev : { ...prev, lessonSeen: [...prev.lessonSeen, levelId] }));
    },
    [setProgress],
  );

  const resetProgress = useCallback(() => setProgress(defaultProgress()), [setProgress]);

  return { progress, completeLevel, markLessonSeen, resetProgress };
}
