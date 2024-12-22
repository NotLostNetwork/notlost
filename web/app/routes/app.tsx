import { createFileRoute, Outlet } from "@tanstack/react-router"
import "@/shared/styles/app.css"
import TelegramProvider from "~/shared/lib/telegram/telegram-provider"
import { DemoAuthBasicUI, createJazzReactApp, useDemoAuth } from "jazz-react"

const Jazz = createJazzReactApp()
export const { useAccount, useCoState } = Jazz

export const Route = createFileRoute("/app")({
  component: RouteComponent,
})

// TODO: will be removed when beta release, here for dev tools debugging
// TODO: can do smarter and only show it even in prod for specific tg usernames
import("eruda").then((lib) => lib.default.init()).catch(console.error)

function RouteComponent() {
  // TODO: seems we have to edit it as we don't need the `sign up / sign in` scree
  // sign up / sign in is done in background through telegram id
  const [auth, state] = useDemoAuth()

  return (
    <TelegramProvider>
      <Jazz.Provider auth={auth} peer={import.meta.env.VITE_JAZZ_PEER_URL}>
        <Outlet />
      </Jazz.Provider>
    </TelegramProvider>
  )
}
