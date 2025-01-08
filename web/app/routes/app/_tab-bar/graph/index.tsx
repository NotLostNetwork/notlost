import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import TgWallpaper from "~/ui/tg-wallpaper"
import ForceGraph from "./-force-graph"
import { PlusButton } from "./-plus-button"
import { useState } from "react"
import { Input } from "@telegram-apps/telegram-ui"

const ContactsGraph = () => {
  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [value, setValue] = useState("")

  if (!profile?.contacts) return

  return (
    <div className="">
      <div className="">
        <TgWallpaper opacity={0.5} />
      </div>
      <div>
        <ForceGraph data={profile?.contacts!} />
      </div>
      <PlusButton createAction={() => setCreateModalOpen((prev) => !prev)} />
      {createModalOpen && (
        <div className="absolute bottom-0 left-0 w-screen bg-secondary p-2">
          <Input
            autoFocus={true}
            className="text-white"
            style={{ color: "white" }}
            type="text"
            onFocus={() => {
              window.scrollTo(0, 0)
            }}
            onBlur={() => {
              window.scrollTo(0, 0)
              setCreateModalOpen(false)
            }}
            placeholder="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
