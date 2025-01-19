import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
  dragState: DragState
  setDragState: (newDragState: DragState) => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      dragState: {
        isDrag: false,
        x: 0,
        y: 0,
      },
      setDragState: (newDragState: DragState) =>
        set(() => ({ dragState: newDragState })),
    }),
    {
      name: "app-storage", // name of the key in localStorage
    },
  ),
)
export interface DragState {
  isDrag: boolean
}
