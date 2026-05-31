export const HOME_MODEL = {
  title: "Victor — Portfólio 3D",
  paragraphs: [
    "Modo Órbita ou Olhar (FPS). Mira central, mouse capturado no modo olhar. WASD para mover.",
  ],
  mobileParagraph:
    "No celular você já entra no modo Olhar: joystick no centro para andar, arraste fora dele para girar a câmera.",
  buttonLabel: "Ver projetos",
  keyboardHint: {
    before: "L alterna modo. Tema:",
    keys: ["p"],
    after: "",
  },
} as const

export type HomeModel = typeof HOME_MODEL
