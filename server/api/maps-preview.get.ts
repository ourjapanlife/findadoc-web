import { createError, defineEventHandler, getQuery } from 'h3'
import { isResolvableShortMapsUrl } from '~/utils/formValidations'
import { resolveMapsPlace } from '~/utils/mapsLinkPreview'

export default defineEventHandler(async event => {
    const url = getQuery(event).url
    if (typeof url !== 'string' || url.length > 2000 || !isResolvableShortMapsUrl(url)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid Maps link' })
    }

    const place = await resolveMapsPlace(url)
    if (!place) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid Maps link' })
    }

    return {
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        placeId: place.placeId,
        resolvedUrl: place.resolvedUrl
    }
})
