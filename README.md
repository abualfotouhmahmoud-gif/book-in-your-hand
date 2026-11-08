# Book in Your Hand

A PDF reader that feels like a real book: right-to-left (Arabic, Qur'an) or left-to-right (English), page curl,
gutter and cover edge, two-page spread in landscape, library with shelves, bookmarks, highlights, quotes,
search, night/sepia themes, daily goal, and full offline use.

## Files
| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `pdf.min.js`, `pdf.worker.min.js` | PDF engine (pdf.js 3.11.174, Apache-2.0) — bundled so the app works offline |
| `manifest.webmanifest` | App name, icons, colours, and "Share → Book in Your Hand" for PDFs |
| `sw.js` | Service worker: offline cache + receiving shared PDFs |
| `icons/` | App icons (192, 512, maskable 512, Apple 180) |

## 1 — Put it online (free, GitHub Pages)
1. Create a free account at github.com.
2. New repository → name it `book-in-your-hand` → **Public** → Create.
3. **Add file → Upload files** → drag in everything from this folder (including the `icons` folder) → **Commit changes**.
4. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → **Save**.
5. After 1–2 minutes the app is live at `https://YOUR-USERNAME.github.io/book-in-your-hand/`.

## 2 — Install on Android (no APK needed)
Open that link in **Chrome** on the phone → menu ⋮ → **Install app**.
It installs like a normal app (icon in the app drawer, opens full screen, works offline,
and appears in the **Share** menu when you share a PDF).

## 3 — Make an APK / AAB file
1. Go to **pwabuilder.com** → paste your app link → **Start**.
2. **Package for stores → Android → Generate package** → download the zip.
3. Inside: an `.apk` (install directly on any phone) and an `.aab` (for Google Play),
   plus a **signing key** — keep it safe; you need the same key for every future update.
4. If a browser address bar shows at the top of the APK app, the zip also contains `assetlinks.json`;
   it must be served at `https://YOUR-USERNAME.github.io/.well-known/assetlinks.json`
   (that needs a second repository named `YOUR-USERNAME.github.io`).

## 4 — Google Play (optional)
Needs a Google Play developer account, the `.aab` file, a privacy-policy page, screenshots,
and — for new personal accounts — a closed test with at least 12 testers for 14 days before public release.

## Privacy
Everything stays on the device: books, progress, bookmarks, highlights and quotes are stored in the browser's
IndexedDB. Nothing is uploaded anywhere.

## Updating the app
Upload the changed files to the same repository, and change `CACHE = 'biyh-v1'` in `sw.js` to `'biyh-v2'`
(then v3, …) so installed copies pick up the new version.
