import { Outlet, createFileRoute } from "@tanstack/react-router"
import TabBar from "~/ui/tab-bar"

function LayoutComponent() {
  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
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
