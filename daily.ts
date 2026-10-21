export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export function hashString(s: string): number {
  let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h;
}
export function pickDaily<T>(items: T[], d: Date): T | undefined {
  return items.length ? items[hashString(dateKey(d)) % items.length] : undefined;
}
