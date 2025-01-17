import { Avatar, Button, Divider, Tappable } from "@telegram-apps/telegram-ui"
import { memo, useEffect, useState } from "react"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { AnimatePresence, motion } from "framer-motion"
import StarBlue from "@/assets/icons/star-blue.svg?react"
import { JazzTopic } from "~/lib/jazz/schema"

const Contact = ({
  username,
  firstName,
  selectedTags,
  topic,
  addContact,
  addButton = true,
  description,
}: {
  username: string
  firstName: string
  selectedTags: string[]
  topic: JazzTopic | null
  addContact: () => void
  addButton?: boolean
  description?: string
}) => {
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    TelegramHelper.getProfileAvatar(username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl)
    })
  }, [])

  return (
    <div className="no-select">
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
            damping: 20,
            stiffness: 300,
          }}
        >
          <div className={`transition-all duration-300 ease`}>
            <Tappable
              className={`flex p-2 min-h-14 justify-center text-sm relative`}
            >
              <div className="h-14 flex items-center">
                {avatarUrl ? (
                  <img
                    loading="lazy"
                    src={avatarUrl}
                    className="h-12 min-w-12 rounded-full"
                    decoding="async"
                    alt=""
                  />
                ) : (
                  <Avatar acronym={firstName[0]} size={48} />
                )}
              </div>
              <div className="h-full ml-4 w-full ">
                <div className={"h-full flex items-center w-full"}>
                  <div className="w-full py-2">
                    <div className="flex w-full">
                      <div>
                        <div className="font-medium text-left">{firstName}</div>
                        <div className="font-medium text-link text-xs text-left">
                          @{username}
                        </div>
                        <div className="flex gap-1 flex-wrap mt-4">
                          {selectedTags &&
                            selectedTags.map((tag) => (
                              <span
                                className={`px-2 py-[0.5px] text-xs font-normal bg-buttonBezeled text-link rounded-xl`}
                                key={tag}
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        {description && (
                          <div className="text-xs text-hint mt-2">
                            {description}
                          </div>
                        )}
                      </div>
                      <div className="ml-auto flex items-start">
                        {topic && (
                          <div className="ml-auto flex items-center justify-start pr-4 gap-2 font-medium mt-[3px]">
                            <div className="h-6 w-6">
                              <StarBlue />
                            </div>
                            <span>{topic.title}</span>
                          </div>
                        )}
                        {addButton && (
                          <Button onClick={addContact} mode="bezeled">
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tappable>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default memo(Contact)
