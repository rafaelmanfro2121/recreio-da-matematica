import { readStorage, writeStorage } from "./storage";

export interface ActivityDay {
  date: string;
  correct: number;
  total: number;
}

const KEY = "activity:log";
const MAX_DAYS = 30;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Call once per completed round/practice session, from any module. */
export function logActivity(correct: number, total: number): void {
  if (total <= 0) return;
  const log = readStorage<ActivityDay[]>(KEY, []);
  const today = todayKey();
  const idx = log.findIndex((d) => d.date === today);
  const next =
    idx >= 0
      ? log.map((d, i) => (i === idx ? { date: today, correct: d.correct + correct, total: d.total + total } : d))
      : [...log, { date: today, correct, total }];
  writeStorage(KEY, next.slice(-MAX_DAYS));
}

/** Last n calendar days (oldest first), zero-filled where nothing was logged. */
export function getLastNDays(n: number): ActivityDay[] {
  const log = readStorage<ActivityDay[]>(KEY, []);
  const byDate = new Map(log.map((d) => [d.date, d]));
  const days: ActivityDay[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push(byDate.get(key) ?? { date: key, correct: 0, total: 0 });
  }
  return days;
}

/** Consecutive days up to and including today with at least one logged round. */
export function computeStreak(): number {
  const log = readStorage<ActivityDay[]>(KEY, []);
  const byDate = new Map(log.map((d) => [d.date, d]));
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = byDate.get(key);
    if (entry && entry.total > 0) streak++;
    else break;
  }
  return streak;
}
