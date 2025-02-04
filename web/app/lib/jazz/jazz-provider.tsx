import { createJazzReactApp, DemoAuthBasicUI, useDemoAuth } from "jazz-react"
import { JazzAccount } from "./schema"
import { BetaTest } from "@/routes/app/closed-beta"
import { useState } from "react"

const Jazz = createJazzReactApp({
  AccountSchema: JazzAccount,
})

export const { useAccount, useCoState } = Jazz

export function JazzAndAuth({ children }: { children: React.ReactNode }) {
  const [auth, state] = useDemoAuth()
  const [betaTestPassword, setBetaTestPassword] = useState<string | null>(
    localStorage.getItem("betaTestPassword"),
  )

  if (!betaTestPassword) {
    return (
      <BetaTest
        setBetaTestPassword={(pass) => {
          setBetaTestPassword(pass)
          localStorage.setItem("betaTestPassword", pass)
        }}
      />
    )
  }

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

// TODO: below is commented as it gives issues, doing the jazz `chat` example 1 to 1
// see if that works

// import { createJazzReactApp } from "jazz-react"
// import { getEnvVariable } from "../utils/utils"
// const Jazz = createJazzReactApp()

// export const { useAccount, useCoState, useAccountOrGuest } = Jazz

// function assertPeerUrl(
//   url: string | undefined,
// ): asserts url is `wss://${string}` | `ws://${string}` {
//   if (!url) {
//     throw new Error("JAZZ_PEER_URL is not defined")
//   }
//   if (!url.startsWith("wss://") && !url.startsWith("ws://")) {
//     throw new Error("JAZZ_PEER_URL must start with wss:// or ws://")
//   }
// }

// const JAZZ_PEER_URL = (() => {
//   const rawUrl = getEnvVariable("VITE_JAZZ_PEER_URL")
//   assertPeerUrl(rawUrl)
//   return rawUrl
// })()

// export function JazzProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <Jazz.Provider auth={"guest"} peer={JAZZ_PEER_URL}>
//       {children}
//     </Jazz.Provider>
//   )
// }
