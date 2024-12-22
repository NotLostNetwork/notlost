import { createFileRoute, Outlet } from "@tanstack/react-router"
import "@/shared/styles/app.css"
import TelegramProvider from "~/shared/lib/telegram/telegram-provider"
import { JazzProvider } from "~/shared/lib/jazz/jazz-provider"

export const Route = createFileRoute("/app")({
  component: RouteComponent,
})

// TODO: FOR TESTING - REMOVE IN PROD
import("eruda").then((lib) => lib.default.init()).catch(console.error)

function RouteComponent() {
  return (
    <TelegramProvider>
      <JazzProvider>
        <Outlet />
      </JazzProvider>
    </TelegramProvider>
  )
}
