import TWallpaper, { TWallpaperHandlers } from "@twallpaper/react"
import { useRef } from "react"

export default function GraphPage() {
  const ref = useRef<TWallpaperHandlers>(null)
  return (
    <TWallpaper
      ref={ref}
      options={{
        fps: 120,
        tails: 30,
        colors: ["#efd359", "#e984d8", "#ac86ed", "#40cdde"],
        pattern: {
          mask: true,
          size: "300px",
          image: "https://twallpaper.js.org/patterns/tattoos.svg",
        },
      }}
    />
  )
}
