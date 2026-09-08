import { defineEventHandler } from 'h3'
import { loadDirectorySitemapUrls } from '~/utils/sitemapDirectory'

export default defineEventHandler(() => loadDirectorySitemapUrls())
