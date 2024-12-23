import React, { useEffect, useState } from "react"
import { Icon28CloseAmbient } from "@telegram-apps/telegram-ui/dist/icons/28/close_ambient"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
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
      className={`w-screen h-screen fixed z-50 top-0 left-0 bg-black bg-opacity-50 transition-all ease-in-out duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="absolute top-0 left-0 flex items-center justify-center transition-all ease-in-out duration-300"
        style={{ height: viewportHeight, width: "100%" }}
      >
        <div
          className={`bg-secondary p-4 rounded-2xl shadow-lg transform transition-transform ease-in-out duration-300 absolute bottom-1/2 translate-y-1/2 w-[90%] ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-2xl font-semibold text-center mb-2">{title}</div>
          {children}
          <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
            <Icon28CloseAmbient />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
