import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system/legacy';

export const DOWNLOAD_DIR = () => `${FileSystem.cacheDirectory}downloads/`;
const PREFIX = 'cache:';

export const cacheService = {
  async setJson(key: string, value: unknown) { try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {} },
  async getJson<T>(key: string): Promise<T | undefined> {
    try { const v = await AsyncStorage.getItem(key); return v ? (JSON.parse(v) as T) : undefined; } catch { return undefined; }
  },
  /** Clears API caches, expo-image caches and temp downloads. Never touches favorites/prefs/gallery. Throws on failure. */
  async clearAll(activeDownloadIds: string[] = []) {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX));
    if (keys.length) await AsyncStorage.multiRemove(keys);
    await Image.clearDiskCache();
    await Image.clearMemoryCache();
    const dir = DOWNLOAD_DIR();
    const info = await FileSystem.getInfoAsync(dir);
    if (info.exists) {
      for (const name of await FileSystem.readDirectoryAsync(dir)) {
        if (activeDownloadIds.some((id) => name.startsWith(id))) continue;
        await FileSystem.deleteAsync(dir + name, { idempotent: true });
      }
    }
  },
};
