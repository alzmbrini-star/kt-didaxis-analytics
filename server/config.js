const DEFAULT_BASE_URL = "https://didaxis.didaxis.com.br";

function validateBaseUrl(value) {
  const url = new URL(value || DEFAULT_BASE_URL);
  if (url.protocol !== "https:") {
    throw new Error("A URL da API Didaxis deve usar HTTPS.");
  }
  return url.origin;
}

function normalizeTenant(id, value) {
  if (!value || typeof value !== "object") {
    throw new Error(`Configuração inválida para o tenant ${id}.`);
  }

  const username = String(value.username || "").trim();
  const password = String(value.password || "");
  if (!username || !password) {
    throw new Error(`Credenciais ausentes para o tenant ${id}.`);
  }

  return {
    id,
    name: String(value.name || id),
    baseUrl: validateBaseUrl(value.baseUrl),
    username,
    password,
    active: value.active !== false,
  };
}

export function loadTenants(env = process.env) {
  const raw = env.DIDAXIS_TENANTS_JSON;
  if (!raw) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("DIDAXIS_TENANTS_JSON não contém JSON válido.");
  }

  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("DIDAXIS_TENANTS_JSON deve ser um objeto indexado pelo ID do tenant.");
  }

  return Object.entries(parsed).map(([id, value]) => normalizeTenant(id, value));
}

export function publicTenant(tenant) {
  return { id: tenant.id, name: tenant.name, status: tenant.active ? "active" : "inactive" };
}
