import { useEffect, useRef, useState } from 'react'
import {
  FilterByLatest,
  FilterBySearch,
  SingleSelectFilter,
} from './components/filters'
import ContactsGraph from './components/graph'
import ContactsList from './components/list'
import mockData from '@/shared/lib/utils/graph-demo-data.json'
import { Filter, useContactsState } from './model/state'
import { UserContact } from '~/entities/user/user-contact/interface'

const ContactsPage = () => {
  const data = [...mockData.nodes] as UserContact[]

  const filtersBlock = useRef<HTMLDivElement>(null)
  const [filtersBlockHeight, setFiltersBlockHeight] = useState<number>(0)
  
  const {
    filteredData,
    graphMode,
    toggleGraphMode,
    filtersState,
    updateFilterState,
    uniqueTags,
    uniqueTopics,
  } = useContactsState(data)

  useEffect(() => {
    if (filtersBlock.current) {
      setFiltersBlockHeight(filtersBlock.current.offsetHeight)
    }
  }, [])

  return (
    <div className="py-4 overflow-hidden no-scrollbar">
      <div
        ref={filtersBlock}
        className="pt-10 pb-4 fixed z-50 w-full bg-primary -mt-4 pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
      >
        <div className='text-blue-500 font-semibold text-center mr-4 mt-2 animate-pulse'>NotLost Alpha</div>
        <FilterBySearch
          value={filtersState.searchState}
          onChange={(value: string) =>
            updateFilterState(Filter.SEARCH_STATE, value)
          }
        />
        <div
          className={
            'flex space-x-2 overflow-x-scroll no-scrollbar py-[1px] -ml-4 -mr-4 px-4'
          }
        >
          <SingleSelectFilter
            items={uniqueTags}
            setSelected={(tag: string | null) =>
              updateFilterState(Filter.TAG, tag)
            }
            selected={filtersState.selectedTag}
            placeholder="No tag selected"
            modalTitle="Filter by tag"
          />
          <SingleSelectFilter
            items={uniqueTopics!}
            setSelected={(topic: string | null) =>
              updateFilterState(Filter.TOPIC, topic)
            }
            selected={filtersState.selectedTopic}
            placeholder="No topic selected"
            modalTitle="Filter by topic"
          />
          <FilterByLatest
            enable={() => {
              updateFilterState(Filter.LAST_ADDED, true)
              updateFilterState(Filter.TAG, null)
            }}
            disable={() => {
              updateFilterState(Filter.LAST_ADDED, false)
            }}
          />
        </div>
      </div>
      {graphMode ? (
        <ContactsGraph
          data={filteredData}
          toggleGraphMode={toggleGraphMode}
          selectTopic={(topic: string) =>
            updateFilterState(Filter.TOPIC, topic)
          }
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
