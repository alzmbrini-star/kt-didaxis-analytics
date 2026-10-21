import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { DidaxisClient } from "../server/didaxis-client.js";

test("obtém e reutiliza o token somente para o tenant do cliente", async (t) => {
  let tokenRequests = 0;
  let apiRequests = 0;
  const server = http.createServer((req, res) => {
    if (req.url === "/api/token" && req.method === "POST") {
      tokenRequests += 1;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ access_token: "token-do-tenant", token_type: "bearer", expires_in: 3599 }));
      return;
    }
    if (req.url === "/api/usuarios/getAll" && req.headers.authorization === "Bearer token-do-tenant") {
      apiRequests += 1;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ Status: true, Dados: [{ ID: 1, Nome: "Aluno" }] }));
      return;
    }
    res.statusCode = 401;
    res.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address();
  const client = new DidaxisClient({
    id: "tenant-teste",
    baseUrl: `http://127.0.0.1:${address.port}`,
    username: "usuario",
    password: "senha",
  });

  const first = await client.get("/api/usuarios/getAll");
  const second = await client.get("/api/usuarios/getAll");

  assert.deepEqual(first, [{ ID: 1, Nome: "Aluno" }]);
  assert.deepEqual(second, first);
  assert.equal(tokenRequests, 1);
  assert.equal(apiRequests, 2);
});
