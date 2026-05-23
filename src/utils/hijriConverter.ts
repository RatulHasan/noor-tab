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
