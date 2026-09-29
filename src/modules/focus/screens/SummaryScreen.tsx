import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mascot } from "../../../shared/components/Mascot";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { Confetti } from "../../../shared/components/Confetti";
import { useStoredState } from "../../../shared/storage";
import { playLevelUpSound } from "../../../shared/sounds";
import type { FocusSessionStats } from "../types";

const ATTENTION_LABEL: Record<string, string> = {
  sustained: "atenção contínua",
  selective: "achar o que importa",
  impulse: "parar e pensar",
  memory: "memória",
};

const MASCOT_BASE_SIZE = 64;
const MASCOT_MAX_SIZE = 108;

export function SummaryScreen({ stats, onPlayAgain }: { stats: FocusSessionStats; onPlayAgain: () => void }) {
  const [totalPoints, setTotalPoints] = useStoredState<number>("focus:totalPoints", 0);
  const [sessionsDone, setSessionsDone] = useStoredState<number>("focus:sessionsDone", 0);
  const [showConfetti, setShowConfetti] = useState(stats.goalMet);

  useEffect(() => {
    setTotalPoints((p) => p + stats.totalScore);
    setSessionsDone((s) => s + 1);
    if (stats.goalMet) {
      playLevelUpSound();
      const t = window.setTimeout(() => setShowConfetti(false), 2000);
      return () => window.clearTimeout(t);
    }
    // fires once, when the summary mounts for this session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mascotSize = Math.min(MASCOT_MAX_SIZE, MASCOT_BASE_SIZE + Math.sqrt(totalPoints) * 2.2);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {showConfetti && <Confetti />}

      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Sessão completa!</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">
          {stats.goalMet ? "Você bateu sua meta hoje 🎉" : "Você treinou até o fim, isso já é vitória"}
        </p>
      </div>

      <Mascot
        name="a"
        mood={stats.goalMet ? "cheer" : "happy"}
        size={mascotSize}
        speech="Cada treino me deixa mais forte — e você também!"
      />

      <Card className="w-full">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-display text-3xl font-extrabold text-ink">{stats.totalScore}</p>
            <p className="font-body text-xs font-semibold text-ink-soft">pontos de foco</p>
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold text-ink">{Math.round(stats.averageAccuracy * 100)}%</p>
            <p className="font-body text-xs font-semibold text-ink-soft">de acerto</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-left">
          {stats.games.map((g, i) => (
            <div key={i} className="flex items-center justify-between rounded-[10px] bg-paper px-3 py-2">
              <div>
                <p className="font-body text-sm font-bold text-ink">{g.title}</p>
                <p className="font-body text-xs font-semibold text-ink-soft">{ATTENTION_LABEL[g.attentionType]}</p>
              </div>
              <p className="font-display text-sm font-extrabold text-world-focus">{Math.round(g.accuracy * 100)}%</p>
            </div>
          ))}
        </div>

        <p className="mt-4 font-body text-xs font-semibold text-ink-soft">
          Sessão nº {sessionsDone} · {totalPoints} pontos de foco acumulados no total
        </p>
      </Card>

      <Card tone="paper" className="w-full">
        <p className="font-body text-sm font-bold text-ink">Seu cérebro treinou bem hoje! 🧠</p>
        <p className="mt-1 font-body text-sm font-semibold text-ink-soft">
          Que tal dar uma pausa agora e voltar outra hora, ainda mais afiado?
        </p>
      </Card>

      <div className="flex w-full flex-col gap-3">
        <Button tone="focus" size="lg" onClick={onPlayAgain} className="w-full">
          Treinar de novo
        </Button>
        <Link to="/" className="block">
          <Button tone="ink" variant="outline" size="md" className="w-full">
            Fazer uma pausa
          </Button>
        </Link>
      </div>
    </div>
  );
}
