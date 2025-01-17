import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import SearchIcon from "~/assets/icons/search-icon.svg?react"
import GraphIcon from "~/assets/icons/graph-icon.svg?react"
import NetworkInternetIcon from "@/assets/icons/network-internet-icon.svg?react"
import React from "react"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { Route as ContactsRoute } from "~/routes/app/_tab-bar/contacts"
import { Route as GraphRoute } from "~/routes/app/_tab-bar/graph"
import { Route as EventsRoute } from "~/routes/app/_tab-bar/events"

export default function TabBar() {
  return (
    <div className="bg-primary border-t-[1px] border-primary">
      <div className="max-w-screen-xl mx-auto px-4 pt-2 pb-4">
        <div className="flex justify-around items-center">
          <BottomBarLink
            to={EventsRoute.to}
            title="Events"
            Icon={<NetworkInternetIcon />}
          />
          <BottomBarLink
            to={GraphRoute.to}
            title="Network"
            Icon={<GraphIcon />}
          />
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
  return (
    <Link
      to={to}
      className="w-full text-[12px] flex flex-col items-center gap-0.5"
    >
      {({ isActive }) => (
        <>
          <div
            className={`h-8 w-8 rounded-full transition-all duration-150 ease-in-out ${isActive ? "bg-buttonBezeled" : "bg-transparent "}`}
          >
            <div
              style={{
                color: isActive
                  ? getCssVariableValue("--tg-theme-accent-text-color")
                  : "white",
                padding: isActive ? 6 : 4,
              }}
              className="transition-all duration-150 ease-in-out"
            >
              <div>{Icon}</div>
            </div>
          </div>
          <span
            className={`font-medium transition-all duration-150 ease-in-out ${isActive && "px-2 rounded-2xl text-accent"}`}
          >
            {title}
          </span>
        </>
      )}
    </Link>
  )
}

function LayoutComponent() {
  return (
    <div className="flex flex-col" style={{ height: "100vh" }}>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <TabBar />
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar")({
  component: LayoutComponent,
})
