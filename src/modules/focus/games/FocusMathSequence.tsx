import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../../shared/components/Card";
import { Ticks } from "../../../shared/components/Ticks";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { playCorrectSound, playTapSound } from "../../../shared/sounds";
import { correctPhrase, tryAgainPhrase } from "../../../shared/copy";
import { randInt, shuffle } from "../engine/random";
import type { MiniGameProps } from "../types";

/**
 * "Sequência de Foco" -- football word-problem arithmetic, one question at
 * a time with multiple-choice answers. A "barra de foco" fills a notch per
 * CONSECUTIVE correct answer and calmly resets (never punitively) on a
 * miss, rewarding sustained accuracy rather than just a final tally.
 */

const PROBLEMS = 8;

type Template = {
  minDiff: number;
  build: () => { question: string; answer: number };
};

const TEMPLATES: Template[] = [
  {
    minDiff: 1,
    build: () => {
      const a = randInt(1, 5);
      const b = randInt(1, 4);
      return { question: `Seu time fez ${a} gols no primeiro tempo e ${b} no segundo. Quantos gols no total?`, answer: a + b };
    },
  },
  {
    minDiff: 1,
    build: () => {
      const a = randInt(2, 6);
      const b = randInt(1, 5);
      return { question: `Você tinha ${a} figurinhas de jogadores e ganhou mais ${b}. Quantas você tem agora?`, answer: a + b };
    },
  },
  {
    minDiff: 1,
    build: () => {
      const a = randInt(8, 11);
      const b = randInt(1, 3);
      return { question: `O time tinha ${a} jogadores em campo e ${b} saíram machucados. Quantos ficaram?`, answer: a - b };
    },
  },
  {
    minDiff: 2,
    build: () => {
      const a = randInt(20, 40);
      const b = randInt(5, 15);
      return { question: `Na arquibancada tinham ${a} torcedores. ${b} foram embora no intervalo. Quantos ficaram até o final?`, answer: a - b };
    },
  },
  {
    minDiff: 2,
    build: () => {
      const a = randInt(5, 12);
      const b = randInt(2, 8);
      return { question: `Seu time venceu ${a} jogos e empatou ${b}. Quantas partidas isso soma?`, answer: a + b };
    },
  },
  {
    minDiff: 2,
    build: () => {
      const a = randInt(4, 10);
      const b = randInt(3, 9);
      return { question: `O goleiro defendeu ${a} pênaltis nessa temporada, mas sofreu ${b} gols de pênalti. Quantos pênaltis foram cobrados no total?`, answer: a + b };
    },
  },
  {
    minDiff: 3,
    build: () => {
      const a = randInt(2, 9);
      const b = randInt(2, 5);
      return { question: `Cada camisa do time custa R$ ${a}. Quanto custam ${b} camisas?`, answer: a * b };
    },
  },
  {
    minDiff: 3,
    build: () => {
      const a = randInt(12, 20);
      const b = randInt(4, a - 2);
      return { question: `O time jogou ${a} partidas nessa temporada e venceu ${b} delas. Quantas partidas o time NÃO venceu?`, answer: a - b };
    },
  },
  {
    minDiff: 3,
    build: () => {
      const b = randInt(2, 4);
      return { question: `Cada time de futebol tem 11 jogadores titulares. Quantos jogadores titulares tem ao todo em ${b} times?`, answer: 11 * b };
    },
  },
  {
    minDiff: 4,
    build: () => {
      const a = randInt(11, 19);
      const b = randInt(2, 9);
      return { question: `Um estádio tem ${b} setores com ${a} cadeiras cada. Quantas cadeiras tem o estádio?`, answer: a * b };
    },
  },
  {
    minDiff: 5,
    build: () => {
      const a = randInt(11, 19);
      const b = randInt(11, 19);
      return { question: `Uma fábrica produz ${a} bolas de futebol por dia. Quantas bolas ela produz em ${b} dias?`, answer: a * b };
    },
  },
  {
    minDiff: 5,
    build: () => {
      const a = randInt(5, 15);
      const b = randInt(5, 15);
      // Keep the balance non-negative -- a 7-13 year old audience hasn't
      // necessarily met negative numbers yet.
      const c = randInt(0, a + b);
      return {
        question: `Seu time fez ${a} gols jogando em casa e ${b} gols jogando fora, mas sofreu ${c} gols ao todo. Qual foi o saldo de gols (marcados menos sofridos)?`,
        answer: a + b - c,
      };
    },
  },
];

function buildQuestion(difficulty: number) {
  // Prefer templates near the current difficulty tier, but always allow
  // easier ones back in so the sequence doesn't feel like a wall.
  const eligible = TEMPLATES.filter((t) => t.minDiff <= difficulty);
  const pool = eligible.length > 0 ? eligible : [TEMPLATES[0]];
  const preferred = pool.filter((t) => t.minDiff >= difficulty - 1);
  const chosen = (preferred.length > 0 ? preferred : pool)[randInt(0, (preferred.length > 0 ? preferred : pool).length - 1)];
  const { question, answer } = chosen.build();

  const numChoices = difficulty >= 3 ? 4 : 3;
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, -4]);
  const choiceSet = new Set<number>([answer]);
  for (const off of offsets) {
    if (choiceSet.size >= numChoices) break;
    const candidate = answer + off;
    if (candidate >= 0) choiceSet.add(candidate);
  }
  // Fallback padding if we somehow ran short (all offsets negative near 0).
  let filler = 1;
  while (choiceSet.size < numChoices) {
    const candidate = answer + numChoices + filler;
    choiceSet.add(candidate);
    filler++;
  }

  return { question, answer, choices: shuffle([...choiceSet]) };
}

export function FocusMathSequence({ difficulty, onComplete }: MiniGameProps) {
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"correct" | "retry" | null>(null);

  const q = useMemo(() => buildQuestion(difficulty), [round, difficulty]);
  const focusFill = Math.min(1, streak / PROBLEMS);

  function handleAnswer(choice: number) {
    if (status) return;
    setSelected(choice);
    const isRight = choice === q.answer;

    if (isRight) {
      playCorrectSound();
      setStatus("correct");
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      playTapSound();
      setStatus("retry");
      setStreak(0);
    }

    window.setTimeout(() => {
      setStatus(null);
      setSelected(null);
      const nextCorrect = isRight ? correctCount + 1 : correctCount;
      if (round + 1 >= PROBLEMS) {
        onComplete({ accuracy: nextCorrect / PROBLEMS, score: nextCorrect });
      } else {
        setRound((r) => r + 1);
      }
    }, 950);
  }

  return (
    <div className="flex flex-col gap-5">
      <Ticks total={PROBLEMS} current={round} />

      <div className="flex flex-col gap-1.5">
        <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-soft">Barra de foco</span>
        <div className="h-3 w-full overflow-hidden rounded-full border border-line bg-card">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-world-focus-light to-world-focus"
            animate={{ width: `${focusFill * 100}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          />
        </div>
      </div>

      <Card tone="paper" className="text-center">
        <p className="font-body text-base font-semibold leading-snug text-ink">{q.question}</p>
      </Card>

      <div className="grid grid-cols-2 gap-2.5">
        {q.choices.map((choice) => {
          const isSelected = selected === choice;
          const showRight = status && choice === q.answer;
          return (
            <motion.button
              key={choice}
              type="button"
              disabled={!!status}
              onClick={() => handleAnswer(choice)}
              className={`rounded-[14px] border px-4 py-3 font-display text-lg font-bold shadow-soft transition-colors ${
                showRight
                  ? "border-leaf/40 bg-leaf/15 text-ink"
                  : isSelected
                    ? "border-world-focus bg-world-focus/10 text-ink"
                    : "border-line bg-card text-ink"
              }`}
              whileTap={status ? undefined : { scale: 0.96 }}
            >
              {choice}
            </motion.button>
          );
        })}
      </div>

      <FeedbackBanner status={status} message={status === "correct" ? correctPhrase() : tryAgainPhrase()} />
    </div>
  );
}
