/**
 * Vercel Build Output API adapter for TanStack Start.
 *
 * What this does:
 *  1. Runs `vite build` with VERCEL=1 so @cloudflare/vite-plugin is skipped.
 *     TanStack Start then compiles the server as a plain Node.js ESM module.
 *  2. Copies dist/client/assets → .vercel/output/static/assets  (CDN-served)
 *  3. Creates a CJS adapter that bridges Vercel's (req,res) API to TanStack
 *     Start's { fetch(request) } API via dynamic import() of the ESM server.
 *  4. Bundles only the thin CJS adapter with esbuild; copies the ESM server
 *     bundle alongside it so the dynamic import resolves at runtime.
 *  5. Writes .vercel/output/config.json so all non-asset requests hit the SSR
 *     function.
 */

import { execSync } from "child_process";
import {
  mkdirSync,
  cpSync,
  copyFileSync,
  writeFileSync,
  existsSync,
  rmSync,
  readdirSync,
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const vercelOut = resolve(root, ".vercel/output");

// ── 1. Clean previous output ─────────────────────────────────────────────────
if (existsSync(vercelOut)) rmSync(vercelOut, { recursive: true });

// ── 2. Build (VERCEL=1 disables @cloudflare/vite-plugin) ─────────────────────
console.log("[vercel-build] Running vite build (CF plugin disabled)…");
execSync("npm run build", {
  cwd: root,
  env: { ...process.env, VERCEL: "1" },
  stdio: "inherit",
});

// ── 3. Static assets → .vercel/output/static ─────────────────────────────────
console.log("[vercel-build] Copying static assets…");
const staticDir = resolve(vercelOut, "static/assets");
mkdirSync(staticDir, { recursive: true });
cpSync(resolve(root, "dist/client/assets"), staticDir, { recursive: true });

// ── 4. Create CJS adapter ─────────────────────────────────────────────────────
// TanStack Start's server is an ESM module that exports { fetch(req, env, ctx) }.
// Vercel's Node.js launcher calls a CJS module.exports function with (req, res).
// We use a CJS wrapper that loads the ESM server via dynamic import().
const adapterSrc = resolve(root, "dist/server/_vercel_adapter.cjs");
writeFileSync(
  adapterSrc,
  `"use strict";
const { Readable } = require("node:stream");

let _server;
async function getServer() {
  if (!_server) {
    const m = await import("./server.js");
    _server = m.default ?? m;
  }
  return _server;
}

module.exports = async function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host  = req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "localhost";
  const url   = new URL(req.url ?? "/", proto + "://" + host);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) v.forEach(function(val) { headers.append(k, val); });
    else headers.set(k, v);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const webRequest = new Request(url.toString(), Object.assign(
    { method: req.method ?? "GET", headers },
    hasBody ? { body: Readable.toWeb(req), duplex: "half" } : {}
  ));

  const server = await getServer();
  const webResponse = await server.fetch(webRequest, {}, {});

  res.statusCode = webResponse.status;
  webResponse.headers.forEach(function(v, k) { res.setHeader(k, v); });

  if (webResponse.body) {
    Readable.fromWeb(webResponse.body).pipe(res);
  } else {
    res.end();
  }
};
`,
);

// ── 5. Bundle CJS adapter (mark server.js external — loaded via dynamic import) ─
console.log("[vercel-build] Bundling CJS adapter…");
const funcDir = resolve(vercelOut, "functions/index.func");
mkdirSync(funcDir, { recursive: true });

execSync(
  [
    "node_modules/.bin/esbuild",
    adapterSrc,
    "--bundle",
    "--format=cjs",
    "--platform=node",
    "--target=node20",
    "--external:./server.js",
    `--outfile=${funcDir}/index.js`,
  ].join(" "),
  { cwd: root, stdio: "inherit" },
);

// ── 6. Copy ESM server bundle next to the CJS wrapper ────────────────────────
// The dynamic import("./server.js") inside index.js resolves from funcDir.
const funcAssetsDir = resolve(funcDir, "assets");
mkdirSync(funcAssetsDir, { recursive: true });

copyFileSync(
  resolve(root, "dist/server/server.js"),
  resolve(funcDir, "server.js"),
);
for (const f of readdirSync(resolve(root, "dist/server/assets"))) {
  copyFileSync(
    resolve(root, "dist/server/assets", f),
    resolve(funcAssetsDir, f),
  );
}

// ── 7. Vercel function metadata ───────────────────────────────────────────────
writeFileSync(
  resolve(funcDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.js",
      launcherType: "Nodejs",
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);

// ── 8. Routing ────────────────────────────────────────────────────────────────
writeFileSync(
  resolve(vercelOut, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: "/assets/(.*)",
          headers: { "Cache-Control": "public, max-age=31536000, immutable" },
          continue: true,
        },
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index" },
      ],
    },
    null,
    2,
  ),
);

console.log("[vercel-build] Done → .vercel/output/");
