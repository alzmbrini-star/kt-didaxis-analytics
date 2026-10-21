# Relatório de recuperação

## Origem analisada

- Site: `https://kt-didaxis-analytics.andzam.chatgpt.site/`
- Framework observável: React com runtime Vinext/Vite.
- Fonte visual: Geist e Geist Mono.
- O site exige autenticação e recebe dados de um backend próprio.

## Recursos públicos encontrados

- `index-BOYFtvI0.js`
- `portal-client-BFuaUwzL.js`
- `framework-Dykh5YIU.js`
- `layout-segment-context-BUBQ9F3j.js`
- `rolldown-runtime-DWdDZTNf.js`
- `index-L_Q-xjyJ.css`
- `logo-portal-relat.png`
- `favicon.svg`

Todos os caminhos correspondentes a `*.map` retornaram HTTP 404. Portanto, não foi possível recuperar nomes de arquivos, TypeScript original, comentários ou a organização exata do projeto.

## Rotas identificadas no cliente

### Portal

- `GET /api/admin/tenants`
- `POST /api/admin/audit`
- `/api/admin/certificate-template`
- `/api/lms/dashboard`
- `/api/lms/details`
- `/api/lms/map`
- `/api/lms/user-analysis`
- `/api/lms/certificates/export`

### Integração LMS observada

- `/api/usuarios/getAll`
- `/api/usuarios/getUser`
- `/api/cursos/GetCursos`
- `/api/cursos/ModulosTelas`
- `/api/provas/GetAll`
- `/api/provas/PerguntasRespostas`
- `/api/trilhas`
- `/api/trilhas/alunos`
- `/api/trilhas/cursos`
- `/api/meetings`
- `/api/relatorios/cursos`
- `/api/relatorios/trilhas`
- `/api/relatorios/certificacoes/historico`
- `/api/relatorios/TermosAceiteCursos`
- `/api/Certificacoes/Realizadas`
- `/api/loginunico/servicos`
- `/api/ModulosReportAPI`
- `/api/TurmaCursos/RelatorioAtivos`
- `/api/StatusCadastro`
- `/api/matricular`
- `/api/token`

## Limites

Os nomes das rotas não revelam sua implementação no servidor. A reconstrução não inclui banco de dados, segredos, regras de autenticação nem código backend. Para restabelecer dados reais, será necessário obter o backend original ou especificar contratos equivalentes para essas rotas.
