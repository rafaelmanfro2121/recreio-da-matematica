import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/components/Button";

const CYCLES = 3;
const PHASE_MS = 4000;

/** "Prepara a mente": a circle grows on the in-breath, shrinks on the out-breath,
 * 3 cycles, ~24s total. Always skippable -- this is a calm-down, not a test. */
export function BreatheScreen({ onDone }: { onDone: () => void }) {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (phase === "in") {
        setPhase("out");
      } else if (cycle + 1 >= CYCLES) {
        onDone();
      } else {
        setCycle((c) => c + 1);
        setPhase("in");
      }
    }, PHASE_MS);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, cycle]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-5 py-16 text-center">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Prepara a mente</h1>
        <p className="mt-1 font-body font-semibold text-ink-soft">Respira com o círculo, {CYCLES} vezes</p>
      </div>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <motion.div
          className="absolute h-28 w-28 rounded-full"
          style={{ background: "linear-gradient(135deg, var(--color-world-focus-light), var(--color-world-focus))" }}
          animate={{ scale: phase === "in" ? 1.5 : 1, opacity: phase === "in" ? 1 : 0.75 }}
          transition={{ duration: PHASE_MS / 1000, ease: "easeInOut" }}
          initial={{ scale: 1, opacity: 0.75 }}
        />
        <span className="relative font-display text-lg font-bold text-white">{phase === "in" ? "Inspira..." : "Solta..."}</span>
      </div>

      <p className="font-body text-sm font-semibold text-ink-soft">Ciclo {cycle + 1} de {CYCLES}</p>

      <Button tone="ink" variant="ghost" size="sm" onClick={onDone}>
        Pular
      </Button>
    </div>
  );
}
