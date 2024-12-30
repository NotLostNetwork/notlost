import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { Button } from "@telegram-apps/telegram-ui"
import { destroyLocalDB } from "~/lib/utils/local-db"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { Filter, useContactsState } from "./-$state"
import { FilterByLatest, FilterBySearch, SingleSelectFilter } from "./-filters"
import ContactsList from "./-list"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzAccount,
  JazzListOfContacts,
  RootUserProfile,
} from "~/lib/jazz/schema"
import { Route as OnboardingRoute } from "../../onboarding"
import tagIcon from "@/assets/icons/tag.svg"
import linkIcon from "@/assets/icons/link.svg"

const ContactsPage = () => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const filtersBlock = useRef<HTMLDivElement>(null)
  const [filtersBlockHeight, setFiltersBlockHeight] = useState<number>(0)

  const navigate = useNavigate()

  const {
    filteredData,
    toggleGraphMode,
    filtersState,
    updateFilterState,
    uniqueTags,
    uniqueTopics,
  } = useContactsState(profile?.contacts)

  useEffect(() => {
    if (filtersBlock.current) {
      setFiltersBlockHeight(filtersBlock.current.offsetHeight)
    }
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        ref={filtersBlock}
        style={{
          paddingTop: `calc(${getCssVariableValue("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariableValue("--tg-viewport-content-safe-area-inset-top")})`,
        }}
        className="pb-4 w-full bg-primary -mt-4 pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
      >
        <div className="relative">
          <FilterBySearch
            value={filtersState.searchState}
            onChange={(value: string) =>
              updateFilterState(Filter.SEARCH_STATE, value)
            }
          />
          <div className="text-accent font-semibold text-center w-full animate-pulse absolute z-10 -top-4">
            NotLost Alpha
          </div>
        </div>

        <div
          className={
            "flex space-x-2 overflow-x-scroll no-scrollbar py-[1px] -ml-4 -mr-4 px-4"
          }
        >
          <SingleSelectFilter
            items={uniqueTopics}
            setSelected={(topic: string | null) =>
              updateFilterState(Filter.TOPIC, topic)
            }
            selected={filtersState.selectedTopic}
            placeholder={
              <div className="flex w-full justify-between gap-2 items-center">
                <div className="w-4 h-4">
                  <img src={linkIcon} />
                </div>
                Topic
              </div>
            }
            modalTitle="Filter by topic"
          />
          <SingleSelectFilter
            items={uniqueTags}
            setSelected={(tag: string | null) =>
              updateFilterState(Filter.TAG, tag)
            }
            selected={filtersState.selectedTag}
            placeholder={
              <div className="flex w-full justify-between gap-2 items-center">
                <div className="w-4 h-4">
                  <img src={tagIcon} />
                </div>
                Tag
              </div>
            }
            modalTitle="Filter by tag"
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
          <Button onClick={destroyLocalDB}>Destroy LDB</Button>
          <Button onClick={() => navigate({ to: OnboardingRoute.to })}>
            Onboarding
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <ContactsList
          filtersBlockHeight={filtersBlockHeight}
          data={filteredData as JazzListOfContacts}
          toggleGraphMode={toggleGraphMode}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/contacts/")({
  component: ContactsPage,
})
