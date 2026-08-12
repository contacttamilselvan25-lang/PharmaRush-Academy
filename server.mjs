import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function respond(res, status, contentType, body) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    return respond(res, 403, "text/plain", "Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return respond(res, 404, "text/plain", "Not found");
    }
    respond(res, 200, MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream", data);
  });
}

const server = http.createServer(handle);
const PREFERRED_PORT = Number(process.env.PORT) || 8123;

function tryListen(port) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && port < PREFERRED_PORT + 10) {
      tryListen(port + 1);
    } else {
      console.error(`Could not start server: ${err.message}`);
      process.exit(1);
    }
  });
  server.listen(port, "127.0.0.1", () => {
    const url = `http://localhost:${port}`;
    try {
      fs.writeFileSync(path.join(ROOT, "PHARMA_RUSH_URL.txt"), url);
    } catch {
      /* best-effort */
    }
    console.log(`\nPHARMA RUSH is running at:\n`);
    console.log(`   ${url}\n`);
    console.log("Press Ctrl+C to stop the server.\n");
  });
}

tryListen(PREFERRED_PORT);