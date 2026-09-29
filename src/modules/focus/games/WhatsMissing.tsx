import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playCorrectSound, playTapSound } from "../../../shared/sounds";
import { correctPhrase } from "../../../shared/copy";
import { sample, shuffle } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "O Que Sumiu?" -- working memory: a set of items appears, then one is
 * hidden. The child recalls which one was there, picking it from a small
 * answer bank rather than typing -- easy touch target, no penalty look-back.
 */

const ROUNDS = 5;
const STUDY_MS_BASE = 2200;

const ITEM_POOL = ["⚽", "🥅", "🟨", "🟥", "🧤", "👟", "🏆", "🎽", "🚩", "📣"];

function itemCountFor(difficulty: number): number {
  return Math.min(8, 4 + Math.floor((difficulty - 1) / 2));
}

type Phase = "study" | "hidden" | "reveal";

type Round = { items: string[]; missingIndex: number; options: string[] };

function buildRound(difficulty: number): Round {
  const count = itemCountFor(difficulty);
  const items = sample(ITEM_POOL, count);
  const missingIndex = Math.floor(Math.random() * items.length);
  const missingItem = items[missingIndex];
  const decoyPool = ITEM_POOL.filter((i) => !items.includes(i));
  const decoys = sample(decoyPool, Math.min(3, decoyPool.length));
  const options = shuffle([missingItem, ...decoys]);
  return { items, missingIndex, options };
}

export function WhatsMissing({ difficulty, onComplete }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("study");
  const [status, setStatus] = useState<"correct" | "retry" | null>(null);

  const roundData = useMemo(() => buildRound(difficulty), [round, difficulty]);
  const studyMs = STUDY_MS_BASE + roundData.items.length * 250;

  useEffect(() => {
    setPhase("study");
    setStatus(null);
    const t1 = window.setTimeout(() => setPhase("hidden"), studyMs);
    const t2 = window.setTimeout(() => setPhase("reveal"), studyMs + 400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, difficulty]);

  function handleAnswer(item: string) {
    if (phase !== "reveal" || status) return;
    const isCorrect = item === roundData.items[roundData.missingIndex];
    if (isCorrect) {
      playCorrectSound();
      setCorrectCount((c) => c + 1);
    } else {
      playTapSound();
    }
    setStatus(isCorrect ? "correct" : "retry");

    window.setTimeout(() => {
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      if (round + 1 >= ROUNDS) {
        onComplete({ accuracy: finalCorrect / ROUNDS, score: finalCorrect });
      } else {
        setRound((r) => r + 1);
      }
    }, 900);
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          {phase === "study" && "Decore tudo que está no campo!"}
          {phase === "hidden" && "Prontinho..."}
          {phase === "reveal" && "O que sumiu? Toque na resposta certa!"}
        </p>
      </Card>

      <div className="grid grid-cols-4 gap-2.5">
        {roundData.items.map((item, idx) => (
          <div key={idx} className="flex aspect-square items-center justify-center rounded-[14px] border border-line bg-card shadow-soft">
            <span className="text-2xl">
              {phase === "hidden" ? "" : phase === "reveal" && idx === roundData.missingIndex ? "❓" : item}
            </span>
          </div>
        ))}
      </div>

      {phase === "reveal" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-2.5">
          {roundData.options.map((item) => (
            <motion.button
              key={item}
              type="button"
              disabled={!!status}
              onClick={() => handleAnswer(item)}
              whileTap={{ scale: 0.92 }}
              className="flex aspect-square items-center justify-center rounded-[14px] border border-line bg-paper shadow-soft"
            >
              <span className="text-2xl">{item}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      <FeedbackBanner status={status} message={status === "correct" ? correctPhrase() : "Quase! Na próxima olha bem antes de sumir."} />
    </div>
  );
}
