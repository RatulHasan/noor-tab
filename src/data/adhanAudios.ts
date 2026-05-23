export interface AdhanAudioOption {
  key: string;
  name: string;
  reciter: string;
  url: string;
}

export const ADHAN_AUDIO_OPTIONS: AdhanAudioOption[] = [
  {
    key: "none",
    name: "Silent / None",
    reciter: "No Sound",
    url: "",
  },
  {
    key: "azan1",
    name: "Masjid al-Haram (Makkah)",
    reciter: "Sheikh Ali Ahmad Mulla",
    url: "https://www.islamcan.com/audio/adhan/azan1.mp3",
  },
  {
    key: "azan2",
    name: "Masjid an-Nabawi (Madinah)",
    reciter: "Traditional Medina Adhan",
    url: "https://www.islamcan.com/audio/adhan/azan2.mp3",
  },
  {
    key: "azan3",
    name: "Al-Aqsa Mosque (Jerusalem)",
    reciter: "Beautiful Al-Aqsa",
    url: "https://www.islamcan.com/audio/adhan/azan3.mp3",
  },
  {
    key: "azan4",
    name: "Egyptian Adhan",
    reciter: "Traditional Cairo Style",
    url: "https://www.islamcan.com/audio/adhan/azan4.mp3",
  },
  {
    key: "azan5",
    name: "Turkish Adhan",
    reciter: "Saba Melodic Style",
    url: "https://www.islamcan.com/audio/adhan/azan5.mp3",
  },
  {
    key: "azan8",
    name: "Sheikh Mishary Al-Afasy",
    reciter: "Famous Kuwaiti Reciter",
    url: "https://www.islamcan.com/audio/adhan/azan8.mp3",
  },
  {
    key: "azan7",
    name: "Sheikh Abdul Basit",
    reciter: "Legendary Egyptian Reciter",
    url: "https://www.islamcan.com/audio/adhan/azan7.mp3",
  },
  {
    key: "azan6",
    name: "Yusuf Islam",
    reciter: "Soft & Gentle Adhan",
    url: "https://www.islamcan.com/audio/adhan/azan6.mp3",
  },
];
