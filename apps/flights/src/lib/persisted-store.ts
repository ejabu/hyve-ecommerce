import type { ZodType } from "zod";

function read<T>(key: string, schema: ZodType<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: state stays in memory only
  }
}

export interface PersistedStore<T> {
  get: () => T;
  set: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
}

/** localStorage-backed store compatible with useSyncExternalStore. Stable snapshot between writes. */
export function createPersistedStore<T>(key: string, schema: ZodType<T>, initial: T): PersistedStore<T> {
  let cache = read(key, schema, initial);
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  window.addEventListener("storage", (e) => {
    if (e.key !== key) return;
    cache = read(key, schema, initial);
    emit();
  });

  return {
    get: () => cache,
    set: (next) => {
      cache = next;
      write(key, next);
      emit();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
