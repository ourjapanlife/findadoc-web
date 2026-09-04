# Find a Doc, Japan — brand and UI foundations

**Status:** In use since 2026-09-03
**Implementation:** `assets/css/tailwind.css` (tokens and primitives), `composables/useColorScheme.ts` (light/dark/auto)

This is the reference for how the site looks and why. It describes what is implemented; if the
code and this document disagree, fix one of them the same day.

---

## 1. What the brand is for

Someone who is unwell, in a country whose language they may not read, needs to find a doctor they
can talk to. Everything on the site is in service of that moment. The visual language therefore
optimises for **trust and clarity** over personality: a quiet ground, one accent colour used only
for things you can act on, generous spacing, real text at a readable size, and no decoration that
competes with the content.

The five character mascots are the warmth in the system. They appear once per page at most, small,
as an accent — never as a hero illustration that pushes the task down the page.

## 2. Colour

Tokens are space-separated RGB triplets so Tailwind's opacity modifiers work (`bg-primary/10`).
Every pair below passes WCAG AA; the ratios were computed with the script in §7.

### Light (default)

| Token | Value | Use | Contrast |
|---|---|---|---|
| `primary` | `#0A7D89` | links, primary buttons, active states | 4.65:1 on ground, 4.88:1 on surface |
| `primary-hover` | `#08646E` | hover of the above | 6.87:1 on surface |
| `primary-text` | `#12212B` | body copy, headings | 15.66:1 |
| `primary-text-muted` | `#4F636B` | secondary copy, labels' helper text | 6.01:1 |
| `primary-text-inverted` | `#FFFFFF` | text on `primary` | 4.88:1 |
| `primary-bg` | `#F7FAFB` | page ground | — |
| `secondary-bg` | `#FFFFFF` | cards, inputs, alternating bands | — |
| `accent-bg` | `#DFE7EA` | hairline borders, subtle fills, skeletons | — |
| `border-strong` | `#768A91` | form-control edges | 3.61:1 (UI boundary ≥ 3:1) |
| `accent` | `#1E40AF` | reserved for informational emphasis | 8.72:1 |
| `secondary` | `#FB9999` | the map's active pin and nothing else | 2.08:1 — never use as text |
| `scrim` | shadow colour | modal backdrops, at `/50`; dark in **both** themes on purpose | — |
| `success` / `error` / `warning` / `info` | `#0B815A` / `#E21313` / `#9E6506` / `#1368F4` | status text and icons | 4.84–4.88:1 |

### Dark

| Token | Value | Contrast |
|---|---|---|
| `primary` | `#2BB7C6` | 7.56:1 on ground |
| `primary-hover` | `#4FCBD7` | 8.56:1 |
| `primary-text` | `#F1F5F6` | 16.65:1 |
| `primary-text-muted` | `#A9B8BD` | 8.94:1 |
| `primary-text-inverted` | `#0B1214` | 7.82:1 on `primary` |
| `primary-bg` / `secondary-bg` / `accent-bg` | `#101617` / `#182022` / `#2A3538` | — |
| `border-strong` | `#6A7C82` | 3.80:1 |
| `accent` | `#809EFF` | 6.51:1 |
| `success` / `error` / `warning` / `info` | `#34D399` / `#F87171` / `#FBBF24` / `#60A5FA` | 5.98–9.92:1 |

### Rules

- **Never encode meaning in hue alone.** A selected card has a 1px `primary` border, not a tint
  only; an invalid field has a message, not only a red edge; status text has a word, not only a colour.
- Text is never `secondary` (coral). It exists for the map's active pin because the pin needs a
  second hue that is not teal.
- Do not hardcode hex values in components. Five did exist before this pass; the goal is zero.
- **A backdrop is not `primary-text`.** That token inverts to near-white in dark mode, which
  turns a scrim into a white wash. Use `bg-scrim/50`.
- **Tailwind v4 has no `bg-opacity-*`.** `bg-secondary bg-opacity-40` renders fully opaque. Use
  the slash syntax (`bg-scrim/50`).
- Check a colour pair in `prefers-contrast: more` as well as in both themes. `accent-bg` darkens
  to a mid grey there, so `text-primary` on an `accent-bg` fill drops to 1.35:1.

### Scheme selection

Three states, one class on `<html>`:

| State | Class | Trigger |
|---|---|---|
| Light | `theme-light` | explicit choice |
| Dark | `theme-dark` | explicit choice |
| Auto | none | default; follows `prefers-color-scheme` |

The choice is stored in `localStorage.colorScheme`. An inline script in `<head>`
(`nuxt.config.ts`) applies it before first paint so prerendered pages never flash. The old
five-colourway picker stored `theme` and `isDarkMode`; only a stored dark choice is migrated,
everything else becomes auto. `prefers-contrast: more` is honoured as a preference (muted copy
becomes full strength, hairlines darken) rather than as a separate theme.

## 3. Type

- **Family:** Noto Sans for Latin, Cyrillic, Greek, Vietnamese; Noto Sans JP for Japanese. Both
  self-hosted as subsetted woff2 via `@fontsource`, weights 400 / 500 / 600 / 700 (JP: 400 / 700).
  A Latin-only visitor downloads ~15 KB per weight and never fetches the CJK subsets. Load a face
  for every weight the utilities use: `font-medium` was in use with no 500 face for a while, and
  a missing weight fails silently by substituting the nearest one.
- **Body:** `text-base` (16px) with `leading-relaxed`. `text-sm` is for labels, meta and chips —
  never for running copy. `text-xs` only for footnotes (last-updated, hosting credit).
- **Scale:** two page-title sizes, both named so a third does not appear by accident.
  `.page-title` (36/48px) introduces a landing surface — home, about, the error page.
  `.page-title-sm` (30/36px) heads a document — the legal pages, the submission form, login.
  One `h1` per page either way. Below that: `h2` 24/30px bold (`.section-heading`), `h3`
  18–20px semibold, lead paragraphs 18/20px muted.
- **Measure:** running copy sits in `max-w-3xl` or narrower and is left-aligned. Headings use
  `text-balance`.
- **Mixed EN/JA:** the stack falls through to Noto Sans JP for CJK glyphs automatically; do not
  set separate line-heights per locale. Expect German, Portuguese and Russian strings to run
  ~30% longer than English — buttons and chips must wrap or truncate, never overflow.

## 4. Space, shape, elevation, motion

- **Section rhythm:** `.page-section` = `py-12`, hero `py-16`. Bands alternate: plain ground,
  then `bg-secondary-bg border-y border-accent-bg`.
- **Containers:** `.page-container` (64rem) for pages; `.page-container-narrow` (48rem) for
  forms and long-form text.
- **Radii:** `rounded-xl` cards and tiles, `rounded-lg` buttons and inputs, `rounded-full` chips
  and avatars.
- **Elevation:** resting surfaces have a hairline border and no shadow. Only floating things
  (menus, the details panel, the mobile drawer) use `shadow-raised` / `shadow-overlay`.
- **Motion:** `transition-colors` on interactive states; the drawer and details panel slide
  200–250ms. `prefers-reduced-motion` disables all of it globally.
- **Targets:** anything clickable is at least 44px tall (`h-11` / `h-12`; compact buttons `h-10`
  only inside dense toolbars).

## 5. Component primitives

Defined once in `@layer components`; pages compose them with utilities.

| Class | Purpose |
|---|---|
| `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-on-primary`, `.btn-sm` | Buttons and button-shaped links |
| `.link` | Links inside copy |
| `.card` | Surface with hairline border |
| `.chip`, `.chip-primary` | Tags; selected/accent variant |
| `.field-label`, `.field`, `.field-textarea`, `.field-hint`, `.field-error` | Form controls; set `aria-invalid="true"` and `aria-describedby` on error |
| `.skeleton` | Loading placeholder |
| `.prose-legal` | Long-form legal text with styled `h2`/`h3`/`p`/`ul` |
| `.page-title`, `.page-title-sm` | The two `h1` scales: landing surface, and document |
| `.page-section`, `.page-container(-narrow)`, `.section-heading`, `.section-lead`, `.eyebrow` | Layout and type |

Focus rings are global; components do not add their own. The indicator is **two-tone**: a
surface-coloured halo filling a 2px offset, then a text-coloured outline around it. No single
colour clears 3:1 against the page ground, a white card and the `bg-primary` band at once, so
one band always carries the contrast. A single primary ring was invisible on the primary band —
exactly where the homepage's main call to action sits.

## 6. Accessibility baselines

- Every input has a `<label>` (visible or `sr-only`); every icon-only control has `aria-label`.
- One `h1` per page; heading levels do not skip.
- Panels and drawers are `role="dialog" aria-modal="true"`, move focus in on open and back on
  close, close on Escape, and lock the page behind them.
- State is in the URL wherever it can be: search filters and the open facility are query
  parameters, so Back closes a panel and links can be shared.

## 7. Verifying contrast

```js
// node contrast.mjs — WCAG 2.x relative luminance
const L = ([r, g, b]) => {
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
console.log(ratio([10, 125, 137], [255, 255, 255]).toFixed(2)) // 4.88
```

Text needs ≥ 4.5:1, large text and UI boundaries ≥ 3:1. Re-run whenever a token changes and
update the tables above.
