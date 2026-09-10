import { motion, AnimatePresence } from "framer-motion";

export type MascotMood = "happy" | "thinking" | "cheer" | "oops";
export type MascotName = "a" | "b";

function MascotSvg({ name, mood }: { name: MascotName; mood: MascotMood }) {
  if (name === "a") {
    return (
      <svg viewBox="0 0 64 64" width="100%" height="100%">
        <circle cx="32" cy="37" r="21" fill="#1f6f5c" />
        <circle cx="20" cy="15" r="5" fill="#1f6f5c" />
        <circle cx="44" cy="15" r="5" fill="#1f6f5c" />
        <circle cx="24" cy="34" r="4" fill="#fff" />
        <circle cx="40" cy="34" r="4" fill="#fff" />
        <circle cx="24" cy={mood === "cheer" ? 33 : 34} r="1.8" fill="#20212b" />
        <circle cx="40" cy={mood === "cheer" ? 33 : 34} r="1.8" fill="#20212b" />
        {mood === "oops" ? (
          <path d="M23 47q9-6 18 0" stroke="#fff" strokeWidth={3} strokeLinecap="round" fill="none" />
        ) : (
          <path d="M23 45q9 8 18 0" stroke="#fff" strokeWidth={3} strokeLinecap="round" fill="none" />
        )}
        <circle cx="15" cy="42" r="3" fill="#ef5b4e" opacity={0.3} />
        <circle cx="49" cy="42" r="3" fill="#ef5b4e" opacity={0.3} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="32" cy="37" r="21" fill="#ffb627" />
      <circle cx="32" cy="13" r="5" fill="#ffb627" />
      <circle cx="24" cy="34" r="4" fill="#fff" />
      <circle cx="40" cy="34" r="4" fill="#fff" />
      <circle cx="25" cy="35" r="1.8" fill="#20212b" />
      <circle cx="41" cy="35" r="1.8" fill="#20212b" />
      {mood === "oops" ? (
        <>
          <path d="M20 30q4 4 8 1" stroke="#20212b" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <path d="M36 30q4 4 8 1" stroke="#20212b" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M19 28q5-5 9-1" stroke="#20212b" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <path d="M36 27q5-5 9-1" stroke="#20212b" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </>
      )}
      <circle cx="32" cy="46" r="3.4" fill="#20212b" />
    </svg>
  );
}

const MOOD_ANIMATION: Record<MascotMood, { rotate: number[]; y: number[] }> = {
  happy: { rotate: [0, -3, 3, 0], y: [0, -4, 0] },
  thinking: { rotate: [0, -2, 0], y: [0, -2, 0] },
  cheer: { rotate: [0, -8, 8, -8, 0], y: [0, -10, 0, -10, 0] },
  oops: { rotate: [0, 0], y: [0, 2, 0] },
};

export function Mascot({
  name,
  mood = "happy",
  speech,
  size = 84,
  className = "",
}: {
  name: MascotName;
  mood?: MascotMood;
  speech?: string;
  size?: number;
  className?: string;
}) {
  const anim = MOOD_ANIMATION[mood];
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <motion.div
        style={{ width: size, height: size }}
        className="shrink-0 drop-shadow-[0_6px_0_rgba(43,36,64,0.15)]"
        animate={anim}
        transition={{ duration: mood === "cheer" ? 0.6 : 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <MascotSvg name={name} mood={mood} />
      </motion.div>
      <AnimatePresence mode="wait">
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="relative max-w-xs rounded-[22px] border-[3px] border-ink bg-card px-4 py-3 font-body text-[15px] font-semibold leading-snug text-ink shadow-pop"
          >
            {speech}
            <span className="absolute -left-2 bottom-3 h-4 w-4 rotate-45 border-b-[3px] border-l-[3px] border-ink bg-card" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
