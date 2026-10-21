import type { CategoryKey, Language, SearchPage, Wallpaper } from '../types';
import { buildSearchString } from '../utils/categories';
import { cacheService } from './cacheService';

export const API = 'https://commons.wikimedia.org/w/api.php';
const HEADERS = { 'Api-User-Agent': 'GlassWalls/1.0 (wallpaper app; contact: set-your-email@example.com)' };
const TIMEOUT_MS = 15000;
const MIN_INTERVAL_MS = 250;
let lastRequest = 0;

const stripHtml = (s?: string) => (s ? s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim() : undefined);
const SUPPORTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Parses a `query.pages` object from the MediaWiki API into wallpapers. Pure — unit tested. */
export function parsePages(json: any, opts: { portraitOnly?: boolean } = { portraitOnly: true }): Wallpaper[] {
  const pages = json?.query?.pages ? Object.values<any>(json.query.pages) : [];
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const out: Wallpaper[] = [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !ii.url || !ii.thumburl || !SUPPORTED_MIME.has(ii.mime)) continue;
    if (ii.width < 800 || ii.height < 1200) continue;
    if (opts.portraitOnly && ii.height < ii.width * 1.1) continue;
    const m = ii.extmetadata ?? {};
    out.push({
      id: String(p.pageid),
      title: String(p.title ?? '').replace(/^File:/, '').replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' '),
      thumbUrl: ii.thumburl, thumbWidth: ii.thumbwidth, thumbHeight: ii.thumbheight,
      originalUrl: ii.url, width: ii.width, height: ii.height,
      description: stripHtml(m.ImageDescription?.value),
      creator: stripHtml(m.Artist?.value),
      license: stripHtml(m.LicenseShortName?.value),
      licenseUrl: m.LicenseUrl?.value,
      pageUrl: ii.descriptionurl,
    });
  }
  return out;
}

async function request(params: Record<string, string>, signal?: AbortSignal): Promise<any> {
  const wait = lastRequest + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequest = Date.now();
  const qs = new URLSearchParams({ format: 'json', formatversion: '1', ...params }).toString();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    const res = await fetch(`${API}?${qs}`, { headers: HEADERS, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error.info ?? 'API error');
    return json;
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', onAbort); }
}

const IMAGEINFO = {
  prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '600',
  iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl|ImageDescription',
};

export async function searchWallpapers(
  query: string, category: CategoryKey, language: Language,
  continuation?: Record<string, string>, signal?: AbortSignal,
): Promise<SearchPage> {
  const key = `cache:search:${language}:${category}:${query.trim().toLowerCase()}:${JSON.stringify(continuation ?? {})}`;
  try {
    const json = await request({
      action: 'query', generator: 'search', gsrnamespace: '6', gsrlimit: '30',
      gsrsearch: buildSearchString(query, category, language), ...IMAGEINFO, ...(continuation ?? {}),
    }, signal);
    const page: SearchPage = { items: parsePages(json), next: json.continue };
    await cacheService.setJson(key, page);
    return page;
  } catch (e) {
    if ((e as any)?.name === 'AbortError' && signal?.aborted) throw e;
    const cached = await cacheService.getJson<SearchPage>(key);
    if (cached) return cached; // offline fallback
    throw e;
  }
}

/** Merges pages, dropping duplicates by id. */
export function mergeUnique(existing: Wallpaper[], incoming: Wallpaper[]): Wallpaper[] {
  const seen = new Set(existing.map((w) => w.id));
  return [...existing, ...incoming.filter((w) => !seen.has(w.id) && seen.add(w.id))];
}

export async function getWallpaperDetails(fileId: string, signal?: AbortSignal): Promise<Wallpaper | undefined> {
  const json = await request({ action: 'query', pageids: fileId, ...IMAGEINFO, iiurlwidth: '1080' }, signal);
  return parsePages(json, { portraitOnly: false })[0];
}
export const getOriginalImage = async (id: string) => (await getWallpaperDetails(id))?.originalUrl;
export const getImageAttribution = async (id: string) => {
  const w = await getWallpaperDetails(id);
  return w && { creator: w.creator, license: w.license, licenseUrl: w.licenseUrl, pageUrl: w.pageUrl };
};
