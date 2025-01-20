import { JazzFolder } from "~/lib/jazz/schema"
import FolderIcon from "@/assets/icons/folder.svg?react"
import { useState, useRef } from "react"
import { Icon28CloseAmbient } from "@telegram-apps/telegram-ui/dist/icons/28/close_ambient"
import { Tappable } from "@telegram-apps/telegram-ui"
import { jazzDeleteFolder } from "~/lib/jazz/actions/jazz-folder"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"

export const Folder = ({ folder }: { folder: JazzFolder | null }) => {
  const jazzProfile = useJazzProfile()

  const [showDeleteOption, setShowDeleteOption] = useState(false)

  const [isPressing, setIsPressing] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTouchStart = () => {
    setIsPressing(true)
    timeoutRef.current = setTimeout(() => {
      setShowDeleteOption((prev) => !prev)
      setIsPressing(false)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleTouchCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const deleteFolder = () => {
    if (jazzProfile && folder) {
      jazzDeleteFolder(jazzProfile, folder)
    }
  }
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className="px-4 py-1"
    >
      <div className="rounded-xl bg-secondary flex gap-2 items-center">
        <Tappable className="flex flex-1 h-full px-4 py-2 rounded-xl gap-2">
          <div className="h-6 w-6 text-link">
            <FolderIcon />
          </div>
          <div contentEditable className="z-10">
            {folder?.title}
          </div>
        </Tappable>
        {showDeleteOption && (
          <Tappable
            onClick={() => {
              deleteFolder()
            }}
            className={`ml-auto absolute mr-2 h-full rounded-full`}
          >
            <Icon28CloseAmbient />
          </Tappable>
        )}
      </div>
    </div>
  )
}
