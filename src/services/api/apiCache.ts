interface CacheEntry<T> {
  data: T;
  cachedAt: number;    // timestamp
  ttl: number;         // milliseconds
}

export const TTL = {
  AYAH_DAILY: 24 * 60 * 60 * 1000,      // 24 hours (daily rotation)
  HADITH_DAILY: 24 * 60 * 60 * 1000,    // 24 hours
  SURAH_LIST: 30 * 24 * 60 * 60 * 1000, // 30 days (static data)
  SURAH_CONTENT: 7 * 24 * 60 * 60 * 1000, // 7 days
  SEARCH_RESULTS: 60 * 60 * 1000,        // 1 hour
};

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const result = await chrome.storage.local.get(key);
    const entry = result[key] as CacheEntry<T>;

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.cachedAt > entry.ttl) {
      await invalidateCache(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
}

export async function setCached<T>(key: string, data: T, ttl: number): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      data,
      cachedAt: Date.now(),
      ttl,
    };
    await chrome.storage.local.set({ [key]: entry });
  } catch (error) {
    console.error("Cache write error:", error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await chrome.storage.local.remove(key);
  } catch (error) {
    console.error("Cache invalidate error:", error);
  }
}
