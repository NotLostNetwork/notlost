import { useRef, useEffect, useState } from "react"
import { UserCoordinates } from "./_tab-bar/map/try"
import { createRoot } from "react-dom/client"
import { Map, Marker } from "@vis.gl/react-maplibre"
import darkStyles from "./_tab-bar/map/dark.json"

import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import YouAreHere from "./_tab-bar/map/-you-are-here"

export const MapBoxExample = () => {
  const [modal, setModal] = useState(false)

  return (
    <Map
      initialViewState={{
        longitude: 2.274536,
        latitude: 48.862997,
        zoom: 16,
      }}
      mapStyle={darkStyles}
    >
      <Marker
        onClick={() => setModal((prev) => !prev)}
        longitude={2.274536}
        latitude={48.862997}
        anchor="bottom"
      >
        <img
          loading="lazy"
          src={`https://t.me/i/userpic/320/${"shestaya_liniya"}.svg`}
          className="h-12 w-12 rounded-full "
          decoding="async"
          alt=""
        />
        {modal && <div className="absolute top-0 left-0">Yo</div>}
      </Marker>
    </Map>
  )
}
