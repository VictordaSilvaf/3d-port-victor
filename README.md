# 3d-port-victor

Monorepo Vite + React com design system compartilhado (`@workspace/ui`).

## Apps

| App | Pasta | Porta | Função |
|-----|-------|-------|--------|
| **web** | `apps/web` | 5173 | Portfólio 3D (R3F, Drei, GSAP, Leva, Zustand) |
| **docs** | `apps/docs` | 5174 | Documentação do projeto |
| **admin** | `apps/admin` | 5175 | Painel interno |

```bash
npm run dev          # sobe web + docs + admin (Turbo)
npm run dev -- --filter=docs   # só documentação
npm run dev -- --filter=admin  # só admin
```

## Packages

| Package | Pasta | Função |
|---------|-------|--------|
| **@workspace/ui** | `packages/ui` | Design system (Atomic Design) |

## Arquitetura

### Atomic Design (`packages/ui`)

| Camada | Pasta | Exemplo |
|--------|-------|---------|
| Atoms | `src/atoms/` | `Button`, `Kbd` |
| Molecules | `src/molecules/` | `KeyboardHint`, `StatCard`, `DocSection` |
| Organisms | `src/organisms/` | `ProjectReadyCard`, `AppShell` |
| Templates | `src/templates/` | `CenteredContentTemplate` |

### MVVM (cada app em `apps/*`)

| Camada | Pasta | Responsabilidade |
|--------|-------|------------------|
| **Model** | `src/models/` | Dados e regras puras (sem React) |
| **ViewModel** | `src/viewmodels/` | Estado e lógica de apresentação (hooks) |
| **View** | `src/views/` | UI que recebe props do ViewModel |
| **Page** | `src/pages/` | Composição View + ViewModel |
| **Provider** | `src/providers/` | Contexto global (tema, etc.) |

```
Page → useXViewModel() → View → @workspace/ui
```

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
```

## Stack 3D (`apps/web`)

- **three** + **@react-three/fiber** + **@react-three/drei** — cena WebGL
- **zustand** — estado da cena (`src/stores/scene/`)
- **gsap** — animação de entrada do mesh
- **leva** — controles em dev (`SceneDevToolsView`)

```bash
npm run dev -- --filter=web
```

## Importando componentes

```tsx
import { Button } from "@workspace/ui/atoms/button"
import { AppShell } from "@workspace/ui/organisms/app-shell"
```

## Deploy na Vercel

Monorepo Turborepo com três apps Vite. O portfólio principal é `apps/web`.

### Opção A — Git Integration (recomendado)

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório `VictordaSilvaf/3d-port-victor`.
2. Deixe o **Root Directory** na raiz do repo (`.`).
3. A Vercel usa o `vercel.json` da raiz:
   - **Build:** `turbo run build --filter=web`
   - **Output:** `apps/web/dist`
4. Cada push em `main` gera deploy de **production**; branches e PRs geram **preview**.

Para `docs` ou `admin`, crie **projetos separados** na Vercel apontando para:
- Root Directory: `apps/docs` ou `apps/admin` (cada pasta já tem `vercel.json`).

### Opção B — GitHub Actions (manual)

O workflow `.github/workflows/deploy.yml` faz deploy via CLI (`vercel deploy --prebuilt --prod`).

1. Instale a CLI e linke o projeto: `npx vercel link` (na raiz).
2. Copie `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` de `.vercel/project.json`.
3. Crie um token em [vercel.com/account/tokens](https://vercel.com/account/tokens).
4. Adicione secrets no GitHub (**Settings → Secrets → Actions**):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Rode **Actions → Deploy → Run workflow**.

> Use **A ou B**, não os dois ao mesmo tempo, para evitar deploy duplicado.

### CI (GitHub Actions)

Em todo push/PR em `main`, o workflow `.github/workflows/ci.yml` roda:

- `npm run typecheck`
- `npm run lint`
- `npm run build -- --filter=web`

