import * as esbuild from "esbuild";
import { readFile } from "node:fs/promises";

const pkg = JSON.parse(await readFile("package.json", "utf8"));

const watch = process.argv.includes("--watch");

// Automatically externalize all peer dependencies and subpaths
const peerDeps = Object.keys(pkg.peerDependencies || {});
const external = [...peerDeps, ...peerDeps.map((d) => `${d}/*`)];

const shared = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  target: ["es2022"],
  platform: "browser",
  logLevel: "info",
};

// ---- ESM library build (for bundlers) ----
const esm = {
  ...shared,
  format: "esm",
  outfile: "dist/puzzmo-stats.js",
  external,
};

// ---- Dev build (for demo page) ----
const dev = {
  ...shared,
  format: "esm",
  outfile: "demo/puzzmo-stats.dev.js",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

// ---- IIFE build (for <script> usage) ----
const iife = {
  ...shared,
  format: "iife",
  sourcemap: false,
  globalName: "PuzzmoStats",
  outfile: "dist/puzzmo-stats.iife.min.js",
  minify: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

if (watch) {
  const ctx = await esbuild.context(dev);
  await ctx.watch();

  const requestedPort = Number(process.env.PORT ?? 3000);
  let server;

  try {
    server = await ctx.serve({
      servedir: ".",
      port: requestedPort,
    });
  } catch (error) {
    if (!String(error).includes("address already in use")) {
      throw error;
    }

    server = await ctx.serve({
      servedir: ".",
      port: 0,
    });
  }

  console.log(`Dev server running at http://localhost:${server.port}/demo/`);
} else {
  await Promise.all([
    esbuild.build(esm),
    esbuild.build(dev),
    esbuild.build(iife),
  ]);

  console.log("✔ Build complete");
}
