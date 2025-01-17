import React, { useEffect, useState } from "react"
import { Icon28CloseAmbient } from "@telegram-apps/telegram-ui/dist/icons/28/close_ambient"
import { AnimatePresence, motion } from "framer-motion"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  cancelable?: boolean
}

const FullWidthModal = ({
  isOpen,
  onClose,
  title,
  children,
  cancelable = true,
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
    <motion.div
      initial={{ filter: "blur(2px)" }}
      animate={{ filter: "unset" }}
      exit={{ filter: "blur(2px)" }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`w-screen h-screen fixed z-50  left-0 transition-all ease-in-out duration-300 ${
          isOpen
            ? "opacity-100 blur-0 top-0"
            : "opacity-0 pointer-events-none blur-xl top-20"
        }`}
        onClick={onClose}
      >
        <div
          className="absolute top-0 left-0 flex items-center justify-center transition-all ease-in-out duration-75"
          style={{ height: viewportHeight, width: "100%" }}
        >
          <div
            className={`bg-secondary p-4 shadow-lg h-full transform transition-transform ease-in-out duration-300 absolute top-0 translate-y-20 w-full ${
              isOpen ? "translate-y-0" : "translate-y-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl font-semibold text-center mb-2">
              {title}
            </div>
            {children}
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={onClose}
            >
              <Icon28CloseAmbient />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FullWidthModal
