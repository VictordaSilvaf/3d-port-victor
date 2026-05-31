import { HOME_MODEL } from "@/models/home/home.model"

export function useHomeViewModel() {
  return {
    content: HOME_MODEL,
  }
}

export type HomeViewModel = ReturnType<typeof useHomeViewModel>
