import { Popup, useMap } from "@vis.gl/react-maplibre"

export default function YouAreHere() {
  const { current: map } = useMap()

  if (!map) return null

  return (
    <Popup longitude={2.274536} latitude={48.862997}>
      <h3>You are approximately here!</h3>
    </Popup>
  )
}
