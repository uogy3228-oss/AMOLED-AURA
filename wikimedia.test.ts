import { parsePages, mergeUnique, searchWallpapers } from '../src/services/wikimediaApi';
import { buildSearchString, CATEGORIES } from '../src/utils/categories';
import { apiResponse } from './fixtures';

describe('query construction', () => {
  it('uses category term when query is empty', () => expect(buildSearchString('', 'ocean', 'en')).toContain('ocean sea'));
  it('combines query and category', () => expect(buildSearchString('wave', 'ocean', 'ar')).toMatch(/^wave ocean sea/));
  it('does not append category for all', () => expect(buildSearchString('cat', 'all', 'en')).toMatch(/^cat filetype:bitmap/));
  it('maps every category to a non-empty term', () => CATEGORIES.forEach((c) => expect(buildSearchString('', c, 'en').length).toBeGreaterThan(20)));
});
describe('parsing', () => {
  const items = parsePages(apiResponse);
  it('keeps portrait, large, supported-mime results only', () => expect(items.map((i) => i.id)).toEqual(['1', '5']));
  it('extracts attribution without HTML', () => { expect(items[0].creator).toBe('Jane'); expect(items[0].license).toBe('CC BY-SA 4.0'); expect(items[0].title).toBe('Pic 1'); });
  it('merges without duplicates', () => expect(mergeUnique(items, items)).toHaveLength(2));
});
describe('search + retry + pagination', () => {
  afterEach(() => jest.restoreAllMocks());
  it('returns continuation token', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => apiResponse }) as any;
    const p = await searchWallpapers('x', 'all', 'en');
    expect(p.next).toEqual(apiResponse.continue);
  });
  it('passes continuation params on next call', async () => {
    const f = jest.fn().mockResolvedValue({ ok: true, json: async () => apiResponse }); global.fetch = f as any;
    await searchWallpapers('y', 'all', 'en', { gsroffset: '30', continue: '-||' });
    expect(String(f.mock.calls[0][0])).toContain('gsroffset=30');
  });
  it('rejects on network failure with no cache', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as any;
    await expect(searchWallpapers('zzz-uncached', 'all', 'en')).rejects.toThrow('offline');
  });
});
