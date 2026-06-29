# PHOOGUN TATTOO — Project Documentation

## Overview
Single-file React SPA for Phoogun Tattoo studio website with full admin CMS backend.
Everything lives in one file: `index.html` (2,285 lines, ~150KB).

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18.3.1 (UMD), JSX via Babel Standalone, Tailwind CDN |
| Persistence (primary) | `localStorage` via `usePersistedState` hook |
| Persistence (cloud) | Google Sheets Apps Script as REST backend |
| Hosting | Vercel (auto-deploy from GitHub) |
| Deployment method | GitHub REST API (Python urllib PUT) — git push blocked in CCR |

## Repository
- **Owner/Repo:** `armuxui1-beep/PHOOGUN-TATTOO`
- **Branch:** `main`
- **Deploy URL:** Vercel (auto-deploy on push to main)
- **GitHub PAT:** *(เก็บใน environment — ไม่เขียนในไฟล์)*

## Backend — Google Sheets Apps Script
- **Sheet URL:** `https://docs.google.com/spreadsheets/d/17xJfqQGpyr8qmHJRZLNFOjAOMK7TgR20syR9b0tz-b8/edit`
- **Script URL (current):** `https://script.google.com/macros/s/AKfycbz_rDHIwp_3nluXL9LSv0lzm62sXCxlwe8Pz_1rhnu-ep0qanitxswRNL_0oabYYYFF7A/exec`
- **Sheets:** `config`, `images`, `albums`, `categories`, `artists`, `reviews`, `heroSlides`

## API Conventions (CRITICAL)

### POST to Sheets (sheetsPost)
```javascript
// DO NOT set Content-Type header — causes CORS preflight that Sheets rejects
fetch(SHEETS_URL, { method: 'POST', body: JSON.stringify(body) })
// NOT: headers: { 'Content-Type': 'application/json' }
```

### updateConfig — must send FLAT keys
```javascript
updateConfig({ heroTitle:'...', heroTitleEn:'...', stat1Val:'500+', socialFacebook:'...' })
// NOT: { stats: [...], social: { facebook: '...' } }
```

### saveToSheets — field name aliases (app internal → Sheets column)
| App field | Sheets column |
|---|---|
| `artist` | `artistName` |
| `cover` | `coverUrl` |
| `specialty` | `specialtyEn` |
| `available` | `availableTh` |
| `social.facebook` | `socialFacebook` |
| `social.email` | `socialEmail` |
| `stats[0].val` | `stat1Val` |

Always send both the app field AND the Sheets alias:
```javascript
saveToSheets('update', 'images', { ...updated, artistName: updated.artist, tags: '...' }, id)
saveToSheets('update', 'albums', { ...updated, coverUrl: updated.cover }, id)
saveToSheets('update', 'artists', { ...updated, specialtyEn: updated.specialty, availableTh: updated.available }, id)
```

## Data Flow
```
Admin edits → setXxx() (localStorage) → saveToSheets/updateConfig (Google Sheets)
                                                     ↓
On reload: loadAllFromSheets() fetches Sheets → merges into state
```

### loadAllFromSheets merge rules
- Only overwrite if Sheets returns non-empty data (`if (d.images.length > 0)`)
- Preserve `logoUrl` and `aboutImage` from prev state if Sheets returns empty
- Reviews always overwrite (no guard)

## Admin Passcode
Default: `1337` (configurable via admin Settings → can be changed and saved to Sheets)

## File Structure (index.html sections)
```
Lines 1-49      — HTML head, Tailwind, React/Babel CDN imports
Lines 50-130    — DEFAULT_* data constants (categories, albums, artists, images, reviews)
Lines 131-169   — DEFAULT_CONFIG (all config fields with defaults)
Lines 170-250   — Google Sheets API functions + data transformers (_trCfg, _trImgs, _trArts, etc.)
Lines 251-445   — UI primitives (Modal, Btn, Input, Textarea, ImagePicker, Icon, etc.)
Lines 446-700   — Public page sections (HeroSection, GallerySection, ArtistsSection, etc.)
Lines 700-1060  — Booking/Review forms, public-facing components
Lines 1063-1168 — ImagesGrid (admin)
Lines 1173-1242 — AlbumsGrid (admin)
Lines 1246-1400 — AdminContent shell + ContentCards (hero/about/stats/logo save)
Lines 1400-1450 — CategoriesCards (admin)
Lines 1455-1521 — ArtistsCards (admin)
Lines 1524-1581 — ReviewCards (admin)
Lines 1585-1815 — AdminSettings (analytics/promote/pixel/social tabs)
Lines 1819-1975 — App Shell (LS_KEYS, lsGet/lsSet, PhoogunLogo SVG)
Lines 1975-2285 — PhoogunApp root component (state, routing, nav, admin login, layout)
```

## Key Components

### PhoogunApp (root)
- State: `images`, `albums`, `categories`, `artists`, `reviews`, `config`, `heroSlides`, `lang`, `mode`
- `mode`: `'public'` | `'admin'` | `'login'`
- `window._phg_togglePromote` — global bridge for promote toggle between AdminSettings and album state

### ImagePicker
- Accepts device file upload → converts to base64 data URL
- Stored in localStorage; base64 URLs also sent to Sheets (may be large)

### usePersistedState hook
- Wraps `useState` + auto-saves to `localStorage` on every state change
- Keys defined in `LS_KEYS` constant

## Deployment Script
```python
import urllib.request, json, base64

PAT='YOUR_GITHUB_PAT_HERE'
OWNER='armuxui1-beep'; REPO='PHOOGUN-TATTOO'; PATH='index.html'
API=f'https://api.github.com/repos/{OWNER}/{REPO}/contents/{PATH}'
hdrs={'Authorization':f'token {PAT}','Accept':'application/vnd.github.v3+json','User-Agent':'phg-deploy'}

req=urllib.request.Request(API,headers=hdrs)
with urllib.request.urlopen(req) as r: sha=json.loads(r.read())['sha']

with open('index.html','rb') as f: content=base64.b64encode(f.read()).decode()

body=json.dumps({'message':'commit message here','content':content,'sha':sha}).encode()
req2=urllib.request.Request(API,data=body,headers={**hdrs,'Content-Type':'application/json'},method='PUT')
with urllib.request.urlopen(req2) as r: print(json.loads(r.read())['commit']['sha'])
```

## Bugs Fixed in This Session (2026-06-29)

| # | Component | Bug | Fix |
|---|---|---|---|
| 1 | `sheetsPost` | `Content-Type: application/json` triggered CORS preflight → `Failed to fetch` | Removed header; browser sends `text/plain` (no preflight) |
| 2 | `ImagesGrid.save()` | Sent `artist` to Sheets; column is `artistName` | Added `artistName: updated.artist` alias |
| 3 | `AlbumsGrid.save()` | Sent `cover` to Sheets; column is `coverUrl` | Added `coverUrl: updated.cover` alias |
| 4 | `ArtistsCards.save()` | Sent `specialty`/`available`; Sheets expects `specialtyEn`/`availableTh` | Added both aliases |
| 5 | `ReviewCards` | `approve/reject/del` had zero Sheets calls — changes lost on reload | Added `saveToSheets` to all three + error toast |
| 6 | `ContentCards` | `saveHero/saveAbout/saveStats` sent nested objects to Sheets | Flattened to `stat1Val`, `socialFacebook`, etc. |
| 7 | `AdminSettings` | `savePixels/saveSocial` never called Sheets at all | Added `updateConfig()` calls |
| 8 | `loadAllFromSheets` | Empty Sheets response overwrote localStorage data | Added `length > 0` guards + config merge |
| 9 | `DEFAULT_CONFIG` | Missing 13 fields (`heroBtnBookTh/En`, `studioName`, `adminPasscode`, etc.) | Added all missing fields |
| 10 | Favicon | No favicon → empty globe icon in browser tab | Added inline SVG favicon with Phoogun logo |
| 11 | Favicon | Admin-uploaded logo not reflected in browser tab | `useEffect` on `config.logoUrl` updates `<link rel=icon>` dynamically |
| 12 | Social UI | Email field missing from Social & Map admin tab | Added email input to the array |

## Notes
- CCR (Cloud Code Runner) blocks outbound to `script.google.com` and `vercel.app` — test on real browser only
- `heroSlides` uses `useState` + manual `lsSet` (not `usePersistedState`) — intentional, only set from Sheets
- `togglePromote` in AdminSettings uses `window._phg_togglePromote` bridge — wired in `PhoogunApp` useEffect with `[albums]` dep
- Base64 image uploads can be very large — monitor localStorage quota (`window._lsWarn` flag set on overflow)
