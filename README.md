# Find a Doc, Japan

🎃 Hacktober friends! Please check out [CONTRIBUTING](/CONTRIBUTING.md) 🎃

## Front-end Repository

# 🧭 Mission

Connecting people in Japan to the healthcare services they need, in the languages they need.

# 🔭 Vision

We want to provide free, accessible, and quality healthcare information in multiple languages.

## What is this repo?

This is the open-source, public repository for the [findadoc.jp](https://findadoc.jp) website! We welcome support and contributions :)

Have a look at the [CONTRIBUTING](/CONTRIBUTING.md) and [CODE_OF_CONDUCT](/CODE_OF_CONDUCT.md) fileS to learn more about how to get started and where we could use your help.

## Tech used

-   [Typescript](https://www.typescriptlang.org/)
-   [Vue 3](https://vuejs.org/)
-   [Nuxt 3](https://nuxtjs.org/)
-   [Pinia](https://pinia.vuejs.org/introduction.html)
-   [Node.js](https://nodejs.org/en/) version 16.18
-   [Yarn](https://yarnpkg.com/)
-   [Vue-router](https://router.vuejs.org/)
-   [ohMyFetch](https://github.com/unjs/ohmyfetch)

### Code Style

-   [ESLint](https://eslint.org/)
-   [Prettier](https://prettier.io/)

## Getting started developing

```bash
# set up husky
$ yarn prepare

# install dependencies
$ yarn install

# For Development, start a dev server with hot reloading at localhost:3000
$ yarn dev
```

## Testing a production build

```
# Generate the production bundle
$ yarn build

# Launch production server
$ yarn start
```

# Folder Structure

### `assets/`

The assets directory contains our uncompiled assets such as Stylus or Sass files, images, or fonts.
Here's more information about the usage of this directory in the [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components/`

The components directory contains our Vue.js components. Components make up the different parts of our page and can be reused and imported into the pages, layouts and even other components.
Here's more information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts/`

Used for building the common templates of the news articles.
Here's more information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages/`

Contains all the pages of the site. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.
Here's more information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `static/`

This directory contains our static files. Each file inside this directory is mapped to `/`.
Example: `/static/robots.txt` is mapped as `/robots.txt`. Here's more information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `stores/`

Contains [Pinia](https://pinia.vuejs.org/introduction.html) store files for state management and data fetching.
