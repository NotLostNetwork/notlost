'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from 'react-force-graph-2d'
import TelegramHelper from '~/lib/telegram/telegram-helper'
import { NodeBody } from 'app/routes/_layout/contacts'
import { getCssVariableValue } from '~/lib/utils/funcs/get-css-variable-value'

type ImageCache = {
  [key: string]: HTMLImageElement
}

interface Link {
  source: string
  target: string
}

const ForceGraph = ({ nodes }: { nodes: NodeBody[] }) => {
  const fgRef = React.useRef<ForceGraphMethods>()

  const links: Link[] = []
  nodes.forEach((nodeBody) => {
    if (nodeBody.topic && nodes.some((node) => node.id === nodeBody.topic)) {
      links.push({ source: nodeBody.topic, target: nodeBody.id })
    }
  })

  const graphData = {
    nodes,
    links,
  }

  useEffect(() => {
    fgRef?.current?.d3Force('charge')!.distanceMax(80)
    fgRef?.current?.centerAt(0, 0)
    fgRef?.current?.zoom(3)
  }, [])
  const [imageCache, setImageCache] = useState<ImageCache>({})

  useMemo(() => {
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
      })
    }

    const preloadImages = async () => {
      const cache: ImageCache = {}
      for (const node of graphData.nodes) {
        const avatarUrl = await TelegramHelper.getProfileAvatar(node.username)
        console.log('AVATAR URL', avatarUrl)
        cache[node.id] = await loadImage(avatarUrl)
      }
      setImageCache(cache)
    }

    preloadImages()
  }, [])

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const imgSize = node.size || 10
      const fontSize = Math.min(3, (12 * globalScale) / 8)
      const fontSizeSecond = Math.min(2, (12 * globalScale) / 8)

      let textOpacity = Math.min(globalScale / 4, 1)
      if (globalScale < 4) {
        textOpacity = globalScale / 10
      }

      if (globalScale < 2) {
        textOpacity = 0
      }

      ctx.font = `500 ${fontSize}px Sans-Serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = hexToRgba(
        getCssVariableValue('--tg-theme-text-color'),
        textOpacity
      )

      ctx.fillText(node.id!.toString(), node.x!, node.y! + imgSize / 2 + 1)

      ctx.font = `400 ${fontSizeSecond}px Sans-Serif`
      ctx.fillStyle = hexToRgba(
        getCssVariableValue('--tg-theme-link-color'),
        textOpacity * 0.8
      )
      const lineHeight = fontSize * 1.2

      // if not a topic
      if (!node.type) {
        ctx.fillText(
          '@' + node.username!,
          node.x!,
          node.y! + imgSize / 2 + 1 + lineHeight
        )
      }

      const img = imageCache[node.id!]

      if (img) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(
          img,
          node.x! - imgSize / 2,
          node.y! - imgSize / 2,
          imgSize,
          imgSize
        )
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false)
        ctx.lineWidth = 1
        ctx.strokeStyle = getCssVariableValue('--tg-theme-accent-text-color')
        ctx.stroke()
        ctx.restore()
      } else {
        const img = new Image()
        img.src =
          'https://www.pngkey.com/png/detail/18-187900_starfield-hourglass-windows-98-hourglass.png'
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(
          img,
          node.x! - imgSize / 2,
          node.y! - imgSize / 2,
          imgSize,
          imgSize
        )
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false)
        ctx.lineWidth = 1
        ctx.strokeStyle = getCssVariableValue('--tg-theme-accent-text-color')
        ctx.stroke()
        ctx.restore()
      }
    },
    [imageCache]
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeCanvasObject={drawNode}
        dagLevelDistance={-100}
        warmupTicks={10}
        nodePointerAreaPaint={(node, color, ctx) => {
          const imgSize = 10
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false)
          ctx.fill()
        }}
        linkCanvasObject={(link, ctx) => {
          ctx.strokeStyle = getCssVariableValue('--tg-theme-button-color')
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(
            (link.source as { x: number; y: number }).x,
            (link.source as { x: number; y: number }).y
          )
          ctx.lineTo(
            (link.target as { x: number; y: number }).x,
            (link.target as { x: number; y: number }).y
          )
          ctx.stroke()
        }}
        enableNodeDrag={true}
      />
    </div>
  )
}

function hexToRgba(hex: string, alpha = 1) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default ForceGraph
