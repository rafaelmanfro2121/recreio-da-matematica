import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../../shared/components/Button";
import { Mascot } from "../../../shared/components/Mascot";
import { Confetti } from "../../../shared/components/Confetti";
import { levelCompletePhrase } from "../../../shared/copy";
import { playLevelUpSound } from "../../../shared/sounds";
import type { Level } from "../types";

export function RoundSummaryScreen({
  level,
  correctCount,
  total,
  onRetry,
  onNextLevel,
  hasNext,
}: {
  level: Level;
  correctCount: number;
  total: number;
  onRetry: () => void;
  onNextLevel: () => void;
  hasNext: boolean;
}) {
  const perfect = correctCount === total;
  const [showConfetti, setShowConfetti] = useState(false);
  const [message] = useState(() => levelCompletePhrase(perfect));

  useEffect(() => {
    if (!perfect) return;
    playLevelUpSound();
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {showConfetti && <Confetti />}
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className="text-6xl"
      >
        {perfect ? "🏆" : "🌱"}
      </motion.span>
      <Mascot name={perfect ? "b" : "a"} mood={perfect ? "cheer" : "thinking"} speech={message} />
      <h2 className="font-display text-2xl font-extrabold text-ink">{perfect ? "Nível completo!" : "Quase lá!"}</h2>
      <p className="font-body font-semibold text-ink-soft">
        Você acertou {correctCount} de {total} problemas de {level.title.toLowerCase()}
      </p>
      {!perfect && (
        <p className="font-body text-sm font-semibold text-ink-soft">
          Precisa acertar tudo (a conta certa e o resultado certo) para desbloquear o próximo nível. Você consegue!
        </p>
      )}
      <div className="flex w-full flex-col gap-3">
        {perfect && hasNext && (
          <Button tone={level.tone} size="lg" onClick={onNextLevel}>
            Próximo nível →
          </Button>
        )}
        {!perfect && (
          <Button tone={level.tone} size="lg" onClick={onRetry}>
            Tentar de novo ↺
          </Button>
        )}
        <Link to="/matematica" className="w-full">
          <Button tone="ink" variant="ghost" size="lg" className="w-full">
            🏠 Mapa de níveis
          </Button>
        </Link>
      </div>
    </div>
  );
}
