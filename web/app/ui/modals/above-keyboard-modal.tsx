import { useLaunchParams } from "@telegram-apps/sdk-react"
import { Button } from "@telegram-apps/telegram-ui"
import React, { useEffect, useState } from "react"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import ForceGraph from "~/routes/app/_tab-bar/graph/-force-graph"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  cancelable?: boolean
  focused: boolean
}

export const AboveKeyboardModal = ({
  isOpen,
  onClose,
  children,
  cancelable = true,
  focused,
}: ModalProps) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  const lp = useLaunchParams()

  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight
      setViewportHeight(newHeight)
    }

    window.visualViewport?.addEventListener("resize", handleResize)
    window.addEventListener("resize", handleResize)

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (lp.platform === "android") {
        setIsVisible(true)
      }
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const { me } = useAccount()
  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  if (!profile) return

  return (
    <div
      className={`fixed top-0 z-20 left-0 transition-all ease-in-out duration-500 ${isVisible ? "opacity-100 pointer-events-none" : "opacity-0 pointer-events-none"}"`}
      style={{ height: viewportHeight, width: "100vw" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="top-0">
          <ForceGraph jazzProfile={profile} />
        </div>
        <div
          className={`bg-secondary pointer-events-auto  shadow-lg pt-2 pb-2 transform transition-all ease-in-out  absolute left-0  w-full ${focused ? "duration-150 delay-0 bottom-0" : "duration-300 bottom-1/2"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
