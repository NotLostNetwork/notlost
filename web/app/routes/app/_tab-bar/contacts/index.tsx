import { createFileRoute } from "@tanstack/react-router"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { Filter, useContactsState } from "./-@state"
import { FilterBySearch } from "./-filters"
import ContactsList from "./-list"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"
import { useLaunchParams } from "@telegram-apps/sdk-react"

const ContactsPage = () => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const lp = useLaunchParams()

  const { filtersState, updateFilterState } = useContactsState(
    profile?.contacts,
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        style={{
          paddingTop: ["macos", "tdesktop"].includes(lp.platform)
            ? 40
            : `calc(${getCssVariableValue("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariableValue("--tg-viewport-content-safe-area-inset-top")})`,
        }}
        className="w-full  -mt-4 pl-4 pr-4"
      >
        <div className="relative">
          <FilterBySearch
            value={filtersState.searchState}
            onChange={(value: string) =>
              updateFilterState(Filter.SEARCH_STATE, value)
            }
          />
          <div className="text-accent font-semibold text-center w-full animate-pulse absolute z-10 -top-4">
            NotLost Beta
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto items-center text-white ">
        <ContactsList />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/contacts/")({
  component: ContactsPage,
  pendingMinMs: 0,
  pendingMs: 0,
})
