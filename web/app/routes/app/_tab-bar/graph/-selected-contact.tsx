import { ReactElement, useEffect, useState } from "react"
import { GraphNode, GraphNodeType } from "./-@interface"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { Avatar, Tappable } from "@telegram-apps/telegram-ui"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"
import { motion } from "framer-motion"
import TagIcon from "@/assets/icons/tag.svg?react"
import TopicIcon from "@/assets/icons/link.svg?react"
import TrashIcon from "@/assets/icons/rubbish-bin.svg?react"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import {
  JazzListOfContacts,
  JazzListOfLinks,
  JazzListOfTags,
  JazzListOfTopics,
} from "~/lib/jazz/schema"

export const SelectedContact = ({
  selectedContact,
}: {
  selectedContact: GraphNode
}) => {
  const profile = useJazzProfile()
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

  const removeNode = () => {
    if (profile) {
      const filteredLinks = profile.links!.filter(
        (link) =>
          link?.source !== link?.source || link?.target !== link?.target,
      )
      profile.links! = JazzListOfLinks.create(filteredLinks, {
        owner: profile._owner,
      })
      switch (selectedContact.type) {
        case GraphNodeType.CONTACT:
          const filteredContacts = profile.contacts!.filter(
            (profileContact) =>
              profileContact?.username !== selectedContact.username,
          )
          profile.contacts! = JazzListOfContacts.create(filteredContacts, {
            owner: profile._owner,
          })
          break
        case GraphNodeType.TOPIC:
          const filteredTopics = profile.topics!.filter(
            (profileTopic) => profileTopic?.id !== selectedContact.id,
          )
          profile.topics! = JazzListOfTopics.create(filteredTopics, {
            owner: profile._owner,
          })
          break
        case GraphNodeType.TAG:
          const filteredTags = profile.tags!.filter(
            (profileTag) => profileTag?.id !== selectedContact.id,
          )
          profile.tags! = JazzListOfTags.create(filteredTags, {
            owner: profile._owner,
          })
          break
      }
    }
  }

  if (selectedContact.type === GraphNodeType.CONTACT) {
    return (
      <Wrapper>
        <div className="rounded-xl">
          <div className="flex items-center pr-2">
            <Tappable
              className="flex items-center p-2 flex-1"
              onClick={() =>
                window.open(`https://t.me/${selectedContact.username}`)
              }
            >
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
            </Tappable>

            <Tappable
              onClick={removeNode}
              className="ml-auto bg-[#ff4059] p-2 rounded-xl absolute"
            >
              <div className="h-6 w-6">
                <TrashIcon />
              </div>
            </Tappable>
          </div>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <div className="rounded-xl">
        <div className="flex items-center p-2 pr-2">
          <div className="flex items-center">
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
              <div className="font-medium">{selectedContact.title}</div>
            </div>
          </div>

          <Tappable
            onClick={removeNode}
            className="ml-auto bg-[#ff4059] p-2 rounded-xl absolute"
          >
            <div className="h-6 w-6">
              <TrashIcon />
            </div>
          </Tappable>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = ({ children }: { children: ReactElement }) => {
  return (
    <motion.div
      className="z-50"
      initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "unset" }}
      exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="absolute top-0 left-0 z-10  w-full"
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
