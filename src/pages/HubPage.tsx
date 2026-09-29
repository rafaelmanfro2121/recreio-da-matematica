import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { WeeklyChart } from "../shared/components/WeeklyChart";
import { AnimatedNumber } from "../shared/components/AnimatedNumber";
import { computeStreak, getLastNDays } from "../shared/activity";

type World = {
  to: string;
  title: string;
  subtitle: string;
  tone: "math" | "logic" | "quick" | "focus";
  emoji: string;
};

const WORLDS: World[] = [
  { to: "/matematica", title: "Matemática", subtitle: "Contas, histórias e a tabuada", tone: "math", emoji: "🧮" },
  { to: "/mente", title: "Desafios da Mente", subtitle: "Padrões, enigmas e pistas", tone: "logic", emoji: "🧩" },
  { to: "/reflexo", title: "Reflexo Rápido", subtitle: "Pense rápido, jogue melhor", tone: "quick", emoji: "⚡" },
  { to: "/foco", title: "Modo Foco", subtitle: "Treine sua atenção em 5 minutos", tone: "focus", emoji: "🎯" },
];

const TONE_GRADIENT: Record<World["tone"], string> = {
  math: "linear-gradient(135deg, var(--color-world-math-light), var(--color-world-math) 70%)",
  logic: "linear-gradient(135deg, var(--color-world-logic-light), var(--color-world-logic) 70%)",
  quick: "linear-gradient(135deg, var(--color-world-quick-light), var(--color-world-quick) 70%)",
  focus: "linear-gradient(135deg, var(--color-world-focus-light), var(--color-world-focus) 70%)",
};

const TONE_GLOW: Record<World["tone"], string> = {
  math: "0 18px 32px -16px rgba(37,99,235,0.55)",
  logic: "0 18px 32px -16px rgba(124,58,237,0.5)",
  quick: "0 18px 32px -16px rgba(22,163,74,0.5)",
  focus: "0 18px 32px -16px rgba(8,145,178,0.5)",
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function WorldCard({ world, index }: { world: World; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35 + index * 0.09, type: "spring", stiffness: 280, damping: 22 }}
    >
      <Link to={world.to} className="block h-full">
        <motion.div
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 460, damping: 26 }}
          style={{ background: TONE_GRADIENT[world.tone], boxShadow: TONE_GLOW[world.tone] }}
          className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[24px] p-5 text-white"
        >
          <span className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10 blur-md" aria-hidden="true" />
          <motion.span
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.2 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl leading-none drop-shadow-sm"
          >
            {world.emoji}
          </motion.span>
          <div>
            <h2 className="font-display text-base font-extrabold">{world.title}</h2>
            <p className="mt-0.5 font-body text-xs font-semibold leading-snug text-white/85">{world.subtitle}</p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-base font-bold backdrop-blur-sm" aria-hidden="true">
            →
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function HubPage() {
  const days = useMemo(() => getLastNDays(7), []);
  const streak = useMemo(() => computeStreak(), []);
  const weekTotal = useMemo(() => days.reduce((sum, d) => sum + d.correct, 0), [days]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-5 px-5 pb-12 pt-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="font-body text-sm font-bold text-ink-soft">{greeting()} 👋</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight text-ink">Recreio</h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 24 }}
        style={{
          background: "linear-gradient(135deg, var(--color-world-math-light), var(--color-world-math) 55%, var(--color-world-logic) 130%)",
          boxShadow: "0 24px 44px -18px rgba(37,99,235,0.5)",
        }}
        className="relative overflow-hidden rounded-[28px] p-6 text-white"
      >
        <motion.span
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
          animate={{ y: [0, -10, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative flex items-start justify-between">
          <h2 className="font-display text-base font-bold text-white/95">Sua evolução</h2>
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              <span className="text-sm leading-none">🔥</span>
              <AnimatedNumber value={streak} className="font-display text-sm font-extrabold" />
            </div>
          )}
        </div>

        <div className="relative mt-3 flex items-end justify-between gap-4">
          <div>
            <AnimatedNumber value={weekTotal} className="font-display text-5xl font-extrabold leading-none tabular-nums" />
            <p className="mt-1.5 font-body text-xs font-bold text-white/75">acertos essa semana</p>
          </div>
        </div>

        <div className="relative mt-5">
          <WeeklyChart days={days} light />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {WORLDS.map((world, index) => (
          <WorldCard key={world.to} world={world} index={index} />
        ))}
      </div>
    </div>
  );
}
