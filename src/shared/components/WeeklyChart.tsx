import { motion } from "framer-motion";
import type { ActivityDay } from "../activity";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
const TRACK_HEIGHT = 84;
const MIN_BAR = 6;

export function WeeklyChart({ days }: { days: ActivityDay[] }) {
  const max = Math.max(1, ...days.map((d) => d.correct));
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: TRACK_HEIGHT + 28 }}>
      {days.map((day, i) => {
        const isToday = day.date === todayKey;
        const pct = day.correct > 0 ? Math.max(MIN_BAR, (day.correct / max) * 100) : 0;
        const weekday = WEEKDAY_LABELS[new Date(`${day.date}T00:00:00`).getDay()];
        return (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex items-end" style={{ height: TRACK_HEIGHT }}>
              <div className="relative flex h-full w-full items-end justify-center">
                {day.correct > 0 && (
                  <span className="absolute -top-4 font-display text-[11px] font-bold text-ink-soft">{day.correct}</span>
                )}
                <motion.div
                  className={`w-2.5 rounded-full sm:w-3.5 ${
                    isToday ? "bg-gradient-to-t from-world-math to-world-math-light" : "bg-gradient-to-t from-world-math/40 to-world-math-light/40"
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
                  style={{ minHeight: day.correct > 0 ? 6 : 3 }}
                />
              </div>
            </div>
            <span className={`font-body text-[11px] font-bold ${isToday ? "text-world-math" : "text-ink-soft"}`}>{weekday}</span>
          </div>
        );
      })}
    </div>
  );
}
