import { useEffect, useRef, useState } from "react"
import { Button, Input } from "@telegram-apps/telegram-ui"
import personIcon from "~/assets/icons/person-icon.svg"
import connectionIcon from "~/assets/icons/connection-icon.svg"
import PencilIcon from "~/assets/icons/iconsAsComponent/pencil-icon"

import CreateContactModal from "./-create-contact-modal"

export const Pencil = () => {
  const [showToolTip, setShowToolTip] = useState(false)
  const [showCreateContactModal, setShowCreateContactModal] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const toggleShowToolTip = () => {
    setShowToolTip(!showToolTip)
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowToolTip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div>
      <div className="fixed bottom-20 right-6">
        <div
          className={`h-screen w-screen fixed top-0 left-0 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        ></div>
        <div
          ref={tooltipRef}
          className={`p-2 absolute w-48 right-0 bottom-16 bg-primary border-primary border-[1px] rounded-xl transition-opacity ease-in-out duration-150 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"} shadow-lg space-y-2`}
        >
          <ToolTipItem
            icon={personIcon}
            title={"New contact"}
            action={() => {
              setShowCreateContactModal(true)
              setShowToolTip(false)
            }}
          />
          <div className="h-[2px] bg-divider"></div>
          <ToolTipItem
            icon={connectionIcon}
            title={`New topic`}
            action={() => {}}
          />
        </div>
        <Button
          size={"s"}
          className={"rounded-full"}
          style={{ borderRadius: "50% !important" }}
          onClick={toggleShowToolTip}
        >
          <div className="h-6 w-6">
            <PencilIcon color={"#fff"} />
          </div>
        </Button>
      </div>
      <CreateContactModal
        isOpen={showCreateContactModal}
        closeModal={() => setShowCreateContactModal(false)}
        onClose={() => {
          setShowToolTip(false)
          setShowCreateContactModal(false)
        }}
      />
    </div>
  )
}

const ToolTipItem = ({
  icon,
  title,
  action,
}: {
  icon: string
  title: string
  action: () => void
}) => {
  return (
    <Button mode={"plain"} stretched={true} onClick={action}>
      <div className="flex w-full">
        <img src={icon} className="h-6 w-6" alt="" />
        <div className="ml-4 text-left font-medium whitespace-nowrap">
          {title}
        </div>
      </div>
    </Button>
  )
}
