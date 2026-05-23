<p align="center">
  <img src="assets/banner.png" alt="NoorTab — Your Islamic New Tab Experience" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/ratulhasan/noor-tab/releases">
    <img src="https://img.shields.io/badge/version-0.0.1-emerald?style=for-the-badge&logo=google-chrome&logoColor=white&color=064e3b" alt="Version" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript&logoColor=white&color=1d4ed8" alt="TypeScript" />
  </a>
  <a href="https://plasmo.com/">
    <img src="https://img.shields.io/badge/Built%20with-Plasmo-purple?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQTEwIDEwIDAgMSAwIDEyIDIyQTEwIDEwIDAgMCAwIDEyIDJaIi8+PC9zdmc+&color=7c3aed" alt="Plasmo" />
  </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white&color=0f172a" alt="React" />
  </a>
  <img src="https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge&logo=googlechrome&logoColor=white&color=059669" alt="MV3" />
</p>

<p align="center">
  <strong>NoorTab</strong> transforms every new browser tab into a tranquil Islamic companion — delivering accurate prayer times, Adhan reminders, daily Quranic verses, Hadith, Dhikr tools, and a Qibla compass, all in a beautifully designed, distraction-free experience.
</p>

<br/>

---

## ✨ Features

### 🕌 New Tab Dashboard
Every new tab becomes a full Islamic experience, replacing the default blank tab with a spiritually enriching, information-rich dashboard.

| Feature | Description |
|---|---|
| **Live Digital Clock** | Real-time clock localized to your detected city's timezone |
| **Hijri & Gregorian Date** | Both Islamic and Gregorian dates displayed side by side — in Arabic and English |
| **Dynamic Background** | Gradient shifts based on the next prayer (dawn colors for Fajr, sunset for Maghrib, etc.) |
| **Mosque Silhouette Art** | Intricate SVG mosque artwork and Islamic geometric patterns as ambient visuals |
| **Prayer Times Bar** | All 5 daily prayers shown at a glance with the next prayer highlighted |
| **Countdown Timer** | Live countdown to the next salah, updating every second |
| **Adhan Reminder Banner** | Rich in-page banner appears when a prayer reminder is triggered — shows prayer name, Arabic name, and Adhan controls |

---

### 📿 Daily Spiritual Content

| Feature | Description |
|---|---|
| **Ayah of the Day** | Rotates through curated Quranic verses with Arabic text, transliteration, and English translation |
| **Hadith of the Day** | Date-seeded authentic Hadith with Arabic text, full translation, and source reference |
| **Dhikr / Tasbih Counter** | Digital counter for SubhanAllah → Alhamdulillah → Allahu Akbar with phase completion tracking and visual rings |
| **Islamic Calendar** | Upcoming Islamic events and observances (Ramadan, Eid, Muharram, etc.) displayed in a compact card |

---

### 🔔 Prayer Reminders & Adhan

| Feature | Description |
|---|---|
| **3 Notification Modes** | Choose between **New Tab Takeover**, **Toast Overlay**, or **Both** |
| **Overlay Position** | Overlay can appear as a compact **bottom-right toast** or a full **centered modal** |
| **Per-Prayer Toggles** | Enable or disable reminders individually for Fajr, Dhuhr, Asr, Maghrib, and Isha |
| **Early Reminder Offset** | Set how many minutes before the prayer you want to be notified (0–30 min) |
| **8 Adhan Reciters** | Preview and select from 8 beautiful Adhans before committing |
| **Global Mute Button** | Stop any playing Adhan from the popup header instantly, across all tabs |
| **Play / Pause Controls** | Toggle Adhan audio from the reminder banner, overlay, and modal — all in sync |

**Available Adhan Reciters:**
- 🕌 Sheikh Ali Ahmad Mulla — *Masjid al-Haram, Makkah*
- 🕌 Traditional Medina Adhan — *Masjid an-Nabawi*
- 🕌 Beautiful Al-Aqsa — *Al-Aqsa Mosque, Jerusalem*
- 🕌 Traditional Cairo Style — *Egyptian Adhan*
- 🕌 Saba Melodic Style — *Turkish Adhan*
- 🕌 Sheikh Mishary Al-Afasy — *Famous Kuwaiti Reciter*
- 🕌 Sheikh Abdul Basit — *Legendary Egyptian Reciter*
- 🕌 Yusuf Islam — *Soft & Gentle Adhan*

---

### 🧭 Qibla Compass
An interactive, animated compass that calculates the precise Qibla direction based on your GPS coordinates, with a smooth rotating needle animation and degree readout.

---

### ⚙️ Settings & Customization

| Setting | Options |
|---|---|
| **Location** | Auto-detect via GPS, pick from 50+ popular cities by country, or search any city by name |
| **Calculation Method** | 11 methods: Muslim World League, Egyptian, Karachi, Umm al-Qura, Dubai, Qatar, Kuwait, Singapore, Turkey, Tehran, ISNA |
| **Madhab** | Standard (Shafi, Maliki, Hanbali) or Hanafi (affects Asr time) |
| **Theme** | Light, Dark, or System |
| **Language** | English, বাংলা, العربية, हिन्दी, اردو |
| **Adhan Sound** | 8 reciters with live preview (Play/Pause before selecting) |
| **Overlay Style** | Bottom-right toast or centered backdrop modal |
| **Notification Style** | New Tab, Overlay Toast, or Both |
| **Reminder Offset** | Slider from 0–30 minutes before prayer |

---

### 🛡️ Privacy First
- **No server, no accounts.** Everything runs locally in your browser.
- Location coordinates are stored only in your browser's local extension storage.
- Prayer times are calculated on-device using the [`adhan-js`](https://github.com/batoulapps/adhan-js) library.
- No analytics, no tracking, no external data collection.

---

## 📸 Screenshots

> *(Coming soon — extension screenshots)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Development

```bash
# Install dependencies
npm install

# Start the dev server (hot reload)
npm run dev
```

Then open Chrome and navigate to `chrome://extensions`. Enable **Developer Mode**, click **Load Unpacked**, and select the `build/chrome-mv3-dev` folder.

### Production Build

```bash
npm run build
```

This outputs a production bundle at `build/chrome-mv3-prod/` and creates a ZIP file ready for Chrome Web Store submission.

---

## 🗂️ Project Structure

```
noor-tab/
├── src/
│   ├── background.ts             # Service worker — alarms, message orchestration
│   ├── newtab.tsx                # New Tab page entry
│   ├── popup.tsx                 # Extension popup entry
│   ├── style.css                 # Global Tailwind + custom CSS
│   │
│   ├── components/
│   │   ├── newtab/
│   │   │   ├── NoorTabHero.tsx   # Clock, greeting, countdown, prayer bar, reminder banner
│   │   │   ├── AyahDisplay.tsx   # Daily Quranic verse
│   │   │   ├── HadithOfDay.tsx   # Daily Hadith card
│   │   │   ├── DhikrCounter.tsx  # Tasbih / Dhikr digital counter
│   │   │   └── IslamicCalendar.tsx # Upcoming Islamic events
│   │   │
│   │   ├── popup/
│   │   │   ├── NextPrayer.tsx    # Next prayer countdown widget
│   │   │   ├── PrayerList.tsx    # Full prayer times list with reminder toggles
│   │   │   ├── QiblaCompass.tsx  # Animated Qibla compass
│   │   │   ├── SettingsPanel.tsx # Full settings form
│   │   │   ├── HijriDate.tsx     # Hijri date badge
│   │   │   └── IslamicEventCard.tsx # Upcoming event in popup
│   │   │
│   │   └── shared/
│   │       ├── ReminderOverlay.tsx # Prayer reminder — supports both toast and modal modes
│   │       └── CountdownTimer.tsx  # Reusable live countdown display
│   │
│   ├── contents/
│   │   └── overlay.tsx           # Content script — injects reminder into active tab
│   │
│   ├── data/
│   │   ├── adhanAudios.ts        # Adhan reciter definitions & audio URLs
│   │   ├── ayahs.ts              # Curated Quranic verses dataset
│   │   ├── hadiths.ts            # Curated Hadith dataset
│   │   ├── defaultSettings.ts    # Default user preferences
│   │   ├── islamicEvents.ts      # Islamic calendar event definitions
│   │   ├── popularLocations.ts   # 50+ city coordinates for quick selection
│   │   ├── prayerNames.ts        # Prayer metadata (Arabic names, display names)
│   │   └── translations.ts       # i18n strings (EN, BN, AR, HI, UR)
│   │
│   ├── hooks/
│   │   ├── useSettings.ts        # Settings read/write with Plasmo Storage
│   │   ├── usePrayerTimes.ts     # Prayer time calculation hook
│   │   └── useHijriDate.ts       # Hijri date conversion hook
│   │
│   ├── types/
│   │   └── index.ts              # Shared TypeScript interfaces & types
│   │
│   └── utils/
│       ├── prayerCalculator.ts   # adhan-js wrapper
│       ├── alarmScheduler.ts     # Chrome alarms scheduling
│       ├── locationService.ts    # GPS detection & geocoding
│       └── cn.ts                 # clsx + tailwind-merge utility
│
└── assets/
    └── banner.png                # README banner
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Plasmo](https://plasmo.com/) — Browser Extension Framework |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Prayer Calculation | [adhan-js](https://github.com/batoulapps/adhan-js) |
| Storage | [@plasmohq/storage](https://docs.plasmo.com/framework/storage) |
| Icons | [Lucide React](https://lucide.dev/) |
| Build Target | Chrome Manifest V3 |

---

## 🌐 Supported Languages

| Language | Code | Status |
|---|---|---|
| English | `en` | ✅ Full support |
| বাংলা (Bangla) | `bn` | ✅ Full support |
| العربية (Arabic) | `ar` | ✅ RTL support |
| हिन्दी (Hindi) | `hi` | ✅ Full support |
| اردو (Urdu) | `ur` | ✅ RTL support |

---

## 📐 Supported Calculation Methods

| Method | Region |
|---|---|
| Muslim World League | Global (Default) |
| Egyptian General Authority | Egypt, Middle East |
| U.I.S. Karachi | Pakistan, South Asia |
| Umm al-Qura, Makkah | Saudi Arabia |
| Dubai Authority | UAE |
| Qatar Authority | Qatar |
| Kuwait Authority | Kuwait |
| MUIS, Singapore | South-East Asia |
| Diyanet, Turkey | Turkey |
| Tehran Geophysics Institute | Iran |
| ISNA (Islamic Society of North America) | North America |

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please make sure your code follows the project's existing conventions (TypeScript strict mode, Tailwind utility classes, modular components).

---

## 📄 License

MIT License — see [`LICENSE`](LICENSE) for details.

---

<p align="center">
  Made with 🤍 for the Muslim Ummah &nbsp;•&nbsp;
  <strong>NoorTab</strong> — نور تاب
  <br/>
  <sub><em>"And We have made the night and the day two signs." — Quran 17:12</em></sub>
</p>
