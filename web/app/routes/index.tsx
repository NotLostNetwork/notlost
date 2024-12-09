import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div className="text-red-500">
      App available at <a href="https://t.me/not_lost_bot">@not_lost_bot</a>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
