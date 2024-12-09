import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return <div className="text-red-500">test css</div>
}

export const Route = createFileRoute("/_pages/")({
  component: RouteComponent,
})
