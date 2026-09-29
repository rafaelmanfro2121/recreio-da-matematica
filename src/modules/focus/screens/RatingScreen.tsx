import { useState } from "react";
import { motion } from "framer-motion";
import { Mascot } from "../../../shared/components/Mascot";
import { Button } from "../../../shared/components/Button";

const FACES = ["😞", "🙁", "😐", "🙂", "😄"];

export function RatingScreen({ goal, onDone }: { goal: string; onDone: (rating: number, goalMet: boolean) => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const [goalMet, setGoalMet] = useState<boolean | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Como foi meu foco?</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Nota de 1 a 5</p>
      </div>

      <Mascot name="a" mood="happy" speech="Sem certo ou errado aqui — só me conta como você se sentiu!" />

      <div className="flex w-full justify-between gap-1.5">
        {FACES.map((face, i) => {
          const value = i + 1;
          const isSelected = rating === value;
          return (
            <motion.button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              whileHover={{ y: -3, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
              className={`flex flex-1 flex-col items-center gap-1 rounded-[14px] border px-2 py-3 shadow-soft transition-colors ${
                isSelected ? "border-world-focus bg-world-focus/10" : "border-line bg-card"
              }`}
            >
              <span className="text-3xl leading-none">{face}</span>
              <span className="font-display text-xs font-extrabold text-ink-soft">{value}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="w-full">
        <p className="mb-2 font-body text-sm font-bold text-ink">Bateu a meta: "{goal}"?</p>
        <div className="flex gap-3">
          <Button
            tone={goalMet === true ? "focus" : "ink"}
            variant={goalMet === true ? "solid" : "outline"}
            className="flex-1"
            onClick={() => setGoalMet(true)}
          >
            Bati! 🎉
          </Button>
          <Button
            tone={goalMet === false ? "focus" : "ink"}
            variant={goalMet === false ? "solid" : "outline"}
            className="flex-1"
            onClick={() => setGoalMet(false)}
          >
            Quase
          </Button>
        </div>
      </div>

      <Button
        tone="focus"
        size="lg"
        onClick={() => rating !== null && goalMet !== null && onDone(rating, goalMet)}
        disabled={rating === null || goalMet === null}
        className="w-full"
      >
        Ver resultado
      </Button>
    </div>
  );
}
