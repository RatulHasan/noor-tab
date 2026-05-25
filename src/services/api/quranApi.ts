import { getCached, setCached, TTL } from "./apiCache";

const BASE_URL = "https://api.alquran.cloud/v1";

export interface Surah {
  number: number;
  name: string;           // Arabic
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface AyahContent {
  number: number;
  arabic: string;
  translation: string;
  surahNumber: number;
  surahName: string;
  juzNumber: number;
}

export interface SurahContent {
  number: number;
  name: string;
  englishName: string;
  ayahs: {
    number: number;
    text: string;           // Arabic
    translation: string;    // English
  }[];
}

export interface SearchResult {
  surah: Surah;
  ayah: {
    number: number;
    text: string;
    numberInSurah: number;
  };
}

export async function getSurahList(): Promise<Surah[]> {
  const cacheKey = "quran_surah_list";
  const cached = await getCached<Surah[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/surah`);
    const result = await response.json();
    if (result.code === 200) {
      await setCached(cacheKey, result.data, TTL.SURAH_LIST);
      return result.data;
    }
    throw new Error("Failed to fetch surah list");
  } catch (error) {
    console.error("getSurahList error:", error);
    return [];
  }
}

export async function getSurah(number: number): Promise<SurahContent | null> {
  const cacheKey = `quran_surah_${number}`;
  const cached = await getCached<SurahContent>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/surah/${number}/editions/quran-uthmani,en.sahih`);
    const result = await response.json();
    if (result.code === 200) {
      const arabicEd = result.data.find((d: any) => d.edition.identifier === "quran-uthmani");
      const englishEd = result.data.find((d: any) => d.edition.identifier === "en.sahih");

      const data: SurahContent = {
        number: arabicEd.number,
        name: arabicEd.name,
        englishName: arabicEd.englishName,
        ayahs: arabicEd.ayahs.map((ayah: any, index: number) => ({
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: englishEd.ayahs[index].text,
        })),
      };

      await setCached(cacheKey, data, TTL.SURAH_CONTENT);
      return data;
    }
    return null;
  } catch (error) {
    console.error("getSurah error:", error);
    return null;
  }
}

export async function getAyah(surah: number, ayah: number): Promise<AyahContent | null> {
  const cacheKey = `quran_ayah_${surah}_${ayah}`;
  const cached = await getCached<AyahContent>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih`);
    const result = await response.json();
    if (result.code === 200) {
      const arabicEd = result.data.find((d: any) => d.edition.identifier === "quran-uthmani");
      const englishEd = result.data.find((d: any) => d.edition.identifier === "en.sahih");

      const data: AyahContent = {
        number: arabicEd.numberInSurah,
        arabic: arabicEd.text,
        translation: englishEd.text,
        surahNumber: arabicEd.surah.number,
        surahName: arabicEd.surah.englishName,
        juzNumber: arabicEd.juz,
      };

      await setCached(cacheKey, data, TTL.AYAH_DAILY);
      return data;
    }
    return null;
  } catch (error) {
    console.error("getAyah error:", error);
    return null;
  }
}

export async function searchQuran(query: string): Promise<SearchResult[]> {
  const cacheKey = `quran_search_${query}`;
  const cached = await getCached<SearchResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/search/${query}/all/en.sahih`);
    const result = await response.json();
    if (result.code === 200) {
      const data = result.data.matches.map((match: any) => ({
        surah: match.surah,
        ayah: {
          number: match.number,
          text: match.text,
          numberInSurah: match.numberInSurah,
        },
      }));
      await setCached(cacheKey, data, TTL.SEARCH_RESULTS);
      return data;
    }
    return [];
  } catch (error) {
    console.error("searchQuran error:", error);
    return [];
  }
}
