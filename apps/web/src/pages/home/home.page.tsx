import { useHomeViewModel } from "@/viewmodels/home/use-home.viewmodel"
import { HomeView } from "@/views/home/home.view"

export function HomePage() {
  const viewModel = useHomeViewModel()

  return <HomeView {...viewModel} />
}
