import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ticks } from "../../../shared/components/Ticks";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Button } from "../../../shared/components/Button";
import { Keypad } from "./Keypad";
import { playCorrectSound, playTapSound, playWrongSound } from "../../../shared/sounds";
import { correctPhrase, tryAgainPhrase } from "../../../shared/copy";
import { OPS_META } from "../data/levels";
import { formatOperand } from "../data/templates";
import type { Question } from "../types";

/** The "calculate" step: numeric keypad, cents-aware when the answer is money. */
export function SolveStep({
  question,
  questionNumber,
  totalQuestions,
  isLast,
  onFinalize,
}: {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  isLast: boolean;
  onFinalize: (correct: boolean) => void;
}) {
  // Each question mounts a fresh SolveStep instance (the parent toggles between
  // StoryStep and SolveStep), so plain initial state is enough — no reset effect needed.
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [message, setMessage] = useState("");
  const meta = OPS_META[question.operation];
  const isMoney = question.answerFormat === "money";

  function isValid(value: string) {
    if (isMoney) return /^\d+,\d{2}$/.test(value);
    return value.length > 0;
  }

  function parseValue(value: string) {
    if (isMoney) {
      const [reais, centavos] = value.split(",");
      return Number(reais) * 100 + Number(centavos);
    }
    return Number(value);
  }

  function pressDigit(d: string) {
    if (feedback) return;
    if (isMoney) {
      const commaIdx = input.indexOf(",");
      if (commaIdx === -1) {
        if (input.length >= 3) return;
      } else if (input.length - commaIdx - 1 >= 2) {
        return;
      }
    } else if (input.length >= 3) {
      return;
    }
    playTapSound();
    setInput((v) => v + d);
  }

  function pressComma() {
    if (feedback || input.length === 0 || input.includes(",")) return;
    playTapSound();
    setInput((v) => v + ",");
  }

  function pressBackspace() {
    if (feedback) return;
    setInput((v) => v.slice(0, -1));
  }

  function submit() {
    if (feedback || !isValid(input)) return;
    const correct = parseValue(input) === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    setMessage(correct ? correctPhrase() : tryAgainPhrase());
    if (correct) playCorrectSound();
    else playWrongSound();
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (/^[0-9]$/.test(e.key)) pressDigit(e.key);
      else if (e.key === "Backspace") pressBackspace();
      else if ((e.key === "," || e.key === ".") && isMoney) pressComma();
      else if (e.key === "Enter") {
        if (feedback) onFinalize(feedback === "correct");
        else submit();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  const answerDisplay = input ? (isMoney ? `R$ ${input}` : input) : "?";
  const equation = `${formatOperand(question.a, question.aFormat)} ${meta.symbol} ${formatOperand(question.b, question.bFormat)} = ${formatOperand(question.answer, question.answerFormat)}`;

  return (
    <div className="flex flex-col gap-5">
      <p className="font-body text-sm font-bold text-ink-soft">
        Pergunta {questionNumber} de {totalQuestions}
      </p>
      <Ticks total={totalQuestions} current={questionNumber - 1} />

      <p className="font-body text-sm font-semibold text-ink-soft">
        {question.text} {question.question}
      </p>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 font-display text-sm font-bold text-ink shadow-soft">
        {meta.symbol} {meta.label}
      </span>

      <motion.div
        animate={feedback === "wrong" ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-3 rounded-[20px] bg-ink px-4 py-7 font-display text-2xl font-bold text-card shadow-pop"
      >
        <span>{formatOperand(question.a, question.aFormat)}</span>
        <span>{meta.symbol}</span>
        <span>{formatOperand(question.b, question.bFormat)}</span>
        <span>=</span>
        <span className={input ? "" : "opacity-50"}>{answerDisplay}</span>
      </motion.div>

      <FeedbackBanner
        status={feedback === "wrong" ? "retry" : feedback}
        message={message}
        detail={feedback ? equation : undefined}
      />

      {!feedback ? (
        <Keypad
          isMoney={isMoney}
          disabled={!!feedback}
          onDigit={pressDigit}
          onComma={isMoney ? pressComma : undefined}
          onBackspace={pressBackspace}
          onSubmit={submit}
          submitDisabled={!isValid(input)}
          tone={meta.tone}
        />
      ) : (
        <Button tone={meta.tone} size="lg" onClick={() => onFinalize(feedback === "correct")}>
          {isLast ? "Ver resultado" : "Próxima pergunta"} →
        </Button>
      )}
    </div>
  );
}
