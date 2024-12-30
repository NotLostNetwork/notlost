import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@telegram-apps/telegram-ui"
import { AnimatePresence, motion } from "framer-motion"
import { Suspense } from "react"
import lazyWithPreload from "react-lazy-with-preload"
import { GraphIcon } from "~/assets/icons/iconsAsComponent/graph-icon"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import TgWallpaper from "~/ui/tg-wallpaper"
import { useContactsState } from "../contacts/-$state"

const ContactsGraph = () => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const LazyForceGraph = lazyWithPreload(
    () => import("~/routes/app/_tab-bar/graph/-force-graph"),
  )
  LazyForceGraph.preload()

  const { uniqueTopics } = useContactsState(profile?.contacts)

  return (
    <div>
      <div className="h-screen absolute">
        <TgWallpaper opacity={0.5} />
      </div>
      <div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              damping: 50,
              stiffness: 500,
              delay: 0.1,
            }}
          >
            <Suspense>
              <LazyForceGraph
                data={profile?.contacts!}
                uniqueTopics={uniqueTopics}
              />
            </Suspense>
          </motion.div>
        </AnimatePresence>
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
