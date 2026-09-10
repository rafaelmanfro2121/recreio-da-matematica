import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { Confetti } from "../../../shared/components/Confetti";
import { Mascot } from "../../../shared/components/Mascot";
import { levelCompletePhrase } from "../../../shared/copy";
import { playLevelUpSound } from "../../../shared/sounds";

export function RoundSummaryScreen({
  roundCorrect,
  roundTotal,
  bestStreak,
  totalSolved,
  onPlayAgain,
}: {
  roundCorrect: number;
  roundTotal: number;
  bestStreak: number;
  totalSolved: number;
  onPlayAgain: () => void;
}) {
  const perfect = roundCorrect === roundTotal;
  const strongRound = roundTotal - roundCorrect <= 1;
  const [showConfetti, setShowConfetti] = useState(strongRound);

  useEffect(() => {
    if (!strongRound) return;
    playLevelUpSound();
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-5 py-10 text-center">
      {showConfetti && <Confetti />}

      <Mascot name="b" mood={strongRound ? "cheer" : "happy"} speech={levelCompletePhrase(perfect)} />

      <Card tone="paper" className="w-full">
        <p className="font-display text-2xl font-extrabold text-ink">
          {roundCorrect} de {roundTotal} certos!
        </p>
        <div className="mt-4 flex justify-center gap-8">
          <div>
            <p className="font-display text-xl font-bold text-ink">{bestStreak}</p>
            <p className="font-body text-xs font-semibold text-ink-soft">melhor sequência</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink">{totalSolved}</p>
            <p className="font-body text-xs font-semibold text-ink-soft">desafios resolvidos</p>
          </div>
        </div>
      </Card>

      <div className="flex w-full flex-col gap-3">
        <Button tone="logic" size="lg" onClick={onPlayAgain} className="w-full">
          Jogar mais
        </Button>
        <Link to="/" className="w-full">
          <Button tone="ink" variant="outline" size="lg" className="w-full">
            Voltar ao mapa
          </Button>
        </Link>
      </div>
    </div>
  );
}
