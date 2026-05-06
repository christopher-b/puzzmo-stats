import * as esbuild from "esbuild";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const watch = process.argv.includes("--watch");

const localNodeModulesPlugin = {
  name: "local-node-modules",
  setup(build) {
    build.onResolve({ filter: /^[^./]|^@/ }, (args) => ({
      path: require.resolve(args.path, { paths: [process.cwd()] }),
    }));
  },
};

const shared = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  target: "es2022",
};

const libraryBuild = {
  ...shared,
  format: "esm",
  outfile: "dist/puzzmo-stats.js",
  external: ["lit", "lit/*"],
};

const demoBuild = {
  ...shared,
  format: "esm",
  outfile: "dist/puzzmo-stats.dev.js",
  plugins: [localNodeModulesPlugin],
};

const iifeBuild = {
  ...shared,
  format: "iife",
  globalName: "PuzzmoStats",
  outfile: "dist/puzzmo-stats.iife.min.js",
  minify: true,
  plugins: [localNodeModulesPlugin],
};

if (watch) {
  const ctx = await esbuild.context(demoBuild);

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

  console.log(`dev server running at http://${server.host ?? "localhost"}:${server.port}/demo/`);
} else {
  await Promise.all([esbuild.build(libraryBuild), esbuild.build(demoBuild), esbuild.build(iifeBuild)]);

  console.log("build complete");
}
