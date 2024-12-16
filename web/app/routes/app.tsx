import { createFileRoute } from '@tanstack/react-router'

function RouteComponent() {
  return <></>
}

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})
