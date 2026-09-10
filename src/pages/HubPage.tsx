import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { WeeklyChart } from "../shared/components/WeeklyChart";
import { computeStreak, getLastNDays } from "../shared/activity";

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

const TONE_GRADIENT: Record<World["tone"], string> = {
  math: "bg-gradient-to-br from-world-math-light to-world-math",
  logic: "bg-gradient-to-br from-world-logic-light to-world-logic",
  quick: "bg-gradient-to-br from-world-quick-light to-world-quick",
};

const TONE_SOFT: Record<World["tone"], string> = {
  math: "bg-world-math/10",
  logic: "bg-world-logic/10",
  quick: "bg-world-quick/10",
};

const TONE_GLOW: Record<World["tone"], string> = {
  math: "0 14px 26px -14px rgba(37,99,235,0.45)",
  logic: "0 14px 26px -14px rgba(124,58,237,0.4)",
  quick: "0 14px 26px -14px rgba(22,163,74,0.4)",
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HubPage() {
  const days = useMemo(() => getLastNDays(7), []);
  const streak = useMemo(() => computeStreak(), []);
  const weekTotal = useMemo(() => days.reduce((sum, d) => sum + d.correct, 0), [days]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-6 px-5 pb-12 pt-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="font-body text-sm font-bold text-ink-soft">{greeting()} 👋</p>
          <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">Recreio</h1>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 shadow-soft">
            <span className="text-base leading-none">🔥</span>
            <span className="font-display text-sm font-extrabold text-ink">{streak}</span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 26 }}
        className="glass-card rounded-[24px] p-5"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-base font-bold text-ink">Sua evolução</h2>
          <p className="font-body text-xs font-bold text-ink-soft">
            {weekTotal > 0 ? `${weekTotal} acertos essa semana` : "Vamos começar?"}
          </p>
        </div>
        <div className="mt-4">
          <WeeklyChart days={days} />
        </div>
      </motion.div>

      <div className="flex w-full flex-col gap-4">
        {WORLDS.map((world, i) => (
          <motion.div
            key={world.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 + i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
          >
            <Link to={world.to} className="block">
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ y: 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                style={{ boxShadow: TONE_GLOW[world.tone] }}
                className="flex items-center gap-4 rounded-[20px] border border-line bg-card p-4"
              >
                <span
                  className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[16px] text-4xl leading-none ${TONE_GRADIENT[world.tone]}`}
                >
                  <span className="pointer-events-none absolute inset-x-2 top-1.5 h-3 rounded-full bg-white/25 blur-[2px]" />
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
