import { createFileRoute, Outlet } from "@tanstack/react-router"
import { JazzAndAuth } from "~/lib/jazz/jazz-provider"
import TelegramProvider from "~/lib/telegram/telegram-provider"

// TODO: only show for specific tg usernames in prod, make so can disable showing forever too
import("eruda").then((lib) => lib.default.init()).catch(console.error)

function LayoutComponent() {
  return (
    <TelegramProvider>
      <JazzAndAuth>
        <Outlet />
      </JazzAndAuth>
    </TelegramProvider>
  )
}

export const Route = createFileRoute("/app")({
  component: LayoutComponent,
})
