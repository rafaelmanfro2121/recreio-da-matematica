import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Ticks } from "../../../shared/components/Ticks";
import { Mascot } from "../../../shared/components/Mascot";
import { playTapSound } from "../../../shared/sounds";
import { useGameDifficulty } from "../engine/useGameDifficulty";
import type { MiniGameDef, MiniGameRunResult, SessionGameRecord } from "../types";

export function PlaySessionScreen({
  games,
  onSessionComplete,
}: {
  games: MiniGameDef[];
  onSessionComplete: (records: SessionGameRecord[]) => void;
}) {
  const [gameIndex, setGameIndex] = useState(0);
  const [subPhase, setSubPhase] = useState<"ready" | "playing">("ready");
  const resultsRef = useRef<SessionGameRecord[]>([]);

  const current = games[gameIndex];
  const { difficulty, reportRun } = useGameDifficulty(current.id);
  const GameComponent = current.component;

  function handleGameComplete(result: MiniGameRunResult) {
    reportRun(result.accuracy);
    resultsRef.current.push({
      id: current.id,
      title: current.title,
      attentionType: current.attentionType,
      accuracy: result.accuracy,
      score: result.score,
    });

    if (gameIndex + 1 >= games.length) {
      onSessionComplete(resultsRef.current);
    } else {
      setGameIndex((i) => i + 1);
      setSubPhase("ready");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 font-body text-sm font-bold text-ink-soft underline">
          Sair
        </Link>
        <Ticks total={games.length} current={gameIndex} className="w-full" />
      </div>

      <AnimatePresence mode="wait">
        {subPhase === "ready" ? (
          <motion.div
            key={`ready-${current.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <Mascot name={gameIndex % 2 === 0 ? "a" : "b"} mood="thinking" speech={`Desafio ${gameIndex + 1}: ${current.title}`} />
            <Card tone="paper" className="w-full">
              <p className="text-4xl">{current.emoji}</p>
              <h2 className="mt-2 font-display text-xl font-extrabold text-ink">{current.title}</h2>
              <p className="mt-2 font-body text-sm font-semibold text-ink-soft">{current.instructions}</p>
            </Card>
            <Button
              tone="focus"
              size="lg"
              className="w-full"
              onClick={() => {
                playTapSound();
                setSubPhase("playing");
              }}
            >
              Vamos lá!
            </Button>
          </motion.div>
        ) : (
          <motion.div key={`play-${current.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameComponent difficulty={difficulty} onComplete={handleGameComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
