import { Link } from "react-router-dom";
import { Mascot } from "../../../shared/components/Mascot";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Modo Foco 🎯</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Treine sua concentração, do seu jeito</p>
      </div>

      <Mascot name="a" mood="happy" speech="Bora treinar o cérebro? É rapidinho, tipo um aquecimento antes do jogo!" />

      <Card tone="paper" className="w-full text-left">
        <p className="font-body text-sm font-semibold text-ink-soft">
          Primeiro a gente respira um pouco, escolhe uma meta, e depois joga 3 desafios curtos — de olho, de ouvido, de
          memória e até de corpo. No fim, você conta como foi seu foco.
        </p>
      </Card>

      <div className="flex w-full flex-col gap-3">
        <Button tone="focus" size="lg" onClick={onStart} className="w-full">
          Começar sessão
        </Button>
        <Link to="/" className="block">
          <Button tone="ink" variant="outline" size="md" className="w-full">
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  );
}
