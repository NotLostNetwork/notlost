import { createFileRoute } from '@tanstack/react-router'
import ContactsPage from '~/pages/contacts'

const Index = () => {
  return <ContactsPage />
}

export const Route = createFileRoute('/_provider/(tab-bar)/_tab-bar/contacts')({
  component: Index,
})
