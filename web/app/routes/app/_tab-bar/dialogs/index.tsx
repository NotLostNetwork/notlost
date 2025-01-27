import { createFileRoute } from '@tanstack/react-router'
import { getCssVariableValue } from '~/lib/utils/funcs/get-css-variable-value'
import { FilterBySearch } from './-filters'
import ContactsList from './-list'
import { useLaunchParams } from '@telegram-apps/sdk-react'

const ContactsPage = () => {
  const lp = useLaunchParams()

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        style={{
          paddingTop: ['macos', 'tdesktop'].includes(lp.platform)
            ? 40
            : `calc(${getCssVariableValue('--tg-viewport-safe-area-inset-top') || '0px'} + ${getCssVariableValue('--tg-viewport-content-safe-area-inset-top')})`,
        }}
        className="w-full  -mt-4 pl-4 pr-4"
      >
        <div className="relative">
          <FilterBySearch value={''} onChange={(value: string) => {}} />
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

export const Route = createFileRoute('/app/_tab-bar/dialogs/')({
  component: ContactsPage,
  pendingMinMs: 0,
  pendingMs: 0,
})
