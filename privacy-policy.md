# Islamic New Tab - Noor Tab Privacy Policy

Last updated: October 5, 2026

## Overview

Noor Tab replaces your browser's new tab page with prayer times and Islamic tools. It does not require a Noor Tab account and does not include advertising or analytics trackers. The extension saves settings and activity records in browser extension storage, and some features connect to external services.

This policy describes the current extension's storage, network requests, permissions, and your choices.

## Information saved by the extension

Noor Tab stores information needed for the features you use, including:

- Location coordinates and city name, calculation method, Asr setting, prayer adjustments, and reminder preferences.
- Theme, language, search engine, widget layout, and Adhan selection.
- Prayer records, fasting records, Quran bookmarks and notes, dua favorites, dhikr goals, Adhkar progress, and quiz records.
- Saved Zakat calculation results, including asset and liability totals, net assets, Nisab threshold, Zakat due, currency, and save date.
- Cached Quran and Hadith responses to reduce repeat requests.

Settings and progress generally use Chrome's `storage.sync` through the extension's storage library. When Chrome Sync is enabled, this information may be synchronized through Google's infrastructure to your other signed-in Chrome browsers. This can include location, worship records, and saved Zakat results. When sync is disabled, Chrome keeps this storage on the device. API caches and some backup-import writes use `storage.local`.

Noor Tab does not send these saved records to a developer-operated backend. Browser synchronization is separate from Noor Tab and is controlled by your browser and account settings. See [Chrome's storage documentation](https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas).

## Location

Prayer times and Qibla direction are calculated on your device from your selected coordinates.

- Selecting a city from the bundled city list does not require a geocoding request.
- Searching by city and country sends those terms to OpenStreetMap Nominatim to obtain coordinates.
- Choosing automatic location detection requests location through your browser's Geolocation API. The extension then sends the detected latitude and longitude to Nominatim to obtain a city name. Your browser or operating system may also use its own location services.

Location lookups can happen again when you use these controls; they are not limited to a single request after installation.

## External services

These connections support the features described below. Service providers receive the requested URL and ordinary connection information, such as your IP address, and may process it under their own policies. Noor Tab does not control their retention practices.

| Service | When it is used | Information in the request |
|---|---|---|
| OpenStreetMap Nominatim (`nominatim.openstreetmap.org`) | City search or automatic location lookup | Entered city and country, or detected coordinates |
| AlQuran Cloud (`api.alquran.cloud`) | Loading or searching online Quran content | Requested surah, ayah, edition, or Quran search query |
| Hadith API (`api.hadith.gading.dev`) | Loading online Hadith collections | Requested book, Hadith number, or range |
| IslamCan (`www.islamcan.com`) | Loading selected Adhan audio for preview or playback | Requested audio file |
| Google, DuckDuckGo, Bing, or Ecosia | Submitting a web search from the dashboard | Search terms sent to the selected search engine |

External links can also open Quran.com for a bookmarked verse, Google Maps for the Kaaba, and Buy Me a Coffee for optional support. The destination receives the requested page and handles any further interaction under its own policies. Noor Tab does not process support payments.

Prayer calculations and Qibla calculations do not require an external calculation service. Online content and audio may require a connection even when other dashboard features work offline.

## Browsing and permissions

Noor Tab does not build a browsing-history database or transmit the content of websites you visit to the developer. It checks tab information to route reminders and audio-control messages. A content script is registered on supported pages to display the reminder overlay.

The current Chrome build declares:

| Permission or access | Current behavior |
|---|---|
| `storage` | Saves settings, activity records, and cached content using browser extension storage, including sync storage |
| `alarms` | Schedules prayer reminders and daily rescheduling |
| `tabs` | Opens reminder tabs and queries tabs to deliver reminder and audio-control messages |
| `activeTab` | Declared in the manifest; current reminders use the registered content script and tab messaging |
| `scripting` | Declared in the manifest; the current implementation does not call `chrome.scripting` for location detection or reminders |
| `https://*/*` host access | Allows access to HTTPS hosts, including external content and location services |
| `<all_urls>` content-script matches | Registers the reminder overlay on supported websites, subject to browser restrictions |

Automatic location detection uses the browser Geolocation API in the extension interface; it is not performed by injecting a geolocation script into another website.

## Backups, reports, and data removal

You can export a JSON backup or supported PDF report to your device. These files can contain location, worship records, or saved financial calculation results. The extension does not upload exported files to a developer server. If you choose to import a backup, the extension reads and validates the selected file and restores its contents to browser storage.

Keep exported files somewhere you trust. Sharing a backup or report shares the information in that file. Removing the extension does not delete files you previously downloaded.

Stored information remains until it is overwritten, removed through an available feature or browser storage controls, or the extension is uninstalled. Chrome removes local extension storage on uninstall. Manage Chrome Sync through your browser and Google account settings; clearing browsing history alone does not clear extension storage. Data already received by external services is governed by those services' policies.

## Accounts, analytics, and support

Noor Tab has no account-registration flow and does not include advertising or analytics tracking. It does not sell your saved extension records. The extension does not ask for passwords, payment-card details, or personal communications.

If you contact the developer through GitHub, the information you choose to post is handled by GitHub and may be public. Please do not attach private backups, exact coordinates, worship records, or financial details to public issues.

## Changes and contact

This policy will be updated when the extension's data practices change. The date above identifies the latest revision.

For questions, visit the [project's issue tracker](https://github.com/ratulhasan/noor-tab/issues). You can inspect the [source code](https://github.com/ratulhasan/noor-tab) and [policy history](https://github.com/ratulhasan/noor-tab/commits/main/privacy-policy.md).
