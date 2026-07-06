import { useSiteSettingsViewModel } from "@/viewmodels/settings/use-site-settings.viewmodel"
import { SiteSettingsView } from "@/views/settings/site-settings.view"

export function SiteSettingsPage() {
  const viewModel = useSiteSettingsViewModel()
  return <SiteSettingsView {...viewModel} />
}
