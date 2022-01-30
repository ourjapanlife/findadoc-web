export const FeaturedNews = () => import('../../components/FeaturedNews.vue' /* webpackChunkName: "components/featured-news" */).then(c => wrapFunctional(c.default || c))
export const Media = () => import('../../components/Media.vue' /* webpackChunkName: "components/media" */).then(c => wrapFunctional(c.default || c))
export const TopNav = () => import('../../components/TopNav.vue' /* webpackChunkName: "components/top-nav" */).then(c => wrapFunctional(c.default || c))
export const Welcome = () => import('../../components/Welcome.vue' /* webpackChunkName: "components/welcome" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
