# Online Consultation Booking System — Requirements Specification

**Project:** Findadoc.jp × MINNA online consultation service
**Status:** Draft v0.2
**Last updated:** 2026-07-30

> **Change log**
> - v0.2 (2026-07-30): Added §6.8 (consent, terms and privacy requirements), expanded §9 open questions, added Appendix A documenting the current state of `findadoc-web` / `findadoc-server` against these requirements. Product requirements live in §1–§9; all implementation-level findings are isolated in Appendix A.
> - v0.1: Initial draft.

---

## 1. Purpose

Build a multilingual reservation system that serves as the entry point for foreign residents in Japan to book online medical consultations. The system collects patient registration, intake, insurance, and payment information ahead of the consultation, and hands that information to the consultation coordinator in a structured format.

This system is the "booking" component of the broader online consultation model described in the Toyota Foundation 2025 project「外国人材の受け入れと日本社会」, in which online consultations integrate multilingual intake, medical interpretation, insurance verification, consultation, and referral letter preparation.

## 2. Terms and Abbreviations

| Term | Definition |
|---|---|
| EMR | Electronic Medical Record — the clinic's software for managing patient records and appointments. Booking data is entered into the EMR manually by the coordinator. |
| MINNA | みんなの外国人ネットワーク (Everyone's Foreign Resident Network) — the multidisciplinary network running the online consultation project; Findadoc is one of its four partner organizations. |
| Findadoc.jp | NPO providing a multilingual platform for finding foreign-friendly medical providers in Japan; responsible for building the booking system. |
| Coordinator | Medical social worker who manages bookings, arranges interpreters, transfers booking data into the clinic EMR, and supports patients through the consultation process. |
| My Number card | マイナンバーカード — Japan's national ID card, which can also function as a health insurance card when registered. |
| MyNa Portal | マイナポータル — the government web portal where My Number card holders can view and download their registered health insurance information. |
| Eligibility certificate | 資格確認書 — paper document issued to insured persons who do not use a My Number card as their insurance card; serves as proof of insurance coverage. |
| やさしい日本語 | "Easy Japanese" — a simplified form of Japanese using basic vocabulary and grammar, used to make information accessible to non-native speakers. |
| Symview | Web-based medical intake questionnaire service used by Minatomachi Clinic for its English-language consultation entry point; referenced for intake question structure. |
| Melifone | メリフォン — a medical interpretation service (phone/video) under consideration for interpreter support during consultations. |
| Intake | Pre-consultation questionnaire collecting symptoms, history, and consultation preferences (問診). |
| Consultation block | A scheduled time window (e.g., a 4-hour session) during which multiple online consultations are held; blocks open once sufficient reservations are collected. |
| Fee-exemption slot | 支払い免除診察枠 — a consultation slot offered without charge to patients unable to pay, introduced after the service reaches break-even, per the Toyota Foundation project plan. |
| APPI | 個人情報保護法 — Japan's Act on the Protection of Personal Information. |
| 要配慮個人情報 | "Special care-required personal information" under APPI, which includes medical history and health information. Its collection requires explicit opt-in consent. |
| オンライン診療指針 | MHLW's「オンライン診療の適切な実施に関する指針」— guidance governing the delivery of online medical care in Japan, including patient identity verification and informed consent. |

## 3. Background

- Consultations are delivered by an existing clinic (Tanaka-san's clinic) using its own EMR and reservation system. The booking system does not integrate with the EMR. Instead, it exports all collected information to a simple Excel sheet, and the consultation coordinator (Takada-san, medical social worker) manually enters it into the clinic EMR appointment form.
- Consultations run in scheduled blocks: initially every other Thursday, expanding with demand. The service model is fully reservation-based with prepayment; a consultation block opens once a sufficient number of reservations is collected (break-even reference: 12 paying patients per 4-hour block).
- Target launch of patient consultations: November–December 2026, preceded by community outreach and a test-operation period.
- Reference implementation: Minatomachi Clinic's English-language Symview intake flow (link in §10).
- Findadoc already operates a public directory platform (`findadoc-web` + `findadoc-server`). The booking system is expected to build on that codebase. A partial, unfinished reservation data model already exists there; see Appendix A.

## 4. Users and Roles

| Role | Description |
|---|---|
| Patient | Foreign resident in Japan. Varying Japanese proficiency, digital literacy, and educational background. Primary device: smartphone. |
| Coordinator | Medical social worker who reviews bookings, arranges interpreters, transfers booking data into the clinic EMR, and supports patients before/during/after consultations. |
| Clinic staff / physician | Receive patient information via the EMR; conduct the consultation with a medical interpreter present. |
| Administrator | Findadoc-side operator managing content (languages, fees, schedule) and exports. |

The existing platform has four roles (Admin, Moderator, Dev, User). "Coordinator" has no equivalent today and must be introduced as a distinct role with access to patient data — see Appendix A.3.

## 5. Scope

**In scope**

- Public landing page and service explanation
- Patient registration and intake form
- Insurance document collection
- Payment collection / validation
- Reservation against available consultation slots
- Structured export (Excel) of all booking data for the coordinator
- Booking-specific consent capture, and the terms/privacy documents that consent refers to (§6.8)

**Handled outside the system (manual operations)**

- Entry of booking data into the clinic EMR (coordinator, manual)
- Interpreter scheduling and consultation delivery
- Referral letter creation and post-consultation follow-up

## 6. Functional Requirements

### 6.1 Landing page

- Explain the clinic service: what an online consultation is, how it works, who it is for.
- Display the consultation fee (approx. ¥20,220 — to be confirmed) and accepted payment methods. The displayed figure must state whether the ¥550 system usage fee (§9.3) is included; §6.1 and §9.3 must not disagree.
- Display available consultation languages and available dates.
- Available in multiple languages, including やさしい日本語 (easy Japanese).

### 6.2 Language and accessibility

- Full multilingual UI across all patient-facing screens; language selectable at any point.
- Design for users with varying educational backgrounds: visual, simplified layouts; minimal free-text entry; icons and illustrations where possible.
- Support katakana and alphabet input for name fields.
- Mobile-first; usable on a single smartphone without a PC.
- Legal and consent text (§6.8) is in scope for translation, not just UI labels.

### 6.3 Patient registration and intake

Capture at minimum:

- Name (with reading), nationality, age / date of birth
- Contact details (phone, email, messaging app as applicable)
- Symptoms / reason for consultation
- Preferred consultation language
- Japanese proficiency level
- Interpreter required (yes/no)

Intake questions should follow the structure of established multilingual medical questionnaires (Symview flow as reference).

**Patient identity model (decision required — see §9.8).** The specification does not currently state whether a patient must create an account to book. This single decision drives the data model, the consent record, the reminder/notification channel, and the UX burden on low-digital-literacy users. The two viable options:

1. **Account-based:** patient signs up (existing platform uses Auth0). Enables return visits, self-service cancellation, and a durable identity for the reservation record. Adds a signup step that is a known drop-off point for this user group.
2. **Tokenised anonymous booking:** patient submits the form without an account and receives a signed link (by email/SMS) to view or cancel the booking. Lower friction, but requires token issuance, expiry, and a rate-limiting strategy.

### 6.4 Insurance verification

Three patient patterns:

1. **Regular health insurance card:** upload a photo of the card.
2. **Eligibility certificate (資格確認書):** upload a photo of the certificate.
3. **My Number insurance card:** patient obtains their insurance information via the MyNa Portal and submits the image to the clinic. The system provides step-by-step multilingual guidance for this flow.

Uninsured patients: flow to be defined (see §9).

Upload handling requirements:

- Accepted file types and maximum size defined and enforced; clear multilingual error messaging on rejection.
- Images stored encrypted at rest, retrievable only by coordinator/admin roles via time-limited access.
- Defined retention period, with automatic deletion after the consultation is complete (see §9.12).
- Whether Findadoc may store these images at all, or must pass them directly to the clinic, is an open legal question (§9.14).

### 6.5 Payment

- Prepayment before the reservation is confirmed.
- Credit card: card validation at booking time.
- Bank transfer: supported as an alternative; transfer-fee handling to be defined (see §9).
- Card data must never touch Findadoc systems; use a hosted/tokenised provider flow.
- A refund, cancellation and no-show policy is required before launch, including the case where a block fails to reach break-even and is cancelled by the operator (§9.10).

### 6.6 Reservation and scheduling

- Admin-defined consultation blocks (initially every other Thursday).
- Patients book into an open block; capacity per block is configurable.
- Two patients must not be able to consume the same capacity concurrently; overbooking must be prevented at the data layer, not only in the UI.
- Patient-visible booking states at minimum: pending payment, confirmed, cancelled, completed.
- Confirmation and reminder notifications to the patient in their selected language. The notification channel (email, SMS, LINE) is undecided and no such infrastructure exists today (§9.15).

### 6.7 Data export

- Export all booking information for a given block to a single Excel sheet containing every field the coordinator needs for EMR entry, including uploaded document references.
- Export available on demand to the coordinator/administrator.
- Export is an authenticated, access-logged action; exports contain 要配慮個人情報 and must not be reachable without a coordinator/admin role.

### 6.8 Consent, terms and privacy

Findadoc already publishes Terms and Conditions (`/terms`) and a Privacy Policy (`/privacypolicy`). Both were written for a **search directory** and neither covers booking, medical data, document upload, payment, or third-party sharing with a clinic and interpreter. Both require substantive revision before launch. See Appendix A.5 for the implementation-level audit.

Requirements:

- **Booking terms.** Either a dedicated set of booking terms or a clearly scoped addendum, covering: that the clinic (not Findadoc) is the medical provider; that the service is not for emergencies; payment, refund, cancellation and no-show policy; operator-initiated cancellation when a block does not reach break-even; interpreter presence and confidentiality; prohibition on recording the consultation; eligibility, including whether minors may book and how guardian consent is obtained; governing law.
- **Privacy policy scope.** Must be extended to name the categories actually collected: symptoms and medical history (要配慮個人情報), insurance and identity document images, payment-related data, and contact details. It must state purpose, legal basis, recipients, retention period, cross-border transfer (if any), and the patient's route to access, correct, or delete their data.
- **Explicit opt-in consent.** Collection of 要配慮個人情報 under APPI requires affirmative consent, separate from generic terms acceptance. Consent to third-party provision (clinic, interpreter service, payment processor) must also be explicit and separately identifiable.
- **Consent must be recorded, not just displayed.** Each booking stores: timestamp, the document version consented to, and the language the patient was shown. No consent record exists in the current data model.
- **Telemedicine informed consent.** Required under オンライン診療指針. Whether it is collected in the booking flow or by the clinic at consultation time must be decided (§9.9).
- **All legal text in all supported languages**, including やさしい日本語. Consent obtained against text the patient cannot read is not informed consent — this is a launch blocker, not a nice-to-have.
- **Versioning and re-consent.** Both documents carry a version and effective date; a material change triggers re-consent for patients with future bookings.
- **Controller / processor roles.** The division of responsibility between Findadoc and the clinic for intake and medical data must be documented in a written agreement (§9.8, §9.14).
- **Legal review.** Bilingual review by someone competent in APPI and Japanese telemedicine guidance, before the test-operation period rather than before launch, so findings can still change the build.

## 7. Non-Functional Requirements

- **Extensibility:** architecture should allow additional clinics to be added later (multi-clinic support), and additional languages without changes to the data model. The existing slot model already carries facility and practitioner references, so multi-clinic is structurally feasible (Appendix A.1). Adding a *language*, however, currently requires code and translation-file changes; "without code changes" is not achievable on the current i18n setup and is restated here as "without schema changes" (Appendix A.2).
- **Privacy:** personal identifying information and medical information should be separable in storage and export, in line with the project's data-handling approach. Access to patient data restricted to coordinator/admin roles. Note that the current platform grants reservation read/write to every authenticated user and has no coordinator role — this requirement is presently violated by the existing scaffolding (Appendix A.3).
- **Reliability:** booking and payment flows must fail safely; no reservation is confirmed without completed payment (or verified transfer).
- **Auditability:** creation, modification, cancellation and export of bookings must be logged with actor and timestamp. Audit records must not themselves duplicate medical free-text (Appendix A.3).
- **Hosting/cost:** operating cost consistent with an NPO/volunteer-run service.

## 8. Timeline

| Period | Milestone |
|---|---|
| July 2026 | Booking-team meeting with clinic side before the next Toyota project monitoring meeting; requirements agreed |
| Aug–Sep 2026 | Detailed wireframes and user flows (Kei); build |
| Sep–Oct 2026 | Test operation with coordinators and migrant community leaders |
| Nov–Dec 2026 | Patient consultations launch, preceded by community outreach |

**Schedule risk (as of 2026-07-30).** No patient-facing booking code exists in either repository, and three requirements — document upload (§6.4), payment (§6.5) and Excel export (§6.7) — need infrastructure that does not exist today (Appendix A.4). Legal revision (§6.8) is on the critical path and depends on external review. Aug–Sep for wireframes *and* build, with test operation starting in September, is not realistic for the full scope.

Recommendation: adopt the interim option in §9.7 (see answer below) to protect the Nov–Dec consultation launch, and treat the full system as a Q1 2027 target with the test-operation period used to validate the intake question set and the coordinator's manual workflow.

## 9. Open Questions

1. Credit card authentication method (auth-only vs. capture at booking; provider selection).
2. Feasibility and method of My Number / MyNa Portal integration vs. guided manual submission.
3. Final consultation fee and its display breakdown; handling of the ¥550 system usage fee. Note §6.1 and §9.3 currently disagree on whether the fee is inclusive.
4. Bank transfer flow: verification method and who bears transfer fees.
5. Flow for uninsured / payment-difficulty patients (fee-exemption slots begin post break-even per the Toyota plan).
6. Interpreter service integration (phone vs. video; e.g. Melifone) — whether the booking system records interpreter assignment or this remains manual. **Note:** the current data model has no interpreter field at all, so unless one is added this remains manual by default.
7. Whether Google Forms + Excel serves as an interim v0 while the full system is built. **Recommendation: yes.** The gap between the current state and a production flow handling payments and uploaded identity documents is not deliverable in the remaining schedule (§8). An interim v0 still needs the §6.8 consent and privacy work, since it collects the same data.
8. Who is the data controller for intake and medical data — Findadoc, the clinic, or both jointly? Requires a written data-sharing agreement, and determines who answers patient access/deletion requests.
9. Is telemedicine informed consent collected in the booking flow, or by the clinic at consultation time?
10. Refund, cancellation and no-show policy — including what happens to prepayments when a block does not reach break-even.
11. Are minors eligible? The current terms require users to be 18+, while the privacy policy references a 13+ threshold. A family-facing medical service likely needs a guardian consent flow.
12. Retention period for uploaded insurance and identity images, and for intake data after the consultation.
13. Who owns and funds the bilingual legal review, and by what date.
14. May Findadoc store uploaded insurance/identity documents at all, or must they transit directly to the clinic without Findadoc-side retention?
15. Patient notification channel (email / SMS / LINE) — none exists today, and reminder delivery (§6.6) depends on it.
16. Patient identity model: account-based or tokenised anonymous booking (§6.3).

## 10. References

- Toyota Foundation 2025 特定課題「外国人材の受け入れと日本社会」企画書 (resubmitted version)
- Wireframes (preliminary): https://transcendent-cheesecake-a299e4.netlify.app/
- Minatomachi Clinic English intake flow (Symview): https://symview.me/medical_interview_flows/hg10467/?templateid=T_004535000019&url_kind=1&openExternalBrowser=1
- MINNA meeting minutes 2026-07 (booking-system discussion; first 42 min of recording)
- Findadoc huddle notes 2026-04-05 (#npo-board)

---

# Appendix A — Technical Implementation Status

*Everything below is implementation detail, recorded against the codebase as of 2026-07-30 (`findadoc-web` @ `13fa97b`, `findadoc-server` @ current `main`). It is not part of the product requirements and does not need to be read to review §1–§9.*

## A.1 Reservation scaffolding that already exists

A partial reservation model is already in the codebase and is not mentioned in the requirements. Work should extend it rather than start fresh.

| Artifact | Location | State |
|---|---|---|
| `Reservation` type, `ReservationStatus` enum, create/update inputs | `findadoc-server/src/typeDefs/schema.graphql:313-348` | Defined |
| `reservation(id)` query; `createReservation` / `updateReservation` mutations | `schema.graphql:894-895, 973-977` | Declared |
| `reservation` query resolver, `createReservation` resolver | `findadoc-server/src/resolvers.ts:253-267, 495-511` | Implemented |
| `read:reservations` / `write:reservations` scopes | `findadoc-server/src/auth.ts:20-80` | Implemented, granted to all four roles |
| `Reservation` and `ReservationSlot` Postgres tables, with FKs to `user`, `facilities`, `hps` | `supabase/migrations/20251010153830_remote_schema.sql:84-107, 262-277` | Created, **never read or written by application code** |
| Generated web-side types; access-panel scope toggles | `findadoc-web/typedefs/gqlTypes.ts:820-843`, `utils/accessControlLinks.ts:115-121` | Present |
| One create-reservation test | `findadoc-server/__tests__/reservation.test.ts` | Single case |

`ReservationSlot` already carries `facility_id` and `hp_id`, which is why the multi-clinic extensibility requirement in §7 is considered structurally feasible.

## A.2 Gap analysis against §6

| § | Requirement | Current state |
|---|---|---|
| 6.1 | Landing page, fee, languages, dates | Nothing. `findadoc-web/pages/` contains only index, about, submit, login, my-page, moderation and legal routes. |
| 6.2 | Full multilingual UI, やさしい日本語 | 10 locales exist (`i18n/locales/`), all at key parity (374 keys). No やさしい日本語 locale. The GraphQL `Locale` enum lists ~40 languages (`typedefs/gqlTypes.ts:360+`) but only 10 are wired up. Adding one requires editing `i18n/index.ts`, adding a JSON file, and satisfying the `lint:locales` parity check — hence the §7 wording change. Mobile-first foundation (Tailwind + `nuxt-viewport`) is in place and sound. |
| 6.3 | Registration and intake fields | The `user` table holds only `display_name` and `profile_pic_url` (migration lines 194-201). No name reading, nationality, DOB, contact, symptoms, proficiency or interpreter fields anywhere; no intake table. |
| 6.4 | Insurance document upload | **No upload capability in either repo.** Supabase storage buckets are commented out (`supabase/config.toml:112-113`). The only `type="file"` input in the web app (`components/ProfilePage.vue:122-129`) is a client-side `FileReader` preview that uploads nothing. |
| 6.5 | Payment | No payment provider, SDK or dependency in either repo. Note that `facilities.payment_options` (migration `20260309141333`) is directory metadata describing what a clinic accepts in person — unrelated to booking payment, and should not be mistaken for it. |
| 6.6 | Blocks, capacity, notifications | Partial schema only; see A.3 items 3 and 6. No notification or email infrastructure of any kind exists. |
| 6.7 | Excel export | Nothing. No `xlsx` / `exceljs` / CSV code in either repo. |
| 6.8 | Consent capture | No consent checkbox in the app and no consent record in the schema. See A.5. |

## A.3 Defects in the existing reservation code

These are live issues that will surface as soon as the reservation model is picked up.

1. **`updateReservation` has no resolver.** Declared in the schema returning non-null `Reservation!` (`schema.graphql:977`) but absent from `resolvers.ts`. Calling it errors at runtime — cancellation (§6.6) has no working path.
2. **The service never touches the database.** `src/services/reservationService.ts:8` is a module-level in-memory array; data is lost on every restart. The Kysely `Database` interface (`src/typeDefs/kyselyTypes.ts:107-113`) doesn't even list the reservation tables.
3. **`Reservation.status` has the wrong column type.** The DB column is `action_type_enum` — `CREATE`/`UPDATE`/`DELETE` (migration lines 52-56, 89) — while GraphQL expects `BOOKED`/`CANCELLED`/`FULFILLED`. Persisting the current model will fail on insert. Needs a new enum plus migration, and the §6.6 state list is wider than either.
4. **No ownership check on reservation access.** `createReservation` accepts a client-supplied `input.userId` and never compares it to `context.user`; the `reservation(id)` query performs no ownership check either. Every role including base `User` holds both `read:reservations` and `write:reservations` (`src/auth.ts:76-80`). Any authenticated user can therefore read any reservation by ID and create bookings attributed to anyone else. This directly violates the §7 privacy requirement and must be fixed before any real patient data exists.
5. **The `user` table has no Auth0 linkage.** There is no `sub` / `auth0_id` column, so the server cannot resolve the authenticated caller to a `user` row — which is why item 4 cannot be fixed without a schema change. This also blocks the account-based option in §6.3.
6. **`ReservationSlot` models one patient per slot** (`is_booked boolean`), whereas §6.6 requires a block with configurable capacity (~12 patients per 4-hour block). Needs remodelling, plus a uniqueness or locking strategy — nothing today prevents double-booking.
7. **No row-level security.** No `ENABLE ROW LEVEL SECURITY` or policies in any migration; the server connects with the Supabase service-role key (`src/supabaseClient.ts`). Defensible for a public directory, thin for medical intake.
8. **Audit logging cannot cover reservations, and would leak if it did.** `object_type_enum` admits only `Facility`, `HealthcareProfessional` and `Submission`, so bookings can't be recorded. Meanwhile `audit_logs` stores whole rows as JSONB in `new_value`/`old_value` — if reservations were added naively, symptoms and insurance data would land there in plaintext, defeating the §7 separability requirement.
9. **No "Coordinator" role.** `Role` is `Admin | Moderator | Dev | User` (`src/auth.ts:11-16`). The §4 coordinator, who needs patient-data and export access but not platform moderation rights, has no representation.

## A.4 Architectural constraint: the web app has no server runtime

`findadoc-web` is a client-rendered static site deployed to Netlify — `ssr: false` (`nuxt.config.ts:26`), SPA catch-all redirect and `Access-Control-Allow-Origin = "*"` (`netlify.toml`). There are no Nuxt server routes and no Netlify functions. The GraphQL client talks directly to `https://api.findadoc.jp` from the browser, attaching an Auth0 bearer token (`utils/graphql.ts:12-20, 38-47`).

Payment secrets, file upload, payment-provider webhooks and Excel generation all require a trusted server context. So §6.4, §6.5 and §6.7 imply one of:

1. Adding server routes or Netlify functions to `findadoc-web`, changing its deployment model; or
2. Putting all of it behind `findadoc-server` (Fastify + Apollo + Supabase); or
3. Accepting the §9.7 interim option.

**Recommended:** option 2 — booking logic in `findadoc-server`, uploads to Supabase Storage via short-lived signed URLs, export as an authenticated server endpoint. The web app stays a static client, and no secret ever reaches it.

## A.5 Legal page audit

**Terms and Conditions — `findadoc-web/pages/terms.vue` (200 lines)**

- **Entirely hardcoded English.** No `useI18n`, no `t()` calls anywhere in the file. The terms are therefore English-only for all 10 locales, while the rest of the app is translated. For a booking flow that depends on informed consent, this is a blocker (§6.8).
- Sections present: Acceptance, Use of the Website, User-Provided Content, Privacy, Limitation of Liability, Termination, Changes, Governing Law.
- **Section 2 duplicates section 1's body text verbatim** (line 30 repeats line 17) — a copy-paste error; "Use of the Website" has no body of its own.
- Eligibility states users "must be at least 18 years old" (line 43), which conflicts with a family-facing medical service and with the privacy policy's 13+ reference. See §9.11.
- No version or effective date.
- Nothing on medical services, payment, refunds, cancellation, no-shows, telemedicine, interpreters, or data retention. The liability section disclaims *directory accuracy* and states Findadoc "does not provide medical advice" — appropriate for a search product, insufficient once Findadoc is the booking intermediary for an actual consultation.
- Linked from `components/Footer.vue:25` and `components/HamburgerMenu.vue:210`.

**Privacy Policy — `findadoc-web/pages/privacypolicy.vue` (75 lines)**

- Properly internationalised via the `privacyPage.*` keys, present in all 10 locale files. Good baseline to extend.
- **Effective Date: December 3, 2023** — stale.
- Scope is search behaviour only: it states the information collected is "your preferred language, search queries, and any feedback you choose to share." It does not mention health or medical information, identity or insurance documents, payment data, or provision to a clinic, interpreter service or payment processor. Every category the booking system introduces is outside the current policy's stated scope.
- Stated purposes (personalisation, service improvement, communication) do not cover booking or clinical use.
- Children's privacy clause says the service is "not directed at individuals under the age of 13," inconsistent with the terms' 18+ eligibility.
- Claims "industry-standard encryption" and restricted access. Given A.3 items 4 and 7, that claim needs the access-control fixes to become accurate before it applies to patient data.
- No retention periods, no deletion mechanism, no cross-border transfer statement, no named contact for access requests.

**Consent capture**

No consent checkbox exists anywhere in the app, and there is no consent record in the schema. §6.8 requires both.

## A.6 Suggested build order

1. Fix A.3 items 4, 5 and 9 (identity linkage, ownership checks, coordinator role) — prerequisite for handling any real patient data, and cheap now.
2. Decide §6.3 identity model and §9.8 controller roles; both gate schema design.
3. Remodel `Reservation` / `ReservationSlot` for block capacity, correct status enum, and DB-backed persistence (A.3 items 1, 2, 3, 6).
4. Legal revision and translation (§6.8) in parallel from the start — it has external dependencies and the longest lead time.
5. Intake and consent capture, then upload, then payment, then export.
