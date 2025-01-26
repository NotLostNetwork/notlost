import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { JazzAndAuth } from "~/lib/jazz/jazz-provider"
import TelegramProvider from "~/lib/telegram/telegram-provider"
import { Toaster } from "react-hot-toast"
import { Route as BetaTestRoute } from "@/routes/app/closed-beta"

// TODO: only show for specific tg usernames in prod, make so can disable showing forever too
import("eruda").then((lib) => lib.default.init()).catch(console.error)

function LayoutComponent() {
  const betaTestPassword = localStorage.getItem("betaTestPassword")

  const navigate = useNavigate()

  if (!betaTestPassword) {
    navigate({ to: BetaTestRoute.to })
  }

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
