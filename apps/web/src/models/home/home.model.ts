export const HOME_MODEL = {
  title: "Victor — Portfólio 3D",
  paragraphs: [
    "Cena inicial com React Three Fiber, Drei, GSAP, Leva e Zustand.",
    "Arraste para orbitar. Em dev, use o painel Leva para ajustar a cena.",
  ],
  buttonLabel: "Ver projetos",
  keyboardHint: {
    before: "(Press",
    keys: ["d"],
    after: "to toggle dark mode)",
  },
} as const

export type HomeModel = typeof HOME_MODEL
