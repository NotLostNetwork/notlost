import { createFileRoute } from "@tanstack/react-router"
import { useAccountOrGuest } from "~/shared/lib/jazz/jazz-provider"

function RouteComponent() {
  // const { me } = useAccountOrGuest({})
  // console.log(me, "me")
  // const { me } = useAccount({
  //   root: { contacts: [{}] }] },
  // })
  return (
    <>
      <div>test</div>
    </>
  )
}

export const Route = createFileRoute("/app/try")({
  component: RouteComponent,
})