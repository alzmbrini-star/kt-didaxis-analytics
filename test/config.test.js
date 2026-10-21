import test from "node:test";
import assert from "node:assert/strict";
import { loadTenants, publicTenant } from "../server/config.js";

test("carrega credenciais isoladas por tenant sem expô-las na resposta pública", () => {
  const tenants = loadTenants({
    DIDAXIS_TENANTS_JSON: JSON.stringify({
      alpha: {
        name: "Tenant Alpha",
        baseUrl: "https://didaxis.didaxis.com.br",
        username: "app-alpha",
        password: "segredo-alpha",
      },
      beta: {
        name: "Tenant Beta",
        baseUrl: "https://didaxis.didaxis.com.br",
        username: "app-beta",
        password: "segredo-beta",
      },
    }),
  });

  assert.equal(tenants.length, 2);
  assert.notEqual(tenants[0].username, tenants[1].username);
  assert.deepEqual(publicTenant(tenants[0]), {
    id: "alpha",
    name: "Tenant Alpha",
    status: "active",
  });
  assert.equal("password" in publicTenant(tenants[0]), false);
});
