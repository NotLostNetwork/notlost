import { Avatar, Tappable } from "@telegram-apps/telegram-ui"
import { truncateWord } from "./(modals)/-manage-dialogs-modal"
import { DialogTooltip } from "./(tooltips)/-dialog-tooltip"
import { JazzDialog } from "~/lib/jazz/schema"
import { useRef, useState } from "react"

export const Dialog = ({ dialog }: { dialog: JazzDialog }) => {
  const timerRef = useRef<number | null>(null)
  const isLongPress = useRef(false)

  const [dialogWithTooltip, setDialogWithTooltip] = useState<null | JazzDialog>(
    null,
  )

  const startPress = (dialog: JazzDialog) => {
    isLongPress.current = false
    timerRef.current = window.setTimeout(() => {
      setDialogWithTooltip(dialog)
      isLongPress.current = true
    }, 200)
  }

  const endPress = (username: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null

      if (!isLongPress.current) {
        window.open(`https://t.me/${username}`, "_blank")
      }
    }
  }

  return (
    <div className={`relative`}>
      <Tappable
        onTouchStart={() => {
          startPress(dialog)
        }}
        onTouchEnd={() => {
          if (dialog?.username) {
            endPress(dialog.username)
          }
        }}
        className="flex flex-col items-center justify-center gap-1 rounded-xl p-2"
      >
        <Avatar
          src={`https://t.me/i/userpic/320/${dialog.username}.svg`}
          size={48}
        />
        <span
          className={`px-2 py-[0.5px] text-xs font-normal bg-buttonBezeled text-link rounded-xl`}
        >
          {truncateWord(dialog?.name || "", 5)}
        </span>
      </Tappable>
      <DialogTooltip
        dialog={dialog}
        showTooltip={dialog === dialogWithTooltip}
        closeTooltip={() => {
          setDialogWithTooltip(null)
        }}
      />
    </div>
  )
}
