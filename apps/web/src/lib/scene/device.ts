export function isCoarsePointerDevice() {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia("(pointer: coarse)").matches
}

export function isNarrowViewport() {
  if (typeof window === "undefined") {
    return false
  }

  return window.matchMedia("(max-width: 768px)").matches
}

export function isMobileLayout() {
  return isCoarsePointerDevice() || isNarrowViewport()
}
