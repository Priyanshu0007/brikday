/**
 * In-memory mock for react-native-mmkv.
 *
 * Replaces the native MMKV storage with a plain Map<string, string>
 * so that actions.ts can be tested without a React Native runtime.
 */

/** The backing in-memory store — accessible from tests for seeding and assertions. */
export const mockStorage = new Map<string, string>();

/** Mock MMKV instance that mirrors the subset of the MMKV API used by the app. */
export const mmkvInstance = {
  getString(key: string): string | undefined {
    return mockStorage.get(key);
  },
  set(key: string, value: string): void {
    mockStorage.set(key, value);
  },
  delete(key: string): void {
    mockStorage.delete(key);
  },
  getAllKeys(): string[] {
    return Array.from(mockStorage.keys());
  },
  clearAll(): void {
    mockStorage.clear();
  },
};

/** Factory that matches the `createMMKV` export signature. */
export const createMMKV = (_opts?: { id?: string }) => mmkvInstance;
