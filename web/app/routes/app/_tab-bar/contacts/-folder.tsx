import { JazzFolder } from "~/lib/jazz/schema"
import FolderIcon from "@/assets/icons/folder.svg?react"
import { useState, useRef, useEffect } from "react"
import { Icon28CloseAmbient } from "@telegram-apps/telegram-ui/dist/icons/28/close_ambient"
import { Tappable } from "@telegram-apps/telegram-ui"
import { jazzDeleteFolder } from "~/lib/jazz/actions/jazz-folder"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { motion, Variants } from "framer-motion"

export const Folder = ({ folder }: { folder: JazzFolder | null }) => {
  const jazzProfile = useJazzProfile()

  const [showDeleteOption, setShowDeleteOption] = useState(false)
  const [folderTitle, setFolderTitle] = useState(folder?.title || "")
  const [inputWidth, setInputWidth] = useState(0)
  const spanRef = useRef<HTMLSpanElement | null>(null)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTouchStart = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDeleteOption((prev) => !prev)
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
      setShowDeleteOption(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderTitle(e.target.value)
  }

  useEffect(() => {
    setFolderTitle(folder?.title || "")
  }, [folder])

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth)
    }
  }, [folderTitle])

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
          <div
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
            <input
              type="text"
              value={folderTitle}
              onChange={handleChange}
              className="bg-transparent border-none outline-none font-medium z-10"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                textAlign: "left",
                width: `${inputWidth}px`,
              }}
              onBlur={() => {
                if (folder) {
                  if (folderTitle.length === 0) {
                    folder.title = "New folder"
                  } else {
                    folder.title = folderTitle
                  }
                }
              }}
            />
            <span ref={spanRef} className="absolute invisible font-medium">
              {/* without adding 5 symbols to shadow span for calculate width, input is lagging, don't ask XD */}
              {folderTitle + "*****" || " "}
            </span>
          </div>
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
