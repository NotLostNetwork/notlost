import { useState, useEffect } from "react"

export const useKeyboardState = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const handleFocus = () => {
      const activeElement = document.activeElement
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        setIsKeyboardVisible(true)
      }
    }

    const handleBlur = () => {
      setIsKeyboardVisible(false)
    }

    window.addEventListener("focusin", handleFocus)
    window.addEventListener("focusout", handleBlur)

    return () => {
      window.removeEventListener("focusin", handleFocus)
      window.removeEventListener("focusout", handleBlur)
    }
  }, [])

  return isKeyboardVisible
}
