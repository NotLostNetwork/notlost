import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import TgWallpaper from "~/ui/tg-wallpaper"
import { useContactsState } from "../contacts/-@state"
import ForceGraph from "./-force-graph"

const ContactsGraph = () => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const { uniqueTopics } = useContactsState(profile?.contacts)

  if (!profile?.contacts) return

  return (
    <div>
      <div className="h-screen absolute">
        <TgWallpaper opacity={0.5} />
      </div>
      <div>
        <ForceGraph data={profile?.contacts!} uniqueTopics={uniqueTopics} />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
