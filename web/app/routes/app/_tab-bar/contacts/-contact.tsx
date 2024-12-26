import { Avatar, Button } from "@telegram-apps/telegram-ui"
import { memo, useEffect, useState } from "react"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { AnimatePresence, motion } from "framer-motion"
import { JazzContact } from "~/lib/jazz/schema"

const Contact = ({ contact }: { contact: JazzContact }) => {
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    TelegramHelper.getProfileAvatar(contact.username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl)
    })
  }, [contact])

  return (
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
        <Button
          mode={"plain"}
          stretched={true}
          style={{ padding: 0 }}
          onClick={() => window.open(`https://t.me/${contact.username}`)}
        >
          <div className={`flex px-4 min-h-20 justify-center text-sm relative`}>
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
                <Avatar acronym={contact.firstName[0]} size={48} />
              )}
            </div>
            <div className="h-full ml-4 w-full ">
              <div className={"h-full flex items-center w-full py-2"}>
                <div className="w-full py-2">
                  <div className="flex w-full">
                    <div>
                      <div className="font-medium text-left">
                        {contact.firstName}
                      </div>
                      <div className="font-medium text-link text-xs text-left">
                        @{contact.username}
                      </div>
                    </div>
                    {contact.topic && (
                      <div className="ml-auto text-link rounded-xl text-xs flex font-medium mt-[3px]">
                        <span>{contact.topic}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap mt-4">
                    {contact.tags &&
                      contact.tags.map((tag) => (
                        <span
                          className={`px-2 py-[0.5px] text-xs font-normal bg-buttonBezeled text-link rounded-xl`}
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <div className="bg-divider h-[1px] absolute bottom-0 w-full"></div>
            </div>
          </div>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

export default memo(Contact)
