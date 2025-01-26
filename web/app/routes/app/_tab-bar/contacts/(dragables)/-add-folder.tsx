import { motion, Variants } from "framer-motion"
import { forwardRef } from "react"
import { useDragStore } from "~/lib/zustand-store/drag-store"

interface AddFolderProps {
  bgColor: string
  message?: string
}

export const AddFolder = forwardRef<HTMLDivElement, AddFolderProps>(
  ({ bgColor }, ref) => {
    const { draggableItemType: draggableItem } = useDragStore()

    if (draggableItem !== "folder") return

    const variants: Variants = {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    }

    return (
      <div ref={ref}>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`px-4 py-2 ${bgColor}`}
        >
          <div className="rounded-xl bg-buttonBezeled p-2 font-semibold text-link text-center">
            Drop here to create folder
          </div>
        </motion.div>
      </div>
    )
  },
)
