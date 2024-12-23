import React, { useEffect, useState, useCallback } from "react"
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d"
import { UserContact } from "~/entities/user/user-contact/interface"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"

import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"

type ImageCache = {
  [key: string]: HTMLImageElement
}

interface Link {
  source: string
  target: string
}

const ForceGraph = ({
  nodes,
  selectTopic,
}: {
  nodes: UserContact[]
  selectTopic: (topic: string) => void
}) => {
  const fgRef = React.useRef<ForceGraphMethods>()
  const [clickedNodeId, setClickedNodeId] = useState<string | null>(null)
  const [clickedNodeTimeStamp, setClickedNodeTimeStamp] = useState<
    number | null
  >(null)

  const links: Link[] = []
  nodes.forEach((nodeBody) => {
    if (nodeBody.topic && nodes.some((node) => node.id === nodeBody.topic)) {
      links.push({ source: nodeBody.topic, target: nodeBody.id })
    }
  })

  nodes.forEach((node) => {
    if (node.topic === null) {
      links.push({ source: "Center", target: node.id })
    }
  })

  const graphData = {
    nodes,
    links,
  }

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(50)
    fgRef?.current?.centerAt(0, 0)
    fgRef?.current?.zoom(1)

    nodes.push({
      id: "Center",
      group: 1,
      username: "Center",
      description: "string",
      tags: [],
      topic: "string",
      type: "topic",
      createdAt: new Date(),
    })
  }, [])
  const [imageCache, setImageCache] = useState<ImageCache>({})

  useEffect(() => {
    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(img)
      })
    }

    const loadNodeImage = async (node: UserContact) => {
      try {
        const avatarUrl = await TelegramHelper.getProfileAvatar(node.username)
        const img = await loadImage(avatarUrl)
        setImageCache((prevCache) => ({
          ...prevCache,
          [node.id]: img,
        }))
      } catch (error) {
        console.error(`Error loading image for node ${node.id}:`, error)
      }
    }

    graphData.nodes.forEach((node) => {
      if (!imageCache[node.id]) {
        loadNodeImage(node)
      }
    })
  }, [graphData.nodes, imageCache])

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (node.id === "Center") return
      let imgSize = 20
      if (node.type) {
        imgSize = 30
      }
      const fontSize = Math.min(3, (12 * globalScale) / 8)
      const fontSizeSecond = Math.min(2, (12 * globalScale) / 8)

      let textOpacity = Math.min(globalScale / 4, 0.8)
      if (globalScale < 4) {
        textOpacity = globalScale / 10
      }

      if (globalScale < 2) {
        textOpacity = 0
      }

      ctx.font = `500 ${fontSize}px Sans-Serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillStyle = hexToRgba(
        getCssVariableValue("--tg-theme-text-color"),
        textOpacity
      )

      ctx.fillText(node.id!.toString(), node.x!, node.y! + imgSize / 4 + 1)

      ctx.font = `400 ${fontSizeSecond}px Sans-Serif`
      ctx.fillStyle = hexToRgba(
        getCssVariableValue("--tg-theme-link-color"),
        textOpacity * 0.8
      )
      const lineHeight = fontSize * 1.2

      // if not a topic
      if (!node.type) {
        ctx.fillText(
          "@" + node.username!,
          node.x!,
          node.y! + imgSize / 4 + 1 + lineHeight
        )
      }

      const img = imageCache[node.id!]

      if (img) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(
          img,
          node.x! - imgSize / 4,
          node.y! - imgSize / 4,
          imgSize / 2,
          imgSize / 2
        )
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false)
        ctx.lineWidth = 1
        ctx.strokeStyle = getCssVariableValue("--tg-theme-accent-text-color")
        ctx.stroke()
        ctx.restore()
      } else {
        const img = new Image()
        img.src =
          "https://www.shutterstock.com/shutterstock/videos/1093269629/thumb/4.jpg?ip=x480"
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(
          img,
          node.x! - imgSize / 4,
          node.y! - imgSize / 4,
          imgSize / 2,
          imgSize / 2
        )
      }
    },
    [imageCache, clickedNodeId]
  )

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      nodeAutoColorBy="group"
      onNodeClick={(node) => {
        // simulate double click
        if (
          clickedNodeId === node.id!.toString() &&
          Date.now() - clickedNodeTimeStamp! <= 500
        ) {
          window.open(`https://t.me/${node.username}`)
        } else {
          setClickedNodeId(node.id!.toString())
          setClickedNodeTimeStamp(Date.now())
          console.log(clickedNodeTimeStamp)
        }
      }}
      onBackgroundClick={() => {
        setClickedNodeId(null)
      }}
      nodeCanvasObject={drawNode}
      nodePointerAreaPaint={(node, color, ctx) => {
        const imgSize = 10
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false)
        ctx.fill()
      }}
      linkCanvasObject={(link, ctx) => {
        ctx.strokeStyle = getCssVariableValue("--tg-theme-button-color")
        ctx.lineWidth = 0.5

        //@ts-ignore
        if (link.source.id === "Center") {
          ctx.strokeStyle = "rgba(0,0,0,0)"
        }
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
    />
  )
}

function hexToRgba(hex: string, alpha = 1) {
  hex = hex.replace(/^#/, "")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default ForceGraph
