import { useHomeViewModel } from "@/viewmodels/home/use-home.viewmodel"
import { HomeView } from "@/views/home/home.view"

export function HomePage() {
  const vm = useHomeViewModel()
  return <HomeView {...vm} />
}
