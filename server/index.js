import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTenants, publicTenant } from "./config.js";
import { DidaxisApiError, DidaxisClient } from "./didaxis-client.js";
import { loadDashboardBase, loadDashboardQuestions } from "./dashboard.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "..");
const production = process.argv.includes("--production");
const port = Number(process.env.PORT) || 5173;
const dashboardCacheMs = Number(process.env.DIDAXIS_DASHBOARD_CACHE_MS) || 300_000;
const tenants = loadTenants();
const clients = new Map(tenants.map((tenant) => [tenant.id, new DidaxisClient(tenant)]));
const cache = new Map();
const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

function getTenant(req, res) {
  const tenant = tenants.find((item) => item.id === req.query.tenantId);
  if (!tenant || !tenant.active) {
    res.status(404).json({ error: "Tenant inexistente, inativo ou não configurado." });
    return null;
  }
  return tenant;
}

async function cached(key, loader, refresh = false) {
  const previous = cache.get(key);
  if (!refresh && previous && Date.now() - previous.createdAt < dashboardCacheMs) return previous.value;
  if (previous?.promise) return previous.promise;

  const promise = loader();
  cache.set(key, { createdAt: Date.now(), promise });
  try {
    const value = await promise;
    cache.set(key, { createdAt: Date.now(), value });
    return value;
  } catch (error) {
    cache.delete(key);
    throw error;
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configuredTenants: tenants.length });
});

app.get("/api/admin/tenants", (_req, res) => {
  res.json({ tenants: tenants.map(publicTenant) });
});

app.get("/api/lms/dashboard", async (req, res, next) => {
  const tenant = getTenant(req, res);
  if (!tenant) return;

  const section = String(req.query.section || "base");
  const params = { start: req.query.start, end: req.query.end };
  const refresh = req.query.refresh === "1";
  const key = JSON.stringify([tenant.id, section, params.start || "", params.end || ""]);
  const client = clients.get(tenant.id);

  try {
    const value = await cached(
      key,
      () => section === "questions" ? loadDashboardQuestions(client, params) : loadDashboardBase(client, params),
      refresh,
    );
    res.json(value);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof DidaxisApiError) {
    if (error.retryAfter) res.set("retry-after", error.retryAfter);
    res.status(error.status === 429 ? 429 : 502).json({
      error: error.message,
      endpoint: error.endpoint,
      retryAfter: error.retryAfter,
    });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Erro interno ao consultar a integração Didaxis." });
});

if (production) {
  app.use(express.static(path.join(root, "dist")));
  app.use((req, res, next) => {
    if (req.method === "GET" && req.accepts("html")) {
      res.sendFile(path.join(root, "dist", "index.html"));
      return;
    }
    next();
  });
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: "spa" });
  app.use(vite.middlewares);
}

app.listen(port, "127.0.0.1", () => {
  console.log(`KT-Didaxis Analytics em http://127.0.0.1:${port}`);
  console.log(`${tenants.length} tenant(s) configurado(s).`);
});
