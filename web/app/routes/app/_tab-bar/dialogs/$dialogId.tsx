import { createFileRoute, useRouter } from "@tanstack/react-router"
import WebApp from "@twa-dev/sdk"
import { Route as ContactsRoute } from "~/routes/app/_tab-bar/dialogs/index"
import { useCoState } from "~/lib/jazz/jazz-provider"
import { JazzDialog } from "~/lib/jazz/schema"
import { ID } from "jazz-tools"
import { AnimatePresence, motion } from "framer-motion"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import PencilIcon from "@/assets/icons/pencil-icon.svg?react"
import TagIcon from "@/assets/icons/tag.svg?react"
import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem"

function RouteComponent() {
  const { dialogId } = Route.useParams()
  const jazzDialog = useCoState(JazzDialog, dialogId as ID<JazzDialog>)

  const router = useRouter()
  const lp = useLaunchParams()

  const backButton = WebApp.BackButton
  backButton.show()
  backButton.onClick(() => {
    backButton.hide()
    router.navigate({ to: ContactsRoute.to })
  })

  return (
    <AnimatePresence>
      <div className="overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scaleZ: 0.9, filter: "blur(2px)" }}
          animate={{
            opacity: 1,
            scaleZ: 1,
            filter: "unset",
            transition: {
              default: { type: "linear" },
            },
          }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(2px)" }}
        >
          <div className="h-full flex flex-col overflow-hidden">
            <div
              style={{
                paddingTop: ["macos", "tdesktop"].includes(lp.platform)
                  ? 40
                  : `calc(${getCssVariableValue("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariableValue("--tg-viewport-content-safe-area-inset-top")})`,
              }}
              className="w-full pl-4 pr-4 flex flex-col items-center"
            >
              <img
                loading="lazy"
                src={`https://t.me/i/userpic/320/${jazzDialog?.username}.svg`}
                className="h-24 w-24 rounded-full "
                decoding="async"
                alt=""
              />
              <div className="pt-2 text-xl">{jazzDialog?.name}</div>
              <span className={`text-link`}>@{jazzDialog?.username}</span>
              <div className="flex gap-4 mt-4 w-full justify-center items-center">
                <InlineButtonsItem mode="plain" text="Add tag">
                  <div className="h-5 w-5">
                    <TagIcon />
                  </div>
                </InlineButtonsItem>
                <InlineButtonsItem mode="plain" text="Add note">
                  <div className="h-5 w-5">
                    <PencilIcon />
                  </div>
                </InlineButtonsItem>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export const Route = createFileRoute("/app/_tab-bar/dialogs/$dialogId")({
  component: RouteComponent,
})
