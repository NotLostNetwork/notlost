import { createFileRoute } from "@tanstack/react-router"
import { useAccount } from "~/shared/lib/jazz/jazz-provider"

function RouteComponent() {
  const { me } = useAccount({})
  console.log(me, "me")
  return (
    <>
      <div>test</div>
    </>
  )
}

export const Route = createFileRoute("/app/try")({
  component: RouteComponent,
})
