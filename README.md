# puzzmo-stats

A Lit-based web component for displaying Puzzmo streak stats from ATProto records.

[Learn more](https://blog.puzzmo.com/posts/2026/03/02/bsky/) about Puzzmo's ATProto integration

## Installation

Install the package and its peer dependency:

```sh
npm install puzzmo-stats lit @lit/task
```

For local development in this repository:

```sh
npm install
```

## Usage

See [the demo](./demo/index.html) for an example.

Import the component once in your application entrypoint:

```ts
import "puzzmo-stats";
```

Then use the custom element in HTML:

```html
<puzzmo-stats handle="cbennell.com"></puzzmo-stats>
```

The `handle` attribute should be a Bluesky/ATProto handle that has Puzzmo streak records in the `com.puzzmo.streak` collection.

## CDN / Script Usage

The package build includes an IIFE bundle for direct script usage:

```html
<script src="./dist/puzzmo-stats.iife.min.js"></script>
<puzzmo-stats handle="cbennell.com"></puzzmo-stats>
```

The IIFE bundle includes Lit and `@lit/task`. The ESM package build keeps those dependencies external.

## Todo

- Add further visual customization with CSS custom properties
- Allow users to exclude certain games
- Customize date format
- Allow initialization with DID/PDS to save requests
- Compare mode: show sttats for two users

## Configuration

### Attributes

| Attribute | Property | Type     | Required | Description                                                    |
| --------- | -------- | -------- | -------- | -------------------------------------------------------------- |
| `handle`  | `handle` | `string` | Yes      | ATProto handle used to resolve and load Puzzmo streak records. |

## Styling

The component ships with default shadow-DOM styles. Consumers can customize supported styling hooks with CSS custom properties applied to the host element.

```css
puzzmo-stats {
  --puzzmo-stats-spacing: 1rem;
  --puzzmo-stats-font-size-stat: 2rem;
  --puzzmo-stats-font-display: Georgia, serif;
  --puzzmo-stats-color-label: #666;
  --puzzmo-stats-border-color: #d8d8d8;
  --puzzmo-stats-icon-size: 28px;
  --puzzmo-stats-icon-foreground: #141620;
  --puzzmo-stats-icon-background: #ececec;
}
```

Icon color values may include or omit the leading `#`. If icon colors are not set, the component picks defaults from the user's preferred light/dark color scheme.

The component also falls back to these app-level design tokens when present:

| Component Variable               | Default                     |
| -------------------------------- | --------------------------- |
| `--puzzmo-stats-spacing`         | `1rem`                      |
| `--puzzmo-stats-font-size-stat`  | `2rem`                      |
| `--puzzmo-stats-font-display`    | `inherit`                   |
| `--puzzmo-stats-label-color`     | `#666`                      |
| `--puzzmo-stats-border-color`    | `#d8d8d8`                   |
| `--puzzmo-stats-icon-size`       | `28px`                      |
| `--puzzmo-stats-icon-foreground` | Light/dark scheme dependent |
| `--puzzmo-stats-icon-background` | Light/dark scheme dependent |

## Development

Start the dev server with automatic rebuilds and browser reloads:

```sh
npm run dev
```

Open the `/demo/` URL printed by the dev server. It uses port `3000` by default and falls back to another available port if needed.

Request a specific port:

```sh
PORT=3001 npm run dev
```

## Build

Create distributable files:

```sh
npm run build
```

Build outputs:

| File                            | Purpose                                                    |
| ------------------------------- | ---------------------------------------------------------- |
| `dist/puzzmo-stats.js`          | ESM package build with `lit` and `@lit/task` externalized. |
| `dist/puzzmo-stats.dev.js`      | Bundled ESM build for the local demo page.                 |
| `dist/puzzmo-stats.iife.min.js` | Bundled/minified script build for direct browser usage.    |
| `dist/*.d.ts`                   | TypeScript declaration files.                              |
| `dist/*.map`                    | Source maps and declaration maps.                          |

Run all checks:

```sh
npm run check
```

`npm run check` runs TypeScript typechecking, the test suite, and a full production build.

## Testing

Run the test suite once:

```sh
npm test
```

Run tests in watch mode while developing:

```sh
npm run test:watch
```

Tests use Vitest with `happy-dom`. The current suite prioritizes low-maintenance coverage for the most important behavior:

| Test File                     | Coverage                                                          |
| ----------------------------- | ----------------------------------------------------------------- |
| `test/format.test.ts`         | Date display formatting.                                          |
| `test/puzzmo-icons.test.ts`   | Puzzmo icon URL generation and CSS-style hex color normalization. |
| `test/puzzmo-streaks.test.ts` | Record loading behavior, filtering, sorting, and normalization.   |
| `test/puzzmo-stats.test.ts`   | Custom-element registration and basic render states.              |

## Package Design

The source is split by responsibility:

| File                    | Responsibility                                                       |
| ----------------------- | -------------------------------------------------------------------- |
| `src/puzzmo-stats.ts`   | Lit custom element and rendering.                                    |
| `src/puzzmo-streaks.ts` | Puzzmo streak record loading, filtering, sorting, and normalization. |
| `src/puzzmo-icons.ts`   | Puzzmo icon URL and color-scheme helpers.                            |
| `src/format.ts`         | Display formatting helpers.                                          |
| `src/lib/atproto.ts`    | ATProto handle, PDS, and record APIs.                                |

## Browser Support

The package targets modern browsers with native custom elements, shadow DOM, ES modules, and `fetch` support.
