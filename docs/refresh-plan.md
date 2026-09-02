# findadoc-web — Refresh Plan (Phase 2)

> **Superseded in part — see [`handoff.md`](./handoff.md) for current state.**
> Most of this backlog shipped on 2026-09-02 (S0, W1, W2, K1, W3–W5, plus P1 by
> another contributor). The ordering below is kept as the original reasoning;
> `handoff.md` records what actually landed and what is next.

**Status:** Proposed backlog
**Date:** 2026-09-02
**Companion:** [`refresh-audit.md`](./refresh-audit.md) — all findings referenced as §n

One PR per item. Effort assumes familiarity with the codebase: **S** ≈ half a day, **M** ≈ 1–3 days, **L** ≈ a week+.

---

## Decisions locked

| Decision | Choice |
|---|---|
| Onboarding | **Remove.** No splash, no gate. (§3.2) |
| Homepage | Real content homepage with a search entry point; the map app moves to `/search` |
| Search layout | **List-first, map secondary** |
| Themes | **Light / dark / auto only.** Retire coral, violet, neon, ocean and both accessibility pairs |
| Accessibility | Fix the base palette to WCAG AA; high-contrast via `prefers-contrast: more`; honour `prefers-reduced-motion`; never encode meaning in hue alone |
| Sequencing | Homepage first, to set the foundation for the rest of the redesign |

**Why the theme cut is safe.** The retired accessibility themes were compensating for a default palette that fails AA (2.63:1 for white-on-primary, 2.08:1 for white-on-secondary — both below even the 3.0 non-text floor). Fixing the base palette supersedes them. Documented in §7.2 and W1 below.

---

## Recommended order

```
  ┌─ S0 hotfix ─────────────────────────────────────────────┐
  │  city-filter data loss — ship immediately, standalone   │
  └─────────────────────────────────────────────────────────┘
            │
  W1 brand foundations ──┬── W3 homepage ── W4 kill onboarding ── W5 list-first search
  W2 layout slot fix ────┘                                              │
  K1 kill list (parallel, no deps)                                      │
                                                                        │
  S1 server city filter ── S2 collapse waterfall ── S3 URL state ───────┤
                                                                        │
  P1 SSR ── P2 bundle split ── P3 fonts ─────────────────────────────────┘
            │
  D1 Storybook patterns ── D2 screen-by-screen restyle
```

**S0 jumps the queue.** It is an S-effort fix for a bug that currently tells users there is no care in their city. It touches one function and is independent of everything else — it should not wait behind the homepage.

---

## Backlog

### S0 — Fix the city-filter pagination bug ⚠️

| | |
|---|---|
| **Effort** | S |
| **Risk** | Low — one function; strictly increases results returned |
| **Depends on** | nothing |

`fetchAllFacilities` computes `hasMoreBatches` from the length of a client-side–filtered batch, so any active city filter halts pagination after the first 100 facilities. **100 of 465 facilities (21%) are reachable; Meguro and Kagoshima return zero results despite having 11 and 8.** (§4.1)

Minimal fix: page on the *unfiltered* response length and filter after accumulating. Superseded entirely by S2, but S2 is weeks out and this is live data loss.

**Acceptance:** selecting Meguro returns 11 facilities; every city in the dropdown returns a count matching its dropdown badge.

---

### W1 — Brand foundations v1

| | |
|---|---|
| **Effort** | M |
| **Risk** | Medium — palette change is visible everywhere at once |
| **Depends on** | nothing |

The foundation the homepage is built on. Deliverable is `docs/brand.md` plus the token implementation.

1. **One canonical palette, AA-verified.** Current primary `#0EB0C0` must darken to reach 4.5:1 against white for text and 3.0:1 for UI surfaces. Document the ratio for every documented pair; add a contrast check to CI.
2. **Type scale.** Define `--font-sans` (currently **never defined** — every `font-sans` class falls through to the system stack, §7.1) with a Japanese-capable stack; `Noto Sans` has no CJK coverage, so `Noto Sans JP` is a separate family. Set a scale with line-heights, and move body copy off `text-sm` (used 73× vs `text-base` 7×, §7.3).
3. **Spacing, radius, elevation, motion tokens.**
4. **Rules:** never hue-alone for meaning; minimum target sizes; focus-visible treatment.

Keep the existing semantic token names — they are well designed and only 5 hardcoded hex values exist across the whole component tree (§7.4). This extends the system, it does not replace it.

**Acceptance:** `docs/brand.md` exists; every token pair in it passes AA; no `font-sans` resolves to a system fallback.

---

### W2 — Layouts: `<NuxtPage />` → `<slot />`

| | |
|---|---|
| **Effort** | S |
| **Risk** | Low |
| **Depends on** | nothing |

All three layouts render their own `<NuxtPage />` instead of `<slot />`, so the page passed from `app.vue` is discarded and a second router-view is instantiated (§5.4). Works today; breaks layout transitions and is a likely hydration-mismatch source the moment SSR lands. Fix before P1.

**Acceptance:** all layouts render `<slot />`; e2e suite green.

---

### K1 — Kill list

| | |
|---|---|
| **Effort** | S |
| **Risk** | Low — all targets are unreachable from the UI |
| **Depends on** | nothing (can run in parallel) |

- **`/moderation` tree** — five child routes **byte-identical** to `/my-page`, zero inbound links; `accessControlLinks.ts` points exclusively at `/my-page` (§2.2). Drop the `TopNav.vue:239` path check with it.
- **`/u/[username]` + `ProfilePage.vue`** — reports "Profile updated successfully" while persisting nothing (§2.3).
- **`components/WelcomeSection.vue`** — orphan (§2.1).
- **`theme-neon`, `theme-ocean`** — orphaned CSS, unreachable from the picker (§7.2).

**Acceptance:** routes 404; `yarn lint` and e2e green; no references remain.

---

### W3 — New homepage at `/`

| | |
|---|---|
| **Effort** | L |
| **Risk** | Medium — new surface, new copy |
| **Depends on** | W1, W2 |

The first surface of the new brand, and the item that sets the pattern for everything after.

Contents: value proposition; **prominent search entry** (location + specialty + language) that navigates to `/search` with the query applied; popular cities and specialties as **real links**; how it works; mission/trust; nav and footer present.

Explicitly **not** loaded here: Google Maps SDK, Auth0, the search waterfall. This is the page that can be prerendered and near-instant — today it loads all three for an anonymous visitor (§5.2).

Content already available: `about.*` is translated across all 10 locales (mission, story, "300+ Doctors Registered", "100+ Monthly Users"); `WelcomeSection.vue` holds the value-prop line; `specialtiesStore` has the category taxonomy.

**Acceptance:** `/` renders full content with nav and footer; no maps or Auth0 request in the network panel; search entry navigates to `/search` with filters applied.

---

### W4 — Remove onboarding

| | |
|---|---|
| **Effort** | S |
| **Risk** | Low |
| **Depends on** | W3 |

Delete `onboardingStore`, `Onboarding.vue`, `WelcomeScreen.vue`, `CategorySelection.vue`, `TransitionToSearchScreen.vue`, `layouts/onboarding.vue`, `tests/e2e/onboarding.spec.ts`, and the `skipOnboarding` fixture (every other e2e test currently calls it). Remove the `onboarding.*` i18n keys across all 10 locales — including `selectcategory` and `notsurebutton`, translated for a screen that never rendered (§3.2).

Removes the 3 s dead timer and the localStorage-gated first-run state that would otherwise guarantee a hydration mismatch under SSR (§3.3).

**Acceptance:** no onboarding code remains; a first-time visitor reaches content with zero artificial delay.

---

### W5 — List-first search at `/search`

| | |
|---|---|
| **Effort** | L |
| **Risk** | Medium — largest UI change |
| **Depends on** | W4 |

Invert the current layout: results list is primary, map is secondary (toggle or side panel on desktop, toggle on mobile). Replaces the map-first `MainContentContainer` branching, which currently mounts `TopNav`/`Footer` inside itself — move those back to the layout.

Pairs naturally with S2: a list-first UI only needs page 1, which is exactly what server-side pagination returns.

**Acceptance:** results render as the primary surface; map is opt-in; no regression in result counts.

---

### S1 — Server-side location filter (findadoc-server)

| | |
|---|---|
| **Effort** | M (external repo) |
| **Risk** | Medium — API change, coordination |
| **Depends on** | server team |

`FacilitySearchFilters` exposes **no prefecture/city field** — only a nested `contact` object (§6). Add first-class `cityEn`/`prefectureEn` (or a normalised location) filtering. Also resolve city-name normalisation: production holds both `"Chuo Ward"` (21) and `"Chuo City"` (9) for the same place.

Optionally add a `professionals` field on `Facility` to remove the client-side join.

**Blocks S2.** Start this conversation early — it is the long pole.

---

### S2 — Collapse the search waterfall

| | |
|---|---|
| **Effort** | M |
| **Risk** | Medium |
| **Depends on** | S1 |

Replace ~10 round trips / **~5.9 s / ~570 KB** with one server-filtered, paginated query returning page 1 plus a total count. Target **1 request, <300 ms, ~30 KB** to first paint (§4.2).

Deletions: `fetchAllFacilities`, `fetchAllProfessionals`, the client-side join, the client-side city filter, and `mapPointsQuery` (a redundant subset of data arriving moments later, sitting *ahead* of the main fetch). Map points load lazily with the map.

Also: skip `getAuthBearerToken()` for anonymous public search — all ~10 requests currently serialise behind Auth0 init. Add request dedup and abort-on-filter-change; today a fast filter-clicker can have several full-database fetches racing, applied in completion order.

`utils/graphqlHelpers.ts` already has `fetchFacilitiesWithCount` / `fetchHealthcareProfessionalsWithCount` with proper pagination — the moderation panel uses them, the public search does not. Reuse them.

**Acceptance:** one request to first paint; p75 <300 ms; S0's bug cannot recur by construction.

---

### S3 — URL state for search

| | |
|---|---|
| **Effort** | M |
| **Risk** | Low |
| **Depends on** | W5 |

Sync `selectedCity`, `selectedSpecialties`, `selectedLanguages`, `activeFacilityId` to query params. Zero `useRoute`/`useRouter` usage exists across the search components today (§3.5).

Restores **back-button, bookmarking, sharing, refresh-safety** — currently Back exits the search entirely rather than closing a detail view, which on mobile is a significant usability failure. Also the prerequisite for the per-entity URLs the existing SEO issues need.

**Acceptance:** every filter state is linkable; Back closes a detail view; refresh preserves results.

---

### S4 — Error handling: toasts, not `alert()`

| | |
|---|---|
| **Effort** | S |
| **Risk** | Low |
| **Depends on** | nothing |

`searchResultsStore` and `locationsStore` call **`alert()`** on failure. With the retry policy in `utils/graphql.ts` (3 attempts, 5000 ms apart), a failing search blocks for **~15 s** then throws a native modal (§3.4). Route through the already-installed `vue-toastification`; cut the retry budget; add a real empty/error state.

Note: fixing `stores/searchResultsStore.ts:19` (module-scope `useToast()`) here also removes an SSR blocker for P1.

**Acceptance:** no `alert()` in the codebase; failure surfaces in <5 s as a toast.

---

### P1 — Enable SSR / prerendering

| | |
|---|---|
| **Effort** | L |
| **Risk** | High — touches every page |
| **Depends on** | W2, W4, S4 |

`ssr: false` (`nuxt.config.ts:24`) means every route serves a 3,644-byte empty shell (§5.1). Biggest first-paint win available.

Blockers, all enumerated in §5.3: `BottomSheet.vue:148` (`window.addEventListener` at setup top level), `searchResultsStore.ts:19` (module-scope `useToast`, cleared by S4), `MapContainer.vue` → `<ClientOnly>`, `ThemeManager` localStorage → cookie, `onboardingStore` (deleted by W4). All six plugins are already `.client.ts`, so nothing auth-related runs server-side.

Keep authenticated trees client-only via `definePageMeta({ ssr: false })`. Requires a Netlify deployment-model decision (static prerender vs. server runtime).

**Acceptance:** `curl /` returns a real `<h1>` and body text; e2e green; no hydration warnings.

---

### P2 — Split the bundle

| | |
|---|---|
| **Effort** | M |
| **Risk** | Low |
| **Depends on** | W3 |

**2.52 MB of JS, largest chunk 576 KB, 12 MB `_nuxt` total** (§5.2). Defer Auth0 (loaded for anonymous visitors who never log in) and the Google Maps SDK (not needed for list-first results). Sentry and hammerjs are secondary candidates.

**Acceptance:** homepage initial JS under 300 KB; maps and Auth0 absent from the homepage waterfall.

---

### P3 — Font pipeline

| | |
|---|---|
| **Effort** | S |
| **Risk** | Low |
| **Depends on** | W1 |

`assets/fonts/` holds **18 `.ttf` files, 8.3 MB**; only two are declared and in practice **none are downloaded**, because nothing references the family (§7.1). Convert the 2–3 weights actually used to subsetted `woff2` (40–60% smaller), add `font-display: swap`, preload the primary weight, delete the rest.

**Acceptance:** ≤3 font files, all woff2; brand typeface visibly applied; no layout shift on load.

---

### D1 — Component patterns in Storybook

| | |
|---|---|
| **Effort** | M |
| **Risk** | Low |
| **Depends on** | W1 |

Button, input, select, card, sheet, dialog, empty state, loading state, pagination. `@nuxtjs/storybook` is already installed and `.storybook/` configured. Include the multilingual rules — text expansion in de/pt/ru, mixed EN/JA typography, line-breaking.

---

### D2 — Screen-by-screen restyle

| | |
|---|---|
| **Effort** | L |
| **Risk** | Low per screen |
| **Depends on** | D1, W5 |

Remaining surfaces in priority order: `/search` detail views → `/submit` → `/about` → `/my-page` → `/terms` (also needs real content — currently hardcoded English with §1 and §2 sharing identical body text, §2) and `/privacypolicy`.

---

## Theme consolidation (folded into W1 + K1)

| Today | After |
|---|---|
| 11 theme classes, 2 orphaned | `light`, `dark`, `auto` |
| `theme-accessible-high-contrast(-dark)` | `@media (prefers-contrast: more)` |
| `theme-accessible-red-green(-dark)` | Removed — replaced by an AA-passing palette + "never hue alone" rule |
| No `prefers-color-scheme` support anywhere | Drives `auto` |
| `prefers-reduced-motion` in 1 file | Honoured globally |

Dark mode currently ignores the OS setting entirely and defaults to light (`ThemeManager.vue` `onMounted`), so `auto` is new work, not a rename.

---

## Out of scope

- **SEO/crawler work** — already ticketed. Note S3 and P1 are its hard prerequisites, so this plan unblocks it.
- **Online booking** — separate spec (`online-booking.md`); its Appendix A.4 assumes a static web client, which P1 may change. Reconcile before P1 commits.
- **MCP server** — separate repo, already built.

## Open questions

1. **Netlify deployment model** — static prerender or server runtime? Gates P1 and has knock-on effects for booking.
2. **Rebuild cadence** if fully static — moderator approvals would need a build webhook.
3. **S1 timeline** — server-side location filtering is the long pole for S2.
4. **Homepage copy** — reuse `about.*` verbatim, or write new? Affects W3 effort and whether 10 locales need re-translation.
