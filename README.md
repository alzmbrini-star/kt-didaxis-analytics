# KT-Didaxis Analytics — reconstrução local

Este repositório contém uma versão editável do frontend reconstruída a partir dos recursos entregues pelo site publicado em `kt-didaxis-analytics.andzam.chatgpt.site`.

## Estado da recuperação

- Interface principal, navegação, identidade visual e dashboard: reconstruídos.
- Logo e favicon: recuperados do site publicado.
- Rotas de API do cliente: inventariadas em `docs/RECOVERY.md`.
- Autenticação, tenants, banco de dados e integração LMS: dependem do backend original e não fazem parte dos arquivos públicos.
- Os bundles publicados não oferecem source maps.

## Executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Segurança

Não coloque tokens, senhas ou chaves no repositório. Use variáveis de ambiente e mantenha o arquivo `.env` fora do Git.
