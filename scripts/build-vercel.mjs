/**
 * Vercel Build Output API adapter for TanStack Start.
 *
 * The adapter is written as a plain CJS file (no bundling of the adapter
 * itself) so there are no ESM→CJS conversion artefacts. The TanStack Start
 * SSR bundle (server.js + assets/) is copied into the function directory and
 * loaded at runtime via Node.js 20's native dynamic import().
 */

import { execSync } from "child_process";
import { mkdirSync, cpSync, copyFileSync, writeFileSync, existsSync, rmSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const vercelOut = resolve(root, ".vercel/output");

// ── 1. Clean ──────────────────────────────────────────────────────────────────
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
mkdirSync(resolve(vercelOut, "static/assets"), { recursive: true });
cpSync(resolve(root, "dist/client/assets"), resolve(vercelOut, "static/assets"), { recursive: true });

// ── 4. Function directory ─────────────────────────────────────────────────────
const funcDir = resolve(vercelOut, "functions/index.func");
mkdirSync(resolve(funcDir, "assets"), { recursive: true });

// Copy server entry and all its chunk assets.
copyFileSync(resolve(root, "dist/server/server.js"), resolve(funcDir, "server.js"));
for (const f of readdirSync(resolve(root, "dist/server/assets"))) {
  copyFileSync(resolve(root, "dist/server/assets", f), resolve(funcDir, "assets", f));
}

// ── 5. Write the CJS adapter ──────────────────────────────────────────────────
// Use .cjs extension — always CJS in Node.js regardless of package.json "type".
// This lets server.js keep its native ESM format.
writeFileSync(
  resolve(funcDir, "index.cjs"),
  `"use strict";
const path = require("path");
const { Readable } = require("stream");

let _server;
async function getServer() {
  if (!_server) {
    // Use a file:// URL so Node.js 20 resolves it correctly.
    const url = new URL("file://" + path.join(__dirname, "server.js"));
    const m = await import(url);
    _server = (m && m.default) || m;
  }
  return _server;
}

module.exports = async function handler(req, res) {
  try {
    const server = await getServer();

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host  = req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
    const url   = new URL(req.url || "/", proto + "://" + host);

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      if (Array.isArray(v)) v.forEach(function(val) { headers.append(k, val); });
      else headers.set(k, v);
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const init = { method: req.method || "GET", headers: headers };
    if (hasBody) { init.body = Readable.toWeb(req); init.duplex = "half"; }

    const webResponse = await server.fetch(new Request(url.toString(), init), {}, {});
    res.statusCode = webResponse.status;
    webResponse.headers.forEach(function(v, k) { res.setHeader(k, v); });
    if (webResponse.body) {
      Readable.fromWeb(webResponse.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    console.error("[vercel-adapter] fatal:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Internal Server Error: " + (err && err.message));
  }
};
`,
);

// ── 6. Function metadata ──────────────────────────────────────────────────────
writeFileSync(
  resolve(funcDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.cjs",
      launcherType: "Nodejs",
      supportsResponseStreaming: true,
    },
    null,
    2,
  ),
);

// ── 7. Routing ────────────────────────────────────────────────────────────────
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
