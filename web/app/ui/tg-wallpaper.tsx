import TWallpaper from "@twallpaper/react"
import React from "react"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import "@twallpaper/react/css"
import tgWallpaperParis from "@/assets/tg-wallpaper-paris.svg"

const TgWallpaper = ({ opacity = 1, withAccent = false }) => {
  const darkThemeColors = ["#232e3c", "#232e3c", "#232e3c", "#232e3c"]
  const darkThemeColorsWithAccent = ["#5288c1", "#2F2F2F", "#5288c1", "#2F2F2F"]

  return (
    <TWallpaper
      options={{
        fps: 60,
        tails: 90,
        animate: false,
        scrollAnimate: true,
        colors: withAccent ? darkThemeColorsWithAccent : darkThemeColors,
        pattern: {
          image: tgWallpaperParis,
          background: getCssVariableValue("--tg-theme-bg-color"),
          blur: 0,
          size: "420px",
          opacity: opacity,
          mask: true,
        },
      }}
    />
  )
}

export default TgWallpaper
