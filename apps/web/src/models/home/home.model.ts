export const HOME_MODEL = {
  title: "Victor — Portfólio 3D",
  paragraphs: [
    "Modo Órbita ou Olhar (FPS). Mira central, mouse capturado no modo olhar. WASD para mover.",
  ],
  buttonLabel: "Ver projetos",
  keyboardHint: {
    before: "L alterna modo. Tema:",
    keys: ["d"],
    after: "",
  },
} as const

export type HomeModel = typeof HOME_MODEL
