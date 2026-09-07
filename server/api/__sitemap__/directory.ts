import { defineSitemapEventHandler } from '#imports'
import { loadDirectorySitemapUrls } from '~/utils/sitemapDirectory'

export default defineSitemapEventHandler(() => loadDirectorySitemapUrls())
