import { createFileRoute } from "@tanstack/react-router"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import TgWallpaper from "~/ui/tg-wallpaper"
import ForceGraph from "./-force-graph"
import { PlusButton } from "./-plus-button"
import { useEffect, useState } from "react"
import { Input } from "@telegram-apps/telegram-ui"
import useViewportSize from "./-window-hook"

const ContactsGraph = () => {
  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [value, setValue] = useState("")

  if ("virtualKeyboard" in navigator) {
    const virtualKeyboard = (navigator as any).virtualKeyboard

    // Check if the virtual keyboard overlays content
    console.log("Overlays Content:", virtualKeyboard.overlaysContent)

    // Add an event listener to detect geometry changes
    virtualKeyboard.addEventListener("geometrychange", () => {
      const boundingRect = virtualKeyboard.boundingRect

      console.log("Keyboard Bounding Rect:", boundingRect)

      // Adjust UI based on the keyboard dimensions
      if (boundingRect.height > 0) {
        // Keyboard is visible
        document.body.style.paddingBottom = `${boundingRect.height}px`
      } else {
        // Keyboard is hidden
        document.body.style.paddingBottom = "0px"
      }
    })
  }

  if (!profile?.contacts) return

  return (
    <div className="relative">
      <div className="">
        <TgWallpaper opacity={0.5} />
      </div>
      <div>
        <ForceGraph data={profile?.contacts!} />
      </div>
      <PlusButton createAction={() => setCreateModalOpen((prev) => !prev)} />
      {createModalOpen && (
        <div className="absolute bottom-0 left-0 w-screen bg-secondary p-2">
          <Input
            autoFocus={true}
            className="text-white"
            style={{ color: "white" }}
            type="text"
            onBlur={() => {
              window.scrollTo(0, 0)
              setCreateModalOpen(false)
            }}
            placeholder="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/graph/")({
  component: ContactsGraph,
  staleTime: Infinity,
})
