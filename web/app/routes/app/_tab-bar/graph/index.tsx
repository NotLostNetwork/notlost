import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@telegram-apps/telegram-ui"
import { GraphIcon } from "~/assets/icons/iconsAsComponent/graph-icon"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
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
        <div className="fixed bottom-20 left-6">
          <Button
            size={"s"}
            mode={"outline"}
            className={"rounded-full"}
            style={{ borderRadius: "50% !important" }}
          >
            <div className="h-6 w-6">
              <GraphIcon
                color={getCssVariableValue("--tg-theme-button-color")}
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
