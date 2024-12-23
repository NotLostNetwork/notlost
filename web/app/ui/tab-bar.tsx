import { Link } from "@tanstack/react-router"
import { SearchIcon } from "~/assets/icons/iconsAsComponent/search-icon"
import React from "react"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { Route as ContactsRoute } from "~/routes/app/_tab-bar/contacts"

export default function TabBar() {
  return (
    <div className="bg-primary border-t-[1px] border-primary">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          <BottomBarLink
            to={ContactsRoute.to}
            title="Contacts"
            Icon={SearchIcon}
          />
        </div>
      </div>
    </div>
  )
}

interface BottomBarLinkProps {
  to: string
  title: string
  Icon: React.FC<{ color: string }>
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
              className={`transition-all duration-150 ease-in-out ${isActive ? "p-1" : "p-[3px]"}`}
            >
              <Icon
                color={
                  isActive
                    ? getCssVariableValue("--tg-theme-accent-text-color")
                    : "white"
                }
              />
            </div>
          </div>
          <span
            className={`font-medium transition-all duration-150 ease-in-out capitalize ${isActive && "px-2 rounded-2xl text-accent"}`}
          >
            {title}
          </span>
        </>
      )}
    </Link>
  )
}
