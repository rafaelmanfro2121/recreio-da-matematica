import { useCallback, useEffect, useState } from "react";

const PREFIX = "recreio:";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode, quota) — silently ignore */
  }
}

export function useStoredState<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback));

  // If `key` changes on a later render (e.g. per-mini-game difficulty keyed
  // by game id, reused across games without remounting), re-sync `value`
  // from the new key's storage instead of carrying over the old key's state
  // -- otherwise the old value both leaks into the new game and overwrites
  // whatever was actually stored under the new key.
  const [syncedKey, setSyncedKey] = useState(key);
  if (key !== syncedKey) {
    setSyncedKey(key);
    setValue(readStorage(key, fallback));
  }

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === "function" ? (next as (prev: T) => T)(prev) : next));
  }, []);

  return [value, update];
}
