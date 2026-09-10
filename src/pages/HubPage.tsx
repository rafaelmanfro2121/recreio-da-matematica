import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mascot } from "../shared/components/Mascot";

type World = {
  to: string;
  title: string;
  subtitle: string;
  tone: "math" | "logic" | "quick";
  emoji: string;
};

const WORLDS: World[] = [
  { to: "/matematica", title: "Matemática", subtitle: "Contas, histórias e a tabuada", tone: "math", emoji: "🧮" },
  { to: "/mente", title: "Desafios da Mente", subtitle: "Padrões, enigmas e pistas", tone: "logic", emoji: "🧩" },
  { to: "/reflexo", title: "Reflexo Rápido", subtitle: "Pense rápido, jogue melhor", tone: "quick", emoji: "⚡" },
];

const TONE_BG: Record<World["tone"], string> = {
  math: "bg-world-math",
  logic: "bg-world-logic",
  quick: "bg-world-quick",
};

export function HubPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center gap-8 px-5 py-10">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-display text-4xl font-extrabold text-ink">Recreio</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Escolha para onde ir hoje</p>
      </motion.div>

      <Mascot name="a" mood="happy" speech="Bora brincar um pouco?" />

      <div className="flex w-full flex-col gap-5">
        {WORLDS.map((world, i) => (
          <motion.div
            key={world.to}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
          >
            <Link to={world.to} className="block">
              <motion.div
                whileHover={{ y: -3, rotate: -0.4 }}
                whileTap={{ y: 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className={`flex items-center gap-4 rounded-3xl border-[3px] border-ink p-5 shadow-pop ${TONE_BG[world.tone]}`}
              >
                <span className="text-5xl leading-none">{world.emoji}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">{world.title}</h2>
                  <p className="font-body text-sm font-semibold text-ink/80">{world.subtitle}</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
