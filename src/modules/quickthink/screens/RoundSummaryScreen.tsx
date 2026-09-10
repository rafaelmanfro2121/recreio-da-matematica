import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mascot } from "../../../shared/components/Mascot";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Confetti } from "../../../shared/components/Confetti";
import { effortPhrase, levelCompletePhrase, streakPhrase } from "../../../shared/copy";
import { playLevelUpSound } from "../../../shared/sounds";
import type { SessionStats } from "../types";

export function RoundSummaryScreen({
  stats,
  onPlayAgain,
}: {
  stats: SessionStats;
  onPlayAgain: () => void;
}) {
  const perfect = stats.correctCount === stats.totalRounds;
  const strongRound = stats.isNewBestStreak || perfect;
  const [showConfetti, setShowConfetti] = useState(strongRound);

  useEffect(() => {
    if (!strongRound) return;
    playLevelUpSound();
    const timeout = window.setTimeout(() => setShowConfetti(false), 2000);
    return () => window.clearTimeout(timeout);
    // fires once, when the summary screen mounts for this session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avgSeconds = stats.avgReactionMs > 0 ? (stats.avgReactionMs / 1000).toFixed(1) : null;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {showConfetti && <Confetti />}

      <Mascot name="b" mood={strongRound ? "cheer" : "happy"} speech={levelCompletePhrase(perfect)} />

      <Card className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-display text-3xl font-extrabold text-ink">
              {stats.correctCount}/{stats.totalRounds}
            </p>
            <p className="font-body text-xs font-semibold text-ink-soft">acertos</p>
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold text-ink">{stats.bestStreakThisSession}</p>
            <p className="font-body text-xs font-semibold text-ink-soft">sequência de acertos</p>
          </div>
        </div>

        {avgSeconds && (
          <p className="mt-4 font-body text-sm font-semibold text-ink-soft">
            Tempo médio de resposta: {avgSeconds}s{stats.isNewBestAvg ? " — novo recorde!" : ""}
          </p>
        )}

        <p className="mt-2 font-body text-sm font-bold text-ink">
          {stats.isNewBestStreak ? `${streakPhrase()} Novo recorde de sequência!` : effortPhrase()}
        </p>
      </Card>

      <div className="flex w-full flex-col gap-3">
        <Button tone="quick" size="lg" onClick={onPlayAgain} className="w-full">
          Jogar de novo
        </Button>
        <Link to="/" className="block">
          <Button tone="ink" variant="outline" size="md" className="w-full">
            Voltar pro início
          </Button>
        </Link>
      </div>
    </div>
  );
}
