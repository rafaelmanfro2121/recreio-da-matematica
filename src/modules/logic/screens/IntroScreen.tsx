import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Mascot } from "../../../shared/components/Mascot";

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-8 px-5 py-10 text-center">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-extrabold text-ink">Desafios da Mente</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Padrões, enigmas e pistas para pensar</p>
      </motion.div>

      <Mascot
        name="a"
        mood="thinking"
        speech="Preparado para umas charadas e quebra-cabeças? Vamos usar a cabeça!"
      />

      <div className="flex w-full flex-col gap-3">
        <Button tone="logic" size="lg" onClick={onStart} className="w-full">
          Começar
        </Button>
        <Link to="/" className="w-full">
          <Button tone="ink" variant="ghost" size="md" className="w-full">
            Voltar ao mapa
          </Button>
        </Link>
      </div>
    </div>
  );
}
