import { create } from "zustand"

interface DragState {
  draggableItem: "folder" | "contact" | null
  setDragState: (newState: {
    draggableItem: "folder" | "contact" | null
  }) => void
}

export const useDragStore = create<DragState>((set) => ({
  draggableItem: null,
  setDragState: (newState) =>
    set(() => ({
      draggableItem: newState.draggableItem,
    })),
}))
