# Handoff — findadoc.jp refresh

**Written:** 2026-09-02 · **Updated:** 2026-09-03
**Companions:** [`refresh-audit.md`](./refresh-audit.md) (findings, §n references below) · [`refresh-plan.md`](./refresh-plan.md) (original backlog)

Start here. This is the state of the refresh and the next piece of work, which spans two repositories.

---

## 1. Where things stand

Merged today, in order:

| PR | What |
|---|---|
| #1802, #1804 | Hybrid rendering enabled (`ssr: true`, prerendered public routes). Not ours. |
| #1807 | City-filter pagination bug — searches were reaching only 100 of 465 facilities |
| #1808 | AA-compliant palette, brand typeface, Japanese font |
| #1809 | Layouts render `<slot />`, so `app.vue`'s children actually mount |
| #1812 | Deleted the duplicated `/moderation` tree, `WelcomeSection`, orphaned themes |
| #1813 | Logo `viewBox` correction and wordmark alignment |
| #1814 | **Unbroke the build.** `nuxi generate` had been failing on every route since #1809 |

**Open: #1815** — the homepage rebuild. `/` becomes a content page, the map app moves to `/search`, onboarding is deleted. Prerenders 3,310 characters of text and 17 internal links where it previously emitted zero.

### Read this before merging #1815

- **The translations have had no native review.** 29 keys across nine languages, written by Claude during the session. The Japanese matters most. One factual error was already caught in draft — an unsupported `認定` claim on the disclosure page — which is the reason to get a second reader rather than a reason to trust the rest.
- **The directory counts are hardcoded** in `utils/homeDirectory.ts`, measured against production on 2026-09-02: 465 clinics, 400 professionals, 14 languages, and per-prefecture figures. Re-measure as the directory grows. The reproduction query is in §Appendix of the audit.

---

## 1b. 2026-09-03 — UI restyle, list-first search, theme consolidation

Uncommitted on `feat/homepage` at the time of writing; one working tree, intended as a few PRs
(foundations + chrome, content pages, search). Companion: [`brand.md`](./brand.md).

### What changed

**Foundations** (`assets/css/tailwind.css`, `nuxt.config.ts`)
- Theme consolidation done: light / dark / **auto** (follows `prefers-color-scheme`) and nothing
  else. Coral, violet, ocean, neon and both accessibility colourways are gone; `prefers-contrast:
  more` and `prefers-reduced-motion` are honoured globally instead. A dark palette that actually
  passes AA (the old one used a near-white `bg-accent`, so every border glowed).
- An inline `<head>` script applies the stored scheme before first paint; `useColorScheme()`
  keeps it in step afterwards and migrates the old `theme`/`isDarkMode` keys (dark survives,
  everything else becomes auto). `ThemeManager.vue` is a three-way control; `ThemeOption.vue`
  and `Toggle.vue` are deleted.
- Component primitives in `@layer components` (`.btn-*`, `.card`, `.chip`, `.field*`,
  `.page-section`, `.section-heading`, `.prose-legal`, …) and a global `:focus-visible` ring.
  New token `border-strong` for form-control edges (3:1). `docs/brand.md` documents all of it
  with contrast ratios.
- Fonts: `assets/fonts/` (8.3 MB of TTFs) deleted; Noto Sans now comes from `@fontsource/noto-sans`
  as subsetted woff2 like Noto Sans JP already did. `titleTemplate` finally has a `%s`, and every
  public page sets a title.
- Character illustrations moved to `public/illustrations/` (svgo'd, ~40% smaller) and are
  `<img>`s. Inlining `characters-together` alone put 130 KB into every prerendered page.

**Chrome** — `TopNav` (sticky, Search link added, no global SearchBar), `Footer` (four columns,
theme control in the legal row), `HamburgerMenu` (proper dialog: backdrop, focus, Escape, scroll
lock), `LocaleSelector`, error layout with nav and footer.

**Pages** — `/about`, `/submit`, `/terms`, `/privacypolicy`, `/npo`, `/login` rebuilt on the
primitives. `/submit` no longer shows a validation error before anyone has typed; `SubmissionForm`
has real labels and `aria-invalid`/`aria-describedby`. `/terms` §2 no longer duplicates §1's
paragraph (replacement sentence is neutral, not legal advice — the page still needs real copy and
extraction to i18n).

**Search** — list-first at `/search` on the default layout. Filter bar (specialty, language,
prefecture; applies on change, no Search button), result cards, a details panel (drawer in
landscape, full screen in portrait) and an opt-in map. Deleted: `SearchBar`, `FiltersPanel`,
`SearchResultsList(Item)`, `SlidingRightPanel`, `LeftNavbar`, `BottomSheet*`, `bottomSheetStore`,
`layouts/search.vue`, and the `hammerjs` dependency.

- **URL state (S3):** `?specialty=&language=&prefecture=&city=&facility=`. Cards are links, so a
  facility opens with `push` and **Back closes it**; shared links open the panel directly.
- **Store (`searchResultsStore`):** loads the directory once (facilities page 1 + count, then the
  remaining pages in parallel, alongside one professionals request) and filters **client-side**
  via `utils/searchDirectory.ts`. Every later filter change is instant and request-free.
  Requests pass `skipAuth` so anonymous search no longer waits on Auth0. Failure is an inline
  error state with retry, not `alert()`.
- Critical path on a cold load is now ~2 sequential requests (was ~10, five of them serial).
  The full-database download itself still stands until the backend work in §2a lands; when it
  does, swap `loadDirectory()` for a filtered query and leave the UI alone.

### Verified

`yarn lint` clean; vitest 80/80 (new: `searchDirectory.spec.ts`, `useScrollLock.spec.ts`, and a
rewritten `searchResultsStore.spec.ts` that keeps the #1807 pagination guard with a
server-style 100-row cap);
snapshots regenerated; `nuxi generate` prerenders 29 routes; **Playwright 58/58 against the
production build** (`tests/e2e/search.spec.ts` mocks GraphQL with `page.route`, so it is
deterministic in CI too). Every prerendered route hydrates with zero warnings in light and dark.

Measured on the `nuxi generate` output:

| Page | HTML raw | HTML gzip |
|---|---|---|
| `/` | 40 KB (was 171 KB) | 9.4 KB |
| `/about` | 141 KB | 12.7 KB |
| `/submit` | 35 KB | 8.1 KB |
| `/search` | 3.8 KB (SPA shell) | 1.6 KB |

The homepage's generated HTML requests neither Google Maps nor Auth0. The Auth0 SDK is still initialised at runtime by `vue-auth0-plugin.client.ts` on every route — see the bundle-splitting item below; what `skipAuth` removed is the token wait in front of public GraphQL requests, not the SDK itself. `/about` is large raw because 44 members
each inline two icon SVGs, but the repetition gzips away — not worth a sprite.

`tests/e2e/search.spec.ts` originally asserted the map by Google's own `region` accessible name.
That fetches the Maps SDK over the network with no API key in CI, and failed two runs in three.
It now asserts our own `search-map-panel` plus a request spy on `maps.googleapis.com`, which is
deterministic (3/3) and a better assertion: the SDK must not be fetched until the map is opened.

One defect found while reviewing and fixed here: the details panel and the hamburger each set
`document.documentElement.style.overflow` directly, so closing either released the lock while
the other was still open, and unmounting with one open (leaving the route) stranded the document
unscrollable. Both now share `composables/useScrollLock.ts`, which is reference-counted and
releases on scope dispose.

### Found by review, fixed here

A six-lens adversarial review over the change set raised 42 findings. The ones that survived
verification and were fixed:

| Severity | What |
|---|---|
| blocker | Modal scrims used `bg-primary-text/40`, which inverts to a **white wash** in dark mode. Now `bg-scrim/50`, a token that is dark in both themes. |
| blocker | The global focus ring was a primary outline, so it was **invisible on a `bg-primary` band** — including the homepage's main call to action. It now carries a surface-coloured halo. |
| should | Opening or closing a result **reset pagination and re-fitted the map**: `applyQuery` rebuilt the filter arrays on every query change, so `filters` always looked new. It now writes only what differs. |
| should | Language chips rendered the literal string `localeErrors.notFound`, a key that existed in no locale. Unnameable codes are now dropped, and the key was added. |
| should | The load-more label was three concatenated fragments, so the count landed in the wrong place in Japanese and Russian. Now one interpolated string. |
| should | `/search` had **no `h1`**; its first heading was a result card's `h3`. Added a screen-reader heading. |
| should | The sign-out icon declares no `fill`, so it painted black and vanished in dark mode. |
| should | `font-medium` was used in ten places with no 500 face loaded, so the weight did nothing. |
| should | Nav labels lost `whitespace-nowrap` while gaining a fourth item — German and Portuguese wrapped inside a fixed-height link. |
| should | The hamburger never returned focus to its trigger on close. |
| should | The profile dropdown claimed `role="menu"`/`menuitem` without the keyboard behaviour those roles promise. Now a labelled group. |
| should | Active nav items were 4.09:1; `prefers-contrast: more` dropped the on-primary button's label to 1.35:1. Both now clear AA in every contrast mode. |
| should | Header, page bands and footer used three different measures. All three now share `.page-container`. |
| should | Search cards and the details panel read `localeStore`, which only updates when someone touches the language picker. A visitor arriving on the `ja-JP` cookie got a Japanese UI full of English clinic and doctor names. They now key off vue-i18n via `utils/activeLocale.ts`. |
| should | A request the API accepts and never answers never settled, so the page sat on skeletons forever and the retry UI was unreachable. `graphQLClientRequestWithRetry` gained a real per-attempt deadline (`abortAfterMs`), which anonymous search sets to 10 s. |
| should | Footer and drawer links were 32px and 20px targets, under the 44px minimum. |
| should | `/about` had two `nav` landmarks both named "Menu". |
| should | Three different `h1` scales existed where the brand doc claimed one. Now two named primitives, `.page-title` and `.page-title-sm`, applied everywhere. |
| should | The language select re-implemented `.field` with the wrong border token. |
| should | `theme-color` metas keyed off `prefers-color-scheme` alone, so an explicit choice that disagreed with the OS left the mobile browser chrome the wrong colour. |
| nit | `bg-opacity-40` does not exist in Tailwind v4, so the confirmation dialog and modal overlays rendered as **opaque coral**. Pre-existing; fixed with the new scrim token. |

Of 42 raw findings, 25 survived an adversarial verify pass. Those not fixed are recorded below.

**Knowingly left:** `fetchAllPages` assumes a fixed page stride — it derives it from the first
page's row count, so a short page in the middle of a result set would leave a gap. That cannot
happen against a stable dataset, and the whole loader is meant to be replaced by a server-side
filter first (§2a). Parallel fan-out *is* capped, at six requests in flight. Two Tagalog strings in `searchResultsList` are actually Thai —
verified identical at `HEAD`, so pre-existing, and not something to guess at. Several copy nits
in the new Japanese strings are worth a native reader's eye rather than mine.

### Search broke against the real API — what happened, and the guard

Shipped and caught in the browser: `/search` loaded nothing and the console showed
`Validation Failed` on `healthcareProfessionals`.

**Cause.** The rewrite asked for the professionals table in one page (`limit: 1000`). The
server *validates* that limit up to 1000, but the endpoint fails somewhere between 300 and 400
rows — measured against `api.findadoc.jp`, which holds exactly 400 professionals, so the
request could never succeed. Worse, it fails as **HTTP 200 with a `Validation Failed` body**
rather than a limit error, so there is nothing to detect and back off from.

**Fix.** 100 rows a page for both tables — the size the previous implementation used in
production, verified here at every offset across the whole directory. Page requests are also
now capped at six in flight, since the page count grows with the directory and this endpoint
fails under load rather than degrading.

**Why the tests missed it.** `tests/e2e/search.spec.ts` mocks the API, and the mock answered
whatever it was asked. A permissive mock cannot fail on a request the real server rejects. It
now refuses a page over 100 exactly as production does, so the suite breaks if the client ever
asks for more than the API can serve. Two unit guards were added alongside it.

Verified by reintroducing the bug: 3 unit tests and 11 e2e tests fail with it, all pass without.
Also verified by loading `/search` against the live production API — 9 requests, 362 results,
no console errors, filters instant.

**Rule of thumb this leaves behind:** a validator's ceiling describes what the input parser
accepts, not what the query can serve. Measure the endpoint.

### Second round of browser feedback, fixed

- **The map never rendered.** `watch(..., { immediate: true })` ran during setup and called a
  `const` arrow function declared further down the file, so it threw *Cannot access
  'recenterMap' before initialization* and the whole component died. Watchers now sit at the
  end of `MapContainer.client.vue`, below every function they call. Arrow functions in `const`
  bindings do not hoist; an immediate watcher above them is always a trap.
- **"Open in Google Maps" opened nothing** for some clinics. 4 of 100 rows sampled against
  production store a bare `google.com/maps?sca_esv=…` with tracking parameters and no place.
  Every facility has exact coordinates, so `facilityMapsUrl()` keeps the stored `/place/` URL
  where there is one and otherwise builds a name search anchored at the clinic's own position.
- **`/about` section order** is now Contributors → NPO Board → Co-Founders, with the jump list
  and the alternating band backgrounds following it, and one column count across all three
  member grids.
- **The empty-state illustration** was the pre-refresh teal (`#0EB0C0`) on a hardcoded
  near-white, so it was off-brand in light and wrong in dark. Its shapes are now `currentColor`
  over the accent token, coloured from the palette in both themes.
- **Footer links to other sites already open in a new tab.** I swept every public page plus the
  mobile drawer for external anchors without `target="_blank"` and found none, so there is
  nothing to change — worth a re-check against a fresh build if it still looks wrong.

### Third round of browser feedback, fixed

**Contact links.** Volunteer-entered free text was going straight into `href`, so several
controls did nothing. All contact values now pass through normalisers in
`utils/searchDirectory.ts`, checked against all 465 production rows:

| Field | Problem | Counts |
|---|---|---|
| website | 5 rows store a bare host (`www.megurokhome.com`). No scheme means the browser reads it as a **relative path**, so the button navigated inside our own site. | 5 of 465 broken, 39 empty |
| website scheme | `https://` was the obvious prefix, but `www.suwa-pediatrics.com` has no working certificate. `http://` reaches 5 of 5, and the four TLS-capable hosts redirect themselves. | measured per domain |
| phone | One row is `+81 045-641-6961` — country code plus the domestic trunk `0`, which never dials. Display and dial values are now separate. | 1 of 465 |
| maps | A valid `maps.app.goo.gl` short link was discarded, and one row stores the literal string `google.maps`, which as an href is the same relative-path trap. | 16 of 465 lack `/place/` |
| email | Only `none` and `email@email.com` occur as placeholders — the existing rule was already correct. | 4 of 465 contactable |

**The heart icon stays dropped.** It is not actually gone: the site logo mark *is* a heart inside
the magnifying glass, on every page, and `heart-icon.svg` heads the submission success card.
Re-adding `heart-plus.svg` to a hero would break the rule in brand.md §1 that illustrations
appear at most once per page as an accent — `/`, `/about` and `/submit` each already spend that
budget on a mascot. It also carries an off-palette coral gradient. Left orphaned, alongside
`heart-circle.svg` and `heart-circle-logo.svg` (325 KB each) — worth a deletion pass someday.

**The logo wordmark was misaligned, and the first measurement missed it.** Checking the two
lines' layout boxes gave a 0.000 px delta, which looked like proof and was not: a box is where a
glyph's advance starts, not where its ink starts. Measuring the actual side bearings via canvas
`TextMetrics` showed "F" at 16px carries **+1.49 px** and "J" at 12px carries **-0.91 px** — the
J's hook overhangs its origin — so the J printed **2.4 px left** of the F. The second line now
carries `translate-x-[2.4px]`; re-measured ink delta is 0.000 px. Both strings are the Latin
brand name in every locale, so the glyphs and the offset are stable. The vertical 4.5% nudge is
unchanged and correct.

Lesson worth keeping: to check optical alignment, measure ink (`actualBoundingBoxLeft`), never
`getBoundingClientRect()`. Flush boxes and flush ink are different things whenever the two lines
differ in size or start with different letters.

**Chrome copy.** `common.siteName` gained its comma in all ten locales (it read "Find a Doc
Japan" everywhere). The drawer's About and Add-a-Doctor labels now come from the same keys as
the top nav — the duplicates had *diverging* translations in Chinese, Portuguese and Vietnamese
— and the dead `hamburgerMenu.about` / `.submit` keys are deleted.

**Legacy assets on public pages.** The drawer's GitHub mark carried a hardcoded `#1B1F23`,
1.10:1 on the dark ground and effectively invisible; it now follows the text colour. The favicon
was still the pre-refresh teal `#0EB0C0` and declared `image/x-icon` for an SVG. The loading
spinner carried four dead palette colours and is now `currentColor`.

**"Contribute" is now one destination.** Decided 2026-09-04: it always points at
`docs.findadoc.jp`, the entry point for every kind of contribution. `/about` used to send it
straight to the repository, so the same word meant two different places depending on where you
read it. The octocat went with it (it promised GitHub), the key was renamed `about.involveGit`
→ `about.involveContribute` so it stops claiming to be repo-specific, and the Chinese value
dropped "代码" — it no longer means "contribute *code*". GitHub is still linked under its own
name in the footer and the drawer.

**Contributor ordering, for the record.** On `main` the list was `shuffleArray(data.members)`,
re-randomised on every render, which was harmless while `/about` was client-only. Now that the
page is prerendered, shuffling on both sides gave the server one order and the client another,
and hydration paired each name with the previous member's avatar and links. The shuffle now runs
once and its index order is carried in the payload, so **the order is random per build and
stable within it**. Verified: identical across loads, 0 name/avatar mismatches, no hydration
warnings.

**Decided 2026-09-04: keep the per-build shuffle.** Per-visit randomness would mean shuffling in
`onMounted`, which costs a visible reshuffle after load and still shows crawlers one fixed order
— not worth it at this traffic level. Do not "restore" the render-time shuffle: on a prerendered
page it is the hydration bug described above, not a feature.

**The feedback form is "Give Feedback" everywhere.** Decided 2026-09-04. It previously appeared
as "Contact" in the drawer, "Give Feedback" in the footer and on `/about`, and "Click here" on
`/npo`. Two of the six links were inline prose rather than labels — `/terms` read "please
contact us *here*", which cannot simply take a noun phrase, so that sentence was restructured to
the colon-then-label pattern `/npo` already used. The dead `hamburgerMenu.contact` and
`footer.clickHere` keys were removed from all ten locales.

The one place still saying something else is `pages/my-page.vue`, the unauthorised-moderator
state: its sentence is assembled from `login.unauthorizedline1/2/3` across ten locales and is
about requesting moderator access, not feedback. Restructuring it means retranslating three
strings in nine languages, so it was left deliberately.

**Stat tiles.** `/` centred its tiles while `/about` left-aligned the same content; both are now
left-aligned, which also reads better when a label wraps to two lines as it does on `/about`.
Deliberately **no icons** — a building, a person and a globe would carry nothing the words do
not, and brand.md §1 rules out decoration that competes with content. If these ever need more
visual weight, the move is typographic (number large, label muted beneath), which costs a
value/label key split per stat in ten locales because Japanese puts the counter suffix after the
number.

"Volunteer and Community Driven" was removed from `/about`'s impact row (decided 2026-09-04):
it is a value, not a measure of what the product delivers, and a tile with no number read as
broken beside three counts. `about.impactVolunteer` is deleted from all ten locales. The two
pages now render the identical three cards from the identical three keys in a `landscape:grid-cols-3`
grid, so `/` and `/about` cannot drift apart again.

### Carry forward

- New i18n keys (`search.*`, `themeManager.*`, `footer.*Heading`, `topNav.search`,
  `common.close`) have English and Japanese only; the other eight locales carry English
  placeholders from `checkLocaleKeys`. Same caveat as #1815: no native review.
- The city filter has no UI (prefecture only) for the normalisation reason in §2a; the `city`
  query param still works for deep links.
- `Loader.vue`, `locationsStore` and `loadingStore` survive only for the moderation panel.
- **Pre-existing, not introduced here:** 11 keys referenced in code have never existed in
  `en.json` — `authErrors.*` (3), `healthcareProfessionalsErrors.*` (3),
  `moderationSubmissionErrors.*` (2) and `modSubmissionForm.errorMessage*` (3). A twelfth,
  `localeErrors.notFound`, was in that group and **was added in this pass**, because the search
  cards rendered it as literal text. They are all `useTranslation()` fallbacks in stores and the
  moderation panel, so the raw key string is what surfaces. Verified absent at HEAD too; the
  locale prune in this pass removed none of them. All ten locale files are otherwise aligned
  at 414 keys, so the `lint:locales` CI gate passes.

## 2. Next: make search fast (audit §4.2)

This is the largest remaining item and **it needs backend and frontend changes, in that order.** The frontend work is mostly deletion, but it cannot start until the API can filter by location.

### The problem, measured

A single search runs **~10 GraphQL round trips, five of them strictly sequential**, and transfers the entire database:

| Step | Requests | Serial? | Time | Bytes |
|---|---|---|---|---|
| `mapPointsQuery` (`limit: 1000`) | 1 | yes | 0.99 s | 85 KB |
| `fetchAllFacilities` — offsets 0/100/200/300/400 | 5 | **yes** | **3.94 s** | 432 KB |
| `fetchAllProfessionals` — ID batches | ~4 | no | ~1.16 s | ~220 KB |
| **Critical path** | **~10** | | **≈ 5.9 s** | **≈ 570 KB** |

Measured against `api.findadoc.jp` on a fast connection, after the JS bundle boots. This is now the slowest thing a user meets, and #1815 sharpens the contrast: the homepage paints in 352 ms and then hands them to this.

### 2a. Backend — `findadoc-server`

Schema lives at `src/typeDefs/schema.graphql`.

**1. A usable location filter on `FacilitySearchFilters`.**

There is none today. The input has `nameEn`, `nameJa`, `contact`, `healthcareProfessionalName`, `healthcareProfessionalIds`, `createdDate`, `updatedDate`, `orderBy`, `limit`, `offset` — and `contact` is `ContactInput`, a *mutation* input reused as a filter. It cannot express "facilities in Tokyo", verified against production:

```
Variable "$f" got invalid value { address: { prefectureEn: "Tokyo" } } at "f.contact";
Field "googleMapsUrl" of required type "String!" was not provided.
```

Every field is non-null, so a partial address filter is impossible. Add flat, optional fields instead:

```graphql
input FacilitySearchFilters {
  cityEn: String
  prefectureEn: String
  # ...existing fields
}
```

**2. Normalise city names.** Production holds both `"Chuo Ward"` (21 facilities) and `"Chuo City"` (9) for the same place. Until this is fixed, city cannot safely be a filter value or a URL slug — which is why #1815's homepage offers **prefectures** rather than cities. 33 prefectures are clean; 214 city values are not.

**3. Expose professionals on `Facility`.** Today `Facility` returns only `healthcareProfessionalIds: [ID!]!`, so the client fetches both sides and joins them in memory. A resolved field would collapse the second half of the waterfall:

```graphql
type Facility {
  healthcareProfessionals: [HealthcareProfessional!]!
  # ...existing fields
}
```

**4. Confirm `MAX_LIMIT`.** The API caps page size; the client currently works around it by looping. Whatever the cap, a single filtered page of 25 must be servable in one request.

### 2b. Frontend — `findadoc-web`

Blocked on 2a. Almost entirely deletion once it lands.

> **Evaluate TanStack Query as part of this work, not before and not after.**
>
> Today every filter change is free: the directory is loaded once and filtered in memory, so
> there is nothing to race. The moment filtering moves server-side, **every filter change is a
> request again — and the race condition comes back**. The audit recorded it in the original
> code: a fast filter-clicker had several fetches in flight at once, applied in completion
> order, so a stale response could overwrite a newer one. Loading once removed that
> structurally. Server-side filtering reintroduces it, and it has to be solved properly with
> request keying and cancellation, not a debounce.
>
> That, plus flicker-free pagination (`keepPreviousData`) and caching of filter combinations a
> user toggles between, is the shape of problem `@tanstack/vue-query` exists to solve. Adopting
> it *during* this rewrite is one migration; adopting it now, while there is a single query to
> manage, would be two.
>
> The swap is already contained: components touch 17 members of `searchResultsStore`, and only
> `loadDirectory` / `reloadDirectory` name the current strategy. Results, filters, status,
> pagination and the active facility are all data-source-agnostic and survive either choice.
>
> What would be a mistake is hand-rolling request cancellation, dedup and pagination caching
> again — that is precisely where the bug was last time.

All of it is in `stores/searchResultsStore.ts`:

- **Delete `fetchAllFacilities`** — the sequential batch loop.
- **Delete `fetchAllProfessionals`** and the in-memory join in `search()`.
- **Delete `filterFacilitiesByLocation`** — the client-side filter, and with it the whole class of bug #1807 fixed.
- **Delete `mapPointsQuery`** — it requests a strict subset of fields that `fetchAllFacilities` fetches moments later for the same facilities, and it sits *ahead* of the main fetch rather than beside it. Map points should load lazily with the map.
- **Use the existing helpers.** `utils/graphqlHelpers.ts` already has `fetchFacilitiesWithCount` and `fetchHealthcareProfessionalsWithCount` with proper pagination. The moderation panel uses them; the public search does not.
- **Skip auth for anonymous search.** `graphQLClientRequestWithRetry` calls `getAuthBearerToken()` on every request, which awaits `waitForAuth0ToLoad()` (10 s timeout) even for public search. All ~10 requests serialise behind Auth0 init.
- **Add request dedup and abort-on-filter-change.** A fast filter-clicker can have several full-database fetches racing, applied in completion order — a stale response can overwrite a newer one.

**Target:** 1 request, <300 ms, ~30 KB to first paint, versus ~10 / 5.9 s / 570 KB.

**Regression guard:** `tests/vitest/piniaTests/searchResultsStore.spec.ts` mocks the GraphQL layer and drives the real pagination loop. Keep it meaningful as the store is rewritten — it is what proves the #1807 class of bug cannot return.

---

## 3. Also outstanding

| | |
|---|---|
| **Footer / header / navbars** | Done 2026-09-03 (§1b). |
| **`pages/terms.vue`** | 35 hardcoded strings, zero i18n, and §1 and §2 share word-for-word identical body text. Needs real legal copy, not just extraction. |
| **Theme consolidation** | Done 2026-09-03 (§1b): light/dark/auto, migration from the stored `theme`/`isDarkMode` keys. |
| **`titleTemplate`** | Done 2026-09-03: `%s · Find a Doc, Japan`, every public page sets a title. |
| **Auth0 on every route** | `vue-auth0-plugin.client.ts` initialises globally, so the homepage loads it for anonymous visitors. Bundle-splitting work. |
| **`/u/[username]`** | Still live. #1812 proposed deleting it (the form reports success while persisting nothing); #1804 kept it and added `profileDirectEntry.spec.ts`. Someone should decide deliberately. |

---

## 4. Things worth knowing about this codebase

Learned the hard way today.

- **Only the Playwright workflow builds the site.** Vitest, Lint and Lint Locales all stayed green through a completely broken `nuxi generate`. A fast `nuxi generate` check on PRs would fail in seconds instead of behind the full e2e suite.
- **`i18n/checkLocaleKeys.js` writes, it does not just check.** Running it inserts missing keys into every locale as English placeholders. That is what CI expects — but do not mistake the result for translated copy.
- **Do not reformat locale files.** `json.dump` reindents all ~450 lines of ten files and buries the real change in 4,500 lines of churn. Edit the text surgically.
- **The production API rejects CORS from `localhost`.** Search returns nothing in local dev regardless of branch. Mock the API with Playwright's `page.route` to exercise result-dependent UI.
- **Prerendered pages are interactive before hydration.** A control in prerendered HTML can be clicked before Vue wires it. Forms need `action`/`method`/`name` so the pre-hydration path still works — see `components/home/HomeSearchEntry.vue`.
- **Nitro reports SSR failures only as `[500] Server Error`.** To get the real stack, add a temporary server plugin hooking `vue:error`, build, and read the console. That is how #1814 was diagnosed.
