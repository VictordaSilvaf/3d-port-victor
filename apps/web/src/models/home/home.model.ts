export const HOME_MODEL = {
  title: "Project ready!",
  paragraphs: [
    "You may now add components and start building.",
    "We've already added the button component for you.",
  ],
  buttonLabel: "Button",
  keyboardHint: {
    before: "(Press",
    keys: ["d"],
    after: "to toggle dark mode)",
  },
} as const

export type HomeModel = typeof HOME_MODEL
