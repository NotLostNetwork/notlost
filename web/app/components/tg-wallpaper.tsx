import TWallpaper from "@twallpaper/react"
import React from 'react';
import { getCssVariableValue } from '~/lib/utils/funcs/get-css-variable-value';

const TgWallpaper = ({opacity = 1, withAccent = false}) => {
  const darkThemeColors = ["#2F2F2F", "#2F2F2F", "#2F2F2F", "#2F2F2F"]
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
          image: "https://twallpaper.js.org/patterns/paris.svg",
          background: getCssVariableValue('--tg-theme-bg-color'),
          blur: 0,
          size: "420px",
          opacity: opacity,
          mask: true,
        },
      }}
    />
  );
};

export default TgWallpaper;