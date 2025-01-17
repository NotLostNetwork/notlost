import { Avatar, Button, Divider, Tappable } from "@telegram-apps/telegram-ui"
import { memo, useEffect, useState } from "react"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { AnimatePresence, motion } from "framer-motion"
import StarBlue from "@/assets/icons/star-blue.svg?react"
import { JazzContact, JazzListOfContacts, JazzTopic } from "~/lib/jazz/schema"
import { Icon24Chat } from "@telegram-apps/telegram-ui/dist/icons/24/chat"
import StarIcon from "@/assets/icons/star.svg?react"
import FilledStarIcon from "@/assets/icons/star-filled.svg?react"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"

const Contact = ({
  username,
  firstName,
  selectedTags,
  topic,
  addContact,
  addButton = true,
  description,
  divider = false,
  actions = false,
}: {
  username: string
  firstName: string
  selectedTags: string[]
  topic: JazzTopic | null
  addContact: () => void
  addButton?: boolean
  description?: string
  divider?: boolean
  actions?: boolean
}) => {
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    TelegramHelper.getProfileAvatar(username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl)
    })
  }, [])

  const jazzProfile = useJazzProfile()

  const [contactSaved, setContactSaved] = useState(false)

  useEffect(() => {
    if (jazzProfile) {
      if (jazzProfile.contacts?.find((c) => c?.username === username)) {
        setContactSaved(true)
      } else {
        setContactSaved(false)
      }
    }
  }, [jazzProfile])

  const clickOnStar = () => {
    if (jazzProfile && jazzProfile.contacts)
      if (!contactSaved) {
        jazzProfile.contacts.push(
          JazzContact.create(
            {
              username: username,
              firstName: firstName,
            },
            {
              owner: jazzProfile._owner,
            },
          ),
        )
      } else {
        const filteredContacts = jazzProfile.contacts!.filter(
          (profileContact) => profileContact?.username !== username,
        )
        jazzProfile.contacts! = JazzListOfContacts.create(filteredContacts, {
          owner: jazzProfile._owner,
        })
      }
  }

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
            <div
              className={`flex px-2 pt-4 min-h-14 justify-center text-sm relative`}
            >
              <div className="h-14 flex items-center">
                {avatarUrl ? (
                  <img
                    loading="lazy"
                    src={avatarUrl}
                    className="h-14 min-w-14 rounded-full"
                    decoding="async"
                    alt=""
                  />
                ) : (
                  <Avatar acronym={firstName[0]} size={48} />
                )}
              </div>
              <div className="h-full ml-4 w-full ">
                <div className={"h-full flex items-center w-full"}>
                  <div className="w-full">
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
                        {actions && (
                          <div className="space-y-2 text-hint">
                            <Tappable
                              onClick={() => {
                                window.open(`https://t.me/${username}`)
                              }}
                              style={{
                                background: "transparent",
                              }}
                              className={"py-2 px-4 font-semibold rounded-2xl"}
                            >
                              <Icon24Chat />
                            </Tappable>
                            <Tappable
                              onClick={clickOnStar}
                              style={{
                                background: "transparent",
                              }}
                              className={"py-2 px-4 font-semibold rounded-2xl"}
                            >
                              {contactSaved ? (
                                <div className="text-link">
                                  <FilledStarIcon />
                                </div>
                              ) : (
                                <div>
                                  <StarIcon />
                                </div>
                              )}
                            </Tappable>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {divider && (
                  <div className="h-[1px] mt-2 bg-divider w-full"></div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default memo(Contact)
