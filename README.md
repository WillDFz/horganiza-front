# Horganiza (frontend)

Painel e fluxo de agendamento para negócios de serviço — dashboard do estabelecimento, equipe, serviços, clientes e página pública de booking.

Stack: **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **MUI**, **Axios**, **Jest** + Testing Library.

## Demo pública

Esta publicação pode rodar em **modo demo**: a API real não é necessária. Os dados são fictícios (Estúdio Aurora) e vivem em memória no processo serverless.

| | |
| --- | --- |
| Login | `demo@horganiza.app` / `demo1234` |
| Página pública | `/business/estudio-aurora` |
| Repo | [WillDFz/horganiza-front](https://github.com/WillDFz/horganiza-front) |

Escrita (criar/editar/cancelar) funciona na sessão atual; um cold start da Vercel volta à semente. Não há persistência entre instâncias.

### Deploy na Vercel (manual)

1. Importe o repositório `WillDFz/horganiza-front`.
2. Defina as variáveis de ambiente (Production e Preview):

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_DEMO_MODE=true
```

3. **Não** defina `API_BACKEND_URL` — sem ela, o catch-all mock atende `/api/*`.
4. Deploy. Credenciais e link da página pública ficam no banner do `/auth/login`.

## Desenvolvimento local (API real)

```bash
cp .env.example .env.local
# ajuste API_BACKEND_URL para o backend
npm install
npm run dev
```

Com `API_BACKEND_URL` definido, o Next faz rewrite de `/api/*` para o backend (`beforeFiles`). Os handlers mock **não** respondem nesse caso.

## Desenvolvimento / preview sem backend

Remova ou comente `API_BACKEND_URL` e use:

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_DEMO_MODE=true
```

O catch-all em `src/app/api/[[...path]]` atende auth, business, staff, services, customers, appointments e upload.

## Scripts

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Estrutura relevante

- `src/app` — rotas (dashboard, auth, booking público)
- `src/services` — clientes HTTP (contratos iguais em prod e demo)
- `src/mocks` — semente, store em memória e handlers do modo demo
- `src/components` — UI e features

## Observações

- `.env.local` e secrets reais **não** entram no repositório.
- Pasta `docs/` é local/interna e está no `.gitignore`.
