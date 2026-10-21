# GlassWalls — Liquid Glass wallpaper app (Expo / React Native / TypeScript)

Wallpapers come from the Wikimedia Commons API (`https://commons.wikimedia.org/w/api.php`). Arabic (RTL) is the default language; English is available in Settings.

## Status — read first
This code was written in an environment with **no network access**, so **nothing here has been installed, type-checked, tested, built or run**. Treat it as an unverified first draft. Run the steps below and fix what surfaces (most likely: dependency version pins — run `npx expo install --fix`).
The reference screenshot was not supplied, so the visuals follow the written description only.

## Glass effect
`LiquidGlassSurface` is now genuinely translucent: ~5% white tint, light blur (`expo-blur`, `dimezisBlurView` on Android), a diagonal sheen, a top-edge specular highlight and an inner light rim. Tune `intensity` / `tint` per surface. The effect only shows when there is content behind the surface.

## Setup
```bash
npm install
npx expo install --fix        # aligns versions with the installed Expo SDK
npm run typecheck && npm test
npx expo prebuild
npm run android               # or: npm run ios   (development build; Expo Go is not sufficient for reliable gallery saving)
```

## Permissions
- iOS: `NSPhotoLibraryAddUsageDescription` (add-only) set in `app.json`; the app requests write-only access.
- Android: `expo-media-library` plugin declares what it needs; `requestPermissionsAsync(true)` requests write-only access. Behaviour differs on Android ≤ 9 vs 10+ (scoped storage) — verify on devices.

## Architecture
`app/` routes (tabs: Home, Explore, Favorites, Calendar, Settings; `wallpaper/[id]` details) · `src/services` (Commons API, download, gallery, cache) · `src/store` (zustand + AsyncStorage: favorites, language) · `src/localization` (ar/en) · `src/components` (Liquid Glass UI).

## Behaviour notes
- RTL: React Native applies `I18nManager.forceRTL` only after a reload; the app reloads once automatically when you switch language (`reloadAppAsync`). Not instantaneous.
- Download progress is real byte progress; if the server sends no length, an indeterminate spinner is shown.
- Cache clearing removes `cache:*` API entries, expo-image disk/memory cache and temp downloads. It keeps favorites, language and gallery photos, and cannot clear OS-level caches.
- Daily wallpaper: deterministic hash of the date over the first page of "nature" results (changes if Commons results change).
- Search uses CirrusSearch operators (`filetype:bitmap fileh:>1600`) and client-side portrait filtering; results are never fabricated.
- Masonry is a custom two-column ScrollView layout (not virtualized). For very long lists consider FlashList masonry.
- Set a real contact address in the `Api-User-Agent` header in `src/services/wikimediaApi.ts` per Wikimedia's etiquette.
- Licenses vary per file; the details screen shows creator, license and a link to the Commons file page. Review attribution requirements for your use.

## Manual verification still required
Gallery save on a real Android device (API 28 and 29+) and on iOS; permission-denied flow; RTL↔LTR reload; tablet layout.
