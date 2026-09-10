import { useState } from "react";
import { IntroScreen } from "./screens/IntroScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { RoundSummaryScreen } from "./screens/RoundSummaryScreen";
import type { SessionStats } from "./types";

type Phase = "intro" | "play" | "summary";

export function QuickThinkModule() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [lastStats, setLastStats] = useState<SessionStats | null>(null);
  const [playKey, setPlayKey] = useState(0);

  function handleFinish(stats: SessionStats) {
    setLastStats(stats);
    setPhase("summary");
  }

  function handlePlayAgain() {
    setPlayKey((key) => key + 1);
    setPhase("play");
  }

  return (
    <div className="mx-auto min-h-dvh max-w-xl px-5 py-8">
      {phase === "intro" && <IntroScreen onStart={() => setPhase("play")} />}
      {phase === "play" && <PlayScreen key={playKey} onFinish={handleFinish} />}
      {phase === "summary" && lastStats && <RoundSummaryScreen stats={lastStats} onPlayAgain={handlePlayAgain} />}
    </div>
  );
}
