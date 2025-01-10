import { Avatar, Tappable } from "@telegram-apps/telegram-ui"
import { memo, useEffect, useState } from "react"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { AnimatePresence, motion } from "framer-motion"

const Contact = ({
  username,
  firstName,
}: {
  username: string
  firstName: string
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
              className={`flex px-4 min-h-20 justify-center text-sm relative`}
            >
              <div className="h-20 flex items-center">
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
                <div className={"h-full flex items-center w-full py-2"}>
                  <div className="w-full py-2">
                    <div className="flex w-full">
                      <div>
                        <div className="font-medium text-left">{firstName}</div>
                        <div className="font-medium text-link text-xs text-left">
                          @{username}
                        </div>
                      </div>
                      <div className="ml-auto text-link rounded-xl text-xs flex font-medium mt-[3px]">
                        <span>Tap to add into graph</span>
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
