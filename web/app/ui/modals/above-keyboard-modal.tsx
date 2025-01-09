import React, { useEffect, useState } from "react"

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

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 600)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  return (
    <div
      className={`fixed top-0 left-0 transition-all ease-in-out duration-1000 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}"`}
      style={{ height: viewportHeight, width: "100vw" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div
          className={`bg-secondary shadow-lg pt-2 transform transition-all ease-in-out  absolute left-0  w-full ${focused ? "duration-1000 delay-300 bottom-0" : "duration-300 bottom-1/2"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
