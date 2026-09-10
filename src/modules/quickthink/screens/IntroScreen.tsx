import { Link } from "react-router-dom";
import { Mascot } from "../../../shared/components/Mascot";
import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Reflexo Rápido ⚡</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Pense rápido, jogue melhor</p>
      </div>

      <Mascot name="a" mood="cheer" speech="Vamos treinar o reflexo? É rapidinho e divertido!" />

      <Card tone="paper" className="w-full text-left">
        <p className="font-body text-sm font-semibold text-ink-soft">
          Você vai ver desafios rápidos: padrões, jogadas espertas e o que vem a seguir. Responda antes do tempo
          acabar — sem pressa de errar, é só treino de reflexo!
        </p>
      </Card>

      <div className="flex w-full flex-col gap-3">
        <Button tone="quick" size="lg" onClick={onStart} className="w-full">
          Começar treino
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
