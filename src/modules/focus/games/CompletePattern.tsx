import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Ticks } from "../../../shared/components/Ticks";
import { playCorrectSound, playTapSound } from "../../../shared/sounds";
import { correctPhrase } from "../../../shared/copy";
import { shuffle, randInt } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Complete o Padrão" -- reasoning: a sequence (jersey-number counting or a
 * repeating symbol pattern) has a gap at the end. The child studies the
 * rule and taps the piece that completes it. Untimed, multiple choice.
 */

const ROUNDS = 6;
const SYMBOL_SETS = [
  ["⚽", "🥅"],
  ["🟨", "🟥"],
  ["⚽", "🥅", "🏆"],
] as const;

type Round = { display: string[]; answer: string; options: string[] };

function buildNumericRound(difficulty: number): Round {
  const step = randInt(1, Math.min(9, 2 + Math.floor((difficulty - 1) / 1.3)));
  const start = randInt(1, 20);
  const length = Math.min(6, 3 + Math.floor((difficulty - 1) / 2));
  const values = Array.from({ length }, (_, i) => start + i * step);
  const answer = start + length * step;
  const decoys = new Set<number>();
  while (decoys.size < 3) {
    const offset = randInt(-step * 2, step * 2) || 1;
    const candidate = answer + offset;
    if (candidate !== answer && candidate > 0) decoys.add(candidate);
  }
  const options = shuffle([answer, ...decoys]).map(String);
  return { display: values.map(String), answer: String(answer), options };
}

function buildVisualRound(difficulty: number): Round {
  const set = SYMBOL_SETS[randInt(0, SYMBOL_SETS.length - 1)];
  const cycles = Math.min(4, 2 + Math.floor((difficulty - 1) / 2));
  const pattern: string[] = [];
  for (let i = 0; i < cycles; i++) pattern.push(...set);
  const answer = set[0];
  const otherSets = SYMBOL_SETS.flatMap((s) => s).filter((s) => !(set as readonly string[]).includes(s));
  const decoys = shuffle(otherSets).slice(0, 3);
  const options = shuffle([answer, ...decoys]);
  return { display: pattern, answer, options };
}

function buildRound(difficulty: number): Round {
  return Math.random() < 0.5 ? buildNumericRound(difficulty) : buildVisualRound(difficulty);
}

export function CompletePattern({ difficulty, onComplete }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [status, setStatus] = useState<"correct" | "retry" | null>(null);

  const roundData = useMemo(() => buildRound(difficulty), [round, difficulty]);

  function handleAnswer(option: string) {
    if (status) return;
    const isCorrect = option === roundData.answer;
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
    }, 800);
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">Qual é a próxima peça do padrão?</p>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-2 py-2">
        {roundData.display.map((item, idx) => (
          <span key={idx} className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-line bg-card font-display text-xl font-extrabold text-ink shadow-soft">
            {item}
          </span>
        ))}
        <motion.span
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-dashed border-world-focus text-xl font-extrabold text-world-focus"
        >
          ?
        </motion.span>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {roundData.options.map((option) => (
          <motion.button
            key={option}
            type="button"
            disabled={!!status}
            onClick={() => handleAnswer(option)}
            whileTap={{ scale: 0.92 }}
            className="flex aspect-square items-center justify-center rounded-[14px] border border-line bg-paper font-display text-xl font-extrabold text-ink shadow-soft"
          >
            {option}
          </motion.button>
        ))}
      </div>

      <FeedbackBanner status={status} message={status === "correct" ? correctPhrase() : "Quase! Olha a regrinha de novo."} />
    </div>
  );
}
