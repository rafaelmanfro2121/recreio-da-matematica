import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { LEVELS, OPS_META } from "../data/levels";
import { LESSON } from "../data/lessons";
import { useMathProgress } from "../engine/useMathProgress";
import { TONE_BG, TONE_TEXT } from "../theme";
import type { Operation } from "../types";

function DotsDemo({
  operation,
  a,
  b,
  answer,
  dotClass,
}: {
  operation: Operation;
  a: number;
  b: number;
  answer: number;
  dotClass: string;
}) {
  const dot = (key: string, faded = false) => (
    <span key={key} className={`inline-block h-3 w-3 rounded-full ${dotClass} ${faded ? "opacity-25" : ""}`} />
  );

  if (operation === "add") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: a }).map((_, i) => dot(`a${i}`))}
        <span className="mx-1 font-display font-bold text-ink">+</span>
        {Array.from({ length: b }).map((_, i) => dot(`b${i}`))}
      </div>
    );
  }
  if (operation === "subtract") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: answer }).map((_, i) => dot(`k${i}`))}
        {Array.from({ length: b }).map((_, i) => dot(`f${i}`, true))}
      </div>
    );
  }
  if (operation === "multiply") {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {Array.from({ length: a }).map((_, row) => (
          <div key={row} className="flex gap-1.5">
            {Array.from({ length: b }).map((_, i) => dot(`${row}-${i}`))}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {Array.from({ length: b }).map((_, g) => (
        <div key={g} className="flex gap-1">
          {Array.from({ length: answer }).map((_, i) => dot(`${g}-${i}`))}
        </div>
      ))}
    </div>
  );
}

export function LessonScreen() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { markLessonSeen } = useMathProgress();
  const level = LEVELS.find((l) => l.id === levelId);

  if (!level) return <Navigate to="/matematica" replace />;

  const skipQuiz = level.explainOps.length === 1;

  function handleStart() {
    if (skipQuiz) {
      markLessonSeen(level!.id);
      navigate(`/matematica/jogar/${level!.id}`);
    } else {
      navigate(`/matematica/quiz/${level!.id}`);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-5 py-8">
      <Link to="/matematica" className="w-fit">
        <Button tone="ink" variant="ghost" size="sm">
          ← Mapa
        </Button>
      </Link>

      <div className="flex flex-col items-center gap-2 text-center">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink font-display text-2xl font-bold text-ink shadow-pop ${TONE_BG[level.tone]}`}
        >
          {level.symbolText}
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink">{level.title}</h1>
        <p className="font-body font-semibold text-ink-soft">{level.description}</p>
        <p className="font-body text-xs font-bold text-ink-soft">
          8 situações-problema · acerte todas para passar de nível
        </p>
      </div>

      <p className="font-body font-semibold text-ink">
        Vamos entender direitinho como funciona {level.explainOps.length > 1 ? "cada conta" : "essa conta"}!
      </p>

      <div className="flex flex-col gap-4">
        {level.explainOps.map((op) => {
          const meta = OPS_META[op];
          const l = LESSON[op];
          return (
            <Card key={op} tone="paper">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-ink font-display text-lg font-bold text-ink ${TONE_BG[meta.tone]}`}
                >
                  {meta.symbol}
                </span>
                <h2 className="font-display text-xl font-bold text-ink">{l.title}</h2>
              </div>
              <p className="mt-3 font-body text-sm text-ink">
                <strong>O que é:</strong> {l.whatItIs}
              </p>
              <p className="mt-1 font-body text-sm text-ink">
                <strong>Quando usar:</strong> {l.whenToUse}
              </p>
              <p className="mt-3 font-body text-xs font-bold uppercase tracking-wide text-ink-soft">
                Fique de olho nestas palavras:
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {l.keywords.map((k) => (
                  <span key={k} className="rounded-full border-2 border-ink bg-card px-2.5 py-1 font-body text-xs font-bold text-ink">
                    {k}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border-2 border-ink/15 bg-card p-3">
                <p className="font-body text-sm font-semibold text-ink">
                  {l.example.text} {l.example.question}
                </p>
                <div className="my-3">
                  <DotsDemo operation={op} a={l.example.a} b={l.example.b} answer={l.example.answer} dotClass={TONE_BG[meta.tone]} />
                </div>
                <p className="font-display font-bold text-ink">
                  {l.example.a} {meta.symbol} {l.example.b} = <span className={TONE_TEXT[meta.tone]}>{l.example.answer}</span>
                </p>
              </div>
              {l.moneyNote && <p className="mt-3 font-body text-sm font-semibold text-ink-soft">💰 {l.moneyNote}</p>}
            </Card>
          );
        })}
      </div>

      {level.contrastNote && (
        <Card tone="card" className="bg-sun/20">
          <p className="font-body text-sm font-semibold text-ink">⚠️ {level.contrastNote}</p>
        </Card>
      )}

      <Button tone={level.tone} size="lg" onClick={handleStart}>
        {skipQuiz ? "Começar a praticar ▶" : "Fazer o teste rápido →"}
      </Button>
    </div>
  );
}
