import { createFileRoute } from "@tanstack/react-router"
import TgWallpaper from "~/ui/tg-wallpaper"
import tonkeeperBg from "@/assets/tonkeeper-bg-3.png"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzEvent,
  JazzListOfParticipants,
  JazzParticipant,
} from "~/lib/jazz/schema"
import { Group, ID } from "jazz-tools"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { Button, Divider } from "@telegram-apps/telegram-ui"

function RouteComponent() {
  const { me } = useAccount()
  const jazzEvent = useCoState(
    JazzEvent,
    "co_zCv49eqnJvGLHPyR6kizpMZ1stL" as ID<JazzEvent>,
  )

  const createEvent = () => {
    const group = Group.create({ owner: me })
    group.addMember("everyone", "writer")
    const jazzEvent = JazzEvent.create(
      {
        participants: JazzListOfParticipants.create([], { owner: group }),
      },
      { owner: group },
    )
  }

  const addParticipant = () => {
    if (jazzEvent) {
      jazzEvent.participants?.push(
        JazzParticipant.create(
          {
            username: "test",
            firstName: "test",
            tags: "test",
            description: "test",
          },
          { owner: me },
        ),
      )
    }
  }

  if (!jazzEvent) return

  return (
    <div className="h-full">
      <div>
        <TgWallpaper opacity={0.5} />
      </div>
      <motion.div
        className="h-full p-2"
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "unset" }}
        exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-primary p-4 h-full border-[1px] border-primary rounded-xl">
          <img
            src={tonkeeperBg}
            className="w-full rounded-xl h-40 object-cover"
          />
          <div className="text-2xl text-center text-link font-semibold mt-6">
            Tonkeeper Native App
          </div>
          <div className="text-hint text-xs mt-4">
            The non-custodial TON wallet Tonkeeper is now available as native
            applications for iOS and Android. Using the wallet has become even
            faster, more convenient, and more secure.
          </div>
          <Button onClick={addParticipant}></Button>
        </div>
        {jazzEvent.participants?.map((p) => <div>{p?.username}</div>)}
      </motion.div>
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/events/event")({
  component: RouteComponent,
})
