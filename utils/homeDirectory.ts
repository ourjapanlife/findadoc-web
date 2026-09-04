import { Locale, SpecialtyCategory } from '~/typedefs/gqlTypes'

/**
 * Entry points for the homepage.
 *
 * These are static on purpose. The homepage must not pay for an API round trip before
 * it can paint, and the API exposes no facet endpoint — deriving any of this at runtime
 * means paging the entire facility table, which is the cost the homepage exists to avoid.
 *
 * Measured against production on 2026-09-02. Re-measure when the directory grows.
 */
export interface PrefectureEntry {
    /** Must match `contact.address.prefectureEn` exactly — it is used as the filter value. */
    name: string
    /** Shown to Japanese readers. Place names are data, not UI copy, so they are not i18n keys. */
    nameJa: string
    approximateFacilities: number
}

/**
 * Every prefecture that currently has at least one facility, ordered by how many.
 *
 * Ordered by volume rather than alphabetically because the distribution is extreme —
 * Tokyo has 96 and Nagasaki has 1 — so the first handful covers most searches, and the
 * ordering itself tells the reader where coverage actually is.
 */
export const ALL_PREFECTURES: readonly PrefectureEntry[] = [
    { name: 'Tokyo', nameJa: '東京都', approximateFacilities: 96 },
    { name: 'Fukuoka', nameJa: '福岡県', approximateFacilities: 68 },
    { name: 'Osaka', nameJa: '大阪府', approximateFacilities: 43 },
    { name: 'Mie', nameJa: '三重県', approximateFacilities: 34 },
    { name: 'Hokkaido', nameJa: '北海道', approximateFacilities: 32 },
    { name: 'Tokushima', nameJa: '徳島県', approximateFacilities: 14 },
    { name: 'Tochigi', nameJa: '栃木県', approximateFacilities: 13 },
    { name: 'Ishikawa', nameJa: '石川県', approximateFacilities: 13 },
    { name: 'Hyogo', nameJa: '兵庫県', approximateFacilities: 12 },
    { name: 'Kagoshima', nameJa: '鹿児島県', approximateFacilities: 12 },
    { name: 'Fukui', nameJa: '福井県', approximateFacilities: 12 },
    { name: 'Yamanashi', nameJa: '山梨県', approximateFacilities: 11 },
    { name: 'Toyama', nameJa: '富山県', approximateFacilities: 11 },
    { name: 'Yamaguchi', nameJa: '山口県', approximateFacilities: 10 },
    { name: 'Akita', nameJa: '秋田県', approximateFacilities: 9 },
    { name: 'Miyagi', nameJa: '宮城県', approximateFacilities: 9 },
    { name: 'Okinawa', nameJa: '沖縄県', approximateFacilities: 8 },
    { name: 'Yamagata', nameJa: '山形県', approximateFacilities: 8 },
    { name: 'Kumamoto', nameJa: '熊本県', approximateFacilities: 6 },
    { name: 'Iwate', nameJa: '岩手県', approximateFacilities: 6 },
    { name: 'Fukushima', nameJa: '福島県', approximateFacilities: 6 },
    { name: 'Niigata', nameJa: '新潟県', approximateFacilities: 6 },
    { name: 'Nagano', nameJa: '長野県', approximateFacilities: 5 },
    { name: 'Ehime', nameJa: '愛媛県', approximateFacilities: 5 },
    { name: 'Kochi', nameJa: '高知県', approximateFacilities: 3 },
    { name: 'Kanagawa', nameJa: '神奈川県', approximateFacilities: 3 },
    { name: 'Oita', nameJa: '大分県', approximateFacilities: 2 },
    { name: 'Saga', nameJa: '佐賀県', approximateFacilities: 2 },
    { name: 'Aomori', nameJa: '青森県', approximateFacilities: 1 },
    { name: 'Saitama', nameJa: '埼玉県', approximateFacilities: 1 },
    { name: 'Aichi', nameJa: '愛知県', approximateFacilities: 1 },
    { name: 'Miyazaki', nameJa: '宮崎県', approximateFacilities: 1 },
    { name: 'Nagasaki', nameJa: '長崎県', approximateFacilities: 1 }
] as const

/**
 * The directory's size, measured against production on 2026-09-02.
 *
 * Shown on the homepage and the about page. Carried statically for the same reason as the
 * prefecture list, and framed in copy as approximate so it never reads as a live counter.
 * Re-measure when the directory grows — the query is in docs/refresh-audit.md, Appendix.
 */
export const DIRECTORY_STATS = {
    facilities: 465,
    professionals: 400,
    languages: 14
} as const

/** The subset shown as chips under "Browse by area". The dropdown offers all of them. */
export const TOP_PREFECTURES: readonly PrefectureEntry[] = ALL_PREFECTURES.slice(0, 8)

/**
 * Every language at least one registered professional speaks, most-spoken first.
 *
 * Deliberately not the whole `Locale` enum, which carries 40+ values: offering a
 * language nobody in the directory speaks sends the user to a guaranteed empty result.
 */
export const SEARCHABLE_LANGUAGES: readonly Locale[] = [
    Locale.JaJp,
    Locale.EnUs,
    Locale.ZhCn,
    Locale.KoKr,
    Locale.FrFr,
    Locale.ZhHk,
    Locale.DeDe,
    Locale.TlPh,
    Locale.EsEs,
    Locale.ArAe,
    Locale.IdId,
    Locale.NeNp,
    Locale.NlBe,
    Locale.SwKe
] as const

/** The category tiles under "Browse by need", in the order they are shown. */
export const BROWSE_CATEGORIES: readonly SpecialtyCategory[] = [
    SpecialtyCategory.PrimaryCare,
    SpecialtyCategory.Dental,
    SpecialtyCategory.MentalHealth,
    SpecialtyCategory.ChildrensHealth,
    SpecialtyCategory.WomensHealth,
    SpecialtyCategory.Dermatology,
    SpecialtyCategory.EyeAndVision,
    SpecialtyCategory.Ent
] as const
