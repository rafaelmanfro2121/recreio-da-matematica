import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#2e6ff2", "#ef5b4e", "#ffb627", "#2fae66", "#8b5cf6", "#e8478b"];

type Piece = {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  size: number;
};

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 1.2,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size * 0.6, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
