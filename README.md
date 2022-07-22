# findadoc-web

# 🧭 Mission

Connecting people in Japan to the healthcare services they need, in the languages they need

# 🔭 Vision

We want to provide free, accessible, and quality healthcare information in multiple languages

## What is this repo?

This is the open-source, public repository for the [findadoc.jp](htttps://findadoc.jp) Website! We welcome support and contributions :) 

## Tech used
- Typescript/Javascript
- Vue3
- Nuxt3
- Pinia
- Nodejs
- Vue-router
- ohMyFetch

## Getting started developing

```bash
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
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components/`

The components directory contains our Vue.js components. Components make up the different parts of our page and can be reused and imported into the pages, layouts and even other components.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Used for building the common templates of the news articles
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

Contains all the pages of the site. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `static`

This directory contains our static files. Each file inside this directory is mapped to `/`.
Example: `/static/robots.txt` is mapped as `/robots.txt`.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `stores`

Contains Pinia store files for state management and data fetching. 
