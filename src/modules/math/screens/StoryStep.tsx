import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mascot } from "../../../shared/components/Mascot";
import { Button } from "../../../shared/components/Button";
import { Ticks } from "../../../shared/components/Ticks";
import { playCorrectSound, playTapSound, playWrongSound } from "../../../shared/sounds";
import { OPS_META, askBubbleText } from "../data/levels";
import type { Level, Operation, Question } from "../types";

/** The "interpret" step: the child reads the situation and picks which operation applies. */
export function StoryStep({
  level,
  question,
  questionNumber,
  totalQuestions,
  onContinue,
}: {
  level: Level;
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onContinue: (chosenOp: Operation) => void;
}) {
  const singleOp = level.ops.length === 1;
  // Each question mounts a fresh StoryStep instance (the parent toggles between
  // StoryStep and SolveStep), so initializing from props here is enough.
  const [chosenOp, setChosenOp] = useState<Operation | null>(singleOp ? level.ops[0] : null);

  const answered = singleOp || chosenOp !== null;
  const opCorrect = answered && chosenOp === question.operation;

  function choose(op: Operation) {
    if (chosenOp) return;
    playTapSound();
    setChosenOp(op);
    if (op === question.operation) playCorrectSound();
    else playWrongSound();
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="font-body text-sm font-bold text-ink-soft">
        Pergunta {questionNumber} de {totalQuestions}
      </p>
      <Ticks total={totalQuestions} current={questionNumber - 1} />

      <div className="flex flex-col gap-3">
        <Mascot name="a" mood="thinking" speech={`${question.text} ${question.question}`} />
        {!singleOp && <Mascot name="b" mood="thinking" speech={askBubbleText(level)} />}
      </div>

      {!singleOp && (
        <motion.div
          animate={answered && !opCorrect ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          {level.ops.map((op) => {
            const meta = OPS_META[op];
            const isChosen = chosenOp === op;
            const isReveal = answered && !opCorrect && op === question.operation;
            return (
              <Button
                key={op}
                tone={meta.tone}
                variant={answered && !isChosen && !isReveal ? "ghost" : "solid"}
                disabled={answered}
                onClick={() => choose(op)}
                className={isReveal ? "ring-4 ring-leaf" : ""}
              >
                <span className="text-xl">{meta.symbol}</span> {meta.label}
              </Button>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`flex flex-col gap-3 rounded-[16px] border px-4 py-3 shadow-soft ${
              singleOp || opCorrect ? "border-leaf/30 bg-leaf/10" : "border-sun/30 bg-sun/10"
            }`}
          >
            <p className="font-body text-sm font-semibold text-ink">
              {singleOp
                ? "💡 "
                : opCorrect
                  ? "✅ Isso mesmo! "
                  : `❌ Essa conta não é de ${OPS_META[chosenOp as Operation].label.toLowerCase()}. `}
              {question.reason}
            </p>
            <Button tone={level.tone} className="self-start" onClick={() => onContinue(chosenOp as Operation)}>
              Vamos calcular →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
