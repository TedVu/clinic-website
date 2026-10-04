// Minimal static server for the exported site, mirroring Cloudflare Pages:
// `/san-khoa` -> `san-khoa.html`, `/` -> `index.html`, unknown paths -> `404.html` (status 404).
// Text responses are Brotli/gzip-compressed, as Cloudflare does, so local performance audits match production.
// Usage: node scripts/serve-static.mjs <dir> <port>
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { brotliCompressSync, constants as zlibConstants, gzipSync } from "node:zlib";

const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".txt", ".xml", ".svg"]);
/** Compressed bodies, cached per file and encoding (output files don't change while serving). */
const compressed = new Map();

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 4000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolvePath(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const base = join(root, clean);
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (await isFile(candidate)) return candidate;
  }
  // Next.js static export on Windows writes prefetch segment files as nested folders
  // (`__next.<id>/san-khoa/__PAGE__.txt`) instead of `__next.<id>.san-khoa.__PAGE__.txt`, because it
  // only converts "/" (not "\") to ".". Linux builds (Cloudflare Pages) are correct; this keeps local
  // testing on Windows equivalent.
  const name = clean.split(/[/\\]/).pop() ?? "";
  if (name.startsWith("__next.") && name.endsWith(".txt")) {
    const [, id, ...segments] = name.slice(0, -4).split(".");
    if (id && segments.length > 0) {
      const nested = join(base, "..", `__next.${id}`, ...segments.slice(0, -1), `${segments.at(-1)}.txt`);
      if (await isFile(nested)) return nested;
    }
  }
  return null;
}

createServer(async (req, res) => {
  const urlPath = new URL(req.url ?? "/", "http://localhost").pathname;
  const file = await resolvePath(urlPath);
  const target = file ?? join(root, "404.html");
  const status = file ? 200 : 404;
  try {
    let body = await readFile(target);
    const headers = { "content-type": types[extname(target)] ?? "application/octet-stream" };
    const accept = String(req.headers["accept-encoding"] ?? "");
    const encoding = accept.includes("br") ? "br" : accept.includes("gzip") ? "gzip" : null;
    if (encoding && COMPRESSIBLE.has(extname(target))) {
      const key = `${encoding}:${target}`;
      if (!compressed.has(key)) {
        compressed.set(
          key,
          encoding === "br"
            ? brotliCompressSync(body, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 } })
            : gzipSync(body),
        );
      }
      body = compressed.get(key);
      headers["content-encoding"] = encoding;
    }
    res.writeHead(status, headers);
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port}`);
});
