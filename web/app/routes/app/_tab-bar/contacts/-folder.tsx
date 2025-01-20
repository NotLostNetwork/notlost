import { JazzFolder } from "~/lib/jazz/schema"
import FolderIcon from "@/assets/icons/folder.svg?react"
import { useState, useRef } from "react"
import { Icon28CloseAmbient } from "@telegram-apps/telegram-ui/dist/icons/28/close_ambient"
import { Tappable } from "@telegram-apps/telegram-ui"
import { jazzDeleteFolder } from "~/lib/jazz/actions/jazz-folder"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { motion, Variants } from "framer-motion"

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

  const variants: Variants = {
    static: { scale: 1, rotate: 0 },
    shake: {
      rotate: [0, -0.5, 0.5, -0.5, 0.5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  }
  return (
    <div className="overflow-hidden no-select">
      <motion.div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        variants={variants}
        animate={showDeleteOption ? "shake" : "static"}
        className="px-4 py-1 overflow-hidden"
        style={{ overflow: "hidden", maxWidth: "100%" }}
      >
        <div className="rounded-xl bg-secondary flex gap-2 items-center">
          <Tappable
            onClick={() => {
              if (showDeleteOption) {
                setShowDeleteOption(false)
              }
            }}
            className="flex flex-1 h-full px-4 py-4 rounded-xl gap-2"
          >
            <div className="h-6 w-6 text-link">
              <FolderIcon />
            </div>
            <div contentEditable className="z-10 font-medium">
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
      </motion.div>
    </div>
  )
}
