jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-image', () => ({ Image: { clearDiskCache: jest.fn().mockResolvedValue(true), clearMemoryCache: jest.fn().mockResolvedValue(true) } }));
jest.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'file:///cache/', getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  readDirectoryAsync: jest.fn().mockResolvedValue(['1.jpg', '2.jpg']), deleteAsync: jest.fn().mockResolvedValue(undefined),
  makeDirectoryAsync: jest.fn(), createDownloadResumable: jest.fn(),
}));
jest.mock('expo-media-library', () => ({ requestPermissionsAsync: jest.fn(), createAssetAsync: jest.fn() }));
