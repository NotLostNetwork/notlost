import { create } from "zustand"
import { GraphNode } from "~/routes/app/_tab-bar/graph/-@interface"

interface AppState {
  linkNodesModeEnabled: boolean
  nodesToLink: GraphNode[]
  setLinkNodesModeEnabled: (value: boolean) => void
  selectNodeToLink: (node: GraphNode) => void
  clearNodesToLink: () => void
}

const useAppStore = create<AppState>((set) => ({
  linkNodesModeEnabled: false,
  nodesToLink: [],
  setLinkNodesModeEnabled: (value: boolean) =>
    set(() => ({
      linkNodesModeEnabled: value,
    })),
  selectNodeToLink: (node: GraphNode) =>
    set((state) => ({
      nodesToLink: [...state.nodesToLink, node],
    })),
  clearNodesToLink: () =>
    set(() => ({
      nodesToLink: [],
    })),
}))

export default useAppStore
