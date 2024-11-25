'use client'

import { createFileRoute } from '@tanstack/react-router'
import '@/styles/app.css'
import ForceGraph from '../../../components/force-graph'
import React, { useRef, useState } from 'react'
import graphBgDark from '@/assets/tattoos-tg-bg.svg'
import TWallpaper, { TWallpaperHandlers } from '@twallpaper/react'

export const Route = createFileRoute('/_layout/graph/')({
  component: App,
})

export default function App() {
  const ref = useRef<TWallpaperHandlers>(null)
  return (
    <TWallpaper
      ref={ref}
      options={{
        fps: 120,
        tails: 30,
        colors: ['#efd359', '#e984d8', '#ac86ed', '#40cdde'],
        pattern: {
          mask: true,
          size: '300px',
          image: 'https://twallpaper.js.org/patterns/tattoos.svg',
        },
      }}
    />
  )
}
