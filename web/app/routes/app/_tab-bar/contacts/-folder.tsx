import { JazzDialog, JazzFolder } from "~/lib/jazz/schema"
import FolderIcon from "@/assets/icons/folder.svg?react"
import { useState, useRef, useEffect } from "react"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { Accordion, Tappable } from "@telegram-apps/telegram-ui"
import {
  jazzDeleteFolder,
  jazzRemoveDialogFromFolder,
} from "~/lib/jazz/actions/jazz-folder"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { motion } from "framer-motion"
import { AccordionContent } from "@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent"
import { AccordionSummary } from "@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary"
import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem"
import PencilIcon from "@/assets/icons/pencil-icon.svg?react"
import ConfirmModal from "~/ui/modals/confirm-modal"
import { truncateWord } from "./(modals)/-manage-dialogs-modal"
import MoreIcon from "~/assets/icons/more.svg?react"

export const Folder = ({
  folder,
  expandedFolderId,
  setExpandedFolderId,
}: {
  folder: JazzFolder | null
  expandedFolderId: string | null
  setExpandedFolderId: (val: null | string) => void
}) => {
  const jazzProfile = useJazzProfile()

  const [folderTitle, setFolderTitle] = useState(folder?.title || "")
  const [isEditTitle, setIsEditTitle] = useState(false)

  const [tooltipDialogId, setTooltipDialogId] = useState<null | string>(null)

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const deleteFolder = () => {
    if (jazzProfile && folder) {
      jazzDeleteFolder(jazzProfile, folder)
      setExpandedFolderId(null)
    }
  }

  const deleteDialogFromFolder = (dialog: JazzDialog) => {
    if (jazzProfile && folder) {
      jazzRemoveDialogFromFolder(jazzProfile, folder, dialog)
    }
  }

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

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setTooltipDialogId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timerRef = useRef<number | null>(null)
  const isLongPress = useRef(false)

  const startPress = (dialogId: string | null) => {
    isLongPress.current = false
    timerRef.current = window.setTimeout(() => {
      setTooltipDialogId(dialogId)
      isLongPress.current = true
      setLongPressTriggered(true)
    }, 200)
  }

  const endPress = (username: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null

      if (!isLongPress.current) {
        window.open(`https://t.me/${username}`, "_blank")
      } else {
        // Prevent hiding the tooltip if it was just shown
        console.log("Tooltip remains visible.")
      }
    }
  }

  return (
    <div className="overflow-hidden no-select">
      {tooltipDialogId && (
        <div
          onClick={() => setTooltipDialogId(null)}
          className={`h-screen w-screen absolute top-0 left-0 z-20`}
        ></div>
      )}

      <motion.div
        className="px-4 py-1 overflow-hidden rounded-b-xl"
        style={{ overflow: "hidden", maxWidth: "100%" }}
      >
        <Accordion
          expanded={expandedFolderId === folder?.id}
          onChange={() => {
            if (expandedFolderId === folder?.id) {
              setExpandedFolderId(null)
            } else if (folder?.id) {
              setExpandedFolderId(folder?.id)
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
          <AccordionContent>
            <div className="flex gap-4">
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
              {folder?.dialogs?.map(
                (d) =>
                  d && (
                    <div key={d.id} className="relative">
                      <Tappable
                        onTouchStart={() => {
                          if (d?.id) {
                            startPress(d.id)
                          }
                        }}
                        onTouchEnd={() => {
                          if (d?.username) {
                            endPress(d.username)
                          }
                        }}
                        className="flex flex-col items-center justify-center gap-1 rounded-xl p-2"
                      >
                        <img
                          loading="lazy"
                          src={`https://t.me/i/userpic/320/${d?.username}.svg`}
                          className="h-12 w-12 rounded-full "
                          decoding="async"
                          alt=""
                        />
                        <span
                          className={`px-2 py-[0.5px] text-xs font-normal bg-buttonBezeled text-link rounded-xl`}
                        >
                          {truncateWord(d?.name || "", 5)}
                        </span>
                      </Tappable>
                      {d?.id === tooltipDialogId && (
                        <div ref={tooltipRef}>
                          <div
                            ref={tooltipRef}
                            className={`absolute left-0 bottom-0 -translate-y-full bg-secondary overflow-hidden border-primary border-[2px] rounded-xl transition-opacity ease-in-out duration-150 shadow-lg z-30`}
                          >
                            <ToolTipItem
                              Icon={
                                <div className="text-link h-4 w-4">
                                  <MoreIcon />
                                </div>
                              }
                              title={"Info"}
                              action={() => {}}
                            />
                            <div className="h-[2px] bg-divider"></div>
                            <ToolTipItem
                              Icon={
                                <div className="text-link">
                                  <Icon16Cancel />
                                </div>
                              }
                              title={`Remove`}
                              action={() => {
                                deleteDialogFromFolder(d)
                                setTooltipDialogId(null)
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ),
              )}
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

const ToolTipItem = ({
  Icon,
  title,
  action,
}: {
  Icon: React.ReactElement
  title: string
  action: () => void
}) => {
  return (
    <Tappable className=" p-2" onClick={action}>
      <div className="flex w-full items-center">
        {Icon}
        <div className="ml-2 text-left font-medium whitespace-nowrap">
          {title}
        </div>
      </div>
    </Tappable>
  )
}
