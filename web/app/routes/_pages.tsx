import { createFileRoute, Outlet } from "@tanstack/react-router"
import "@/shared/styles/app.css"
import TelegramProvider from "~/shared/lib/telegram/telegram-provider"

export const Route = createFileRoute("/_pages")({
  component: RouteComponent,
})

// TODO: FOR TESTING - REMOVE IN PROD
import('eruda').then((lib) => lib.default.init()).catch(console.error)
//

function RouteComponent() {
  return (
    <TelegramProvider>
      <Outlet />
    </TelegramProvider>
  )
}
