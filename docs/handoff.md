# Handoff — findadoc.jp refresh

**Written:** 2026-09-02
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
| **Footer / header / navbars** | Flagged as needing more work than #1815 gave them. Its own pass. |
| **`pages/terms.vue`** | 35 hardcoded strings, zero i18n, and §1 and §2 share word-for-word identical body text. Needs real legal copy, not just extraction. |
| **Theme consolidation** | Nine variants remain. Collapse to light/dark/auto, retire the two accessibility themes now the base palette passes AA, wire up `prefers-color-scheme` (unsupported anywhere today). Needs a migration path for anyone with a stored theme. Detail in audit §7.2. |
| **`titleTemplate`** | `'Health Services in Japan'` with no `%s` replaces the title outright, so every page shares one title and none carry the brand. Now more visible since pages actually prerender. Part of the SEO tickets. |
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
