import type { Wallpaper } from '../types';
// In-memory lookup so the details screen can open instantly with the tapped item.
const map = new Map<string, Wallpaper>();
export const rememberWallpaper = (w: Wallpaper) => { map.set(w.id, w); };
export const recallWallpaper = (id: string) => map.get(id);
