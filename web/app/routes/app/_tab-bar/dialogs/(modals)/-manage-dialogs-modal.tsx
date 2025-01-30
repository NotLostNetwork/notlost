import { useState, useEffect, useRef } from "react"
import { DialogData, $getMyDialogs } from "~/actions/telegram"
import BottomModal from "~/ui/modals/bottom-modal"
import FolderIcon from "@/assets/icons/folder.svg?react"
import { useDragStore } from "~/lib/zustand-store/drag-store"
import { useKeyboardState } from "~/lib/utils/funcs/use-keyboard-visible"
import { Avatar } from "@telegram-apps/telegram-ui"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"

interface ManageDialogsModal {
  isOpen: boolean
  close: () => void
}

export const ManageDialogsModal: React.FC<ManageDialogsModal> = ({
  isOpen,
  close,
}) => {
  const [dialogs, setDialogs] = useState<null | DialogData[]>(null)

  const getMyDialogs = async () => {
    const dialogs = await $getMyDialogs()
    setDialogs(dialogs)
  }

  useEffect(() => {
    getMyDialogs()
  }, [])

  const dialogRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const newFolderRef = useRef<HTMLDivElement | null>(null)

  const { setDragState } = useDragStore()

  const handleTouchStart = (
    e: React.TouchEvent,
    draggableItemType: "contact" | "folder",
    dialog?: DialogData,
  ) => {
    let touch = e.touches[0]
    const ref =
      draggableItemType === "folder"
        ? newFolderRef.current
        : dialogRefs.current[dialog?.username!]

    if (!ref) {
      return
    }

    if (draggableItemType === "contact") {
      setDragState({
        draggableItemType,
        draggableItem: dialog,
      })
    } else {
      setDragState({
        draggableItemType,
      })
    }

    const startPos = {
      x: touch.clientX,
      y: touch.clientY,
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      ref.style.transition = ""

      touch = e.touches[0]
      const dx = touch.clientX - startPos.x
      const dy = touch.clientY - startPos.y

      ref.style.transform = `translate(${dx}px, ${dy}px)`
    }

    const handleTouchEnd = () => {
      setDragState({
        draggableItem: null,
        draggableItemType: null,
      })
      ref.style.transition = `transform 0.3s ease`
      ref.style.transform = `translate(0px, 0px)`

      //@ts-ignore
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    //@ts-ignore
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
  }

  const keyboardIsVisible = useKeyboardState()

  useEffect(() => {
    if (keyboardIsVisible) {
      close()
    }
  }, [keyboardIsVisible])

  return (
    <BottomModal title="Manage dialogs" isOpen={isOpen} onClose={close}>
      <div className="flex items-center text-link justify-center mb-6">
        <div
          className="absolute px-2 py-1 rounded-2xl -z-10 h-10 w-[180px]"
          style={{
            backgroundColor: `${hexToRgba(getCssVariableValue("--tg-theme-bg-color"), 0.3)}`,
          }}
        ></div>
        <div
          ref={newFolderRef}
          onTouchStart={(e) => handleTouchStart(e, "folder")}
          className="flex items-center bg-buttonBezeled px-2 py-1 rounded-xl gap-2 font-medium touch-none no-select"
        >
          <div className="h-6 w-6">
            <FolderIcon />
          </div>
          <div>Place new folder</div>
        </div>
      </div>
      {dialogs ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {dialogs.map((d) => {
            if (!d.username) return
            return (
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full bg-primary -z-10 animate-pulse"></div>
                <div
                  ref={(el) => (dialogRefs.current[d.username!] = el)}
                  /*onMouseDown={(e) => handleMouseDown(e, d.username!)}*/
                  onTouchStart={(e) => {
                    handleTouchStart(e, "contact", d)
                  }}
                  className="flex flex-col justify-center items-center gap-1 touch-none relative"
                >
                  <Avatar
                    src={`https://t.me/i/userpic/320/${d.username}.svg`}
                    size={20}
                  />
                  <span
                    className={`px-2 py-[0.5px] text-xs font-normal bg-buttonBezeled text-link rounded-xl`}
                  >
                    {truncateWord(d.name, 6)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {trialContacts.map((d) => {
            if (!d.username) return
            return (
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full bg-primary -z-10 animate-pulse"></div>
                <div
                  ref={(el) => (dialogRefs.current[d.username!] = el)}
                  /*onMouseDown={(e) => handleMouseDown(e, d.username!)}*/
                  onTouchStart={(e) => {
                    handleTouchStart(e, "contact", d)
                  }}
                  className="flex flex-col justify-center items-center gap-1 touch-none relative"
                >
                  <Avatar
                    src={`https://t.me/i/userpic/320/${d.username}.svg`}
                    size={48}
                  />
                  <span
                    className={`px-2 py-[0.5px] text-xs font-normal bg-buttonBezeled text-link rounded-xl`}
                  >
                    {truncateWord(d.name, 6)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </BottomModal>
  )
}

const trialContacts: DialogData[] = [
  { username: "shestaya_liniya", name: "Andrei", unreadCount: 0 },
  { username: "skywl_k", name: "Andrei", unreadCount: 0 },
  { username: "PiraJoke", name: "Max", unreadCount: 0 },
]

export function truncateWord(word: string, maxLength: number): string {
  return word.length > maxLength ? word.slice(0, maxLength) + "..." : word
}
