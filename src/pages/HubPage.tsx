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

const TONE_SOFT: Record<World["tone"], string> = {
  math: "bg-world-math/10",
  logic: "bg-world-logic/10",
  quick: "bg-world-quick/10",
};

export function HubPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center gap-9 px-5 pb-12 pt-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-1 text-center"
      >
        <span className="rounded-full border border-line bg-card px-4 py-1 font-display text-xs font-bold uppercase tracking-[0.14em] text-ink-soft shadow-soft">
          Recreio
        </span>
        <h1 className="font-display text-[2.4rem] font-extrabold leading-tight text-ink">
          Bora <span className="text-world-math">jogar</span>?
        </h1>
        <p className="font-body font-semibold text-ink-soft">Escolha um mundo para explorar hoje</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Mascot name="a" mood="happy" speech="Bora jogar um pouco?" size={100} />
      </motion.div>

      <div className="flex w-full flex-col gap-5">
        {WORLDS.map((world, i) => (
          <motion.div
            key={world.to}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
          >
            <Link to={world.to} className="block">
              <motion.div
                whileHover={{ y: -4, rotate: -0.5 }}
                whileTap={{ y: 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="flex items-center gap-4 rounded-[20px] border border-line bg-card p-4 shadow-soft"
              >
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] text-4xl leading-none shadow-soft ${TONE_BG[world.tone]}`}
                >
                  {world.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-bold text-ink">{world.title}</h2>
                  <p className="font-body text-sm font-semibold leading-snug text-ink-soft">{world.subtitle}</p>
                </div>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-ink-soft ${TONE_SOFT[world.tone]}`}
                  aria-hidden="true"
                >
                  →
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
