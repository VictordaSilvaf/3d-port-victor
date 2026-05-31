export type Theme = "dark" | "light" | "system"
export type ResolvedTheme = "dark" | "light"

export const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
export const THEME_VALUES: Theme[] = ["dark", "light", "system"]
export const DEFAULT_THEME_STORAGE_KEY = "theme"

export function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

export function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

export function getNextTheme(currentTheme: Theme): Theme {
  if (currentTheme === "dark") {
    return "light"
  }

  if (currentTheme === "light") {
    return "dark"
  }

  return getSystemTheme() === "dark" ? "light" : "dark"
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const editableParent = target.closest(
    "input, textarea, select, [contenteditable='true']"
  )

  return Boolean(editableParent)
}
