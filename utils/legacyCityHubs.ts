/**
 * Old hub slugs from the facility city backfill (findadoc-server#1011).
 * A slug that still has facilities keeps its current page.
 * The redirect applies once that slug is no longer published.
 */
const LEGACY_CITY_HUBS: Record<string, string> = {
    'fukui|tsurgua': 'tsuruga',
    'fukuoka|chuo-ward': 'fukuoka',
    'fukuoka|east-ward': 'fukuoka',
    'fukuoka|hakata-ward': 'fukuoka',
    'fukuoka|higashi-ward': 'fukuoka',
    'fukuoka|jonan-ward': 'fukuoka',
    'fukuoka|kitakyushu-kokurakita-ward': 'kitakyushu',
    'fukuoka|kitakyushu-kokuraminami-ward': 'kitakyushu',
    'fukuoka|kitakyushu-tobata-ward': 'kitakyushu',
    'fukuoka|kitakyushu-wakamatsu-ward': 'kitakyushu',
    'fukuoka|kokurakita-ward': 'kitakyushu',
    'fukuoka|minami-ward': 'fukuoka',
    'fukuoka|nishi-ward': 'fukuoka',
    'fukuoka|sawara-ward': 'fukuoka',
    'fukuoka|south-ward': 'fukuoka',
    'fukuoka|watanabedori-2-4-28': 'fukuoka',
    'fukuoka|west-ward': 'fukuoka',
    'fukuoka|yahatanishi-ward': 'kitakyushu',
    'hokkaido|esashi-hiyama-district': 'esashi',
    'hokkaido|kutchan-abuta-district': 'kutchan',
    'hokkaido|kutchan-abuta-district-north-4': 'kutchan',
    'hokkaido|sapporo-atsubetsu-ward': 'sapporo',
    'hokkaido|sapporo-chuo-ward': 'sapporo',
    'hokkaido|sapporo-east-ward': 'sapporo',
    'hokkaido|sapporo-nishi-ward': 'sapporo',
    'hokkaido|sapporo-north-ward': 'sapporo',
    'hokkaido|sapporo-toyohira-ward': 'sapporo',
    'hokkaido|sapporo-west-ward': 'sapporo',
    'hokkaido|shimizu-kamikawa-district': 'shimizu',
    'hokkaido|shinhidaka-hidaka-district': 'shinhidaka',
    'hokkaido|toyako-abuta-district': 'toyako',
    'ishikawa|anamizu-hosu-district': 'anamizu',
    'kumamoto|chuo-ward': 'kumamoto',
    'kumamoto|kita-ward': 'kumamoto',
    'kumamoto|minami-ward': 'kumamoto',
    'miyagi|miyagi-district-rifu': 'rifu',
    'miyagi|osaki-matsuyamasengoku': 'osaki',
    'miyagi|sendai-aoba-ward': 'sendai',
    'miyagi|sendai-miyagino-ward': 'sendai',
    'niigata|chuo-ward': 'niigata',
    'niigata|west-ward': 'niigata',
    'osaka|abeno-ward': 'osaka',
    'osaka|chuo-ward': 'osaka',
    'osaka|higashiyodogawa-ward': 'osaka',
    'osaka|naniwa-ward': 'osaka',
    'osaka|nishiyodogawa-ward': 'osaka',
    'osaka|sakai-north-ward': 'sakai',
    'osaka|sakai-south-ward': 'sakai',
    'osaka|sakai-west-ward': 'sakai',
    'osaka|suminoe-ward': 'osaka',
    'osaka|sumiyoshi-ward': 'osaka',
    'osaka|tennoji-ward': 'osaka',
    'osaka|tsurumi-ward': 'osaka',
    'osaka|yodogawa-ward': 'osaka',
    'saitama|urawa-ward': 'saitama',
    'tokyo|bunkyo-city': 'bunkyo',
    'tokyo|chiyoda-city': 'chiyoda',
    'tokyo|chuo-city': 'chuo',
    'tokyo|minato-city': 'minato',
    'tokyo|taito-city': 'taito'
}

export function legacyCityHubSlug(prefectureSlug: string, citySlug: string): string | undefined {
    return LEGACY_CITY_HUBS[`${prefectureSlug}|${citySlug}`]
}

/**
 * Keep a slug that is still published. Fall back to the canonical slug only
 * after the backfill has moved every facility off the old one.
 */
export function cityHubSlugToLoad(
    prefectureSlug: string,
    citySlug: string,
    publishedSlugs: ReadonlySet<string>
): string {
    if (publishedSlugs.has(citySlug)) {
        return citySlug
    }

    return legacyCityHubSlug(prefectureSlug, citySlug) ?? citySlug
}
