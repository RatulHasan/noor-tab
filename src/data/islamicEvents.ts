import type { IslamicEvent } from "../types";

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    name: "Islamic New Year",
    hijriDate: { month: 1, day: 1 },
    description: "1st of Muharram, marking the beginning of the Hijri calendar year.",
  },
  {
    name: "Day of Ashura",
    hijriDate: { month: 1, day: 10 },
    description: "10th of Muharram. A day of fasting and remembrance of Allah's saving of Prophet Musa (AS).",
  },
  {
    name: "Mawlid an-Nabi",
    hijriDate: { month: 3, day: 12 },
    description: "12th of Rabi' al-Awwal, commemorating the birth of the Prophet Muhammad (SAW).",
  },
  {
    name: "Isra' and Mi'raj",
    hijriDate: { month: 7, day: 27 },
    description: "27th of Rajab, commemorating the night journey and ascension of the Prophet Muhammad (SAW).",
  },
  {
    name: "First Day of Ramadan",
    hijriDate: { month: 9, day: 1 },
    description: "1st of Ramadan, the holy month of fasting, prayer, and reflection.",
  },
  {
    name: "Laylat al-Qadr",
    hijriDate: { month: 9, day: 27 },
    description: "27th of Ramadan (traditionally observed). The Night of Power, better than a thousand months.",
  },
  {
    name: "Eid al-Fitr",
    hijriDate: { month: 10, day: 1 },
    description: "1st of Shawwal. The festival of breaking the fast, celebrating the end of Ramadan.",
  },
  {
    name: "Eid al-Adha",
    hijriDate: { month: 12, day: 10 },
    description: "10th of Dhu al-Hijjah. The festival of sacrifice, marking the completion of the Hajj pilgrimage.",
  },
];
