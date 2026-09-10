import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../../shared/components/Button";
import { Mascot } from "../../../shared/components/Mascot";
import { playTapSound } from "../../../shared/sounds";
import { LEVELS } from "../data/levels";
import { useMathProgress } from "../engine/useMathProgress";
import { TONE_BG, TONE_TEXT } from "../theme";

export function LevelMapScreen() {
  const navigate = useNavigate();
  const { progress, resetProgress } = useMathProgress();

  function openLevel(index: number) {
    if (index > progress.unlockedLevelIndex) return;
    const level = LEVELS[index];
    playTapSound();
    if (progress.lessonSeen.includes(level.id)) navigate(`/matematica/jogar/${level.id}`);
    else navigate(`/matematica/licao/${level.id}`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-5 py-8">
      <Link to="/" className="w-fit">
        <Button tone="ink" variant="ghost" size="sm">
          ← Recreio
        </Button>
      </Link>

      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink">Matemática</h1>
      </div>

      <Mascot name="a" mood="happy" speech="Escolha um nível, leia a situação com atenção e descubra qual conta usar!" />

      <div className="flex flex-col gap-3">
        {LEVELS.map((level, i) => {
          const unlocked = i <= progress.unlockedLevelIndex;
          const stars = progress.stars[level.id] || 0;
          return (
            <motion.button
              key={level.id}
              type="button"
              disabled={!unlocked}
              onClick={() => openLevel(i)}
              whileHover={unlocked ? { y: -2 } : undefined}
              whileTap={unlocked ? { y: 2 } : undefined}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              aria-label={`${level.title}${unlocked ? "" : " (bloqueado)"}`}
              className={`flex items-center gap-4 rounded-3xl border-[3px] border-ink p-4 text-left shadow-pop ${
                unlocked ? "bg-card" : "bg-card/60 opacity-70"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-ink font-display text-lg font-bold text-ink ${
                  unlocked ? TONE_BG[level.tone] : "bg-paper-line"
                }`}
              >
                {unlocked ? level.symbolText : "🔒"}
              </span>
              <span className="flex-1">
                <span className={`block font-display text-lg font-bold ${unlocked ? TONE_TEXT[level.tone] : "text-ink-soft"}`}>
                  {level.title}
                </span>
                <span className="block font-body text-sm font-semibold text-ink-soft">
                  {unlocked ? level.description : "Complete o nível anterior para desbloquear"}
                </span>
                <span className="mt-1 flex gap-0.5">
                  {[0, 1, 2].map((s) => (
                    <span key={s} className={s < stars ? "text-sun" : "text-ink/15"}>
                      ★
                    </span>
                  ))}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <Link to="/matematica/tabuada">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ y: 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex items-center gap-4 rounded-3xl border-[3px] border-ink bg-card p-4 shadow-pop"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-board font-display text-lg font-bold text-card">
            ⏱
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-bold text-board">Treino de Tabuada</span>
            <span className="block font-body text-sm font-semibold text-ink-soft">
              Pratique até decorar de verdade, no seu ritmo. Sem trancar nada!
            </span>
          </span>
        </motion.div>
      </Link>

      <button
        type="button"
        onClick={() => {
          if (confirm("Tem certeza que quer reiniciar todo o progresso?")) resetProgress();
        }}
        className="mx-auto font-body text-xs font-bold text-ink-soft underline"
      >
        Reiniciar meu progresso
      </button>
    </div>
  );
}
