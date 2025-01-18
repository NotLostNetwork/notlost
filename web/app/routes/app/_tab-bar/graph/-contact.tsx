import {
  Avatar,
  Button,
  Divider,
  Input,
  Tappable,
} from "@telegram-apps/telegram-ui"
import { memo, useEffect, useRef, useState } from "react"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { AnimatePresence, motion } from "framer-motion"
import StarBlue from "@/assets/icons/star-blue.svg?react"
import {
  JazzContact,
  JazzEvent,
  JazzLink,
  JazzListOfContacts,
  JazzListOfContactTags,
  JazzParticipant,
  JazzTag,
  JazzTopic,
} from "~/lib/jazz/schema"
import { Icon24Chat } from "@telegram-apps/telegram-ui/dist/icons/24/chat"
import StarIcon from "@/assets/icons/star.svg?react"
import FilledStarIcon from "@/assets/icons/star-filled.svg?react"
import PencilIcon from "@/assets/icons/pencil-icon.svg?react"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { co, CoList, Group, ID } from "jazz-tools"
import { Icon28AddCircle } from "@telegram-apps/telegram-ui/dist/icons/28/add_circle"
import FullWidthModal from "~/ui/modals/full-width-modal"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"

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
  edit = false,
  participant,
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
  edit?: boolean
  participant?: JazzParticipant
}) => {
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    TelegramHelper.getProfileAvatar(username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl)
    })
  }, [])

  const jazzProfile = useJazzProfile()
  const jazzEvent = useCoState(
    JazzEvent,
    "co_zWcBGmgtn5rkPgAiVDTitFaVF4T" as ID<JazzEvent>,
  )

  //new event -> co_zhMJSt2rMzhCz2qCzD4CsgfMFd7

  const [contactSaved, setContactSaved] = useState(false)

  const [signInModalOpen, setSignInModalOpen] = useState(false)

  const lp = useLaunchParams()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget === null) {
      window.scrollTo(0, 0)
      inputRef.current?.focus()
    }
  }

  const { me } = useAccount()

  useEffect(() => {
    if (jazzProfile) {
      if (jazzProfile.contacts?.find((c) => c?.username === username)) {
        setContactSaved(true)
      } else {
        setContactSaved(false)
      }
    }
  }, [jazzProfile])

  const [inputValues, setInputValues] = useState({
    tag: "",
    description: "",
  })
  const [tags, setTags] = useState<string[]>([])

  const clickOnStar = () => {
    if (jazzProfile && jazzProfile.contacts)
      if (!contactSaved) {
        jazzProfile.contacts.push(
          JazzContact.create(
            {
              username: username,
              firstName: firstName,
              tags: JazzListOfContactTags.create(selectedTags, {
                owner: jazzProfile._owner,
              }),
              topic: topic?.title!,
            },
            {
              owner: jazzProfile._owner,
            },
          ),
        )
        const tonkeeperTag = jazzProfile.tags?.find(
          (jTag) => jTag?.title === "Tonkeeper Event",
        )
        if (!tonkeeperTag) {
          const newTag = JazzTag.create(
            {
              title: "Tonkeeper Event",
              superTag: true,
            },
            {
              owner: jazzProfile._owner,
            },
          )
          jazzProfile.tags?.push(newTag)
          jazzProfile.links?.push(
            JazzLink.create(
              {
                source: newTag.id,
                target: username,
              },
              { owner: jazzProfile._owner },
            ),
          )
        } else {
          jazzProfile.links?.push(
            JazzLink.create(
              {
                source: tonkeeperTag.id,
                target: username,
              },
              { owner: jazzProfile._owner },
            ),
          )
        }
      } else {
        const filteredContacts = jazzProfile.contacts!.filter(
          (profileContact) => profileContact?.username !== username,
        )
        jazzProfile.contacts! = JazzListOfContacts.create(filteredContacts, {
          owner: jazzProfile._owner,
        })
      }
  }

  const modifyContact = () => {
    debugger
    if (jazzEvent) {
      const user = jazzEvent.participants?.find(
        (p) => p?.username === lp.initData?.user?.username,
      )
      if (user) {
        const group = Group.create({ owner: me })
        group.addMember("everyone", "writer")
        user.tags = JazzListOfContactTags.create(tags, { owner: group })
        user.description = inputValues.description

        inputValues.description = ""
        setTags([])

        setSignInModalOpen(false)
      }
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
                        {edit && (
                          <Tappable
                            onClick={() => setSignInModalOpen(true)}
                            style={{
                              background: "transparent",
                            }}
                            className={
                              "py-2 px-4 font-semibold rounded-2xl border-[1px] border-primary"
                            }
                          >
                            <div className="h-6 w-6">
                              <PencilIcon />
                            </div>
                          </Tappable>
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
      <AnimatePresence>
        {signInModalOpen && (
          <FullWidthModal
            isOpen={signInModalOpen}
            onClose={() => {
              setInputValues({
                description: "",
                tag: "",
              })
              setTags([])
              setSignInModalOpen(false)
            }}
            title="Modify my contact"
          >
            <div className="bg-secondary px-2 py-1 relative ">
              <div className="text-xs text-center text-hint">
                This information will help other people on the event to know
                more about you{" "}
              </div>
              <Contact
                username={lp.initData?.user?.username!}
                firstName={lp.initData?.user?.firstName!}
                selectedTags={tags}
                addContact={() => {}}
                topic={null}
                addButton={false}
                description={inputValues.description}
              />
              <div className="pt-6 pb-4">
                <Input
                  autoFocus={true}
                  ref={inputRef}
                  className="text-white bg-primary flex-1"
                  style={{ color: "white" }}
                  type="text"
                  onFocus={() => {
                    window.scrollTo(0, 0)
                  }}
                  placeholder="Company, role, skill..."
                  value={inputValues.tag}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      tag: e.target.value,
                    }))
                  }
                  after={
                    <AnimatePresence mode="wait">
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                          rotate: 90,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.5,
                          rotate: -90,
                        }}
                        transition={{
                          duration: 0.15,
                          ease: "easeInOut",
                        }}
                      >
                        <Tappable
                          className="h-6 absolute w-6 -top-[2px] right-0 rounded-full"
                          onClick={() => {
                            setTags((prev) => [...prev, inputValues.tag])
                            setInputValues((prev) => ({
                              ...prev,
                              tag: "",
                            }))
                          }}
                        >
                          <Icon28AddCircle />
                        </Tappable>
                      </motion.div>
                    </AnimatePresence>
                  }
                />
                <div className="mt-1 mb-4 text-xs text-hint px-2">
                  Things that can interest people to meet you
                </div>
                <Input
                  className="text-white bg-primary"
                  style={{ color: "white" }}
                  type="text"
                  onFocus={() => {
                    window.scrollTo(0, 0)
                  }}
                  onBlur={handleBlur}
                  placeholder="You want everybody to know about"
                  value={inputValues.description}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <div className="mt-1 mb-6 text-xs text-hint px-2">
                  Might be specific connections you search for, or just "I love
                  dogs 🐶"
                </div>
                <Button
                  stretched={true}
                  onClick={modifyContact}
                  disabled={
                    tags.length < 1 || inputValues.description.length < 1
                  }
                >
                  Modify
                </Button>
              </div>
            </div>
          </FullWidthModal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(Contact)
