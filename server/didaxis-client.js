const TOKEN_SAFETY_WINDOW_MS = 60_000;

export class DidaxisApiError extends Error {
  constructor(message, { status = 500, endpoint = "", retryAfter = null } = {}) {
    super(message);
    this.name = "DidaxisApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.retryAfter = retryAfter;
  }
}

export class DidaxisClient {
  #tenant;
  #token = null;
  #tokenExpiresAt = 0;
  #tokenPromise = null;

  constructor(tenant) {
    this.#tenant = tenant;
  }

  async #authenticate() {
    const body = new URLSearchParams({
      grant_type: "password",
      username: this.#tenant.username,
      password: this.#tenant.password,
    });

    const response = await fetch(`${this.#tenant.baseUrl}/api/token`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(30_000),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.access_token) {
      throw new DidaxisApiError(
        payload?.error_description || payload?.Mensagem || "Falha ao autenticar na API Didaxis.",
        { status: response.status || 502, endpoint: "/api/token" },
      );
    }

    const expiresIn = Math.max(60, Number(payload.expires_in) || 3599);
    this.#token = payload.access_token;
    this.#tokenExpiresAt = Date.now() + expiresIn * 1000;
    return this.#token;
  }

  async getToken({ force = false } = {}) {
    if (!force && this.#token && Date.now() < this.#tokenExpiresAt - TOKEN_SAFETY_WINDOW_MS) {
      return this.#token;
    }
    if (!force && this.#tokenPromise) return this.#tokenPromise;

    this.#tokenPromise = this.#authenticate();
    try {
      return await this.#tokenPromise;
    } finally {
      this.#tokenPromise = null;
    }
  }

  async get(path, query = {}, { retryAuth = true } = {}) {
    if (!path.startsWith("/api/")) throw new Error("Somente endpoints /api/ são permitidos.");
    const url = new URL(path, this.#tenant.baseUrl);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }

    const token = await this.getToken();
    const response = await fetch(url, {
      headers: { accept: "application/json", authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(60_000),
    });

    if (response.status === 401 && retryAuth) {
      await this.getToken({ force: true });
      return this.get(path, query, { retryAuth: false });
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new DidaxisApiError(
        payload?.Mensagem || payload?.message || `A API Didaxis retornou HTTP ${response.status}.`,
        {
          status: response.status,
          endpoint: path,
          retryAfter: response.headers.get("retry-after"),
        },
      );
    }

    if (payload?.Status === false) {
      throw new DidaxisApiError(payload.Mensagem || "A API Didaxis recusou a consulta.", {
        status: 502,
        endpoint: path,
      });
    }

    return Array.isArray(payload) ? payload : payload?.Dados ?? payload;
  }
}
