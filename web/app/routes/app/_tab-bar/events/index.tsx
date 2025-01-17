import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import TgWallpaper from "~/ui/tg-wallpaper"
import {
  FilterByLatest,
  FilterBySearch,
  SingleSelectFilter,
} from "../contacts/-filters"
import LinkIcon from "@/assets/icons/link.svg?react"
import TagIcon from "@/assets/icons/tag.svg?react"
import CalendarIcon from "@/assets/icons/calendar.svg?react"
import PlaceIcon from "@/assets/icons/place-svgrepo-com.svg?react"
import tonKeeperEvent from "@/assets/ton-keeper-event.jpeg"
import { useAccount } from "~/lib/jazz/jazz-provider"
import { Route as EventRoute } from "@/routes/app/_tab-bar/events/event"
import { Tappable } from "@telegram-apps/telegram-ui"

function RouteComponent() {
  const lp = useLaunchParams()
  const { me } = useAccount()

  /* const createEvent = () => {
    const group = Group.create({ owner: me })
    group.addMember("everyone", "writer")
    const jazzEvent = JazzEvent.create([], { owner: group })
    console.log(jazzEvent.id)
  } */

  // co_zRFDGQiMJWAor53ZBFXhtaxe9JT
  const navigate = useNavigate()
  return (
    <div className="h-full overflow-hidden">
      <div>
        <TgWallpaper opacity={0.5} />
      </div>
      <div
        style={{
          paddingTop: ["macos", "tdesktop"].includes(lp.platform)
            ? 40
            : `calc(${getCssVariableValue("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariableValue("--tg-viewport-content-safe-area-inset-top")})`,
        }}
        className="pb-2 w-full bg-primary -mt-4 pl-4 pr-4 shadow-lg border-b-primary border-b-[1px]"
      >
        <div className="relative">
          <FilterBySearch enabled={false} value={""} onChange={() => {}} />
          <div className="text-accent font-semibold text-center w-full animate-pulse absolute z-10 -top-4">
            NotLost MVP
          </div>
        </div>
        <div
          className={
            "flex space-x-2 overflow-x-scroll no-scrollbar py-[1px] -ml-4 -mr-4 px-4"
          }
        >
          <SingleSelectFilter
            items={[]}
            setSelected={(topic: string | null) => {}}
            selected={""}
            placeholder={
              <div className="flex w-full justify-between gap-2 items-center">
                <div className="w-[18px] h-[18px]">
                  <LinkIcon />
                </div>
                Topic
              </div>
            }
            modalTitle="Filter by topic"
          />
          <SingleSelectFilter
            items={[]}
            setSelected={(tag: string | null) => {}}
            selected={""}
            placeholder={
              <div className="flex w-full justify-between gap-2 items-center">
                <div className="w-4 h-4 text-white">
                  <TagIcon />
                </div>
                Tag
              </div>
            }
            modalTitle="Filter by tag"
          />
          <FilterByLatest
            enable={() => {
              true
            }}
            disable={() => {}}
          />
        </div>
        <div className="italic text-xs text-hint mt-1 text-center">
          MVP was made in two days, sorry but without filters for now
        </div>
      </div>
      <div className="p-2 pb-12">
        <Tappable
          onClick={() => {
            navigate({ to: EventRoute.to })
          }}
          className="bg-primary border-[1px] border-primary rounded-xl p-4"
        >
          <div className="flex gap-4">
            <div>
              <div className="font-semibold">Tonkeeper Native App</div>
              <div className="text-hint text-xs mt-2">
                The non-custodial TON wallet Tonkeeper is now available...
              </div>
              <div className="flex gap-2 mt-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-3 w-3">
                    <TagIcon />
                  </div>
                  <div className="h-4 w-4 mt-1">
                    <CalendarIcon />
                  </div>
                  <div className="h-4 w-4 mt-1 text-white">
                    <PlaceIcon />
                  </div>
                </div>
                <div className="flex flex-col justify-center font-semibold">
                  <div className="text-xs">Networking</div>
                  <div className="text-xs mt-1 text-link">Today</div>
                  <div className="text-xs mt-1">Paris</div>
                </div>
              </div>
            </div>
            <div className="w-[50%]">
              <div className="w-full">
                <img
                  className="w-full rounded-lg object-contain"
                  src={tonKeeperEvent}
                  alt=""
                />
              </div>
            </div>
          </div>
        </Tappable>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/events/")({
  component: RouteComponent,
})
