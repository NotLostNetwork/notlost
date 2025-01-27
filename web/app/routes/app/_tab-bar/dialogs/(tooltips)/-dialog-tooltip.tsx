import { useRouter } from "@tanstack/react-router"
import { Tappable } from "@telegram-apps/telegram-ui"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { JazzDialog } from "~/lib/jazz/schema"
import MoreIcon from "~/assets/icons/more.svg?react"
import { Route as ContactsRoute } from "~/routes/app/_tab-bar/dialogs/index"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { jazzRemoveDialog } from "~/lib/jazz/actions/jazz-dialog"

export const DialogTooltip = ({
  dialog,
  showTooltip,
  closeTooltip,
}: {
  dialog: JazzDialog
  showTooltip: boolean
  closeTooltip: () => void
}) => {
  const jazzProfile = useJazzProfile()
  const router = useRouter()

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (showTooltip) {
        event.preventDefault()
        closeTooltip()
      }
    }

    if (showTooltip) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      })
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
    }
  }, [showTooltip, closeTooltip])

  const navigateToDialogInfo = () => {
    router.navigate({ to: `${ContactsRoute.to}/${dialog.id}` })
  }

  const removeDialog = () => {
    if (jazzProfile) {
      jazzRemoveDialog(jazzProfile, dialog)
    }
  }

  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={`absolute left-1 -bottom-full -translate-x-1/4 backdrop-blur-lg bg-secondary bg-opacity-70 border-primary border-[2px] rounded-xl shadow-lg z-30`}
          onTouchStart={(event) => {
            event.stopPropagation()
          }}
        >
          <DialogToolTipItem
            Icon={
              <div className="text-link h-4 w-4">
                <MoreIcon />
              </div>
            }
            title={"Info"}
            action={() => {
              navigateToDialogInfo()
            }}
            closeTooltip={closeTooltip}
          />
          <div className="h-[2px] bg-divider"></div>
          <DialogToolTipItem
            Icon={
              <div className="text-link">
                <Icon16Cancel />
              </div>
            }
            title={"Remove"}
            action={() => {
              removeDialog()
            }}
            closeTooltip={closeTooltip}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const DialogToolTipItem = ({
  Icon,
  title,
  action,
  closeTooltip,
}: {
  Icon: React.ReactElement
  title: string
  action: () => void
  closeTooltip: () => void
}) => {
  return (
    <Tappable
      className=" p-2"
      onClick={() => {
        action()
        closeTooltip()
      }}
    >
      <div className="flex w-full items-center">
        {Icon}
        <div className="ml-2 text-left font-medium whitespace-nowrap">
          {title}
        </div>
      </div>
    </Tappable>
  )
}
