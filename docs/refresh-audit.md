# findadoc-web — Refresh Audit

**Status:** Phase 1 (audit only, no code changes)
**Date:** 2026-09-01
**Scope:** Route/flow inventory, render performance, search performance, data model, crawler surface.

> **Focus note.** SEO/crawler defects are already tracked as GitHub issues and are summarised only briefly in §6. The weight of this audit is on **flows, time-to-render, and search speed**, per the current priority.

---

## 1. Executive summary

The site is slow and the first-run flow is broken, and neither is primarily a design problem. Three findings dominate:

1. **A city-filtered search can only ever see 100 of 465 facilities (21%).** `fetchAllFacilities` terminates its pagination loop using the length of a *client-side–filtered* batch, so any active city filter stops paging after the first batch. Searching **Meguro** (11 facilities) or **Kagoshima** (8 facilities) returns **zero results**, presented to the user as "no clinics found." This is a silent correctness bug, not a performance issue. — §4.1
2. **Every search re-downloads the entire database over ~10 GraphQL round trips, ~5 of them strictly sequential.** Measured against production: **~5.9 s of network time and ~570 KB** before a single result can render — and that is *after* the 2.5 MB JS bundle has booted, on a fast connection. — §4.2
3. **The onboarding flow is a splash screen and a hardcoded 3-second fake loading animation, and nothing else.** The category-selection step it was built around is **unreachable dead code** — nothing ever sets `currentStep` to `Categories`, so `CategorySelection.vue` never renders. First-run users click one button, wait 3 s for a timer that does no work, and land on an unfiltered list. — §3.2

Fixing #1 and #2 is largely deleting code — but only partly. The API already filters
professionals by specialty and spoken language, which the client re-implements in memory. It
does **not** filter facilities by location: `FacilitySearchFilters` exposes no prefecture or
city field (§6), so the city filter cannot move server-side until the schema gains one. That
backend change is the long pole. Fixing #3 is uncommenting and finishing ~8 lines.

Separately, the route tree carries a **byte-identical duplicate of the entire moderation surface** (§2.2) and a **placeholder profile page that tells users their changes were saved when nothing is persisted** (§2.3).

---

## 2. Route inventory

`ssr: false` (`nuxt.config.ts:24`) means every route below is a client-rendered SPA view. Prerendered output in `.output/public/` confirms directories exist for `about`, `login`, `moderation`, `my-page`, `privacypolicy`, `submit`, `terms` — and **not** for `u/`, which is why `/u/<anything>` returns a hard 404 on direct entry.

| Route | Description | Reachable from nav? | Verdict |
|---|---|---|---|
| `/` | Onboarding gate + map/list search. The product. | yes | **Keep** — rebuild flow (§3) |
| `/about` | Org story, mission, contributor directory (`member_directory/members.json`, 45 avatars). 566 lines. | yes (TopNav) | **Keep** |
| `/submit` | Community facility/professional submission form. | yes (TopNav, Footer) | **Keep** |
| `/privacypolicy` | Privacy policy, fully i18n'd. | yes (Footer) | **Keep** |
| `/terms` | Terms & conditions. **Hardcoded English, zero i18n keys**; §1 and §2 share word-for-word identical body text (copy-paste defect). | yes (Footer) | **Keep** — fix content |
| `/login` | Auth0 redirect wrapper (`LoginForm`). | yes (TopNav) | **Keep** — `noindex` |
| `/my-page` + 5 children | Authenticated dashboard: submissions, facilities, professionals, create/edit flows. | yes (TopNav, gated) | **Keep** — `noindex` |
| `/moderation` + 5 children | **Byte-identical duplicate** of the `/my-page` tree. | **no** — zero inbound links | **Kill** (§2.2) |
| `/u/[username]` | Placeholder profile editor that persists nothing. | **no** — zero inbound links | **Kill** (§2.3) |
| — | **Missing:** per-facility, per-professional, and faceted routes | — | **Add** (tracked in SEO issues) |

### 2.1 Orphaned components

- `components/WelcomeSection.vue` (10 lines, hardcoded English `<h1>`/`<h2>`) — referenced nowhere. Delete.
- Note it is *not* the same as `components/onboarding/WelcomeScreen.vue`, which is live. The near-identical names are a trap.

### 2.2 `/moderation` is a duplicate of `/my-page` — kill it

All five child routes are **byte-for-byte identical** (`diff` returns zero lines for every pair):

```
pages/moderation/create-facility/index.vue                 ==  pages/my-page/create-facility/index.vue
pages/moderation/create-healthcare-professional/index.vue  ==  pages/my-page/create-healthcare-professional/index.vue
pages/moderation/edit-facility/[id].vue                    ==  pages/my-page/edit-facility/[id].vue
pages/moderation/edit-healthcare-professional/[id].vue     ==  pages/my-page/edit-healthcare-professional/[id].vue
pages/moderation/edit-submission/[id].vue                  ==  pages/my-page/edit-submission/[id].vue
```

`pages/moderation.vue` and `pages/my-page.vue` differ only in Tailwind classes, an `isSettingsView` computed, a `key`, and the redirect target. `/my-page` is the newer, more complete branch — it has the settings view and the nested `<NuxtPage>` mount.

**Nothing links to `/moderation`.** The only surviving references are `pages/moderation.vue:87` (its own redirect) and a defensive path check at `components/TopNav.vue:239`. `utils/accessControlLinks.ts` — the canonical scope→route registry — points **exclusively** at `/my-page`.

This is dead weight that doubles the maintenance surface of the most complex part of the app: every moderation bug must be fixed twice or it silently regresses on one branch. **Kill the whole `/moderation` tree**, and drop the `TopNav.vue:239` check with it.

### 2.3 `/u/[username]` is a placeholder that lies to the user — kill it

`components/ProfilePage.vue` renders a full profile-edit form with username, email, and photo-upload fields. Its two data paths are both stubs, by its own comments:

- `populateFromStoreOrParam` — *"Replace the placeholder below with an actual API call to fetch public profile data by username when available."* For a public view it sets the username from the URL and blanks everything else.
- `submitProfile` — *"Only a placeholder here — implement actual update logic."* The `try` block contains **no persistence call**; it unconditionally sets `successMessage`.

So a user who fills in the form and clicks Save is told **"Profile updated successfully"** while nothing is written anywhere. The route is unreachable from the UI and 404s on direct entry, which is the only reason this has not caused support load.

**Kill the route and the component.** Reintroduce it when there is a real profile API. The i18n keys under `profile.*` can stay.

---

## 3. Flow analysis

### 3.1 The first-run flow, as experienced

```
land on /  →  JS bundle boots (2.5 MB)  →  WelcomeScreen splash
          →  click "Find a Doctor!"
          →  3.0 s hardcoded fake loader        ← does no work
          →  full-screen map, UNFILTERED
          →  ~5.9 s of GraphQL waterfall before the first result paints
```

A first-time visitor waits **~9 seconds** across two separate loading states to reach an unfiltered map. Nothing is asked, nothing is learned, nothing is prefetched. The intended second step — "what are you looking for?" — never runs (§3.2).

The homepage also has **no nav and no footer**: `layouts/onboarding.vue` renders only `<NuxtPage />`, and `TopNav`/`Footer` are mounted *inside* `MainContentContainer`'s search branch. So until onboarding completes there is no link to About or Submit, and no language selector — on the one page most likely to be a stranger's first contact with the site.

### 3.2 Onboarding is a splash and a timer; its real step is dead code (`components/onboarding/Onboarding.vue`)

**The category step never renders.** `currentStep` is initialised to `Welcome` and assigned only `LoadingSearch` (lines 47 and 53). No code path sets `OnboardingSteps.Categories`, so the `v-else-if` for `CategorySelection` is unreachable and `handleCategorySelect` is never called. `WelcomeScreen`'s `@next` binds straight to `completeOnboarding`, skipping the step entirely. `tests/e2e/onboarding.spec.ts` encodes this degraded path as the expected behaviour.

`CategorySelection.vue` (107+ lines) and the `onboarding.selectcategory` / `onboarding.notsurebutton` keys — **translated across all 10 locales** — are dead weight for a screen that has never been shown.

What does run:

```js
const completeOnboarding = async () => {
    currentStep.value = OnboardingSteps.LoadingSearch
    // Wait for the loading animation to finish, then transition to the search page
    setTimeout(() => {
        onboardingStore.setOnboardingState(OnboardingState.Completed)
    }, 3000)

    // Let's start the search with the selected category to start
    // const specialtiesToSearch = selectedCategory.value
    //     ? specialtiesStore.categoryToSpecialtyMap[selectedCategory.value]
    //     : undefined
    // searchResultsStore.selectedSpecialties = specialtiesToSearch ?? []
    // await searchResultsStore.search()
}
```

Three defects in nine lines:

1. **`selectedCategory` is captured and never used.** The mapping to specialties is commented out, so the category selection screen is decorative.
2. **The 3000 ms timer is unconditional and does no work.** It is not waiting on a request — the search has not started. It is pure dead time, and it is *in addition to* the real search latency that follows.
3. **The search is not kicked off here.** It starts later from `SearchResultsList.vue:155` (`onMounted`), so the 3 s animation and the ~5.9 s fetch are **serial, not overlapped.** Even if the timer were justified, it is spent idle rather than prefetching.

The imports for `useSearchResultsStore` and `useSpecialtiesStore` are commented out at the top of the file, confirming this was mid-refactor and left in a shipped state.

**Fix:** map category → specialties, set the filter, and start the search *immediately* on category select. Drive the transition off the request completing rather than a fixed timer. This removes 3 s outright and overlaps the rest — most of the perceived wait disappears without touching the network layer.

### 3.3 Onboarding state is `localStorage`-only

`stores/onboardingStore.ts` reads `onboardingState` from `localStorage` at module init, guarded by `typeof window`. Consequences: onboarding replays on every new device/browser/incognito session, and under SSR (§5) the server would always render the not-started branch, guaranteeing a hydration mismatch on repeat visitors. Needs a cookie or an explicit client-only boundary before SSR lands.

### 3.4 Errors are surfaced with blocking `alert()`

`stores/searchResultsStore.ts` (both `queryProfessionals` and `queryFacilities`) and `stores/locationsStore.ts` call **`alert()`** on failure. Combined with the retry policy in `utils/graphql.ts` (3 attempts, 5000 ms between them), a failing search hangs for **~15 seconds** and then throws a native modal. Native modals also block the page thread and are unstyleable, untranslatable in context, and inaccessible. The app already has `vue-toastification` wired up — use it.

### 3.5 No URL state anywhere in search

Zero matches for `useRoute`/`useRouter` across `MainContentContainer`, `SearchBar`, `FiltersPanel`, `SearchResultsList`, `SearchResultsListItem`, `SearchResultDetails`. All search state (`selectedCity`, `selectedSpecialties`, `selectedLanguages`, `activeFacilityId`) lives only in Pinia.

UX consequences, independent of SEO: **no back-button support** (browser Back exits the search entirely rather than closing a detail view), **no bookmarking, no sharing, no refresh-safety**. A user who finds a clinic cannot send it to their partner. On mobile, where Back is the primary navigation gesture, this is a significant usability failure.

---

## 4. Search performance

### 4.1 Correctness: city filtering silently loses 79% of the database

`stores/searchResultsStore.ts`:

```js
while (hasMoreBatches) {
    const batch = await queryFacilities(searchCity, healthcareProfessionalIDs, batchSize, offset)
    allFacilities.push(...batch)
    hasMoreBatches = batch.length === batchSize   // ← batch is ALREADY city-filtered
    offset += batchSize
}
```

`queryFacilities` requests 100 facilities, then filters them **client-side** by `cityEn`/`cityJa` before returning. The loop's continue-condition tests the length of that *filtered* result against the *requested* batch size. With any city selected, batch 1 returns far fewer than 100 matches, so `hasMoreBatches` is immediately false and **pagination stops after the first 100 facilities**.

Measured against production data (465 facilities, first batch = offset 0–99):

| City | Visible to a city search | Actually in DB | Missed |
|---|---|---|---|
| Chuo Ward | 5 | 21 | 16 |
| Minato City | 7 | 20 | 13 |
| Shibuya | 6 | 14 | 8 |
| **Meguro** | **0** | **11** | **11** |
| **Kagoshima** | **0** | **8** | **8** |
| Setagaya | 1 | 10 | 9 |
| Shinjuku | 3 | 10 | 7 |
| Tokushima | 1 | 8 | 7 |

**100 of 465 facilities (21.5%) are reachable when a city filter is active.** Cities absent from the first batch return an empty state that reads as "we have nothing here" — for Meguro and Kagoshima this is simply false. Users are being told there is no English-speaking care in their city when there is.

Note this also makes the location dropdown actively misleading: `FiltersPanel.createLocationDropdownOptions` builds its list (with per-city counts) from `locationsStore.fetchLocations()`, which fetches with `limit: 1000` and therefore sees **all 465**. So the dropdown offers "Meguro (11)" and selecting it yields zero results.

**Fix:** push city filtering to the server. This bug is a direct symptom of client-side filtering — it disappears entirely once the API does the work.

### 4.2 Latency: ~10 round trips and the whole DB on every search

`search()` executes, in order:

| Step | Requests | Serial? | Measured time | Bytes |
|---|---|---|---|---|
| `mapPointsQuery` (`limit: 1000`) | 1 | yes | 0.99 s | 85 KB |
| `fetchAllFacilities` — offsets 0/100/200/300/400, full payload | 5 | **yes, `while` loop** | **3.94 s** | 432 KB |
| `fetchAllProfessionals` — ID batches | ~4 | no (`Promise.all`) | ~1.16 s | ~55 KB × 4 |
| **Critical path** | **~10** | | **≈ 5.9 s** | **≈ 570 KB** |

Measured against `api.findadoc.jp` on a fast connection; real users on mobile networks in Japan will be materially worse. This runs **after** the JS bundle boots, and (per §3.2) **after** the 3 s onboarding timer.

Compounding factors:

- **The city filter does not reduce the fetch.** The server is asked for everything regardless; filtering happens after transfer.
- **`mapPointsQuery` is redundant.** It requests `id, nameEn, nameJa, mapLatitude, mapLongitude` for all facilities — a strict subset of the fields `fetchAllFacilities` fetches moments later for the same facilities. It is a duplicate download of data already inbound, sitting on the critical path *before* the main fetch, not in parallel with it.
- **Every request pays an auth check.** `graphQLClientRequestWithRetry` calls `useAuthStore().getAuthBearerToken()` unconditionally, which `await`s `waitForAuth0ToLoad()` (10 s timeout) even for anonymous public search that needs no token. All ~10 requests serialise behind Auth0 initialisation.
- **No caching, dedup, or abort.** Re-running a search refetches everything. Changing a filter mid-flight does not cancel the in-flight request, so a fast filter-clicker can have several full-database fetches racing, and results are applied in completion order — a stale response can overwrite a newer one.

**The API already supports what the client is emulating.** `HealthcareProfessionalSearchFilters` accepts `specialties`, `spokenLanguages`, `ids`, `limit`, `offset`, and `orderBy`; `facilitiesTotalCount`/`healthcareProfessionalsTotalCount` exist for real pagination; `utils/graphqlHelpers.ts` already implements `fetchFacilitiesWithCount`/`fetchHealthcareProfessionalsWithCount` **which the search path does not use**. The moderation panel uses them; the public search does not.

**Fix direction:** one server-filtered, properly paginated query returning page 1 (25 results) plus a total count. Target: **1 request, <300 ms, ~30 KB** to first paint, versus ~10 requests / 5.9 s / 570 KB today. Map points load lazily alongside, not ahead. This is mostly deletion — `fetchAllFacilities`, `fetchAllProfessionals`, the client-side join, and the client-side city filter all go away.

Gap to confirm with the server team: `FacilitySearchFilters` currently exposes **no prefecture/city field** (only a nested `contact` object). Server-side city filtering likely needs a small API addition — the single highest-leverage backend change available.

### 4.3 Client-side pagination fetches everything to show 25

`paginatedResults` slices an already-fully-materialised `searchResultsList`, and `loadMore()` only increments a counter. So "Load More" is instant, but it was paid for by downloading all 465 facilities and ~400 professionals up front. The perceived-speed win of infinite scroll is being funded by the worst possible initial load.

---

## 5. Rendering and load performance

### 5.1 `ssr: false` — empty shell, everything on the client

`nuxt.config.ts:24`. Every route serves an identical **3,644-byte** document with an empty `<body>`; all content requires JS boot **plus** a cross-origin GraphQL waterfall. Verified live: `/`, `/about`, `/submit`, `/terms`, `/privacypolicy`, `/login` all return 200 with the same shell; `/u/test` and unknown paths return **404** with that shell.

Beyond crawlers, this is the root cause of perceived slowness: **first contentful paint cannot happen until the bundle parses and the network settles.**

### 5.2 Bundle size

| Measure | Value |
|---|---|
| `.output/public/_nuxt` total | **12 MB** |
| Total JS across chunks | **2.52 MB** |
| Largest single chunk | **576 KB** |
| Next three chunks | 320 KB, 320 KB, 192 KB |

Heavy client-only dependencies loaded on the critical path: `vue3-google-map` + Google Maps SDK, `@auth0/auth0-vue` (loaded for anonymous visitors who never log in), `hammerjs`, `@sentry/vue`, `vue-toastification`. Auth0 and the maps SDK are the obvious candidates for deferral — neither is needed for a first paint of search results.

### 5.3 SSR blockers (enumerated)

Enabling SSR is tractable. All six plugins are already `.client.ts`, so nothing auth-related runs server-side. Concrete blockers:

| # | Location | Problem | Fix |
|---|---|---|---|
| 1 | `components/BottomSheet.vue:148` | `window.addEventListener('keyup', …)` at **setup top level** — throws on the server | move into `onMounted` |
| 2 | `stores/searchResultsStore.ts:19` | `const toast = useToast()` at **module scope** | move into setup/action scope |
| 3 | `components/MapContainer.vue:113,147,194` | `window.btoa`, `document.createElement`, `window.google` | `<ClientOnly>` |
| 4 | `components/ThemeManager.vue` | `localStorage` in `toggleLightDarkMode`/`setTheme`; reads in `onMounted` (safe) | cookie-based theme, or accept FOUC |
| 5 | `stores/onboardingStore.ts` | `localStorage` at module init (guarded, but causes hydration mismatch) | cookie |
| 6 | `layouts/*.vue` | **all three layouts render `<NuxtPage />` instead of `<slot />`** | see §5.4 |
| 7 | 9 further `useToast()` call sites | in setup scope — likely fine, verify | verify |

Files touching `window`/`document`/`localStorage`/`navigator`: 20 (full list available via grep; most are inside handlers or `onMounted` and are safe).

### 5.4 All three layouts use `<NuxtPage />` instead of `<slot />`

`layouts/default.vue:16`, `layouts/my-page.vue:8`, `layouts/onboarding.vue:9`.

`app.vue` already renders `<NuxtLayout><NuxtPage /></NuxtLayout>`, which passes the page to the layout **as its default slot**. Because each layout renders its own `<NuxtPage />` and never renders `<slot />`, the page passed in from `app.vue` is discarded and a second router-view is instantiated inside the layout.

It renders correctly today, which is why it has gone unnoticed, but it is non-idiomatic and it breaks layout transitions and page-level `key`/transition control — and it is a likely source of double-mounting and hydration mismatch the moment SSR is switched on. Should be fixed *before* SSR, as an independent, low-risk change.

---

## 6. Data model

| Concept | Source | Notes |
|---|---|---|
| Facility | `facilities` / `facilitiesTotalCount` | name En/Ja, lat/lng, `healthcareProfessionalIds`, `contact { address { cityEn/Ja, prefectureEn/Ja, postalCode, … }, phone, email, website, googleMapsUrl }` |
| Healthcare professional | `healthcareProfessionals` / `…TotalCount` | localised `names`, `specialties`, `spokenLanguages`, `degrees`, `acceptedInsurance`, `additionalInfoForPatients`, `facilityIds` |
| Specialty | `Specialty` enum (~31) + `SpecialtyCategory` (12) | client-side display map in `stores/specialtiesStore.ts` |
| Language | `Locale` enum (40+ server-side; 10 shipped in UI) | `i18n/index.ts` |
| Location | **derived** — no location entity | cities come from paging facilities in `stores/locationsStore.ts` |

Production totals (verified 2026-09-01): **465 facilities, 400 healthcare professionals.**

Two structural constraints worth flagging:

1. **Facility↔professional is a two-way ID array with no server-side join.** The client fetches both sides and joins in memory (§4.2). Any server-side `professionals` field on `Facility` would collapse the waterfall.
2. **No location filter on `FacilitySearchFilters`.** Cities are derived, not first-class, and city names are **not normalised** — production contains both `"Chuo Ward"` (21) and `"Chuo City"` (9) for the same place, which will also produce two competing entries in the location dropdown.

### Crawler surface (brief — already ticketed)

`/robots.txt`, `/sitemap.xml`, `/llms.txt` all **404**. No canonical, no hreflang, no JSON-LD. `titleTemplate: 'Health Services in Japan'` (`nuxt.config.ts:36`) has no `%s`, so it **replaces** the title on every page — no page carries the brand name. `twitter:card` is `summary`. `i18n.strategy: 'no_prefix'` collapses 10 locales onto one URL. `pages/_headers` is in the wrong directory (Netlify reads `_headers` from the publish root only) and is inert. These are consistent with the existing issues; no action proposed here.

---

## 7. Design system and brand

The token layer is sound; **typography and brand definition are absent**. This is the mechanical cause of the "unpolished" read, and it is fixable without redesigning a single screen.

### 7.1 The brand typeface is loaded but never applied

`assets/css/tailwind.css:33-41` declares two `@font-face` families, `notosans` and `notosans-bold`. Neither is ever used:

- `--font-sans` is **never defined** in the `@theme` block.
- The strings `notosans` / `notosans-bold` appear **nowhere else in the repo** — no `font-family` on `body`, no utility class, no component reference.

So every `font-sans` class across the app — and `font-sans` is applied on nearly every text container — resolves to **Tailwind's default system stack**. The site renders in San Francisco on macOS, Segoe on Windows, Roboto on Android. There is no brand typeface in production, and typography is inconsistent across every visitor's machine. Japanese text falls through to a *second*, different system fallback, so `ja` and `en` do not visually match.

`assets/fonts/` holds **18 `.ttf` files totalling 8.3 MB** (~550 KB each). Only two are declared, and because browsers fetch `@font-face` files only when matched to rendered text, in practice **none are downloaded**. It is 8.3 MB of dead repo weight backing a typeface the site never shows.

Fixes, in order: define `--font-sans` (and a Japanese-capable stack — Noto Sans alone has no CJK coverage; `Noto Sans JP` is a separate family), convert to subsetted `woff2` (typically 40–60% smaller than `.ttf`), keep only the 2–3 weights actually used, add `font-display: swap`, preload the primary weight, delete the other 15 files.

### 7.2 Eleven theme variants, no canonical brand

`assets/css/tailwind.css` defines: `theme-coral`, `theme-violet`, `theme-neon`, `theme-ocean`, `theme-original-dark`, `theme-coral-dark`, `theme-violet-dark`, `theme-accessible-high-contrast(-dark)`, `theme-accessible-red-green(-dark)` — plus the `:root` default.

`components/ThemeManager.vue:134-146` removes ten of these by name when switching. **`theme-neon` and `theme-ocean` are not in that list** — they are orphaned definitions that can never be cleanly deselected, and are unreachable from the picker.

Maintaining 11 colourways means none of them is refined, and there is no single answer to "what colour is Find a Doc." A brand needs **one** default palette that is genuinely designed, plus the two accessibility themes (high-contrast, red-green), which have a real justification. Coral / violet / neon / ocean are decoration with a maintenance cost.

### 7.3 No type scale

Base styles set only `h1..h4` to `text-3xl/2xl/xl/lg`. Everything else is ad hoc. Measured usage across components/pages/layouts:

| class | uses | | class | uses |
|---|---|---|---|---|
| `text-sm` | **73** | | `text-3xl` | 20 |
| `text-lg` | 42 | | `text-base` | **7** |
| `text-2xl` | 41 | | `text-4xl` | 7 |
| `text-xl` | 22 | | `text-5xl` | 2 |
| `text-xs` | 20 | | `text-7xl` | 1 |

Ten sizes in use, with **`text-sm` as the de facto body size and `text-base` almost unused** — body copy is systematically one step too small, which reads as cramped. There is no line-height, letter-spacing, or measure guidance at all. A defined scale (and using it) is most of the perceived-polish gap.

### 7.4 What is already healthy

Worth preserving rather than rewriting:

- **Semantic tokens are well designed** — `primary`, `secondary`, `accent`, `primary-bg`, `secondary-bg`, `accent-bg`, `primary-text`, `-muted`, `-inverted`, plus `success`/`error`/`warning`/`info`, all as `rgb(var(--…))` so opacity modifiers work.
- **Token discipline is genuinely good** — only **5** hardcoded hex values across all components, pages and layouts. Components are not bypassing the system.
- Arbitrary Tailwind values are rare and mostly legitimate layout constants (`[500px]`, `[70svh]`).

The system is not being abused; it is under-specified. The brand doc should fill in typography, spacing, elevation, radius, motion and component patterns on top of the existing colour tokens — not replace them.

### 7.5 Scope of a brand/style doc

Recommended contents, roughly in build order: brand foundations (what Find a Doc sounds and looks like, and why — trust and clarity for someone who is unwell and cannot read the local language); one canonical colour palette with documented contrast ratios; the type scale with a Japanese-capable stack; spacing/radius/elevation/motion tokens; core component patterns (button, input, select, card, sheet, dialog, empty state, loading state); bilingual/multilingual rules (line-breaking, mixed EN/JA typography, text expansion in de/pt/ru); and accessibility baselines. Storybook is already installed (`@nuxtjs/storybook`, with `.storybook/` configured) and is the natural home for the component half.

---

## 8. What I'd fix first (input to Phase 2)

Ordered by user-visible impact per unit of effort. Detailed backlog with effort/risk/dependencies comes in Phase 2.

0. **Kill onboarding; make `/` a real homepage** (§3.1–3.2) — deletes a splash + 3 s timer, gives the domain's most valuable URL a job, and removes the maps SDK and Auth0 from the first-paint path.
1. **City-filter pagination bug** (§4.1) — users are told care doesn't exist in their city. Correctness, not polish.
2. **Collapse the search waterfall to one server-filtered query** (§4.2) — ~5.9 s → target <0.3 s. Mostly deletion; needs a server-side city filter.
3. **Kill `/moderation` and `/u/[username]`** (§2.2, §2.3) — removes a duplicated maintenance surface and a page that lies about saving.
4. **Replace `alert()` with toasts; cut retry/backoff** (§3.4) — a failed search currently blocks for ~15 s.
5. **Layouts: `<NuxtPage />` → `<slot />`** (§5.4) — prerequisite for SSR, low risk on its own.
6. **URL state for search** (§3.5) — restores Back/bookmark/share. Also the foundation the SEO issues need.
7. **SSR/prerendering** (§5.1, §5.3) — biggest first-paint win, but sequence it after items 5 and 6.
8. **Bundle: defer Auth0 + maps SDK** (§5.2).
9. **Brand + style docs** (§7) — typeface, one palette, type scale. Should land *with* the homepage rebuild (item 0), since that page is the first surface of the new brand; doing it after means building the homepage twice.
10. **UI/design refresh across remaining screens** — last. Restyling the current flow would preserve its problems.

---

## Appendix — reproduction

```bash
# Route/status surface
for p in "" about robots.txt sitemap.xml llms.txt submit terms privacypolicy login u/test; do
  printf "%-22s " "/$p"; curl -sL -o /dev/null -w "status:%{http_code} bytes:%{size_download}\n" "https://www.findadoc.jp/$p"
done

# Duplicate moderation tree (expect zero diff lines for all five)
for p in create-facility/index create-healthcare-professional/index \
         "edit-facility/[id]" "edit-healthcare-professional/[id]" "edit-submission/[id]"; do
  echo "$p: $(diff "pages/moderation/$p.vue" "pages/my-page/$p.vue" | wc -l) diff lines"
done

# Search waterfall timing (5 sequential facility batches)
for o in 0 100 200 300 400; do
  curl -s -m 60 -o /dev/null -w "offset=$o time:%{time_total}s bytes:%{size_download}\n" \
    https://api.findadoc.jp -H 'Content-Type: application/json' \
    -d "{\"query\":\"query(\$f:FacilitySearchFilters!){facilities(filters:\$f){id nameEn healthcareProfessionalIds contact{address{cityEn prefectureEn}}}}\",\"variables\":{\"f\":{\"limit\":100,\"offset\":$o}}}"
done

# No URL state in search (expect no matches)
grep -rn "useRoute\|useRouter" components/MainContentContainer.vue components/SearchBar.vue \
  components/FiltersPanel.vue components/SearchResultsList.vue \
  components/SearchResultsListItem.vue components/SearchResultDetails.vue
```
