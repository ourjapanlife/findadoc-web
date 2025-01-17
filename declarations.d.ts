/* eslint-disable @typescript-eslint/no-empty-object-type */

/*
This is a patch for outdated packages that still use `@vue/runtime-core` to augment the `vue` namespace.
We can remove this file once all packages update their code.
Removing this might show TypeScript linting errors.
https://nuxt.com/blog/v3-13#vue-typescript-changes
*/

import type {
    ComponentCustomOptions as _ComponentCustomOptions,
    ComponentCustomProperties as _ComponentCustomProperties
} from 'vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends _ComponentCustomProperties {}
    interface ComponentCustomOptions extends _ComponentCustomOptions {}
}
