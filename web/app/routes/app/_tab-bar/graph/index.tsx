import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import TgWallpaper from "~/ui/tg-wallpaper"
import ForceGraph from "./-force-graph"
import { PlusButton } from "./-plus-button"
import { useEffect, useRef, useState } from "react"
import { Input, TabsList, Tappable } from "@telegram-apps/telegram-ui"
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem"
import LinkIcon from "@/assets/icons/link.svg?react"
import TagIcon from "@/assets/icons/tag.svg?react"
import useViewportSize from "./-window-height"
import { AboveKeyboardModal } from "~/ui/modals/above-keyboard-modal"
import TelegramIcon from "@/assets/icons/telegram.svg?react"
import AtSign from "@/assets/icons/at-sign.svg?react"
import { Icon24QR } from "@telegram-apps/telegram-ui/dist/icons/24/qr"

const ContactsGraph = () => {
  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [value, setValue] = useState({
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
      // Refocus the input if no other element is gaining focus
      setTimeout(() => {
        window.scrollTo(0, 0)
        inputRef.current?.focus()
      }, 0)
    }
  }

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
          title="r"
          focused={focused}
        >
          <div ref={modalRef} className="bg-secondary p-2">
            {step === 0 && (
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  autoFocus={true}
                  className="text-white bg-primary"
                  style={{ color: "white", flex: "1 !important" }}
                  type="text"
                  onFocus={() => {
                    setFocused(true)
                    window.scrollTo(20, 20)
                  }}
                  onBlur={handleBlur}
                  placeholder="Username"
                  value={value.username}
                  before={
                    <div className="h-4 w-4 text-gray-500">
                      <AtSign />
                    </div>
                  }
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
                <Tappable className="flex text-xs font-medium items-center justify-center gap-1 py-2 px-1 rounded-xl">
                  <div className="text-white h-6 w-6">
                    <Icon24QR />
                  </div>
                </Tappable>
                <Tappable className="flex text-xs font-semibold items-center justify-center gap-1 py-2 px-1 rounded-xl">
                  <div className="text-white h-6 w-6">
                    <TelegramIcon />
                  </div>
                </Tappable>
              </div>
            )}

            {step === 1 && (
              <div className="flex items-center gap-2">
                <Input
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
                  value={value.group}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, group: e.target.value }))
                  }
                />
                <Tappable className="py-1 px-2">Add</Tappable>
              </div>
            )}

            {step === 2 && (
              <Input
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
                value={value.tag}
                onChange={(e) =>
                  setValue((prev) => ({ ...prev, tag: e.target.value }))
                }
              />
            )}

            <TabsList className="mb-2 mt-2">
              <TabsItem onClick={() => setStep(0)} selected={step === 0}>
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 text-center">
                    <AtSign />
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
              <TabsItem onClick={() => setStep(2)} selected={step === 2}>
                <div className="flex items-center justify-center">
                  <div className="w-7 h-7 text-center">
                    <LinkIcon />
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

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
