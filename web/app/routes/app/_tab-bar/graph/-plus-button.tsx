import { useEffect, useRef, useState } from "react"
import { Button, Tappable } from "@telegram-apps/telegram-ui"
import Link from "~/assets/icons/link.svg?react"
import PencilIcon from "~/assets/icons/pencil-icon.svg?react"
import PlusIcon from "~/assets/icons/add-plus-circle.svg?react"

export const PlusButton = ({
  createAction,
  setLinkMode,
}: {
  createAction: () => void
  setLinkMode: (linkMode: boolean) => void
}) => {
  const [showToolTip, setShowToolTip] = useState(false)
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
      <div className="fixed bottom-24 right-6">
        <div
          className={`h-screen w-screen fixed top-0 left-0 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        ></div>
        <div
          ref={tooltipRef}
          className={`p-2 absolute right-0 bottom-16 bg-primary border-primary border-[1px] rounded-xl transition-opacity ease-in-out duration-150 ${showToolTip ? "opacity-100" : "opacity-0 pointer-events-none"} space-y-1 shadow-lg`}
        >
          <ToolTipItem
            Icon={<PlusIcon />}
            title={"Create"}
            action={() => {
              createAction()
              setShowToolTip(false)
            }}
          />
          <div className="h-[1px] w-full bg-divider"></div>

          <ToolTipItem
            Icon={<Link />}
            title={"Link"}
            action={() => {
              setLinkMode(true)
              setShowToolTip(false)
            }}
          />
        </div>
        <Button
          size={"s"}
          className={"rounded-full"}
          style={{ borderRadius: "50% !important" }}
          onClick={toggleShowToolTip}
        >
          <div className="text-white h-6 w-6">
            <PencilIcon />
          </div>
        </Button>
      </div>
    </div>
  )
}

const ToolTipItem = ({
  Icon,
  title,
  action,
}: {
  Icon: React.ReactElement
  title: string
  action: () => void
}) => {
  return (
    <Tappable onClick={action} className="pl-2 py-2 pr-8 rounded-md">
      <div className="flex w-full gap-4">
        <div className="h-6 w-6 text-white">
          <div>{Icon}</div>
        </div>
        <div className="text-left font-medium whitespace-nowrap">{title}</div>
      </div>
    </Tappable>
  )
}
