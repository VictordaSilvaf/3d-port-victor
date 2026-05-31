import { useEffect, useState } from "react"

import { isMobileLayout } from "@/lib/scene/device"
import { HOME_MODEL } from "@/models/home/home.model"
import { useSceneViewModel } from "@/viewmodels/scene/use-scene.viewmodel"

export function useHomeViewModel() {
  const scene = useSceneViewModel()
  const [mobile, setMobile] = useState(isMobileLayout)

  useEffect(() => {
    const coarseQuery = window.matchMedia("(pointer: coarse)")
    const narrowQuery = window.matchMedia("(max-width: 768px)")
    const syncLayout = () => setMobile(isMobileLayout())

    syncLayout()
    coarseQuery.addEventListener("change", syncLayout)
    narrowQuery.addEventListener("change", syncLayout)

    return () => {
      coarseQuery.removeEventListener("change", syncLayout)
      narrowQuery.removeEventListener("change", syncLayout)
    }
  }, [])

  return {
    content: {
      ...HOME_MODEL,
      paragraphs: mobile
        ? [HOME_MODEL.mobileParagraph]
        : [...HOME_MODEL.paragraphs],
    },
    isMobileLayout: mobile,
    scene,
  }
}

export type HomeViewModel = ReturnType<typeof useHomeViewModel>
