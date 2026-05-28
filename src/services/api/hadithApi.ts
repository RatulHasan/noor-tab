import { getCached, setCached, TTL } from "./apiCache";

const BASE_URL = "https://api.hadith.gading.dev/books";

export interface HadithBook {
  name: string;
  id: string;
  available: number;
}

export interface Hadith {
  number: number;
  arab: string;
  id: string; // This is Indonesian translation in gading.dev API
  contents?: {
    number: number;
    arab: string;
    id: string;
  };
}

export interface HadithResult {
  name: string;
  id: string;
  available: number;
  hadiths: Hadith[];
}

export async function getHadithBooks(): Promise<HadithBook[]> {
  const cacheKey = "hadith_books";
  const cached = await getCached<HadithBook[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(BASE_URL);
    const result = await response.json();
    if (result.code === 200) {
      await setCached(cacheKey, result.data, TTL.SURAH_LIST); // using same TTL as surah list
      return result.data;
    }
    return [];
  } catch (error) {
    console.error("getHadithBooks error:", error);
    return [];
  }
}

export async function getHadiths(bookId: string, range: string = "1-10"): Promise<HadithResult | null> {
  const cacheKey = `hadith_${bookId}_${range}`;
  const cached = await getCached<HadithResult>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/${bookId}?range=${range}`);
    const result = await response.json();
    if (result.code === 200) {
      await setCached(cacheKey, result.data, TTL.SURAH_CONTENT);
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("getHadiths error:", error);
    return null;
  }
}

export async function getHadith(bookId: string, number: number): Promise<Hadith | null> {
  const cacheKey = `hadith_${bookId}_${number}`;
  const cached = await getCached<Hadith>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/${bookId}/${number}`);
    const result = await response.json();
    if (result.code === 200) {
      await setCached(cacheKey, result.data.contents, TTL.SURAH_CONTENT);
      return result.data.contents;
    }
    return null;
  } catch (error) {
    console.error("getHadith error:", error);
    return null;
  }
}
