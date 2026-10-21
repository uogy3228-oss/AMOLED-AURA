import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '../types';
import { translate, TKey } from '../localization';

interface PrefsState { language: Language; setLanguage: (l: Language) => void }
export const usePreferences = create<PrefsState>()(persist(
  (set) => ({ language: 'ar', setLanguage: (language) => set({ language }) }),
  { name: 'prefs', storage: createJSONStorage(() => AsyncStorage) },
));
export const useT = () => { const lang = usePreferences((s) => s.language); return (k: TKey) => translate(lang, k); };
