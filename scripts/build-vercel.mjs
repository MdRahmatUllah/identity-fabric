/**
 * Vercel Build Output API adapter for TanStack Start.
 *
 * What this does:
 *  1. Runs `vite build` with VERCEL=1 so @cloudflare/vite-plugin is skipped.
 *     TanStack Start then compiles the server as a plain Node.js ESM module.
 *  2. Copies dist/client/assets → .vercel/output/static/assets  (CDN-served)
 *  3. Bundles dist/server/server.js into a Vercel Node.js Function via esbuild.
 *     A thin adapter converts Node.js req/res ↔ Web standard Request/Response.
 *  4. Writes .vercel/output/config.json so all non-asset requests hit the SSR function.
 */

import { execSync } from "child_process";
import { mkdirSync, cpSync, writeFileSync, existsSync, rmSync } from "fs";
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

// ── 4. Create Node.js adapter entry ──────────────────────────────────────────
// TanStack Start's server exports { async fetch(request, env, ctx) }.
// Vercel Node.js functions receive Node.js IncomingMessage/ServerResponse.
// This adapter bridges the two.
const adapterSrc = resolve(root, "dist/server/_vercel_adapter.mjs");
writeFileSync(
  adapterSrc,
  /* js */ `
import { Readable } from "node:stream";
import serverModule from "./server.js";

const server = serverModule.default ?? serverModule;

export default async function handler(req, res) {
  // Reconstruct the full URL from headers Vercel sets on forwarded requests.
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const host  = req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "localhost";
  const url   = new URL(req.url ?? "/", \`\${proto}://\${host}\`);

  // Build Web-standard Headers from Node.js incoming headers.
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) v.forEach((val) => headers.append(k, val));
    else headers.set(k, v);
  }

  // Requests with a body need the Node.js Readable converted to a Web ReadableStream.
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const webRequest = new Request(url.toString(), {
    method: req.method ?? "GET",
    headers,
    ...(hasBody ? { body: Readable.toWeb(req), duplex: "half" } : {}),
  });

  // Invoke TanStack Start's SSR handler.
  const webResponse = await server.fetch(webRequest, {}, {});

  res.statusCode = webResponse.status;
  webResponse.headers.forEach((v, k) => res.setHeader(k, v));

  if (webResponse.body) {
    Readable.fromWeb(webResponse.body).pipe(res);
  } else {
    res.end();
  }
}
`.trimStart(),
);

// ── 5. Bundle with esbuild (Node.js target) ───────────────────────────────────
console.log("[vercel-build] Bundling Node.js function…");
const funcDir = resolve(vercelOut, "functions/index.func");
mkdirSync(funcDir, { recursive: true });

execSync(
  [
    "node_modules/.bin/esbuild",
    adapterSrc,
    "--bundle",
    "--format=esm",
    "--platform=node",
    "--target=node20",
    `--outfile=${funcDir}/index.mjs`,
  ].join(" "),
  { cwd: root, stdio: "inherit" },
);

// ── 6. Vercel function metadata ───────────────────────────────────────────────
writeFileSync(
  resolve(funcDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);

// ── 7. Routing: CDN assets first, then SSR for everything else ────────────────
writeFileSync(
  resolve(vercelOut, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Hashed assets get long-lived CDN cache.
        {
          src: "/assets/(.*)",
          headers: { "Cache-Control": "public, max-age=31536000, immutable" },
          continue: true,
        },
        // Serve matched static files (e.g. favicon once added).
        { handle: "filesystem" },
        // All other requests → SSR Node.js function.
        { src: "/(.*)", dest: "/index" },
      ],
    },
    null,
    2,
  ),
);

console.log("[vercel-build] Done → .vercel/output/");
