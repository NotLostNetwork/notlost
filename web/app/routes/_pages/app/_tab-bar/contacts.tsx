import { createFileRoute } from "@tanstack/react-router"
import ContactsPage from "~/pages/contacts"

export const Route = createFileRoute("/_pages/app/_tab-bar/contacts")({
  component: ContactsPage,
})
