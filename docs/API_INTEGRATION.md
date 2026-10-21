# Integração da API por tenant

## Autenticação

A API Didaxis usa OAuth2 Password. Cada tenant deve possuir um aplicativo externo ativo, criado por um administrador em **Configurações → Configurações Gerais → APIs**.

O servidor envia `grant_type=password`, `username` e `password` para `POST /api/token`. O `access_token` retornado fica somente na memória do processo e é renovado antes da expiração ou após uma resposta HTTP 401.

Credenciais e tokens nunca são enviados ao navegador.

## Configuração

Copie `.env.example` para `.env` e preencha `DIDAXIS_TENANTS_JSON`:

```dotenv
DIDAXIS_TENANTS_JSON={"tenant-interno":{"name":"Nome exibido","baseUrl":"https://didaxis.didaxis.com.br","username":"USUARIO","password":"SENHA","active":true}}
```

Para mais de um tenant, acrescente outras propriedades ao objeto JSON. O ID da propriedade é interno ao portal e não precisa ser o ID numérico da empresa na Didaxis.

## Segurança

- Use apenas URLs HTTPS.
- Guarde `DIDAXIS_TENANTS_JSON` no gerenciador de segredos da hospedagem.
- Não use a chave de acesso à documentação como token da API.
- Não prefixe variáveis secretas com `VITE_`; esse prefixo expõe valores no frontend.
- Rotacione a senha de cada aplicativo externo separadamente.
- O cache de dashboard reduz o risco de exceder o limite documentado de 10 requisições por minuto nos relatórios de cursos e certificações.

## Endpoints internos do portal

- `GET /api/health`: informa se o servidor está ativo e quantos tenants foram configurados.
- `GET /api/admin/tenants`: lista somente IDs, nomes e status; nunca retorna credenciais.
- `GET /api/lms/dashboard?tenantId=...&section=base`: agrega usuários, cursos, matrículas, trilhas, meetings e certificações.
- `GET /api/lms/dashboard?tenantId=...&section=questions`: agrega provas, perguntas e respostas.

Use `refresh=1` apenas para uma atualização manual. Consultas normais usam o cache configurado em `DIDAXIS_DASHBOARD_CACHE_MS`.
