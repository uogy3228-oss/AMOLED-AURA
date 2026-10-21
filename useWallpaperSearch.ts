import { useCallback, useEffect, useRef, useState } from 'react';
import type { CategoryKey, Wallpaper } from '../types';
import { mergeUnique, searchWallpapers } from '../services/wikimediaApi';
import { usePreferences } from '../store/preferencesStore';

const MIN_ITEMS = 12, MAX_PAGES = 4;
export function useWallpaperSearch(initialCategory: CategoryKey = 'all') {
  const language = usePreferences((s) => s.language);
  const [query, setQuery] = useState(''); const [submitted, setSubmitted] = useState('');
  const [category, setCategory] = useState<CategoryKey>(initialCategory);
  const [items, setItems] = useState<Wallpaper[]>([]); const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); const [error, setError] = useState(false);
  const itemsRef = useRef<Wallpaper[]>([]); const next = useRef<Record<string, string> | undefined>(undefined);
  const ctrl = useRef<AbortController | null>(null); const seq = useRef(0);

  const run = useCallback(async (reset: boolean) => {
    ctrl.current?.abort(); const c = new AbortController(); ctrl.current = c; const mine = ++seq.current;
    if (reset) { setLoading(true); setLoadingMore(false); itemsRef.current = []; next.current = undefined; setItems([]); } else setLoadingMore(true);
    setError(false);
    try {
      let acc = itemsRef.current; const target = reset ? MIN_ITEMS : acc.length + 8; let cont = next.current; let pages = 0;
      do {
        const page = await searchWallpapers(submitted, category, language, cont, c.signal);
        if (mine !== seq.current) return; // obsolete search
        acc = mergeUnique(acc, page.items); cont = page.next; pages++;
      } while (cont && acc.length < target && pages < MAX_PAGES);
      itemsRef.current = acc; next.current = cont; setItems(acc);
    } catch (e: any) { if (mine === seq.current && e?.name !== 'AbortError') setError(true); }
    finally { if (mine === seq.current) { setLoading(false); setLoadingMore(false); } }
  }, [submitted, category, language]);

  useEffect(() => { void run(true); return () => ctrl.current?.abort(); }, [run]);
  useEffect(() => { const id = setTimeout(() => setSubmitted(query.trim()), 500); return () => clearTimeout(id); }, [query]);

  const loadMore = useCallback(() => { if (!loading && !loadingMore && next.current) void run(false); }, [loading, loadingMore, run]);
  return { query, setQuery, submit: () => setSubmitted(query.trim()), category, setCategory, items, loading, loadingMore, error, retry: () => run(true), loadMore };
}
