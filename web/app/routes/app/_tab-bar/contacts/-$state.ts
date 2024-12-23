import { useState } from "react"
import { UserContact } from "~/entities/user/user-contact/interface"

export enum Filter {
  SEARCH_STATE = "searchState",
  TAG = "selectedTag",
  TOPIC = "selectedTopic",
  LAST_ADDED = "lastAdded",
}

const initialFiltersData = {
  searchState: "",
  selectedTag: null,
  selectedTopic: null,
  lastAdded: false,
}

export const useContactsState = (data: UserContact[]) => {
  const [filtersState, setFiltersData] = useState(initialFiltersData)
  const [graphMode, setGraphMode] = useState(false)

  const updateFilterState = (
    filter: Filter,
    value: string | boolean | null
  ) => {
    setFiltersData((prev) => ({
      ...prev,
      [filter]: value,
    }))
  }

  const toggleGraphMode = () => setGraphMode(!graphMode)

  const uniqueTags = Array.from(
    new Set(
      data.flatMap((contact) => contact.tags?.map((tag) => tag.title) || [])
    )
  )

  const uniqueTopics = Array.from(
    new Set(data.flatMap((contact) => contact.topic!))
  )

  const filteredData = data
    .filter((contact) => {
      if (filtersState.selectedTag) {
        return contact.tags?.some(
          (tag) => tag.title === filtersState.selectedTag
        )
      }
      return true
    })
    .filter((contact) => {
      if (filtersState.selectedTopic) {
        return contact.topic === filtersState.selectedTopic
      }
      return true
    })
    .filter((contact) => {
      if (filtersState.searchState) {
        return (
          contact.id
            .toLowerCase()
            .includes(filtersState.searchState.toLowerCase()) ||
          contact.username
            .toLowerCase()
            .includes(filtersState.searchState.toLowerCase()) ||
          contact.description
            ?.toLowerCase()
            .includes(filtersState.searchState.toLowerCase())
        )
      }
      return true
    })
    .sort((a, b) => {
      if (filtersState.lastAdded) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  return {
    filteredData,
    graphMode,
    toggleGraphMode,
    filtersState,
    uniqueTags,
    uniqueTopics,
    updateFilterState,
  }
}
