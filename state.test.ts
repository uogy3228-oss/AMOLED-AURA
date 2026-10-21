import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../src/store/favoritesStore';
import { usePreferences } from '../src/store/preferencesStore';
import { parsePages } from '../src/services/wikimediaApi';
import { translate, isRTL } from '../src/localization';
import { pickDaily } from '../src/utils/daily';
import { cacheService } from '../src/services/cacheService';
import { isUsableUrl, downloadWallpaper, useDownloads } from '../src/services/downloadService';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import * as FS from 'expo-file-system/legacy';
import { apiResponse } from './fixtures';

const w = parsePages(apiResponse)[0];
beforeEach(() => { useFavorites.setState({ items: {}, order: [] }); jest.clearAllMocks(); });

describe('favorites', () => {
  it('adds, dedupes and removes', () => {
    useFavorites.getState().toggle(w); expect(useFavorites.getState().order).toEqual([w.id]);
    useFavorites.getState().toggle(w); expect(useFavorites.getState().order).toEqual([]);
  });
  it('persists to storage', async () => {
    useFavorites.getState().toggle(w); await new Promise((r) => setTimeout(r, 0));
    expect(await AsyncStorage.getItem('favorites')).toContain(w.id);
  });
});
describe('language', () => {
  it('defaults to Arabic with RTL', () => { expect(usePreferences.getState().language).toBe('ar'); expect(isRTL('ar')).toBe(true); });
  it('switches and translates', () => { usePreferences.getState().setLanguage('en'); expect(isRTL('en')).toBe(false); expect(translate('en', 'explore')).toBe('Explore'); expect(translate('ar', 'explore')).toBe('استكشاف'); });
});
describe('daily pick', () => {
  it('is deterministic per date', () => { const a = [1, 2, 3, 4, 5, 6, 7]; const d = new Date(2026, 0, 5); expect(pickDaily(a, d)).toBe(pickDaily(a, new Date(2026, 0, 5, 20))); });
});
describe('cache clearing', () => {
  it('clears cache keys and image caches but keeps favorites', async () => {
    await AsyncStorage.setItem('cache:x', '1'); await AsyncStorage.setItem('favorites', '{}');
    await cacheService.clearAll(['2']);
    expect(await AsyncStorage.getItem('cache:x')).toBeNull(); expect(await AsyncStorage.getItem('favorites')).not.toBeNull();
    expect(Image.clearDiskCache).toHaveBeenCalled(); expect(FS.deleteAsync).toHaveBeenCalledTimes(1); // '2.jpg' skipped as active
  });
});
describe('download state', () => {
  it('validates urls', () => { expect(isUsableUrl('https://upload.wikimedia.org/a.jpg')).toBe(true); expect(isUsableUrl('http://evil.com/a.jpg')).toBe(false); });
  it('goes to permission-denied when gallery permission refused', async () => {
    (FS.createDownloadResumable as jest.Mock).mockReturnValue({ downloadAsync: async () => ({ status: 200, uri: 'file:///cache/downloads/1.jpg' }) });
    (FS.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true, size: 10 });
    (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });
    await downloadWallpaper(w);
    expect(useDownloads.getState().jobs[w.id].status).toBe('permission-denied');
  });
  it('succeeds only after the asset is created', async () => {
    (FS.createDownloadResumable as jest.Mock).mockReturnValue({ downloadAsync: async () => ({ status: 200, uri: 'file:///x.jpg' }) });
    (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
    (MediaLibrary.createAssetAsync as jest.Mock).mockResolvedValue({ id: 'a1' });
    await downloadWallpaper(w); expect(useDownloads.getState().jobs[w.id].status).toBe('success');
  });
  it('reports error on HTTP failure', async () => {
    (FS.createDownloadResumable as jest.Mock).mockReturnValue({ downloadAsync: async () => ({ status: 503, uri: '' }) });
    await downloadWallpaper(w); expect(useDownloads.getState().jobs[w.id].status).toBe('error');
  });
});
