import { JazzFolder } from "~/lib/jazz/schema"
import FolderIcon from "@/assets/icons/folder.svg?react"
import { useState, useRef, useEffect } from "react"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { Accordion } from "@telegram-apps/telegram-ui"
import { jazzDeleteFolder } from "~/lib/jazz/actions/jazz-folder"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { AccordionContent } from "@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent"
import { AccordionSummary } from "@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary"
import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem"
import PencilIcon from "@/assets/icons/pencil-icon.svg?react"
import ConfirmModal from "~/ui/modals/confirm-modal"
import { useAppStore } from "~/lib/zustand-store/store"
import { motion } from "framer-motion"
import { Dialog } from "./-dialog"

export const Folder = ({ folder }: { folder: JazzFolder | null }) => {
  const jazzProfile = useJazzProfile()

  const { expandedFolder, setExpandedFolder } = useAppStore()

  const [folderTitle, setFolderTitle] = useState(folder?.title || "")
  const [isEditTitle, setIsEditTitle] = useState(false)

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEditTitle(true)
    setFolderTitle(e.target.value)
  }

  useEffect(() => {
    setFolderTitle(folder?.title || "")
  }, [folder])

  useEffect(() => {
    if (inputRef.current && isEditTitle) {
      inputRef.current.focus()
    }
  }, [folderTitle])

  const deleteFolder = () => {
    if (jazzProfile && folder) {
      jazzDeleteFolder(jazzProfile, folder)
      setExpandedFolder(null)
    }
  }

  return (
    <div className="no-select">
      <motion.div className="px-4 py-1 rounded-b-xl">
        <Accordion
          expanded={expandedFolder?.id === folder?.id}
          onChange={() => {
            if (expandedFolder?.id === folder?.id) {
              setExpandedFolder(null)
            } else if (folder?.id) {
              setExpandedFolder(folder)
            }
          }}
        >
          <AccordionSummary className="rounded-xl bg-secondary">
            <div className="flex gap-2 items-center">
              <div className="h-6 w-6 text-link">
                <FolderIcon />
              </div>
              <input
                type="text"
                ref={inputRef}
                value={folderTitle}
                onChange={handleChange}
                className="bg-transparent border-none outline-none font-medium z-10"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  textAlign: "left",
                }}
                onBlur={() => {
                  setIsEditTitle(false)
                  if (folder) {
                    if (folderTitle.length === 0) {
                      folder.title = "New folder"
                    } else {
                      folder.title = folderTitle
                    }
                  }
                }}
              />
            </div>
          </AccordionSummary>
          <AccordionContent
            className={` ${expandedFolder?.id === folder?.id ? "transition-all duration-300 delay-75 ease-in-out opacity-100" : "opacity-0"}`}
          >
            <div className={`flex gap-4`}>
              <InlineButtonsItem mode="plain" text="Icon (soon)">
                <div className="h-5 w-5">
                  <FolderIcon />
                </div>
              </InlineButtonsItem>
              <InlineButtonsItem
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
                mode="plain"
                text="Rename"
              >
                <div className="h-5 w-5">
                  <PencilIcon />
                </div>
              </InlineButtonsItem>
              <InlineButtonsItem
                onClick={() => setIsOpenDeleteModal(true)}
                mode="plain"
                text="Delete"
              >
                <div className="h-5 w-5 flex items-center justify-center">
                  <Icon16Cancel />
                </div>
              </InlineButtonsItem>
            </div>
            <div className="px-4 py-2 flex items-center justify-center flex-wrap">
              {folder?.dialogs?.map((d) => d && <Dialog dialog={d} />)}
            </div>
          </AccordionContent>
        </Accordion>
      </motion.div>
      <ConfirmModal
        isOpen={isOpenDeleteModal}
        closeModal={() => setIsOpenDeleteModal(false)}
        title="Remove folder with dialogs?"
        action={deleteFolder}
      />
    </div>
  )
}
