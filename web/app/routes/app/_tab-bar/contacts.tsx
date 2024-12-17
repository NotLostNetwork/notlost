import { createFileRoute } from "@tanstack/react-router"
import ContactsPage from "~/pages/contacts"

export const Route = createFileRoute("/app/_tab-bar/contacts")({
  component: ContactsPage,
})
