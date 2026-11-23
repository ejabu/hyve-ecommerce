const KEY = "corner-shop:client-id";
let memoryId: string | null = null;

// Anonymous per-browser id used to scope orders until real auth exists.
export function getClientId(): string {
  try {
    const existing = localStorage.getItem(KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
    return id;
  } catch {
    memoryId ??= crypto.randomUUID();
    return memoryId;
  }
}
