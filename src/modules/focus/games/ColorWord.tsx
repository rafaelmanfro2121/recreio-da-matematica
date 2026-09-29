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
 * "Diga a Cor" -- classic Stroop-style impulse control: a color word is
 * painted in an ink color that often doesn't match what it says. The child
 * must tap the swatch matching the INK color, resisting the automatic urge
 * to tap the color the word names.
 */

const ROUNDS = 8;

const COLORS = [
  { name: "Vermelho", hex: "#e11d48" },
  { name: "Verde", hex: "#15803d" },
  { name: "Azul", hex: "#2563eb" },
  { name: "Amarelo", hex: "#f59e0b" },
  { name: "Roxo", hex: "#7c3aed" },
  { name: "Laranja", hex: "#f97316" },
] as const;

function optionCountFor(difficulty: number): number {
  return Math.min(COLORS.length, 3 + Math.floor((difficulty - 1) / 1.3));
}

function incongruentChanceFor(difficulty: number): number {
  return Math.min(1, 0.45 + (difficulty - 1) * 0.14);
}

type Round = { word: (typeof COLORS)[number]; ink: (typeof COLORS)[number]; options: (typeof COLORS)[number][] };

function buildRound(difficulty: number): Round {
  const count = optionCountFor(difficulty);
  const options = shuffle(COLORS).slice(0, count);
  const word = options[randInt(0, options.length - 1)];
  const incongruent = Math.random() < incongruentChanceFor(difficulty);
  const otherOptions = options.filter((c) => c.name !== word.name);
  const ink = incongruent && otherOptions.length > 0 ? otherOptions[randInt(0, otherOptions.length - 1)] : word;
  return { word, ink, options: shuffle(options) };
}

export function ColorWord({ difficulty, onComplete }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [status, setStatus] = useState<"correct" | "retry" | null>(null);

  const roundData = useMemo(() => buildRound(difficulty), [round, difficulty]);

  function handleTap(hex: string) {
    if (status) return;
    const isCorrect = hex === roundData.ink.hex;
    if (isCorrect) {
      playCorrectSound();
      setCorrectCount((c) => c + 1);
    } else {
      playTapSound();
    }
    setStatus(isCorrect ? "correct" : "retry");

    window.setTimeout(() => {
      setStatus(null);
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      if (round + 1 >= ROUNDS) {
        onComplete({ accuracy: finalCorrect / ROUNDS, score: finalCorrect });
      } else {
        setRound((r) => r + 1);
      }
    }, 700);
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={ROUNDS} current={round} />

      <Card tone="paper" className="text-center">
        <p className="font-body text-sm font-semibold text-ink-soft">
          Toque na cor da TINTA, não na que a palavra diz!
        </p>
      </Card>

      <div className="flex items-center justify-center py-4">
        <motion.p
          key={`${round}-word`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-4xl font-extrabold"
          style={{ color: roundData.ink.hex }}
        >
          {roundData.word.name.toUpperCase()}
        </motion.p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {roundData.options.map((color) => (
          <motion.button
            key={color.name}
            type="button"
            disabled={!!status}
            onClick={() => handleTap(color.hex)}
            whileTap={{ scale: 0.92 }}
            className="flex aspect-square items-center justify-center rounded-[16px] border border-line shadow-soft"
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>

      <FeedbackBanner status={status} message={status === "correct" ? correctPhrase() : "Quase! Olha a tinta de novo na próxima."} />
    </div>
  );
}
