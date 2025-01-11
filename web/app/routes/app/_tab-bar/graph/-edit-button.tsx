import { Button } from "@telegram-apps/telegram-ui"
import PencilIcon from "~/assets/icons/pencil-icon.svg?react"

export const EditButton = ({ createAction }: { createAction: () => void }) => {
  return (
    <div>
      <div className="fixed bottom-24 right-6">
        <Button
          size={"s"}
          className={"rounded-full"}
          style={{ borderRadius: "50% !important" }}
          onClick={createAction}
        >
          <div className="text-white h-6 w-6">
            <PencilIcon />
          </div>
        </Button>
      </div>
    </div>
  )
}
