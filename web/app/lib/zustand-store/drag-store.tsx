import { create } from "zustand"
import { DialogData } from "~/actions/telegram"

interface DragState {
  draggableItemType: "folder" | "contact" | null
  draggableItem: null | DialogData
  setDragState: (newState: {
    draggableItemType: "folder" | "contact" | null
    draggableItem?: DialogData | null
  }) => void
}

export const useDragStore = create<DragState>((set) => ({
  draggableItemType: null,
  draggableItem: null,
  setDragState: (newState) =>
    set(() => ({
      draggableItemType: newState.draggableItemType,
      draggableItem: newState.draggableItem,
    })),
}))
