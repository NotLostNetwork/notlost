import { createFileRoute } from "@tanstack/react-router"
import { MapBoxExample } from "../../-test"

function RouteComponent() {
  // const { me } = useAccountOrGuest({})
  // console.log(me, "me")
  // const { me } = useAccount({
  //   root: { contacts: [{}] }] },
  // })

  const userA: UserCoordinates = {
    id: 0,
    name: "You",
    latitude: 40.7128,
    longitude: -74.006,
  }

  const users: UserCoordinates[] = [
    { id: 5, name: "Eve", latitude: 40.713, longitude: -74.0062 }, // ~25m north
    { id: 6, name: "Frank", latitude: 40.7126, longitude: -74.0058 }, // ~30m southeast
    { id: 7, name: "Grace", latitude: 40.7131, longitude: -74.0064 }, // ~40m north-northwest
    { id: 8, name: "Heidi", latitude: 40.7125, longitude: -74.0059 }, // ~35m south
    { id: 10, name: "Judy", latitude: 40.7132, longitude: -74.0063 }, // ~45m north-northwest
  ]

  return (
    <div style={{ height: "110%" }}>
      <MapBoxExample />
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/map/try")({
  component: RouteComponent,
  pendingMinMs: 0,
  pendingMs: 0,
})

export interface UserCoordinates {
  id: number
  name: string
  latitude: number
  longitude: number
}
