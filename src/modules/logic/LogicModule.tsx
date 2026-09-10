import { useState } from "react";
import { IntroScreen } from "./screens/IntroScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { RoundSummaryScreen } from "./screens/RoundSummaryScreen";
import type { RoundStats } from "./screens/PlayScreen";

type Phase = "intro" | "play" | "summary";

/**
 * "Desafios da Mente" — a continuous, adaptive round of short logic puzzles
 * (sequences, odd-one-out, riddles, cause & effect, step planning).
 *
 * Flow: Intro (mascot greeting, skippable) -> Play (one puzzle at a time,
 * adaptive difficulty) -> every 8 puzzles, a Round Summary with the option
 * to keep playing or head back to the hub.
 */
export function LogicModule() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundKey, setRoundKey] = useState(0);
  const [lastRound, setLastRound] = useState<RoundStats | null>(null);

  if (phase === "intro") {
    return <IntroScreen onStart={() => setPhase("play")} />;
  }

  if (phase === "summary" && lastRound) {
    return (
      <RoundSummaryScreen
        roundCorrect={lastRound.correct}
        roundTotal={lastRound.total}
        bestStreak={lastRound.bestStreak}
        totalSolved={lastRound.totalSolved}
        onPlayAgain={() => {
          setRoundKey((k) => k + 1);
          setPhase("play");
        }}
      />
    );
  }

  return (
    <PlayScreen
      key={roundKey}
      onRoundComplete={(stats) => {
        setLastRound(stats);
        setPhase("summary");
      }}
    />
  );
}
