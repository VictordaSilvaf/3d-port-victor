export type DocParagraph = string | { type: "code"; value: string }

export type DocSectionModel = {
  id: string
  label: string
  title: string
  paragraphs: readonly DocParagraph[]
}

export const DOCS_MODEL = {
  brand: "3d-port-victor",
  title: "Documentação",
  subtitle: "Guia do monorepo, arquitetura e apps.",
  navItems: [
    { id: "overview", label: "Visão geral" },
    { id: "monorepo", label: "Monorepo" },
    { id: "atomic", label: "Atomic Design" },
    { id: "mvvm", label: "MVVM" },
    { id: "apps", label: "Apps" },
  ],
  sections: [
    {
      id: "overview",
      label: "Visão geral",
      title: "Visão geral",
      paragraphs: [
        "Este repositório é um monorepo React com Turborepo e npm workspaces.",
        "O portfólio público vive em apps/web; a documentação em apps/docs; o painel em apps/admin.",
        "Componentes visuais compartilhados ficam em packages/ui (@workspace/ui).",
      ],
    },
    {
      id: "monorepo",
      label: "Monorepo",
      title: "Estrutura do monorepo",
      paragraphs: [
        { type: "code", value: "apps/*     → aplicações (web, docs, admin)" },
        { type: "code", value: "packages/* → bibliotecas internas (ui)" },
        "Scripts na raiz (dev, build, typecheck) são orquestrados pelo Turbo.",
      ],
    },
    {
      id: "atomic",
      label: "Atomic Design",
      title: "Atomic Design (packages/ui)",
      paragraphs: [
        "atoms/ — elementos mínimos (Button, Kbd).",
        "molecules/ — combinações (KeyboardHint, StatCard, DocSection).",
        "organisms/ — blocos maiores (ProjectReadyCard, AppShell).",
        "templates/ — layouts de página (CenteredContentTemplate).",
      ],
    },
    {
      id: "mvvm",
      label: "MVVM",
      title: "MVVM (cada app em apps/)",
      paragraphs: [
        "models/ — dados e regras puras, sem React.",
        "viewmodels/ — hooks com estado e lógica de apresentação.",
        "views/ — componentes que só recebem props.",
        "pages/ — composição View + ViewModel.",
        "providers/ — contexto global (ex.: tema).",
      ],
    },
    {
      id: "apps",
      label: "Apps",
      title: "Aplicações",
      paragraphs: [
        "web (5173) — portfólio 3D / landing pública.",
        "docs (5174) — esta documentação.",
        "admin (5175) — painel interno de métricas e gestão.",
        "Pressione d em qualquer app para alternar tema claro/escuro.",
      ],
    },
  ],
} as const

export type DocsModel = typeof DOCS_MODEL
