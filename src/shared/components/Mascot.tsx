import { motion, AnimatePresence } from "framer-motion";

export type MascotMood = "happy" | "thinking" | "cheer" | "oops";
export type MascotName = "a" | "b";

/**
 * Two companions, told apart purely by color (cool blue/cyan vs warm amber/pink) --
 * no cartoon face. Mood reads through motion (breathing speed, a ping ring on
 * cheer, a brief dim on oops) and color intensity instead of drawn expressions.
 */
const NAME_HUES: Record<MascotName, { from: string; to: string }> = {
  a: { from: "#2563eb", to: "#06b6d4" },
  b: { from: "#f59e0b", to: "#ec4899" },
};

const MOOD_MOTION: Record<MascotMood, { scale: number[]; duration: number; rotate?: number[] }> = {
  happy: { scale: [1, 1.05, 1], duration: 2.6 },
  thinking: { scale: [1, 1.02, 1], duration: 3.4, rotate: [0, 5, -5, 0] },
  cheer: { scale: [1, 1.12, 0.97, 1.06, 1], duration: 0.9 },
  oops: { scale: [1, 0.93, 1], duration: 1.3 },
};

function Orb({ name, mood, size }: { name: MascotName; mood: MascotMood; size: number }) {
  const hue = NAME_HUES[name];
  const motionSpec = MOOD_MOTION[mood];

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${hue.from}66, transparent 72%)`, filter: "blur(9px)" }}
        animate={{
          scale: mood === "cheer" ? [1, 1.4, 1] : [1, 1.12, 1],
          opacity: mood === "oops" ? [0.3, 0.16, 0.3] : [0.35, 0.55, 0.35],
        }}
        transition={{ duration: motionSpec.duration * 1.3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      {mood === "cheer" && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: hue.to }}
          initial={{ scale: 0.75, opacity: 0.7 }}
          animate={{ scale: [0.75, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />
      )}
      <motion.div
        className="absolute inset-[9%] rounded-full"
        style={{ background: `linear-gradient(135deg, ${hue.from}, ${hue.to})`, boxShadow: `0 6px 16px -4px ${hue.from}88` }}
        animate={{ scale: motionSpec.scale, rotate: motionSpec.rotate ?? 0 }}
        transition={{ duration: motionSpec.duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute left-[16%] top-[13%] h-[32%] w-[32%] rounded-full bg-white/55 blur-[1.5px]" />
      </motion.div>
    </div>
  );
}

export function Mascot({
  name,
  mood = "happy",
  speech,
  size = 76,
  className = "",
}: {
  name: MascotName;
  mood?: MascotMood;
  speech?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <Orb name={name} mood={mood} size={size} />
      <AnimatePresence mode="wait">
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="relative max-w-xs rounded-[16px] border border-line bg-card px-4 py-3 font-body text-[15px] font-semibold leading-snug text-ink shadow-soft"
          >
            {speech}
            <span className="absolute -left-2 bottom-3 h-4 w-4 rotate-45 border-b border-l border-line bg-card" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
