import { motion } from "framer-motion";

const SIZE = 72;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Small reusable countdown ring for the Modo Foco mini-games -- calm colors,
 * no harsh red-alert flashing (this mode deliberately avoids time pressure). */
export function RingTimer({ ratio, icon = "🧠" }: { ratio: number; icon?: string }) {
  const clamped = Math.min(1, Math.max(0, ratio));
  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="rgba(43,36,64,0.14)" strokeWidth={STROKE} />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-world-focus)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - clamped) }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl" aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
