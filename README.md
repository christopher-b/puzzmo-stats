# puzzmo-stats

A small Lit-based web component package.

## Development

Install dependencies:

```sh
npm install
```

Start the dev server with automatic reloads:

```sh
npm run dev
```

Open the `/demo/` URL printed by the dev server. It uses port `3000` by default and falls back to another available port if needed. Set `PORT=3001 npm run dev` to request a specific port.

## Build

```sh
npm run build
```

The package ESM build is emitted to `dist/puzzmo-stats.js` and keeps `lit` external as a peer dependency. The IIFE build at `dist/puzzmo-stats.iife.min.js` bundles dependencies for direct script usage.

## Check

```sh
npm run check
```
