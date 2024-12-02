'use client'

import { useEffect, useRef, useState } from 'react'
import {
  FilterByLatest,
  FilterBySearch,
  FilterByTag,
  FilterByTopic,
} from './components/filters'
import ContactsGraph from './components/graph'
import ContactsList from './components/list'
import mockData from '@/shared/lib/utils/graph-demo-data.json'

export interface NodeBody {
  id: string
  group: number
  username: string
  description?: string
  tags?: Tag[]
  topic?: string
  type?: string
  createdAt: Date
}

interface Tag {
  title: string
  color: string
}

enum FilterOptions {
  LAST_ADDED,
}

const ContactsPage = () => {
  const [graphMode, setGraphMode] = useState(false)

  const [filterState, setFilterState] = useState<FilterOptions[]>([])
  const [searchState, setSearchState] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const filtersBlock = useRef<HTMLDivElement>(null)
  const [filtersBlockHeight, setFiltersBlockHeight] = useState<number>(0)

  useEffect(() => {
    if (filtersBlock.current) {
      setFiltersBlockHeight(filtersBlock.current.offsetHeight)
    }
  }, [])

  const data = [...mockData.nodes] as NodeBody[]

  const filteredData = data
    .filter((node) => {
      if (selectedTag) {
        return node.tags?.some((tag) => tag.title === selectedTag)
      }
      return true
    })
    .filter((node) => {
      if (selectedTopic) {
        return node.topic === selectedTopic
      }
      return true
    })
    .filter((node) => {
      if (searchState) {
        return (
          node.id.toLowerCase().includes(searchState.toLowerCase()) ||
          node.username.toLowerCase().includes(searchState.toLowerCase()) ||
          node.description?.toLowerCase().includes(searchState.toLowerCase())
        )
      }
      return true
    })
    .sort((a, b) => {
      if (filterState.includes(FilterOptions.LAST_ADDED)) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  const uniqueTags = Array.from(
    new Set(data.flatMap((node) => node.tags?.map((tag) => tag.title) || [])),
  )

  const uniqueTopics = Array.from(new Set(data.flatMap((node) => node.topic!)))

  const toggleGraphMode = () => {
    setGraphMode(!graphMode)
  }

  return (
    <div className="py-4 overflow-hidden no-scrollbar">
      <div
        ref={filtersBlock}
        className="pb-4 fixed z-50 w-full bg-primary -mt-4 pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
      >
        <FilterBySearch
          value={searchState}
          onChange={(value: string) => setSearchState(value)}
        />
        <div
          className={
            'flex space-x-2 overflow-x-scroll no-scrollbar py-[1px] -ml-4 -mr-4 px-4'
          }
        >
          <FilterByTag
            tags={uniqueTags}
            setSelectedTag={(tag: string | null) => {
              setSelectedTag(tag)
            }}
            selectedTag={selectedTag}
          />
          <FilterByTopic
            topics={uniqueTopics!}
            setSelectedTopic={(topic: string | null) => {
              setSelectedTopic(topic)
            }}
            selectedTopic={selectedTopic}
          />
          <FilterByLatest
            enable={() => {
              setFilterState([...filterState, FilterOptions.LAST_ADDED])
              setSelectedTag(null)
            }}
            disable={() => {
              setFilterState(
                filterState.filter(
                  (option) => option !== FilterOptions.LAST_ADDED,
                ),
              )
            }}
          />
        </div>
      </div>
      {graphMode ? (
        <ContactsGraph
          data={filteredData}
          toggleGraphMode={toggleGraphMode}
          selectTopic={(topic: string) => setSelectedTopic(topic)}
        />
      ) : (
        <div className="pb-32" style={{ marginTop: filtersBlockHeight - 16 }}>
          <ContactsList
            filtersBlockHeight={filtersBlockHeight}
            data={filteredData}
            toggleGraphMode={toggleGraphMode}
          />
        </div>
      )}
    </div>
  )
}

export default ContactsPage