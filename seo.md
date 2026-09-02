# SEO — Assessment and Improvement Plan

**Project:** findadoc-web organic search visibility
**Status:** Draft v0.1
**Last updated:** 2026-07-30

> **Change log**
> - v0.1 (2026-07-30): Initial assessment and phased plan. Findings in §3–§5 were verified against the live site and the production API on 2026-07-30; §6 is the proposed plan; §9 reconciles this plan with the online-booking spec and the MCP/AIEO rollout.

---

## 1. Summary

findadoc.jp is not ranking poorly — it is **structurally unindexable**. The site currently exposes **one indexable URL containing zero words of body text**, while the production API holds **465 facilities and 400 healthcare professionals across 214 cities and 34 prefectures**. There is nothing for a search engine to rank.

Three findings account for nearly all of the lost visibility:

1. **`ssr: false`** (`nuxt.config.ts:24`) plus `nuxi generate` produces an empty SPA shell. Every URL serves the same 3,880 bytes with `0` characters of visible text and no `<h1>`.
2. **No per-entity URLs exist.** `pages/` has no facility route and no professional route. All search state lives in Pinia with no URL synchronisation, so 465 clinics and 400 professionals share the single URL `https://www.findadoc.jp/`.
3. **No discovery or interpretation layer.** `/robots.txt` and `/sitemap.xml` both return 404. There is no `application/ld+json` anywhere in the repo, no `rel=canonical`, and no `hreflang` despite ten shipped locales.

The opportunity is large and mostly mechanical: **~1,100 indexable pages can be generated from data that already exists in the API**, before any new content is written.

Ranking tactics, keyword work, and link building are all premature. They cannot move a site with one blank page.

## 2. Method

All findings were verified empirically rather than inferred from the codebase alone:

- Live HTML fetched with `curl` and parsed to measure server-delivered visible text.
- `robots.txt`, `sitemap.xml`, apex redirect, and representative deep links checked for HTTP status.
- Content inventory measured by paging the production GraphQL API at `https://api.findadoc.jp` (`utils/graphql.ts:12`) with `limit: 100` (the API enforces a `MAX_LIMIT`).
- Facet viability computed by joining professionals to facilities via `facilityIds` and counting distinct prefecture/city/specialty/language combinations.

Reproduction commands are in Appendix A.

## 3. Current State — What Search Engines Receive

### 3.1 The rendered document is empty

Every URL returns an identical shell:

```html
<body><div id="__nuxt"></div><div id="teleports"></div><script>…</script></body>
```

| Measurement | Value |
|---|---|
| Total HTML size | 3,880 bytes |
| Visible body text | **0 characters** |
| `<h1>` elements | **0** |
| `application/ld+json` blocks | **0** |
| `data-ssr` attribute in payload | `false` |

`ssr: false` is set at `nuxt.config.ts:24`, and `prod:build` (`package.json:15`) runs `nuxi generate`, so the "static" build is a single prerendered empty shell rather than prerendered content.

Google does execute JavaScript, but rendering is queued, budgeted, and deprioritised for low-authority domains. On a site where *all* content requires JS plus a cross-origin GraphQL round trip to `api.findadoc.jp`, effectively nothing reaches the index. AI crawlers are stricter still — see §9.2.

### 3.2 Discovery paths do not exist

| Path | Status |
|---|---|
| `/` | 200 (empty shell) |
| `/about` | 200 (empty shell) |
| `/robots.txt` | **404** |
| `/sitemap.xml` | **404** |
| `/nonexistent-page-xyz` | 404 |
| `/u/someone` | **404** |
| `https://findadoc.jp/` → `https://www.findadoc.jp/` | 301 (correct) |

With no `robots.txt` and no sitemap, discovery depends entirely on external inbound links.

### 3.3 Missing meta and interpretation layer

Present in `nuxt.config.ts`: description, Open Graph title/description/image/url, Twitter card, `google-site-verification`.

Absent everywhere in the repo:

- `rel=canonical`
- `hreflang` / `x-default`
- `og:type`, `og:site_name`, `og:locale`
- Structured data of any kind (no `schema.org`, no `application/ld+json`)
- Per-page titles and descriptions — only three pages call `definePageMeta`, and all three do so for `layout` only, never for meta

`twitter:card` is `summary` rather than `summary_large_image`, which yields a small thumbnail on shared links.

Meta tags still use the Nuxt 2 `hid` attribute (e.g. `nuxt.config.ts` description, all `og:*` and `twitter:*` entries). In Nuxt 4 / unhead this key is inert — deduplication now works on `name`/`property`, so `hid` is dead weight that leaks into the served HTML. Harmless but should be cleaned up when the head config is touched.

## 4. Current State — No URLs To Rank

This is the more fundamental problem, and it is independent of SSR.

`pages/` contains only:

```
index.vue  about.vue  login.vue  submit.vue  terms.vue  privacypolicy.vue
my-page*   moderation*   u/[username].vue
```

**There is no facility page and no professional page.**

Search state lives entirely in Pinia — `stores/searchResultsStore.ts:29-36` holds `activeFacilityId`, `activeFacility`, `activeProfessional`, `selectedCity`, `selectedSpecialties`, and `selectedLanguages`. A grep across every search component (`MainContentContainer`, `SearchBar`, `FiltersPanel`, `SearchResultsList`, `SearchResultsListItem`, `SearchResultDetails`) for `useRoute`, `useRouter`, or query synchronisation returns **zero matches**.

Consequences:

- Every search, every filter combination, and every clinic detail view is the same URL.
- A user who finds an English-speaking dentist in Shibuya **cannot link anyone to it and cannot bookmark it**.
- Google has no address to index even if it did render the page.

For a search directory, per-entity URLs *are* the SEO product. This is the single highest-leverage item in the plan.

## 5. Defects Found Along The Way

These are small, individually cheap, and mostly independent of the larger phases.

### 5.1 The brand name is missing from every title tag

`nuxt.config.ts:36-37`:

```ts
titleTemplate: 'Health Services in Japan',   // no %s placeholder
title: SITE_TITLE,                            // 'Find a Doc, Japan!' — discarded
```

A `titleTemplate` without `%s` replaces the title outright. Live HTML confirms `<title>Health Services in Japan</title>`. **No page on the site has "Find a Doc" in its title tag**, so branded queries do not match it.

### 5.2 Deep links return hard 404s

`/nonexistent-page-xyz` and `/u/someone` both return **404**, not the SPA shell. The `netlify.toml` catch-all (`/* → /index.html`, status 200) is therefore not in effect — most likely because `nuxi generate` emits a `404.html` that Netlify prefers.

For a client-routed SPA this means **any non-prerendered dynamic route is unreachable by direct entry**. This is a shareability and correctness bug independent of SEO, and it would silently break every entity URL introduced in Phase 2 if not fixed first. Worth confirming against a valid `/u/<username>` before filing — `member_directory/members.json` has no username field, so a real one may need pulling from Auth0.

### 5.3 `pages/_headers` is in the wrong directory

Netlify reads `_headers` from the publish root only. The file at `pages/_headers` is treated as a Nuxt page directory entry and has no effect. Its contents duplicate the `Access-Control-Allow-Origin` rule already set in `netlify.toml`, so nothing is currently broken — but the file should move to `public/` or be deleted, and it is the natural home for future caching and security headers.

### 5.4 Ten locales collapsed onto one URL

`nuxt.config.ts:163` sets `strategy: 'no_prefix'`, and `nuxt.config.ts:172` sets `detectBrowserLanguage.alwaysRedirect: true`.

Full translations ship for **ja, zh, pt, ru, de, fr, tl, vi, it** (`i18n/locales/`) — a genuine competitive asset that no Japanese-language competitor markets on. Because content varies by cookie on an identical URL:

- **All nine non-English locales are invisible to search.**
- Japanese-language queries — likely the highest-volume segment — cannot be served at all.

### 5.5 City name data is not normalised

The API returns both `"Chuo Ward"` (21 facilities) and `"Chuo City"` (9 facilities) for what is the same place. Left as-is, this produces two competing URLs for one city. **This must be resolved before city names become URL slugs** (Phase 2), and is a data/server-side task, not a web task.

## 6. Plan

Items are sized to become individual tasks. Effort estimates assume familiarity with the codebase.

### Phase 1 — Fast wins (no architectural change)

Ship as one PR. None of these depend on SSR.

| ID | Task | Effort | Acceptance criteria |
|---|---|---|---|
| P1-1 | Fix `titleTemplate` to `'%s \| Find a Doc, Japan'`; set a distinct `title` per public page | S | `curl` of each public page shows a unique title containing the brand |
| P1-2 | Add `public/robots.txt` with a `Sitemap:` directive | XS | `/robots.txt` returns 200 `text/plain` |
| P1-3 | Move `pages/_headers` to `public/_headers` (or delete as redundant) | XS | No `_headers` entry in the route manifest |
| P1-4 | Investigate and fix the deep-link 404 (§5.2) | S | A valid dynamic route returns 200 on direct entry |
| P1-5 | Add `og:type`, `og:site_name`, `og:locale`; switch `twitter:card` to `summary_large_image`; drop dead `hid` keys | XS | Validates in a social preview debugger |
| P1-6 | Add `rel=canonical` (self-referencing) via a shared head composable | S | Every page emits exactly one canonical |
| P1-7 | Verify Google Search Console is claimed and note current coverage as a baseline | XS | Baseline screenshot/figures recorded in this doc |

**Note on sequencing:** P1-2 is only useful once a sitemap exists (P2-6). Ship `robots.txt` now with the `Sitemap:` line pointing at the future URL, or add the line in Phase 2.

### Phase 2 — Enable SSR (unblocks everything downstream)

This looks larger than it is. **All six plugins are already `.client.ts`** — including `vue-auth0-plugin.client.ts` — so authentication never runs server-side. The blockers are small and enumerable.

| ID | Task | Effort | Notes |
|---|---|---|---|
| P2-1 | Hoist module-scope `useToast()` calls into setup scope | S | 10 occurrences, incl. `stores/searchResultsStore.ts:19`, `components/TopNav.vue:224`, `components/SubmissionForm.vue:169`, `components/HamburgerMenu.vue:335`, and 6 files under `components/moderation-panel/` |
| P2-2 | Wrap browser-only components in `<ClientOnly>` | S | `MapContainer.vue` (`vue3-google-map`), `BottomSheet.vue` (`hammerjs`) |
| P2-3 | Audit the 16 files referencing `window`/`document`/`localStorage` for server-side execution paths | M | Guard with `import.meta.client` where needed |
| P2-4 | Set `ssr: true`; keep authenticated trees client-only via `definePageMeta({ ssr: false })` | M | Applies to `my-page*`, `moderation*`, `login` |
| P2-5 | Configure `routeRules` — ISR/prerender for public directory routes, SPA for authenticated ones | M | Requires a Netlify deployment-model decision; see §9.1 |
| P2-6 | Add `@nuxtjs/sitemap`, generating from the API | M | `/sitemap.xml` returns 200 and lists all public routes |
| P2-7 | Confirm hydration parity and that E2E suites still pass | M | `yarn test` green |

**Acceptance criteria for the phase:** `curl https://www.findadoc.jp/` returns a document with a real `<h1>` and non-trivial body text.

### Phase 3 — Create the URL inventory (the actual win)

Give every entity and viable facet a real, server-rendered URL. Counts are measured from live data, not estimated.

| ID | Route pattern | Pages | Effort |
|---|---|---|---|
| P3-1 | `/clinic/[prefecture]/[city]/[slug]-[id]` | **465** | L |
| P3-2 | `/doctor/[slug]-[id]` | **400** | L |
| P3-3 | `/[prefecture]` and `/[prefecture]/[city]` hubs | 34 / 214 | M |
| P3-4 | `/[prefecture]/[specialty]` (gated at ≥3 results) | **62** | M |
| P3-5 | `/[prefecture]/[language]-speaking` (gated at ≥3 results) | **65** | M |
| P3-6 | Sync search filters to query params so result sets become linkable | M | — |
| P3-7 | Internal linking: breadcrumbs, related clinics, city↔specialty cross-links | M | — |

**~1,100 indexable pages from data already in the API**, versus 1 today.

Gating rules, to avoid shipping thin pages that dilute crawl budget:

- Facet pages require **≥3 results**. Unfiltered combinations are 231 (prefecture × specialty) and 454 (city × specialty); only 62 and 24 respectively clear the threshold, so city × specialty is **not** worth building yet.
- Entity URLs carry the ID as a suffix so slug changes never break links.
- Facet pages below threshold must return 404 or `noindex`, never an empty result page.

**Why this matters commercially:** the highest-intent queries in this vertical are long-tail, and the site currently matches none of them — *"English speaking dentist Shibuya"*, *"英語 対応 小児科 福岡"*, *"English speaking psychiatrist Tokyo"*. The strongest ready-made clusters are:

| Cluster | Professionals |
|---|---|
| Tokyo / Dentistry | 38 |
| Fukuoka / Internal Medicine | 22 |
| Tokyo / Internal Medicine | 16 |
| Fukuoka / Dentistry | 16 |
| Osaka / Dentistry | 14 |
| Mie / Dentistry | 11 |
| Tokyo / Psychiatry | 8 |

**Dependency:** P3-1 and P3-3 are blocked on the city normalisation fix (§5.5).

### Phase 4 — Structured data and internationalisation

| ID | Task | Effort | Notes |
|---|---|---|---|
| P4-1 | `MedicalClinic` JSON-LD on facility pages | M | `name`, `address`, `geo`, `telephone`, `url`, `availableLanguage` — every field is already fetched by `searchFacilitiesQuery` |
| P4-2 | `Physician` JSON-LD on professional pages | M | `medicalSpecialty`, `knowsLanguage`, `worksFor` |
| P4-3 | `BreadcrumbList` on hub and facet pages | S | — |
| P4-4 | Switch i18n to `prefix_except_default`; emit `hreflang` + `x-default` | L | Resolves §5.4; revisit `alwaysRedirect` so crawlers are never cookie-redirected |
| P4-5 | Localised titles, descriptions, and `og:locale` per locale | M | — |

`availableLanguage` and `knowsLanguage` are the schema fields that encode the site's actual differentiator. Multiplying ~1,100 pages across 10 locales is the largest single expansion available, but only after Phase 3 exists — do not reorder.

## 7. Measurement

Record a baseline before Phase 1 ships, or the impact of this work cannot be demonstrated.

| Metric | Source | Baseline (2026-07-30) |
|---|---|---|
| Indexed pages | GSC Coverage | *to fill — expected ≈1* |
| Impressions / clicks, 28d | GSC Performance | *to fill* |
| Queries with impressions | GSC Performance | *to fill* |
| Visible text bytes served at `/` | `curl` | **0** |
| Indexable URLs | route manifest | **1** |

Leading indicators, in the order they should move: pages discovered → pages indexed → impressions → clicks. Expect indexing to lag Phase 3 deployment by weeks, not days.

Analytics already in place: `nuxt-gtag` (`G-T0RE9B3PRG`, production only) and Umami. Neither reports organic search visibility — Search Console is the required instrument and should be confirmed as claimed (P1-7). The `google-site-verification` meta tag in `nuxt.config.ts` suggests it is.

## 8. Risks and Open Questions

1. **Deployment model.** Phase 2 P2-5 requires deciding whether findadoc-web keeps a pure-static Netlify deploy (prerender-only, rebuild on data change) or gains a server runtime (ISR/SSR). This has a direct bearing on the online-booking plan — see §9.1.
2. **Rebuild cadence for prerendered pages.** If the site stays fully static, ~1,100 pages must be regenerated when moderators approve new facilities. Needs either a build webhook from `findadoc-server` or a scheduled rebuild, and the staleness window must be acceptable.
3. **Build time at ~1,100 pages × 10 locales.** Prerendering the full matrix could reach 11,000 pages. ISR or on-demand rendering is likely required before Phase 4.
4. **Thin-content risk.** Only 17 of 400 professionals have `additionalInfoForPatients`. Entity pages will be largely structured facts. This is normal and acceptable for a directory, but the facet gating in Phase 3 is what keeps it from becoming a quality problem.
5. **Do the ~400 professional pages have a privacy dimension?** Making named practitioners individually indexable is a different exposure from listing them inside a search UI. Worth an explicit decision, and it may interact with the APPI considerations already raised in the online-booking spec.
6. **Is `u/[username]` intended to be public?** If public profiles are indexable, they need the same meta treatment; if not, they need `noindex` and a robots exclusion.
7. **Unverified:** current Search Console coverage figures, and whether a valid `/u/<username>` also 404s (§5.2).

## 9. Relationship To Other Planned Work

### 9.1 Tension with the online-booking spec, Appendix A.4

`online-booking.md` §A.4 records the same `ssr: false` constraint and recommends **option 2** — keep findadoc-web a static client, put all booking logic in `findadoc-server` — on the grounds that no secret should ever reach the web app.

**These plans are compatible, but the premise needs restating.** Enabling SSR for public directory routes does not require any secret in the web app: facility and professional data is already public and already served unauthenticated from `api.findadoc.jp`. Booking logic, payment, uploads, and Excel export can all stay in `findadoc-server` exactly as A.4 recommends.

What does change is the sentence *"the web app stays a static client."* If Phase 2 adopts ISR or SSR, findadoc-web gains a server runtime — which happens to remove A.4's option 1 objection as a side effect. The two plans should agree on this explicitly before either commits; a pure-prerender variant of Phase 2 is possible and preserves the static model, at the cost of the rebuild-cadence problem in §8.2.

### 9.2 The MCP / AIEO rollout is a different surface

The MCP server (`findadoc-mcp`, already built with 7 tools) serves **in-session tool calls** — a user in Claude or ChatGPT who has the connector installed. High-quality traffic, but gated on connector adoption.

AI **crawlers** are a separate pipeline, and this plan is what serves them:

- `OAI-SearchBot` (ChatGPT Search) and `PerplexityBot` **execute no JavaScript at all**. The current shell is not merely deprioritised for them — it is literally blank.
- Google AI Overviews draw largely from the existing Google index, which the site is absent from.

So Phases 2–4 are the shared foundation: SSR-rendered entity pages carrying `MedicalClinic` / `Physician` schema are simultaneously the SEO fix and the AIEO substrate. MCP is a valuable third channel on top of that foundation, not a substitute for it. Once real pages exist, adding `llms.txt` and explicit AI-crawler rules in `robots.txt` is cheap and belongs in the AIEO workstream rather than here.

## 10. Priority Order

By leverage, highest first:

1. `ssr: false` — nothing is renderable (Phase 2)
2. No per-entity URLs — nothing to rank (Phase 3)
3. No `robots.txt` / sitemap — nothing discoverable (P1-2, P2-6)
4. No structured data — nothing interpretable (Phase 4)
5. `no_prefix` i18n — nine locales invisible (P4-4)
6. The title tag bug — branded queries do not match (P1-1)

Phase 1 is worth shipping first anyway: it is a day of work, it is independent of the architectural decision in §8.1, and P1-4 must land before Phase 3 introduces dynamic routes.

---

# Appendix A — Verification

Run from `findadoc-web/`. Findings in §3–§5 reproduce with these commands.

**Measure server-delivered content:**

```bash
curl -sL https://www.findadoc.jp/ -o home.html -w "status:%{http_code} size:%{size_download}\n"
python3 -c "
import re
h = open('home.html').read()
body = re.search(r'<body.*?>(.*)</body>', h, re.S).group(1)
txt = re.sub(r'<script.*?</script>', '', body, flags=re.S)
txt = re.sub(r'<[^>]+>', ' ', txt)
print('visible text chars:', len(re.sub(r'\s+', ' ', txt).strip()))
print('h1 count:', len(re.findall(r'<h1', h)))
print('has ld+json:', 'ld+json' in h)
"
```

**Check discovery paths and status codes:**

```bash
for p in "" about robots.txt sitemap.xml nonexistent-page-xyz u/someone; do
  printf "/%-24s " "$p"
  curl -sL -o /dev/null -w "status:%{http_code}\n" "https://www.findadoc.jp/$p"
done
```

**Count the content inventory** (the API enforces `MAX_LIMIT`, so page at 100):

```bash
for o in 0 100 200 300 400; do
  curl -s https://api.findadoc.jp -H 'Content-Type: application/json' \
    -d "{\"query\":\"{ facilities(filters:{limit:100, offset:$o}) { id nameEn healthcareProfessionalIds contact { address { cityEn prefectureEn } } } }\"}"
done
```

**Confirm no URL synchronisation exists:**

```bash
grep -rn "useRoute\|useRouter\|router\." \
  components/MainContentContainer.vue components/SearchBar.vue \
  components/FiltersPanel.vue components/SearchResultsList.vue \
  components/SearchResultsListItem.vue components/SearchResultDetails.vue
# expected: no matches
```

## A.1 Measured inventory (2026-07-30)

| Entity | Count |
|---|---|
| Facilities | 465 |
| — with a website URL | 426 |
| Healthcare professionals | 400 |
| — with `additionalInfoForPatients` | 17 |
| Distinct cities (`cityEn`) | 214 |
| Distinct prefectures (`prefectureEn`) | 34 |
| Distinct specialties | 31 |
| Distinct spoken languages | 14 |
| Professional↔facility links | 403 |

Facet viability, from joining professionals to facilities via `facilityIds`:

| Combination | Total | With ≥3 results |
|---|---|---|
| Prefecture × specialty | 231 | **62** |
| City × specialty | 454 | 24 |
| Prefecture × language | — | **65** |

Language distribution (professionals): `ja_JP` 396, `en_US` 389, `zh_CN` 42, `ko_KR` 8, `fr_FR` 6, `zh_HK` 5, `de_DE` 5, `tl_PH` 3, `es_ES` 2, plus `ne_NP`, `nl_BE`, `id_ID` at 1 each.

Top specialties: `DENTISTRY` 113, `INTERNAL_MEDICINE` 110, `GENERAL_MEDICINE` 44, `PEDIATRICS` 41, `ORTHOPEDIC_SURGERY` 37, `NEUROLOGY` 24, `DERMATOLOGY` 24, `CARDIOLOGY` 20.
