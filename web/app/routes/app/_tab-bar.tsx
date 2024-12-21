import { Outlet, createFileRoute } from "@tanstack/react-router"
import { getCssVariableValue } from "~/shared/lib/utils/funcs/get-css-variable-value"
import BottomBar from "~/shared/ui/bottom-bar"

function LayoutComponent() {
  return (
    <div className="flex flex-col" style={{height: '100dvh'}}>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <BottomBar />
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar")({
  component: LayoutComponent,
})
