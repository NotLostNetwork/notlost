import { create } from "zustand"
import { JazzFolder } from "../jazz/schema"

interface AppState {
  expandedFolder: JazzFolder | null
  setExpandedFolder: (expandedFolder: JazzFolder | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  expandedFolder: null,
  setExpandedFolder: (expandedFolder) =>
    set(() => ({
      expandedFolder: expandedFolder,
    })),
}))
