import * as FileSystem from 'expo-file-system/legacy';
import { create } from 'zustand';
import type { DownloadJob, Wallpaper } from '../types';
import { DOWNLOAD_DIR } from './cacheService';
import { saveToPhotoLibrary } from './photoLibraryService';

interface DLState { jobs: Record<string, DownloadJob>; set: (id: string, j: Partial<DownloadJob>) => void; dismiss: (id: string) => void }
export const useDownloads = create<DLState>((set) => ({
  jobs: {},
  set: (id, j) => set((s) => ({ jobs: { ...s.jobs, [id]: { id, status: 'idle', progress: null, ...s.jobs[id], ...j } } })),
  dismiss: (id) => set((s) => { const jobs = { ...s.jobs }; delete jobs[id]; return { jobs }; }),
}));

const running = new Map<string, FileSystem.DownloadResumable>();
const extOf = (url: string) => (url.split('?')[0].match(/\.(jpe?g|png|webp)$/i)?.[1] ?? 'jpg').toLowerCase();

export const isUsableUrl = (u?: string) => !!u && /^https:\/\/upload\.wikimedia\.org\//.test(u);

export async function downloadWallpaper(w: Wallpaper) {
  const { set } = useDownloads.getState();
  if (running.has(w.id)) return; // prevent duplicate concurrent downloads
  if (!isUsableUrl(w.originalUrl)) { set(w.id, { status: 'error', error: 'invalid-url' }); return; }
  const dir = DOWNLOAD_DIR();
  const dest = `${dir}${w.id}.${extOf(w.originalUrl)}`;
  try {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    set(w.id, { status: 'downloading', progress: null, error: undefined });
    const dl = FileSystem.createDownloadResumable(w.originalUrl, dest, {}, (p) => {
      // Real byte progress; null (indeterminate) when the server reports no total.
      set(w.id, { progress: p.totalBytesExpectedToWrite > 0 ? p.totalBytesWritten / p.totalBytesExpectedToWrite : null });
    });
    running.set(w.id, dl);
    const res = await dl.downloadAsync();
    if (!res || res.status !== 200) throw new Error(`HTTP ${res?.status ?? 'cancelled'}`);
    const info = await FileSystem.getInfoAsync(res.uri);
    if (!info.exists || info.size === 0) throw new Error('invalid-file');
    set(w.id, { status: 'saving', progress: null });
    const result = await saveToPhotoLibrary(res.uri);
    set(w.id, result === 'saved' ? { status: 'success', progress: 1 } : { status: 'permission-denied' });
  } catch (e: any) {
    set(w.id, { status: 'error', error: String(e?.message ?? e) });
  } finally {
    running.delete(w.id);
    FileSystem.deleteAsync(dest, { idempotent: true }).catch(() => {});
  }
}
export async function cancelDownload(id: string) { await running.get(id)?.pauseAsync(); running.delete(id); useDownloads.getState().dismiss(id); }
export const activeDownloadIds = () => [...running.keys()];
