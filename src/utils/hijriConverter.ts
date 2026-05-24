export interface HijriDateParts {
  day: number;
  month: number; // 1-indexed (1-12)
  monthName: string;
  monthArabicName: string;
  year: number;
}

const HIJRI_MONTHS = [
  { en: "Muharram", ar: "المحرم" },
  { en: "Safar", ar: "صفر" },
  { en: "Rabi' al-Awwal", ar: "ربيع الأول" },
  { en: "Rabi' al-Thani", ar: "ربيع الآخر" },
  { en: "Jumada al-Awwal", ar: "جمادى الأولى" },
  { en: "Jumada al-Thani", ar: "جمادى الآخرة" },
  { en: "Rajab", ar: "رجب" },
  { en: "Sha'ban", ar: "شعبان" },
  { en: "Ramadan", ar: "رمضان" },
  { en: "Shawwal", ar: "شوال" },
  { en: "Dhu al-Qadah", ar: "ذو القعدة" },
  { en: "Dhu al-Hijjah", ar: "ذو الحجة" },
];

export function getHijriDateParts(date: Date = new Date()): HijriDateParts {
  // Use Intl.DateTimeFormat with islamic-umalqura calendar
  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  
  const parts = formatter.formatToParts(date);
  
  let day = 1;
  let month = 1;
  let year = 1445;
  
  for (const part of parts) {
    if (part.type === "day") {
      day = parseInt(part.value, 10);
    } else if (part.type === "month") {
      month = parseInt(part.value, 10);
    } else if (part.type === "year") {
      year = parseInt(part.value, 10);
    }
  }
  
  // Safeguard bounds
  const monthIdx = Math.max(1, Math.min(12, month)) - 1;
  const monthInfo = HIJRI_MONTHS[monthIdx];
  
  return {
    day,
    month,
    monthName: monthInfo.en,
    monthArabicName: monthInfo.ar,
    year,
  };
}

export function getHijriDateString(date: Date = new Date()): string {
  const parts = getHijriDateParts(date);
  return `${parts.day} ${parts.monthName} ${parts.year} AH`;
}

export function getHijriArabicDateString(date: Date = new Date()): string {
  const parts = getHijriDateParts(date);
  // Arabic formatting: e.g. ٢٧ رمضان ١٤٤٥ هـ
  // Convert numbers to Arabic digits
  const arabicDigits = (n: number) =>
    n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d, 10)]);
    
  return `${arabicDigits(parts.day)} ${parts.monthArabicName} ${arabicDigits(parts.year)} هـ`;
}

export function gregorianToHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
  const parts = getHijriDateParts(date);
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    monthName: parts.monthName,
  };
}

export function hijriToGregorian(year: number, month: number, day: number): Date {
  // Approximate Gregorian year
  const approxGregYear = Math.floor(622 + (year * 354.367) / 365.2422);
  let guess = new Date(approxGregYear, month - 1, day);

  for (let i = 0; i < 15; i++) {
    const parts = getHijriDateParts(guess);

    const yearDiff = year - parts.year;
    const monthDiff = month - parts.month;
    const dayDiff = day - parts.day;

    // A Hijri year is ~354.36 days, month is ~29.5 days
    const totalDiffDays = Math.round(yearDiff * 354.367 + monthDiff * 29.53 + dayDiff);

    if (totalDiffDays === 0) {
      // Additional safety check: check if it's the exact match
      const finalParts = getHijriDateParts(guess);
      if (finalParts.year === year && finalParts.month === month && finalParts.day === day) {
        return guess;
      }
    }

    guess = new Date(guess.getTime() + totalDiffDays * 86400000);
  }
  return guess;
}

