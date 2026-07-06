import { useContactViewModel } from "@/viewmodels/contact/use-contact.viewmodel"
import { ContactView } from "@/views/contact/contact.view"

export function ContactPage() {
  return <ContactView {...useContactViewModel()} />
}
