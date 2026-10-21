# KT-Didaxis Analytics — reconstrução local

Este repositório contém uma versão editável do frontend reconstruída a partir dos recursos entregues pelo site publicado em `kt-didaxis-analytics.andzam.chatgpt.site`.

## Estado da recuperação

- Interface principal, navegação, identidade visual e dashboard: reconstruídos.
- Logo e favicon: recuperados do site publicado.
- Rotas de API do cliente: inventariadas em `docs/RECOVERY.md`.
- Integração LMS: cliente servidor implementado com OAuth2 Password e token isolado por tenant.
- Banco de dados e credenciais reais: devem ser fornecidos no ambiente de execução e nunca enviados ao Git.
- Os bundles publicados não oferecem source maps.

## Executar

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm start
```

Consulte `docs/API_INTEGRATION.md` para configurar credenciais distintas por tenant.

## Segurança

Não coloque tokens, senhas ou chaves no repositório. Use variáveis de ambiente e mantenha o arquivo `.env` fora do Git.
