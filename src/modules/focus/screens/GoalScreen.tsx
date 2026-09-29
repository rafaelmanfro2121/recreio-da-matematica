import { useState } from "react";
import { motion } from "framer-motion";
import { Mascot } from "../../../shared/components/Mascot";
import { Button } from "../../../shared/components/Button";
import { SESSION_GOALS } from "../engine/session";

export function GoalScreen({ onPick }: { onPick: (goal: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Minha meta</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Escolha o que quer treinar hoje</p>
      </div>

      <Mascot name="b" mood="thinking" speech="Toda missão começa com uma meta. Qual vai ser a sua?" />

      <div className="flex w-full flex-col gap-2.5">
        {SESSION_GOALS.map((goal) => {
          const isSelected = goal === selected;
          return (
            <motion.button
              key={goal}
              type="button"
              onClick={() => setSelected(goal)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 1, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={`rounded-[14px] border px-4 py-3 text-left font-body text-base font-bold shadow-soft transition-colors ${
                isSelected ? "border-world-focus bg-world-focus/10 text-ink" : "border-line bg-card text-ink"
              }`}
            >
              {goal}
            </motion.button>
          );
        })}
      </div>

      <Button tone="focus" size="lg" onClick={() => selected && onPick(selected)} disabled={!selected} className="w-full">
        Vamos lá!
      </Button>
    </div>
  );
}
