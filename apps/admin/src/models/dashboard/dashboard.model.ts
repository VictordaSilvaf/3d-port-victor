export const DASHBOARD_MODEL = {
  brand: "Admin",
  title: "Painel",
  subtitle: "Visão geral do portfólio e do monorepo.",
  navItems: [
    { id: "overview", label: "Visão geral" },
    { id: "apps", label: "Apps" },
    { id: "content", label: "Conteúdo" },
  ],
  sections: {
    overview: {
      id: "overview",
      title: "Visão geral",
      stats: [
        { label: "Visitas", value: "12.4k", hint: "+8% vs. semana passada" },
        { label: "Projetos", value: "6", hint: "2 em rascunho" },
        { label: "Taxa de clique", value: "4.2%", hint: "CTA do portfólio" },
        { label: "Tempo médio", value: "2m 14s", hint: "sessão na home" },
      ],
    },
    apps: {
      id: "apps",
      title: "Apps do monorepo",
      stats: [
        { label: "web", value: "ativo", hint: "localhost:5173" },
        { label: "docs", value: "ativo", hint: "localhost:5174" },
        { label: "admin", value: "ativo", hint: "localhost:5175" },
        { label: "@workspace/ui", value: "ok", hint: "design system" },
      ],
    },
    content: {
      id: "content",
      title: "Conteúdo",
      stats: [
        { label: "Seções publicadas", value: "4", hint: "home, sobre, projetos, contato" },
        { label: "Assets 3D", value: "3", hint: "GLB no pipeline" },
        { label: "Rascunhos", value: "1", hint: "case study" },
        { label: "Última atualização", value: "hoje", hint: "deploy manual" },
      ],
    },
  },
} as const

export type DashboardModel = typeof DASHBOARD_MODEL
export type DashboardSectionId = keyof typeof DASHBOARD_MODEL.sections
