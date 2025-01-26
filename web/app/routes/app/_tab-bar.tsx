import {
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router"
import SearchIcon from "~/assets/icons/search-icon.svg?react"
import GraphIcon from "~/assets/icons/graph-icon.svg?react"
import React from "react"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { Route as ContactsRoute } from "~/routes/app/_tab-bar/contacts"
import { Route as TryRoute } from "~/routes/app/_tab-bar/map"
import tgWallpaper from "~/assets/tg-wallpaper-paris.svg"

export default function TabBar() {
  return (
    <div className="bg-primary border-t-[1px] border-primary">
      <div className="max-w-screen-xl mx-auto px-4 pt-2 pb-4">
        <div className="flex justify-around items-center">
          <BottomBarLink to={TryRoute.to} title="Try" Icon={<GraphIcon />} />
          <BottomBarLink
            to={ContactsRoute.to}
            title="Search"
            Icon={
              <div className="p-[2px]">
                <SearchIcon />
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

interface BottomBarLinkProps {
  to: string
  title: string
  Icon: React.ReactElement
}

const BottomBarLink: React.FC<BottomBarLinkProps> = ({ to, title, Icon }) => {
  const router = useRouter()
  const { pathname } = useLocation()

  const isActive = `${pathname}/` === to
  const handleClick = () => {
    router.navigate({ to })
  }

  return (
    <div
      onClick={handleClick}
      className={`w-full text-[12px] flex flex-col items-center gap-0.5 cursor-pointer`}
    >
      <div
        className={`h-8 w-8 rounded-full transition-all duration-150 ease-in-out ${
          isActive ? "bg-buttonBezeled" : "bg-transparent"
        }`}
      >
        <div
          style={{
            color: isActive
              ? getCssVariableValue("--tg-theme-accent-text-color")
              : "white",
            padding: isActive ? 6 : 4,
          }}
          className="flex items-center justify-center transition-all duration-150 ease-in-out"
        >
          <div className={`h-6 w-6 ${isActive ? "text-link" : "text-white"}`}>
            {Icon}
          </div>
        </div>
      </div>
      <span
        className={`font-medium transition-all duration-150 ease-in-out ${
          isActive ? "px-2 rounded-2xl text-accent" : ""
        }`}
      >
        {title}
      </span>
    </div>
  )
}

function LayoutComponent() {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <div className="flex-1 overflow-auto text-white">
        <div
          className="h-full w-full -z-10 absolute bg-link bg-opacity-5"
          style={{
            mask: `url(${tgWallpaper}) center / contain`,
          }}
        ></div>
        <Outlet />
      </div>
      <TabBar />
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar")({
  component: LayoutComponent,
})
