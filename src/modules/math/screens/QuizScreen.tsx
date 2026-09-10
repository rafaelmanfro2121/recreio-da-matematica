import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../shared/components/Button";
import { Mascot } from "../../../shared/components/Mascot";
import { Ticks } from "../../../shared/components/Ticks";
import { playCorrectSound, playTapSound, playWrongSound } from "../../../shared/sounds";
import { LEVELS, OPS_META } from "../data/levels";
import { LESSON, generateQuizRound } from "../data/lessons";
import { useMathProgress } from "../engine/useMathProgress";
import type { Operation, QuizItem } from "../types";

/** Comprehension-check quiz gating first play of multi-op levels. */
export function QuizScreen() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { markLessonSeen } = useMathProgress();
  const level = LEVELS.find((l) => l.id === levelId);

  const [round, setRound] = useState<QuizItem[]>(() => (level ? generateQuizRound(level.explainOps) : []));
  const [index, setIndex] = useState(0);
  const [chosenOp, setChosenOp] = useState<Operation | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  if (!level) return <Navigate to="/matematica" replace />;

  const finished = results.length === round.length;
  const cur = round[index];

  function choose(op: Operation) {
    if (chosenOp) return;
    playTapSound();
    setChosenOp(op);
    if (op === cur.operation) playCorrectSound();
    else playWrongSound();
  }

  function continueQuiz() {
    setResults((r) => [...r, chosenOp === cur.operation]);
    setChosenOp(null);
    setIndex((i) => i + 1);
  }

  function retryQuiz() {
    setRound(generateQuizRound(level!.explainOps));
    setIndex(0);
    setChosenOp(null);
    setResults([]);
  }

  function startPractice() {
    markLessonSeen(level!.id);
    navigate(`/matematica/jogar/${level!.id}`);
  }

  const correctCount = results.filter(Boolean).length;
  const perfect = finished && correctCount === round.length;

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-5 py-8">
      <Link to="/matematica" className="w-fit">
        <Button tone="ink" variant="ghost" size="sm">
          ← Mapa
        </Button>
      </Link>

      {finished ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">{perfect ? "🏆" : "🌱"}</span>
          <h2 className="font-display text-2xl font-extrabold text-ink">{perfect ? "Você entendeu tudinho!" : "Quase lá!"}</h2>
          <p className="font-body font-semibold text-ink-soft">
            Você acertou {correctCount} de {round.length} no teste rápido
          </p>
          <p className="font-body font-semibold text-ink-soft">
            {perfect ? "Agora sim, vamos praticar de verdade!" : "Vamos revisar a explicação antes de praticar."}
          </p>
          <div className="flex w-full flex-col gap-3">
            {perfect ? (
              <Button tone={level.tone} size="lg" onClick={startPractice}>
                Começar a praticar ▶
              </Button>
            ) : (
              <>
                <Button tone={level.tone} size="lg" onClick={() => navigate(`/matematica/licao/${level.id}`)}>
                  Rever explicação
                </Button>
                <Button tone="ink" variant="ghost" size="lg" onClick={retryQuiz}>
                  Tentar de novo ↺
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <p className="font-body text-sm font-bold text-ink-soft">
            Teste rápido · {index + 1} de {round.length}
          </p>
          <Ticks total={round.length} current={index} />
          <Mascot name="b" mood="thinking" speech={cur.text} />
          <p className="font-body font-bold text-ink">Essa frase é de:</p>
          <div className="grid grid-cols-2 gap-3">
            {level.explainOps.map((op) => {
              const meta = OPS_META[op];
              const answered = !!chosenOp;
              const isChosen = chosenOp === op;
              const opCorrect = answered && chosenOp === cur.operation;
              const isReveal = answered && !opCorrect && op === cur.operation;
              return (
                <Button
                  key={op}
                  tone={meta.tone}
                  variant={answered && !isChosen && !isReveal ? "ghost" : "solid"}
                  disabled={answered}
                  onClick={() => choose(op)}
                  className={isReveal ? "ring-4 ring-leaf" : ""}
                >
                  {meta.symbol} {meta.label}
                </Button>
              );
            })}
          </div>
          <AnimatePresence>
            {chosenOp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className={`flex flex-col gap-3 rounded-[16px] border px-4 py-3 shadow-soft ${
                  chosenOp === cur.operation ? "border-leaf/30 bg-leaf/10" : "border-sun/30 bg-sun/10"
                }`}
              >
                <p className="font-body text-sm font-semibold text-ink">
                  {chosenOp === cur.operation ? "✅ Isso mesmo! " : `❌ Essa frase não é de ${OPS_META[chosenOp].label.toLowerCase()}. `}
                  A palavra "{cur.keyword}" indica {OPS_META[cur.operation].label.toUpperCase()} ({OPS_META[cur.operation].symbol}).
                  {chosenOp !== cur.operation ? ` ${LESSON[cur.operation].whenToUse}` : ""}
                </p>
                <Button tone={level.tone} className="self-start" onClick={continueQuiz}>
                  Continuar →
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
