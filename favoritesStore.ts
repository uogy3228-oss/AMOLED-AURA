import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Wallpaper } from '../types';

const without = (items: Record<string, Wallpaper>, id: string) => {
  const copy = { ...items }; delete copy[id]; return copy;
};
interface FavState {
  items: Record<string, Wallpaper>; order: string[];
  toggle: (w: Wallpaper) => void; remove: (id: string) => void;
}
export const useFavorites = create<FavState>()(persist(
  (set) => ({
    items: {}, order: [],
    remove: (id) => set((s) => ({ items: without(s.items, id), order: s.order.filter((x) => x !== id) })),
    toggle: (w) => set((s) => s.items[w.id]
      ? { items: without(s.items, w.id), order: s.order.filter((x) => x !== w.id) }
      : { items: { ...s.items, [w.id]: w }, order: [w.id, ...s.order.filter((x) => x !== w.id)] }),
  }),
  { name: 'favorites', storage: createJSONStorage(() => AsyncStorage) },
));
