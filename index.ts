import ar from './ar';
import en from './en';
import type { Language } from '../types';
export type TKey = keyof typeof en;
export const dictionaries = { ar, en } as const;
export const translate = (lang: Language, key: TKey) => dictionaries[lang][key] ?? en[key];
export const isRTL = (lang: Language) => lang === 'ar';
export const dateLocale = (lang: Language) => (lang === 'ar' ? 'ar' : 'en-US');
