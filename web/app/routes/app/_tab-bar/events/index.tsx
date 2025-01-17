import { createFileRoute } from '@tanstack/react-router'

function RouteComponent() {
  return <></>
}

export const Route = createFileRoute('/app/_tab-bar/events/')({
  component: RouteComponent,
})
