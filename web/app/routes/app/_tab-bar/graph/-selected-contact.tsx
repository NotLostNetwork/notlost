import { ReactElement, useEffect, useState } from "react"
import { GraphNode, GraphNodeType } from "./-@interface"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { Avatar, Tappable } from "@telegram-apps/telegram-ui"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"
import { motion } from "framer-motion"
import TagIcon from "@/assets/icons/tag.svg?react"
import TopicIcon from "@/assets/icons/link.svg?react"

export const SelectedContact = ({
  selectedContact,
}: {
  selectedContact: GraphNode
}) => {
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    setAvatarUrl("")
    if (selectedContact.type === GraphNodeType.CONTACT) {
      TelegramHelper.getProfileAvatar(selectedContact.username).then(
        (avatarBlobUrl) => {
          setAvatarUrl(avatarBlobUrl)
        },
      )
    }
  }, [selectedContact])

  if (selectedContact.type === GraphNodeType.CONTACT) {
    return (
      <Wrapper>
        <Tappable
          className="rounded-xl"
          onClick={() =>
            window.open(`https://t.me/${selectedContact.username}`)
          }
        >
          <div className="flex items-center p-2">
            {avatarUrl ? (
              <img
                loading="lazy"
                src={avatarUrl}
                className="h-12 min-w-12 rounded-full"
                decoding="async"
                alt=""
              />
            ) : (
              <Avatar acronym={selectedContact.firstName[0]} size={48} />
            )}
            <div className="pl-2">
              <div className="text-xs font-medium">
                {selectedContact.firstName}
              </div>
              <div className="text-xs text-link font-medium">
                @{selectedContact.username}
              </div>
            </div>
          </div>
        </Tappable>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <Tappable className="rounded-xl">
        <div className="flex items-center p-2">
          {selectedContact.type === GraphNodeType.TAG ? (
            <div className="h-6 w-6 m-2">
              <TagIcon />
            </div>
          ) : (
            <div className="h-6 w-6 m-2">
              <TopicIcon />
            </div>
          )}
          <div className="pl-2">
            <div className="font-medium">{selectedContact.firstName}</div>
          </div>
        </div>
      </Tappable>
    </Wrapper>
  )
}

const Wrapper = ({ children }: { children: ReactElement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "unset" }}
      exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      transition={{ duration: 0.15 }}
    >
      <div
        style={{
          top: `calc(${getCssVariableValue("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariableValue("--tg-viewport-content-safe-area-inset-top")})`,
        }}
      >
        <div className="w-screen p-4 pt-2">
          <div
            className="bg-secondary rounded-xl"
            style={{
              boxShadow: `${hexToRgba("#6ab3f3", 0.8)} 0px 3px 0px 0px`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
