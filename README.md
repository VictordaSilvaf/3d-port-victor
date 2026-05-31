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
