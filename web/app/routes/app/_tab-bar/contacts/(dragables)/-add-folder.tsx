import { forwardRef } from "react"
import { useDragStore } from "~/lib/zustand-store/drag-store"

interface AddFolderProps {
  bgColor: string
  message?: string
}

export const AddFolder = forwardRef<HTMLDivElement, AddFolderProps>(
  ({ bgColor }, ref) => {
    const { draggableItem } = useDragStore()

    if (draggableItem !== "folder") return

    return (
      <div className={`p-4 ${bgColor}`} ref={ref}>
        <div className="rounded-xl bg-buttonBezeled p-2 font-semibold text-link text-center">
          Drop here to create folder
        </div>
      </div>
    )
  },
)
