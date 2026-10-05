# Chrome Web Store product details

## Product name

Islamic New Tab - Noor Tab

## Short description

Your Islamic new tab companion with prayer times, Adhan reminders, Quran bookmarks, duas, dhikr and a Qibla compass.

## Product details — description

Copy the text inside this block into the Chrome Web Store description field. The matching `.txt` file contains only this publishable description.

```text
Noor Tab is an Islamic new tab extension for Chrome that brings prayer times, Adhan reminders, Quran, Hadith, and a Qibla compass to your browser. Replace your new tab page with a calm, customizable Muslim dashboard for daily worship, learning, and remembrance.

Whether you are working or studying, keep your next prayer in sight, return to your Quran reading, and make space for a moment of dhikr.

PRAYER TIMES & ADHAN REMINDERS
• See Fajr, Dhuhr, Asr, Maghrib, and Isha times for your selected location, with a live countdown to the next prayer.
• Choose from calculation methods including Muslim World League, ISNA, Egyptian, and Umm al-Qura, with Hanafi or standard Asr settings.
• Adjust individual prayer times and choose which prayer reminders you receive.
• Select Adhan audio or keep reminders silent. Pause reminders with Focus Mode when you need quiet time.
• View prayer times for Makkah, Madinah, and additional cities.

QURAN, HADITH & READING BOOKMARKS
• Reflect on a daily Quranic verse with Arabic text, transliteration, and English translation.
• Read the Hadith of the Day with its source reference.
• Explore Quran surahs and online Hadith collections from your new tab.
• Save Quran bookmarks by Surah and Ayah, add notes, and return to your reading.

QIBLA COMPASS
• Find the direction to Makkah from your selected coordinates, with a compass and degree readout.
• Calculate Qibla direction offline once your location is saved.

DUAS, ADHKAR & DHIKR COUNTER
• Browse a searchable dua library for everyday moments, including travel, sleep, gratitude, and seeking protection.
• Read Arabic text with transliteration and translation, and save favorite supplications.
• Follow morning and evening Adhkar sessions with repetition counts and progress tracking.
• Use the digital tasbih counter for SubhanAllah, Alhamdulillah, Allahu Akbar, or custom dhikr, with personal goals.
• Explore the 99 Names of Allah with Arabic text, transliteration, and meanings.

PRAYER & FASTING TRACKERS
• Record your daily prayers, view your prayer calendar, and follow your current and longest streaks.
• Track Ramadan and voluntary fasts with a monthly fasting calendar.
• Check Suhoor and Iftar times based on your selected location and follow the Iftar countdown.

ISLAMIC CALENDAR & LEARNING TOOLS
• See the Hijri date, browse the Islamic calendar, and check upcoming events such as Ramadan and Eid.
• Follow a step-by-step Salah guide with prayer instructions, supplications, and a rakat table.
• Test your knowledge with Islamic quizzes covering Quran, Fiqh, Seerah, and Islamic history.
• Estimate Zakat using the built-in calculator and save calculation results.

YOUR DASHBOARD, YOUR ROUTINE
• Show or hide available widgets and arrange your dashboard with drag and drop.
• Choose light, dark, or system theme.
• Search the web using Google, DuckDuckGo, Bing, or Ecosia.
• Use the interface in English, Bengali (বাংলা), Arabic (العربية), Hindi (हिन्दी), or Urdu (اردو). Quran and Hadith content languages may differ from your interface language.
• Export and import JSON backups of your settings and saved progress.

PRIVACY & CONNECTIVITY
No Noor Tab account is required, and the extension includes no advertising or analytics trackers. Prayer times and Qibla direction are calculated on your device.

Settings and saved progress may sync through Chrome when browser sync is enabled. Online Quran and Hadith content, Adhan audio, location lookups, and web searches use external services and require an internet connection. Location lookups send your entered place name or detected coordinates to OpenStreetMap Nominatim.

GET STARTED
Add Noor Tab to Chrome, open a new tab, and choose your location and prayer settings. Enable the reminders you want and arrange your favorite widgets.

Make every new tab a moment of faith.
Made with care for the Muslim Ummah.
```

## Naming and positioning decisions

- **Store title:** Islamic New Tab - Noor Tab. Lead with the product category so a new visitor immediately understands the extension, then introduce the brand.
- **Brand in the interface:** Noor Tab. Use this spelling in visible headings, messages, and exported reports.
- **Core promise:** Make every new tab a moment of faith.
- **Primary audience:** Muslims who want prayer awareness and daily remembrance within their existing work or study routine.
- **Feature order:** Prayer times and reminders first, Quran and Qibla next, then remembrance, habit tools, and customization.
- **Search language:** Use “Islamic new tab,” “prayer times,” “Adhan reminders,” “Quran,” “duas,” and “Qibla” naturally where they describe a real feature. These are relevance choices, not measured keyword-volume findings or a guarantee of higher rankings.
- **Compatibility:** Keep the package slug `noor-tab`, storage keys, internal identifiers, and the backup discriminator `NoorTab` stable so existing settings and backups remain compatible.

Google recommends a concise, descriptive title, an accurate feature-led description, and a summary of no more than 132 characters. This copy follows that guidance without repetitive keyword lists. See [Google's listing guidance](https://developer.chrome.com/docs/webstore/best-listing) and [manifest description requirements](https://developer.chrome.com/docs/extensions/reference/manifest/description).

## Suggested screenshot story

Use current product screenshots with these short captions:

1. A moment of faith in every new tab — full dashboard.
2. Keep your next prayer in sight — prayer times and countdown.
3. Return to Quran and remembrance — Quran, duas, and Adhkar.
4. Build your daily routine — prayer and fasting trackers.
5. Your space, your rhythm — widget arrangement and themes.

## Publishing notes

The title and short description are configured in `package.json` and included in the production manifest. Paste only the description block above into the store's description field. The strategy and publishing notes are internal guidance.

The [privacy policy](../privacy-policy.md) documents external services, location lookups, browser sync, saved Zakat results, and the current permissions. Keep the store privacy disclosures consistent with that policy and the submitted build.
