import "@/shared/styles/app.css"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { createJazzReactApp, DemoAuthBasicUI, useDemoAuth } from "jazz-react"
import TelegramProvider from "~/shared/lib/telegram/telegram-provider"

const Jazz = createJazzReactApp()
export const { useAccount, useCoState } = Jazz

function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, state] = useDemoAuth()
  return (
    <>
      <Jazz.Provider auth={auth} peer={import.meta.env.VITE_JAZZ_PEER_URL}>
        {children}
      </Jazz.Provider>
      {state.state !== "signedIn" && (
        <DemoAuthBasicUI appName="NotLost" state={state} />
      )}
    </>
  )
}

export const Route = createFileRoute("/app")({
  component: RouteComponent,
})

// TODO: will be removed when beta release, here for dev tools debugging
// TODO: can do smarter and only show it even in prod for specific tg usernames
import("eruda").then((lib) => lib.default.init()).catch(console.error)

function RouteComponent() {
  return (
    <TelegramProvider>
      <JazzAndAuth>
        <Outlet />
      </JazzAndAuth>
    </TelegramProvider>
  )
}
