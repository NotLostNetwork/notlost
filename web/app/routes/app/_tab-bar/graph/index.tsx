import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzAccount,
  JazzContact,
  JazzListOfTags,
  JazzTag,
  JazzTopic,
  RootUserProfile,
} from "~/lib/jazz/schema"
import TgWallpaper from "~/ui/tg-wallpaper"
import ForceGraph from "./-force-graph"
import { PlusButton } from "./-plus-button"
import { useEffect, useRef, useState } from "react"
import { Input, Spinner, TabsList, Tappable } from "@telegram-apps/telegram-ui"
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem"
import LinkIcon from "@/assets/icons/link.svg?react"
import TagIcon from "@/assets/icons/tag.svg?react"
import { AboveKeyboardModal } from "~/ui/modals/above-keyboard-modal"
import TelegramIcon from "@/assets/icons/telegram.svg?react"
import AtSign from "@/assets/icons/at-sign.svg?react"
import { Icon24QR } from "@telegram-apps/telegram-ui/dist/icons/24/qr"
import { User as TelegramUser } from "@telegram-apps/sdk-react"
import { $getTelegramUserByUsername } from "~/lib/telegram/api/telegram-api-server"
import Contact from "./-contact"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { Icon16Chevron } from "@telegram-apps/telegram-ui/dist/icons/16/chevron"
import { AnimatePresence, motion } from "framer-motion"
import GraphIcon from "@/assets/icons/graph-icon.svg?react"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"

const ContactsGraph = () => {
  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [inputValues, setInputValues] = useState({
    username: "",
    tag: "",
    group: "",
  })
  const [step, setStep] = useState(0)

  const [focused, setFocused] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setCreateModalOpen(false)
        setFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget === null) {
      window.scrollTo(0, 0)
      inputRef.current?.focus()
    }
  }

  const createNewTopic = () => {
    if (profile) {
      profile.topics!.push(
        JazzTopic.create(
          {
            title: inputValues.group,
          },
          { owner: profile._owner },
        ),
      )
      setInputValues((prev) => ({ ...prev, group: "" }))
    }
  }

  const createNewTag = () => {
    if (profile) {
      profile.tags!.push(
        JazzTag.create(
          {
            title: inputValues.tag,
          },
          { owner: profile._owner },
        ),
      )
      setInputValues((prev) => ({ ...prev, tag: "" }))
    }
  }

  const [linkMode, setLinkMode] = useState(false)

  // get telegram user

  if (!profile) return

  return (
    <div>
      <div>
        <TgWallpaper opacity={0.5} />
      </div>
      <div className="h-dvh">
        <ForceGraph jazzProfile={profile} linkMode={linkMode} />
      </div>
      <PlusButton
        setLinkMode={(linkMode) => setLinkMode(linkMode)}
        createAction={() => setCreateModalOpen((prev) => !prev)}
      />
      {createModalOpen && (
        <AboveKeyboardModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          focused={focused}
        >
          <div ref={modalRef} className="bg-secondary p-2 relative">
            <div className="flex gap-2">
              <EntityTooltip step={step} setStep={(step) => setStep(step)} />
              {step === 0 && (
                <TelegramUserField setFocused={() => setFocused(true)} />
              )}

              {step === 1 && (
                <div className="flex items-center justify-center gap-2 flex-1">
                  <Input
                    ref={inputRef}
                    autoFocus={true}
                    className="text-white bg-primary"
                    style={{ color: "white" }}
                    type="text"
                    onFocus={() => {
                      window.scrollTo(0, 0)
                    }}
                    onBlur={handleBlur}
                    placeholder="Topic"
                    value={inputValues.group}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        group: e.target.value,
                      }))
                    }
                  />
                  <Tappable
                    onClick={createNewTopic}
                    className="flex font-semibold items-center justify-center gap-2 py-2 bg-button px-4 rounded-xl border-[1px] border-primary"
                  >
                    <span className="font-semibold">Add</span>
                  </Tappable>
                </div>
              )}

              {step === 2 && (
                <div className="flex items-center justify-center gap-2 flex-1">
                  <Input
                    ref={inputRef}
                    autoFocus={true}
                    className="text-white bg-primary"
                    style={{ color: "white" }}
                    type="text"
                    onFocus={() => {
                      window.scrollTo(0, 0)
                    }}
                    onBlur={handleBlur}
                    placeholder="Tag"
                    value={inputValues.tag}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        tag: e.target.value,
                      }))
                    }
                  />
                  <Tappable
                    onClick={createNewTag}
                    className="flex font-semibold items-center justify-center gap-2 py-2 bg-button px-4 rounded-xl border-[1px] border-primary"
                  >
                    <span className="font-semibold">Add</span>
                  </Tappable>
                </div>
              )}
            </div>
          </div>
        </AboveKeyboardModal>
      )}
    </div>
  )
}

const TelegramUserField = ({ setFocused }: { setFocused: () => void }) => {
  const profile = useJazzProfile()

  const [usernameValue, setUsernameValue] = useState("")

  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [telegramSearchLoading, setTelegramSearchLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [localFocused, setLocalFocused] = useState(false)

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget === null) {
      window.scrollTo(0, 0)
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    if (usernameValue.length > 0) {
      setTelegramUser(null)
      setTelegramSearchLoading(true)
      $getTelegramUserByUsername({ data: usernameValue })
        .then((res) => {
          if (res && res[0]) {
            setTelegramUser(res[0] as TelegramUser)
          }
        })
        .finally(() => {
          setTelegramSearchLoading(false)
        })
    }
  }, [usernameValue])

  const noTelegramUser = usernameValue.length > 0 && !telegramUser

  const createNewContact = () => {
    if (profile) {
      profile.contacts!.push(
        JazzContact.create(
          {
            username: telegramUser!.username!,
            firstName: telegramUser?.firstName!,
          },
          { owner: profile._owner },
        ),
      )
      setTelegramUser(null)
      setUsernameValue("")
    }
  }

  return (
    <div>
      {telegramUser && (
        <div
          className="absolute -top-28 left-0 w-full"
          onClick={createNewContact}
        >
          <div className="bg-secondary m-2 rounded-xl shadow-xl">
            <Contact
              username={telegramUser.username!}
              firstName={telegramUser.firstName}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          autoFocus={true}
          className={`text-white bg-primary ${noTelegramUser ? "bg-[#5c3236]" : "bg-primary"}`}
          style={{ color: "white", flex: "1 !important" }}
          type="text"
          onFocus={() => {
            setFocused()
            window.scrollTo(0, 0)
            setLocalFocused(true)
          }}
          onBlur={handleBlur}
          placeholder="username"
          value={usernameValue}
          onChange={(e) => setUsernameValue(e.target.value)}
          after={
            <AnimatePresence mode="wait">
              <div
                className={`absolute top-[9px] z-10 right-[12px] transition-all duration-100 ease-in-out ${noTelegramUser ? "bg-[#5c3236]" : "bg-primary"} pointer-events-none ${telegramSearchLoading ? "opacity-100 h-6" : "opacity-0 h-0"}`}
              >
                <Spinner size="s" />
              </div>
              {usernameValue ? (
                <Tappable
                  key="cancel"
                  Component="div"
                  style={{
                    display: "flex",
                    opacity: localFocused ? "1" : "0",
                  }}
                  onClick={() => {
                    setUsernameValue("")
                    setTelegramUser(null)
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    <Icon16Cancel />
                  </motion.div>
                </Tappable>
              ) : (
                <Tappable
                  key="qr"
                  Component="div"
                  style={{ display: "flex" }}
                  onClick={() => setUsernameValue("")}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    <Icon24QR />
                  </motion.div>
                </Tappable>
              )}
            </AnimatePresence>
          }
        />
        <Tappable className="flex text-xs font-semibold items-center justify-center gap-2 py-2 px-2 rounded-xl border-[1px] border-primary">
          <div className="text-white h-6 w-6">
            <TelegramIcon />
          </div>
          <span className="text-xs font-bold">Contacts</span>
        </Tappable>
      </div>
    </div>
  )
}

const EntityTooltip = ({
  step,
  setStep,
}: {
  step: number
  setStep: (step: number) => void
}) => {
  const [showToolTip, setShowToolTip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowToolTip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div>
      <Tappable
        onClick={() => setShowToolTip((prev) => !prev)}
        className="flex text-xs font-semibold items-center justify-center gap-2 py-2 px-2 rounded-xl border-[1px] border-primary"
      >
        <div className="flex text-white items-center justify-center gap-1">
          <div className="h-6 w-6">
            {step === 0 && <AtSign />}
            {step === 1 && <LinkIcon />}
            {step === 2 && (
              <div className="p-1">
                <TagIcon />
              </div>
            )}
          </div>
          <div
            className={`h-4 w-4 transition-all duration-150 ease-in-out ${showToolTip ? "-rotate-90" : "rotate-90"} `}
          >
            <Icon16Chevron />
          </div>
        </div>
      </Tappable>
      <div
        className={`h-screen w-screen fixed top-0 left-0 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      ></div>
      <div
        ref={tooltipRef}
        className={`p-2 absolute w-32 left-2 bottom-20 bg-primary border-primary border-[1px] rounded-xl transition-opacity ease-in-out duration-150 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"} shadow-lg space-y-1`}
      >
        <ToolTipItem
          Icon={<AtSign />}
          title={"Contact"}
          action={() => {
            setStep(0)
            setShowToolTip(false)
          }}
        />
        <div className="h-[1px] bg-divider"></div>
        <ToolTipItem
          Icon={<LinkIcon />}
          title={"Group"}
          action={() => {
            setStep(1)
            setShowToolTip(false)
          }}
        />
        <div className="h-[1px] bg-divider"></div>
        <ToolTipItem
          Icon={<TagIcon />}
          title={"Tag"}
          action={() => {
            setStep(2)
            setShowToolTip(false)
          }}
        />
      </div>
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
    <Tappable
      onClick={action}
      className="pl-2 py-1 rounded-md flex gap-4 items-center"
    >
      <div className="h-5 w-5 text-white">
        <div>{Icon}</div>
      </div>
      <div className="text-left font-medium whitespace-nowrap">{title}</div>
    </Tappable>
  )
}

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
