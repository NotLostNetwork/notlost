import { Avatar, Button, Tappable } from "@telegram-apps/telegram-ui"
import { memo, useEffect, useRef, useState } from "react"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { AnimatePresence, motion } from "framer-motion"
import {
  JazzAccount,
  JazzContact,
  JazzListOfContacts,
  RootUserProfile,
} from "~/lib/jazz/schema"
import PencilIcon from "~/assets/icons/pencil-icon.svg?react"
import TrashBinIcon from "@/assets/icons/rubbish-bin.svg"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import DeleteContactModal from "./(modals)/-delete-contact-modal"

const Contact = ({ contact }: { contact: JazzContact }) => {
  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    TelegramHelper.getProfileAvatar(contact.username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl)
    })
  }, [contact])

  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const [hidden, setHidden] = useState(false)
  const timerRef = useRef<number | null>(null)
  const isLongPress = useRef(false)

  const startPress = () => {
    isLongPress.current = false
    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true
      setLongPressTriggered((prev) => !prev)
    }, 200)
  }

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!isLongPress.current) {
      window.open(`https://t.me/${contact.username}`)
    }
  }

  const handleTouchMove = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      isLongPress.current = true
    }
  }

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)

  const removeContact = () => {
    setHidden(true)
    setTimeout(() => {
      if (profile) {
        const filteredContacts = profile.contacts!.filter(
          (profileContact) => profileContact?.username !== contact.username,
        )
        profile.contacts! = JazzListOfContacts.create(filteredContacts, {
          owner: profile._owner,
        })
      }
    }, 300)
  }

  return (
    <div>
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
          <div
            className={`transition-all duration-300 ease ${hidden ? "max-h-0 opacity-0" : "max-h-[200px] opacity-100"}`}
          >
            <Tappable
              onTouchStart={startPress}
              onTouchEnd={endPress}
              onTouchMove={handleTouchMove}
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
              </div>
            </Tappable>
            <div
              className={`transition-all pl-4 pr-2 ml-16 duration-300 ease ${longPressTriggered ? "max-h-[100px] opacity-100 pb-2" : "max-h-0 opacity-0"}`}
            >
              {contact.description && (
                <div className="font-medium text-xs pb-4 text-hint">
                  {contact.description}
                </div>
              )}

              <div className="flex justify-end gap-2 rounded-lg pr-2">
                <Tappable onClick={() => {}}>
                  <div className="flex items-center gap-2 p-2 rounded-lg border-primary border-[1px]">
                    <div className="h-6 w-6 text-[#6ab2f2]">
                      <PencilIcon />
                    </div>
                    <div className="text-xs text-link font-medium">Modify</div>
                  </div>
                </Tappable>

                <Tappable onClick={() => setIsOpenDeleteModal(true)}>
                  <div className="flex items-center gap-2 p-2 rounded-lg border-primary border-[1px]">
                    <div className="h-6 w-6">
                      <img src={TrashBinIcon} alt="" />
                    </div>
                    <div className="text-xs font-medium text-[#ff4059]">
                      Remove
                    </div>
                  </div>
                </Tappable>
              </div>
            </div>
            <div className="w-full pl-20">
              <div className="bg-divider h-[1px]"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <DeleteContactModal
        isOpen={isOpenDeleteModal}
        closeModal={() => setIsOpenDeleteModal(false)}
        deleteContact={removeContact}
      />
    </div>
  )
}

export default memo(Contact)
