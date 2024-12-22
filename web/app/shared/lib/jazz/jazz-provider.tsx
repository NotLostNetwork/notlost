import { createJazzReactApp } from "jazz-react"
import { getEnvVariable } from "../utils/utils"
const Jazz = createJazzReactApp()

export const { useAccount, useCoState } = Jazz

function assertPeerUrl(
  url: string | undefined,
): asserts url is `wss://${string}` | `ws://${string}` {
  if (!url) {
    throw new Error("JAZZ_PEER_URL is not defined")
  }
  if (!url.startsWith("wss://") && !url.startsWith("ws://")) {
    throw new Error("JAZZ_PEER_URL must start with wss:// or ws://")
  }
}

const JAZZ_PEER_URL = (() => {
  const rawUrl = getEnvVariable("VITE_JAZZ_PEER_URL")
  assertPeerUrl(rawUrl)
  return rawUrl
})()

export function JazzProvider({ children }: { children: React.ReactNode }) {
  return (
    <Jazz.Provider auth={"guest"} peer={JAZZ_PEER_URL}>
      {children}
    </Jazz.Provider>
  )
}
