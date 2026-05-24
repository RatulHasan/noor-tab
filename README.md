<p align="center">
  <img src="assets/banner.png" alt="NoorTab - Your Islamic New Tab Experience" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/ratulhasan/noor-tab/releases">
    <img src="https://img.shields.io/badge/version-1.0.0-emerald?style=for-the-badge&logo=google-chrome&logoColor=white&color=064e3b" alt="Version" />
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
  <strong>NoorTab</strong> transforms every new browser tab into a tranquil Islamic companion - delivering accurate prayer times, Adhan reminders, daily Quranic verses, Hadith, Dhikr tools, a Qibla compass, and much more, all wrapped in a beautifully designed, distraction-free experience.
</p>

<br/>

---

## ✨ Core Features

### 🕌 Prayer Times & Adhan
- **Accurate prayer time calculation** using industry-standard algorithms (Adhan.js) supporting 8+ calculation methods (Muslim World League, ISNA, Egyptian, Umm al-Qura, and more)
- **Madhab support** for Hanafi and standard Asr calculation
- **Per-prayer reminders** - individually enable or disable Fajr, Dhuhr, Asr, Maghrib, and Isha notifications
- **Configurable reminder offset** - be notified 0–30 minutes before each prayer
- **Adhan audio playback** - choose from a curated selection of high-quality Adhan recordings; audio plays automatically when the prayer reminder fires
- **Global stop control** - a pulsing mute button appears in the popup header *only while the Adhan is actively playing*, letting you stop it instantly from anywhere
- **Live countdown** to the next prayer with a smooth animated timer
- **Dynamic background gradients** in the new tab that shift throughout the day - dawn blues, midday greens, sunset ambers, and night indigos

### 📅 Islamic Calendar
- **Hijri date** displayed in both English transliteration and Arabic script
- **Islamic event cards** - automatically surfaces upcoming events (Ramadan, Eid, Muharram, Mawlid, etc.) with days-remaining countdown
- **Friday (Jumu'ah) banner** - special contextual greeting every Friday

### 🧭 Qibla Compass
- **Geolocation-aware Qibla direction** calculated from the user's coordinates to Makkah
- Animated SVG compass with degree readout
- Works offline once location is stored

### 📖 Quranic Ayah of the Day
- A beautiful daily Ayah displayed with Arabic text, transliteration, and English translation
- Date-seeded rotation ensures a different verse each day
- Serif typography (`font-amiri`) for a premium Arabic reading experience

### 📚 Hadith of the Day
- Curated authentic Hadith shown daily with source attribution
- Elegant card layout with gradient accents

### 📿 Dhikr Counter
- **Customisable digital counter** for Tasbih, Tahmid, Takbir, and custom Dhikr
- Set personal goals (e.g. 33, 99, 100) with visual progress tracking
- Haptic-style feedback on each count; auto-resets when goal is reached
- Persistent storage - counts survive browser restarts

---

## 🚀 Extended Features (Phase 2)

### 📿 Adhkar Player
A full **morning & evening Adhkar companion** built into both the new tab and the popup:
- Structured Adhkar sessions split into Morning and Evening categories
- Each Dhikr item shows its Arabic text, transliteration, translation, and recommended count
- **Progress tracking** - completed items are persisted per day; sessions auto-reset the following morning/evening
- Daily completion percentage with a visual progress bar
- Reminder alarms that fire at Fajr + 30 min (morning) and at Asr time (evening) if enabled in settings

### 🏅 Prayer Streak Tracker
A motivational accountability tool for establishing consistent Salah:
- **7-day streak display** with a visual heatmap of the past week
- Monthly calendar view showing which prayers were prayed, missed, or skipped
- Mark each prayer as **Prayed ✓**, **Missed ✗**, or **Excused (Qada) ◎**
- Current streak counter and longest-ever streak badge
- All data stored locally - 100% private, no account required

### 🌙 Fasting Tracker
Tracks Ramadan and voluntary fasting with full historical logging:
- **Ramadan Mode** - auto-detects the Ramadan month or can be toggled manually
- Mark each day as fasted, not fasted, or excused
- Displays Suhoor and Iftar times based on the user's location (Fajr and Maghrib)
- **Live countdown** to Iftar with seconds precision during a fast
- Monthly fasting calendar with colour-coded status indicators
- Voluntary fast support for Mondays, Thursdays, White Days (13–15 Dhul Hijjah), and the Day of Arafah

### 📖 Quran Bookmark
A lightweight reading-progress companion:
- Save your current Surah and Ayah position
- Browse all 114 Surahs by name, number, and revelation type (Makki / Madani)
- Multiple bookmarks supported - pick up exactly where you left off
- Clean two-panel layout: bookmark list on the left, detail view on the right

### 🔤 Asma ul-Husna - The 99 Names of Allah
- **Name of the Day** card - date-seeded so a different name is highlighted every day
- Displays the Arabic calligraphy, transliteration, English meaning, and a devotional benefit/supplication
- **Smooth animated benefit reveal** - click "Show benefit" to expand the card without layout glitches
- **View all 99 names** opens a full-screen modal (rendered via React Portal to prevent clipping) with a 3-column searchable grid; the today's name is highlighted in emerald

### 🌍 Global Prayer Times
A world-clock-style table showing prayer times for multiple cities simultaneously:
- **Always-on Makkah and Madinah rows** as anchors
- Add up to **3 custom cities** from a searchable dropdown spanning 500+ cities worldwide
- Live prayer time calculations using each city's coordinates and the Umm al-Qura method
- Persistent city selections via storage - survives page refreshes

### 🧠 Islamic Quiz
A gamified knowledge tool to deepen Islamic understanding:
- 50+ curated multiple-choice questions covering Fiqh, Seerah, Quranic topics, and Islamic history
- Timed questions with difficulty levels (Easy / Medium / Hard)
- Score tracking and personal-best records persisted across sessions
- Instant feedback with correct answer explanations after each question

### 📚 Dua Library
A searchable library of authentic supplications:
- 100+ duas organised by category (Morning, Evening, Eating, Travelling, Sleep, etc.)
- Full Arabic text with transliteration and translation for each dua
- **Favourite system** - star any dua to pin it to a personal quick-access list
- Copy to clipboard in one tap

### ☕ Jumuah Banner
- Every Friday the new tab displays a special Jumu'ah greeting banner with an emerald accent
- Subtle background gradient shift distinguishes Friday from other days

### 🎨 Customisable Dashboard
A drag-and-drop-style widget manager:
- Toggle any of the 10+ widgets on or off
- Reorder widgets by dragging them to preferred positions
- Changes persist immediately via Plasmo storage

---

## 🔇 Focus Mode (Silence Reminders)
- Moon icon in the popup header opens the **Silence Reminders** dropdown
- Snooze all prayer notifications for **1 hour, 2 hours, or 4 hours**
- Active snooze shows a pulsing indicator and live remaining time countdown
- Background worker respects the snooze window - no alarms fire until it expires
- Disable at any time with the "Disable Focus Mode" option

---

## 💾 Backup & Restore
Export and restore all your personal data in one click:
- Full JSON export covers settings, prayer streak, fasting log, Quran bookmarks, Dhikr goals, Adhkar progress, Dua favourites, quiz records, and widget layout
- Import from any previously exported file with automatic validation
- Enables seamless migration between devices or browsers

---

## 🌐 Multi-Language Support
Full UI localisation for:
| Language | Code |
|---|---|
| English | `en` |
| Bengali | `bn` |
| Arabic | `ar` |
| Hindi | `hi` |
| Urdu | `ur` |

Clock, date, and number formatting adapts to the selected locale using native `Intl` APIs.

---

## 📍 Location & Privacy

NoorTab is **entirely local**. There are no accounts, no tracking, and no data is sent to any server.

- Location is detected once via the browser Geolocation API and stored in local extension storage
- Alternatively, choose from 500+ popular cities with a single dropdown or enter coordinates manually
- All streak, fasting, Quran, and quiz data lives in `chrome.storage` (Plasmo Storage) on-device only

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Plasmo](https://plasmo.com/) (Chrome Extension MV3) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| State | `@plasmohq/storage` / `useStorage` hook |
| Prayer Calculation | `adhan` (Adhan.js) |
| Icons | `lucide-react` |
| Build | Parcel (via Plasmo) |
| Testing | - (unit tests planned) |

---

## 📁 Project Structure

```
noor-tab/
├── src/
│   ├── background.ts              # Service worker - alarm scheduling & message routing
│   ├── newtab.tsx                 # New Tab page entry point
│   ├── popup.tsx                  # Browser action popup entry point
│   ├── content.ts                 # Content script for overlay injection
│   │
│   ├── components/
│   │   ├── newtab/
│   │   │   ├── NoorTabHero.tsx        # Clock, Hijri date, prayer bar, Adhan banner
│   │   │   ├── AsmaUlHusna.tsx        # 99 Names of Allah widget + modal
│   │   │   ├── GlobalPrayerWidget.tsx # World prayer times table
│   │   │   ├── PrayerStreakWidget.tsx # Streak summary card for new tab
│   │   │   ├── JumuahBanner.tsx       # Friday Jumu'ah greeting
│   │   │   ├── WidgetCustomizer.tsx   # Widget toggle & reorder drawer
│   │   │   ├── AyahDisplay.tsx        # Quran Ayah of the day
│   │   │   ├── HadithOfDay.tsx        # Hadith of the day card
│   │   │   ├── DhikrCounter.tsx       # Digital Tasbih counter
│   │   │   └── IslamicCalendar.tsx    # Hijri calendar card
│   │   │
│   │   ├── popup/
│   │   │   ├── HijriDate.tsx          # Compact Hijri date badge
│   │   │   ├── NextPrayer.tsx         # Next prayer countdown chip
│   │   │   ├── PrayerList.tsx         # Full prayer list with reminder toggles
│   │   │   ├── QiblaCompass.tsx       # Animated Qibla SVG compass
│   │   │   ├── SettingsPanel.tsx      # All user settings UI
│   │   │   ├── IslamicEventCard.tsx   # Upcoming Islamic event badge
│   │   │   ├── FocusModeToggle.tsx    # Silence reminders dropdown
│   │   │   └── BackupManager.tsx      # Export/import personal data
│   │   │
│   │   └── shared/
│   │       ├── AdhkarPlayer.tsx       # Morning/evening Adhkar session UI
│   │       ├── PrayerStreakTracker.tsx # Full monthly streak calendar
│   │       ├── FastingTracker.tsx     # Ramadan & voluntary fasting log
│   │       ├── QuranBookmark.tsx      # Quran reading progress tracker
│   │       ├── IslamicQuiz.tsx        # Multiple-choice Islamic quiz
│   │       ├── DuaLibrary.tsx         # Searchable dua collection
│   │       ├── AsmaCard.tsx           # Individual Asma name card
│   │       ├── CountdownTimer.tsx     # Reusable countdown display
│   │       └── BuyMeCoffee.tsx        # Support button (badge & floating variants)
│   │
│   ├── hooks/
│   │   ├── useSettings.ts         # Global user settings with Plasmo Storage
│   │   ├── usePrayerTimes.ts      # Prayer time computation hook
│   │   └── useHijriDate.ts        # Hijri date formatting hook
│   │
│   ├── utils/
│   │   ├── prayerCalculator.ts    # Adhan.js wrapper for prayer time calc
│   │   ├── alarmScheduler.ts      # Chrome alarm creation & management
│   │   ├── locationService.ts     # Geolocation & geocoding helpers
│   │   ├── streakCalculator.ts    # Prayer streak logic
│   │   ├── fastingHelper.ts       # Ramadan detection & fasting utils
│   │   ├── jumuahHelper.ts        # Friday detection helper
│   │   ├── dateUtils.ts           # Native JS date helpers (format, subDays, etc.)
│   │   ├── backupManager.ts       # JSON export/import logic
│   │   └── cn.ts                  # Tailwind class merge utility
│   │
│   ├── data/
│   │   ├── adhanAudios.ts         # Adhan audio option registry
│   │   ├── adhkarData.ts          # Morning & evening Adhkar content
│   │   ├── asmaUlHusna.ts         # All 99 names with meanings & benefits
│   │   ├── defaultSettings.ts     # Default UserSettings shape
│   │   ├── duaData.ts             # Categorised Dua library content
│   │   ├── islamicEvents.ts       # Upcoming Islamic events dataset
│   │   ├── popularLocations.ts    # 500+ cities with coordinates
│   │   ├── prayerNames.ts         # Prayer metadata (Arabic, transliteration)
│   │   ├── quizData.ts            # Islamic quiz questions
│   │   ├── quranData.ts           # Surah list with metadata
│   │   └── translations.ts        # UI strings in 5 languages
│   │
│   └── types/
│       └── index.ts               # All shared TypeScript types & interfaces
│
├── assets/
│   └── banner.png                 # README banner image
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🛠️ Development

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Getting Started

```bash
# Clone the repository
git clone https://github.com/ratulhasan/noor-tab.git
cd noor-tab

# Install dependencies
npm install

# Start the development server (hot-reload)
npm run dev
```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load Unpacked**
4. Select the `build/chrome-mv3-dev` folder generated by `npm run dev`

### Production Build

```bash
npm run build
```

The production bundle is output to `build/chrome-mv3-prod/`.

### 🛠️ Developer Mode & Testing Tools

NoorTab includes a built-in suite of Developer Testing Tools, which are consolidated in the **Widget Customizer** sidebar (New Tab page) when built in dev mode:
- **Enable Developer Mode**: Build or start the extension with the environment variable `PLASMO_PUBLIC_DEV_MODE=true` set in the environment or `.env` file.
- **Local Time Simulator**: Speed up testing by simulating any hour/minute of the day. The tab's dynamic background gradient transitions and clock adjust instantly.
- **Global Location Simulator**: Select any country and city from a dropdown to simulate different geographic locations. The prayer times and timezone offset recalculate instantly.
- **Immediate Notifications Tester**: Fire mock prayer alarms (Maghrib), center-modal overlays (Fajr), or new tab notifications instantly to test the notification triggers.

---

## ⚙️ Settings Reference

| Setting | Options | Description |
|---|---|---|
| Calculation Method | 8 methods | Prayer time calculation school |
| Madhab | Hanafi / Standard | Asr time calculation preference |
| Reminder Offset | 0–30 min | How early before the prayer to notify |
| Per-Prayer Reminders | Toggle per salah | Enable/disable individual prayer alarms |
| Adhan Audio | None + 6 reciters | Audio to play when prayer reminder fires |
| Notification Style | New Tab / Overlay / Both | How prayer reminders are displayed |
| Language | en / bn / ar / hi / ur | Full UI language |
| Morning Adhkar Reminder | On/Off | Alarm at Fajr + 30 min |
| Evening Adhkar Reminder | On/Off | Alarm at Asr time |

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are very welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit with conventional commits: `git commit -m "feat: add XYZ"`
4. Push and open a Pull Request

Please ensure your PR includes:
- A clear description of what changed and why
- Screenshots for any UI changes
- No `console.log`, `dd()`, or commented-out code

---

## 📄 License

MIT © [Ratul Hasan](https://github.com/ratulhasan)

---

<p align="center">
  Built with 💚 for the global Muslim community.<br/>
  <em>May Allah accept this effort and make it a source of benefit.</em>
  <br/><br/>
  <a href="https://www.buymeacoffee.com/ratulhasan">
    <img src="https://img.shields.io/badge/Support-Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
  </a>
</p>
