import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../../shared/components/Button";
import { Ticks } from "../../../shared/components/Ticks";
import { FeedbackBanner } from "../../../shared/components/FeedbackBanner";
import { Confetti } from "../../../shared/components/Confetti";
import { Keypad } from "./Keypad";
import { useStoredState } from "../../../shared/storage";
import { playCorrectSound, playLevelUpSound, playTapSound, playWrongSound } from "../../../shared/sounds";
import { correctPhrase, tryAgainPhrase } from "../../../shared/copy";
import { TABUADA_TABLES, formatElapsed, tabuadaTableProgress } from "../data/tabuada";
import { buildTabuadaQueue, computeStars, requeueInsertIndex } from "../engine/tabuadaEngine";
import type { TabuadaFact, TabuadaProgressMap } from "../types";

type SubView = "select" | "round" | "summary";

interface RoundResult {
  elapsedMs: number;
  starsEarned: number;
  newRecord: boolean;
}

export function TabuadaScreen() {
  const [progress, setProgress] = useStoredState<TabuadaProgressMap>("math:tabuada", {});
  const [subView, setSubView] = useState<SubView>("select");
  const [table, setTable] = useState<number | null>(null);
  const [queue, setQueue] = useState<TabuadaFact[]>([]);
  const [cleared, setCleared] = useState<Set<number>>(new Set());
  const [misses, setMisses] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<RoundResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentFact = queue[0] ?? null;

  function startTable(t: number) {
    playTapSound();
    const prog = tabuadaTableProgress(progress, t);
    setTable(t);
    setQueue(buildTabuadaQueue(t, prog.missCounts));
    setCleared(new Set());
    setMisses(0);
    setStartTime(Date.now());
    setInput("");
    setFeedback(null);
    setMessage("");
    setResult(null);
    setSubView("round");
  }

  function pressDigit(d: string) {
    if (feedback || input.length >= 3) return;
    playTapSound();
    setInput((v) => v + d);
  }

  function pressBackspace() {
    if (feedback) return;
    setInput((v) => v.slice(0, -1));
  }

  function submit() {
    if (feedback || input.length === 0 || !currentFact) return;
    const correct = Number(input) === currentFact.answer;
    setFeedback(correct ? "correct" : "wrong");
    setMessage(correct ? correctPhrase() : tryAgainPhrase());
    if (correct) playCorrectSound();
    else playWrongSound();
  }

  function finishRound(finalMisses: number) {
    if (table === null) return;
    const elapsedMs = Date.now() - startTime;
    const stars = computeStars(finalMisses);
    const prog = tabuadaTableProgress(progress, table);
    const newRecord = finalMisses === 0 && (prog.bestTimeMs === null || elapsedMs < prog.bestTimeMs);

    setProgress((prev) => {
      const p = tabuadaTableProgress(prev, table);
      return {
        ...prev,
        [table]: { ...p, bestTimeMs: newRecord ? elapsedMs : p.bestTimeMs, stars: Math.max(p.stars, stars) },
      };
    });

    setResult({ elapsedMs, starsEarned: stars, newRecord });
    setSubView("summary");
    if (stars === 3) {
      playLevelUpSound();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }

  function continueRound() {
    if (!currentFact || table === null) return;
    const fact = currentFact;
    const wasCorrect = feedback === "correct";
    let nextQueue = queue.slice(1);
    let nextCleared = cleared;
    let nextMisses = misses;

    if (wasCorrect) {
      nextCleared = new Set(cleared);
      nextCleared.add(fact.m);
    } else {
      nextMisses = misses + 1;
      setProgress((prev) => {
        const p = tabuadaTableProgress(prev, table);
        return {
          ...prev,
          [table]: { ...p, missCounts: { ...p.missCounts, [fact.m]: (p.missCounts[fact.m] || 0) + 1 } },
        };
      });
      const insertAt = requeueInsertIndex(nextQueue.length);
      nextQueue = [...nextQueue.slice(0, insertAt), fact, ...nextQueue.slice(insertAt)];
    }

    while (nextQueue.length > 0 && nextCleared.has(nextQueue[0].m)) nextQueue = nextQueue.slice(1);

    setQueue(nextQueue);
    setCleared(nextCleared);
    setMisses(nextMisses);
    setInput("");
    setFeedback(null);
    setMessage("");

    if (nextCleared.size >= TABUADA_TABLES.length) {
      finishRound(nextMisses);
    }
  }

  useEffect(() => {
    if (subView !== "round") return;
    function handleKey(e: KeyboardEvent) {
      if (/^[0-9]$/.test(e.key)) pressDigit(e.key);
      else if (e.key === "Backspace") pressBackspace();
      else if (e.key === "Enter") {
        if (feedback) continueRound();
        else submit();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-5 py-8">
      <Link to="/matematica" className="w-fit">
        <Button tone="ink" variant="ghost" size="sm">
          ← Mapa
        </Button>
      </Link>

      {subView === "select" && (
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold text-ink">Treino de Tabuada</h1>
            <p className="mt-1 font-body font-semibold text-ink-soft">
              Escolha uma tabuada. As perguntas vêm embaralhadas, e o que você errar aparece de novo — assim gruda de
              verdade na memória!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TABUADA_TABLES.map((t) => {
              const prog = tabuadaTableProgress(progress, t);
              return (
                <motion.button
                  key={t}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  onClick={() => startTable(t)}
                  className="flex flex-col items-center gap-1.5 rounded-[16px] border border-line bg-card px-3 py-4 shadow-soft"
                >
                  <span className="font-display text-2xl font-extrabold text-ink">{t}×</span>
                  <span className="font-body text-xs font-bold text-ink-soft">Tabuada do {t}</span>
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((s) => (
                      <span key={s} className={s < prog.stars ? "text-sun" : "text-ink/15"}>
                        ★
                      </span>
                    ))}
                  </span>
                  {prog.bestTimeMs !== null && (
                    <span className="font-body text-[11px] font-bold text-ink-soft">⏱ {formatElapsed(prog.bestTimeMs)}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {subView === "round" && currentFact && (
        <div className="flex flex-col gap-5">
          <p className="font-body text-sm font-bold text-ink-soft">
            Tabuada do {table} · {cleared.size} de {TABUADA_TABLES.length} dominadas
          </p>
          <Ticks total={TABUADA_TABLES.length} current={cleared.size} />
          <motion.div
            animate={feedback === "wrong" ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 rounded-[20px] bg-ink px-4 py-8 font-display text-3xl font-bold text-card shadow-pop"
          >
            <span>{currentFact.table}</span>
            <span>×</span>
            <span>{currentFact.m}</span>
            <span>=</span>
            <span className={input ? "" : "opacity-50"}>{input || "?"}</span>
          </motion.div>
          <FeedbackBanner
            status={feedback === "wrong" ? "retry" : feedback}
            message={message}
            detail={feedback ? `${currentFact.table} × ${currentFact.m} = ${currentFact.answer}` : undefined}
          />
          {!feedback ? (
            <Keypad
              isMoney={false}
              disabled={!!feedback}
              onDigit={pressDigit}
              onBackspace={pressBackspace}
              onSubmit={submit}
              submitDisabled={input.length === 0}
              tone="multiply"
            />
          ) : (
            <Button tone="multiply" size="lg" onClick={continueRound}>
              Próxima →
            </Button>
          )}
        </div>
      )}

      {subView === "summary" && result && table !== null && (
        <div className="flex flex-col items-center gap-4 text-center">
          {showConfetti && <Confetti />}
          <span className="text-6xl">{result.starsEarned === 3 ? "🏆" : "🌱"}</span>
          <h2 className="font-display text-2xl font-extrabold text-ink">{misses === 0 ? "Tabuada dominada!" : "Bom treino!"}</h2>
          <p className="font-body font-semibold text-ink-soft">
            Tabuada do {table} em {formatElapsed(result.elapsedMs)}
            {misses > 0 ? ` · ${misses} ${misses === 1 ? "errinho" : "errinhos"}` : ""}
          </p>
          {result.newRecord && <p className="font-body font-bold text-leaf">🏅 Novo recorde de tempo!</p>}
          {misses > 0 && (
            <p className="font-body text-sm font-semibold text-ink-soft">
              As que você errou vão aparecer mais vezes na próxima — assim gruda de vez!
            </p>
          )}
          <div className="flex w-full flex-col gap-3">
            <Button tone="multiply" size="lg" onClick={() => startTable(table)}>
              Treinar de novo ↺
            </Button>
            <Button tone="ink" variant="ghost" size="lg" onClick={() => setSubView("select")}>
              Escolher outra tabuada
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
