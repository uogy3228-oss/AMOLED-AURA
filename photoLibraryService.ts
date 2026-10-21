import * as MediaLibrary from 'expo-media-library';

export type SaveResult = 'saved' | 'permission-denied';
/** Requests write-only access (add-only on iOS) and saves a local file to the native library. */
export async function saveToPhotoLibrary(localUri: string): Promise<SaveResult> {
  const perm = await MediaLibrary.requestPermissionsAsync(true);
  if (!perm.granted) return 'permission-denied';
  const asset = await MediaLibrary.createAssetAsync(localUri);
  if (!asset?.id) throw new Error('Gallery save returned no asset');
  return 'saved';
}
