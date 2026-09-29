import { useMemo, useState } from "react";
import { logActivity } from "../../shared/activity";
import { IntroScreen } from "./screens/IntroScreen";
import { BreatheScreen } from "./screens/BreatheScreen";
import { GoalScreen } from "./screens/GoalScreen";
import { PlaySessionScreen } from "./screens/PlaySessionScreen";
import { RatingScreen } from "./screens/RatingScreen";
import { SummaryScreen } from "./screens/SummaryScreen";
import { GAME_REGISTRY } from "./engine/registry";
import { pickSessionGames } from "./engine/session";
import type { FocusSessionStats, SessionGameRecord } from "./types";

type Phase = "intro" | "breathe" | "goal" | "play" | "rating" | "summary";

/**
 * "Modo Foco" -- a short (5-10min) attention-training session: breathe,
 * pick a goal, play 3 mini-games sampled from 3 different categories
 * (visual, impulse control, memory, auditory, reasoning/math, body -- several
 * themed around football, per the user's request), then rate your own focus.
 */
export function FocusModule() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [goal, setGoal] = useState<string>("");
  const [gameRecords, setGameRecords] = useState<SessionGameRecord[]>([]);
  const [stats, setStats] = useState<FocusSessionStats | null>(null);
  const [runKey, setRunKey] = useState(0);

  // Re-sampled fresh every time runKey changes (a new session starts).
  const sessionGames = useMemo(() => pickSessionGames(GAME_REGISTRY), [runKey]);

  function handleSessionComplete(records: SessionGameRecord[]) {
    const totalScore = records.reduce((sum, r) => sum + r.score, 0);
    const averageAccuracy = records.reduce((sum, r) => sum + r.accuracy, 0) / records.length;
    setGameRecords(records);
    logActivity(Math.round(averageAccuracy * records.length), records.length);
    setStats({ goal, games: records, totalScore, averageAccuracy, goalMet: false, selfRating: 0 });
    setPhase("rating");
  }

  function handleRatingDone(rating: number, goalMet: boolean) {
    setStats((prev) => (prev ? { ...prev, selfRating: rating, goalMet } : prev));
    setPhase("summary");
  }

  function startNewSession() {
    setRunKey((k) => k + 1);
    setGameRecords([]);
    setStats(null);
    setGoal("");
    setPhase("breathe");
  }

  return (
    <div className="mx-auto min-h-dvh max-w-xl px-5 py-8">
      {phase === "intro" && <IntroScreen onStart={() => setPhase("breathe")} />}
      {phase === "breathe" && <BreatheScreen onDone={() => setPhase("goal")} />}
      {phase === "goal" && (
        <GoalScreen
          onPick={(g) => {
            setGoal(g);
            setPhase("play");
          }}
        />
      )}
      {phase === "play" && (
        <PlaySessionScreen key={runKey} games={sessionGames} onSessionComplete={handleSessionComplete} />
      )}
      {phase === "rating" && stats && <RatingScreen goal={goal} onDone={handleRatingDone} />}
      {phase === "summary" && stats && gameRecords.length > 0 && <SummaryScreen stats={stats} onPlayAgain={startNewSession} />}
    </div>
  );
}
