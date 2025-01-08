import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import TgWallpaper from "~/ui/tg-wallpaper"
import ForceGraph from "./-force-graph"
import { PlusButton } from "./-plus-button"
import { useEffect, useRef, useState } from "react"
import { Input, TabsList } from "@telegram-apps/telegram-ui"
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem"
import LinkIcon from "@/assets/icons/link.svg?react"
import TagIcon from "@/assets/icons/tag.svg?react"
import useViewportSize from "./-window-height"
import { AboveKeyboardModal } from "~/ui/modals/above-keyboard-modal"

const ContactsGraph = () => {
  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [value, setValue] = useState("")
  const [step, setStep] = useState(0)

  const modalRef = useRef<HTMLDivElement | null>(null)

  const height = useViewportSize()

  const [focused, setFocused] = useState(false)

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
              <Input
                autoFocus={true}
                className="text-white bg-primary"
                style={{ color: "white" }}
                type="text"
                onFocus={() => {
                  setFocused(true)
                  window.scrollTo(20, 20)
                }}
                onBlur={() => {
                  window.scrollTo(0, 0)
                }}
                placeholder="Username"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}

            {step === 1 && (
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}

            <TabsList className="mb-2">
              <TabsItem onClick={() => setStep(0)} selected={step === 0}>
                @
              </TabsItem>
              <TabsItem onClick={() => setStep(1)} selected={step === 1}>
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 text-center">
                    <TagIcon />
                  </div>
                </div>
              </TabsItem>
              <TabsItem onClick={() => setStep(2)} selected={step === 2}>
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 text-center">
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
