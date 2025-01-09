import React, { useEffect, useState } from "react"
import { Icon28CloseAmbient } from "@telegram-apps/telegram-ui/dist/icons/28/close_ambient"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  cancelable?: boolean
  focused: boolean
}

export const AboveKeyboardModal = ({
  isOpen,
  onClose,
  title,
  children,
  cancelable = true,
  focused,
}: ModalProps) => {
  // Resize viewport in the case of keyboard appearing to not overlaying content of a modal
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

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

  return (
    <div
      className={`fixed top-0 left-0 transition-all ease-in-out delay-500 duration-0 ${isOpen ? "opacity-100" : "opacity-20 pointer-events-none"}"`}
      style={{ height: viewportHeight, width: "100vw" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div
          className={`bg-secondary shadow-lg pt-2 transform transition-all ease-in-out  absolute left-0  w-full ${focused ? "duration-1000 delay-1000 bottom-0" : "duration-300 bottom-1/2 top-20"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
