import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzAccount,
  JazzContact,
  JazzListOfTags,
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
import { AnimatePresence, motion } from "framer-motion"
import GraphIcon from "@/assets/icons/graph-icon.svg?react"

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

  // get telegram user

  if (!profile?.contacts) return

  return (
    <div>
      <div>
        <TgWallpaper opacity={0.5} />
      </div>
      <div>
        <ForceGraph data={profile?.contacts!} />
      </div>
      <PlusButton createAction={() => setCreateModalOpen((prev) => !prev)} />
      {createModalOpen && (
        <AboveKeyboardModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          focused={focused}
        >
          <div ref={modalRef} className="bg-secondary p-2 relative">
            {step === 0 && (
              <TelegramUserField setFocused={() => setFocused(true)} />
            )}

            {step === 1 && (
              <div className="flex items-center justify-center gap-4">
                <Input
                  ref={inputRef}
                  autoFocus={true}
                  className="text-white bg-primary"
                  style={{ color: "white" }}
                  type="text"
                  onFocus={() => {
                    window.scrollTo(0, 0)
                  }}
                  onBlur={() => {
                    window.scrollTo(0, 0)
                  }}
                  placeholder="Tag"
                  value={inputValues.tag}
                  onChange={(e) =>
                    setInputValues((prev) => ({ ...prev, tag: e.target.value }))
                  }
                />
                <Tappable className="flex font-semibold items-center justify-center gap-2 py-2 bg-button px-2 rounded-xl border-[1px] border-primary">
                  <div className="text-white h-6 w-6 p-1">
                    <TagIcon />
                  </div>
                  <span className="font-semibold">Add</span>
                </Tappable>
              </div>
            )}

            {step === 2 && (
              <div className="flex items-center justify-center gap-4">
                <Input
                  ref={inputRef}
                  autoFocus={true}
                  className="text-white bg-primary"
                  style={{ color: "white" }}
                  type="text"
                  onFocus={() => {
                    window.scrollTo(0, 0)
                  }}
                  onBlur={() => {
                    window.scrollTo(0, 0)
                  }}
                  placeholder="Group"
                  value={inputValues.group}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      group: e.target.value,
                    }))
                  }
                />
                <Tappable className="flex font-semibold items-center justify-center gap-2 py-2 bg-button px-2 rounded-xl border-[1px] border-primary">
                  <div className="text-white h-6 w-6">
                    <LinkIcon />
                  </div>
                  <span className="font-semibold">Add</span>
                </Tappable>
              </div>
            )}

            <TabsList className="mb-2 mt-2">
              <TabsItem onClick={() => setStep(0)} selected={step === 0}>
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 text-center">
                    <AtSign />
                  </div>
                </div>
              </TabsItem>
              <TabsItem onClick={() => setStep(2)} selected={step === 2}>
                <div className="flex items-center justify-center">
                  <div className="w-7 h-7 text-center">
                    <LinkIcon />
                  </div>
                </div>
              </TabsItem>
              <TabsItem onClick={() => setStep(1)} selected={step === 1}>
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 text-center">
                    <TagIcon />
                  </div>
                </div>
              </TabsItem>
            </TabsList>
          </div>
        </AboveKeyboardModal>
      )}
    </div>
  )
}

const TelegramUserField = ({ setFocused }: { setFocused: () => void }) => {
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

  return (
    <div>
      {telegramUser && (
        <div className="absolute -top-28 left-0 w-full ">
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
          placeholder="Username"
          value={usernameValue}
          before={
            <div className={`h-4 w-4 text-gray-500`}>
              <AtSign />
            </div>
          }
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

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
