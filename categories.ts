import type { CategoryKey, Language } from '../types';
export const CATEGORIES: CategoryKey[] = ['all','nature','gradients','ocean','animals','technology','cars','space','architecture','art','abstract'];
// Broad terms only, to avoid empty results. Commons content is mostly English-titled,
// so the English term is always included; Arabic term added when the UI language is Arabic.
const TERMS: Record<CategoryKey, { en: string; ar: string }> = {
  all: { en: 'landscape', ar: 'منظر' },
  nature: { en: 'nature landscape', ar: 'طبيعة' },
  gradients: { en: 'gradient sky sunset', ar: 'تدرج' },
  ocean: { en: 'ocean sea', ar: 'محيط' },
  animals: { en: 'animal wildlife', ar: 'حيوان' },
  technology: { en: 'technology computer', ar: 'تقنية' },
  cars: { en: 'car automobile', ar: 'سيارة' },
  space: { en: 'space galaxy nebula', ar: 'فضاء' },
  architecture: { en: 'architecture building', ar: 'عمارة' },
  art: { en: 'painting art', ar: 'فن' },
  abstract: { en: 'abstract pattern', ar: 'تجريد' },
};
export const categoryTerm = (c: CategoryKey, lang: Language) =>
  lang === 'ar' && c !== 'all' ? `${TERMS[c].en}` : TERMS[c].en;

/** Builds the CirrusSearch string. User query + category term; filetype restricts to bitmaps, fileh to tall-enough images. */
export function buildSearchString(query: string, category: CategoryKey, lang: Language): string {
  const q = query.trim();
  const base = q ? (category === 'all' ? q : `${q} ${categoryTerm(category, lang)}`) : categoryTerm(category, lang);
  return `${base} filetype:bitmap fileh:>1600`;
}
