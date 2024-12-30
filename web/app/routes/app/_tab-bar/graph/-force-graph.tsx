import React, { useEffect, useState, useCallback } from "react"
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d"
import { JazzListOfContacts } from "~/lib/jazz/schema"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import topicIcon from "@/assets/icons/link.svg"

import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"

type ImageCache = {
  [key: string]: HTMLImageElement
}

interface Link {
  source: string
  target: string
}

interface Node {
  id: string
  username: string
  firstName: string
  topic: string | null
  description: string
  tags: string[][]
  type: string | null
}

const ForceGraph = ({
  data,
  uniqueTopics,
}: {
  data: JazzListOfContacts
  uniqueTopics: string[]
}) => {
  const nodes: Node[] = data
    .filter((item) => item !== undefined && item !== null)
    .map((item) => ({
      id: item.username,
      username: item.username,
      topic: item.topic || null,
      firstName: item.firstName,
      description: item.description,
      tags: new Array(item.tags?.map((tag) => tag.toString()) || []),
      type: null,
    }))

  nodes.push({
    id: "Center",
    username: "Center",
    firstName: "Center",
    description: "string",
    tags: [],
    topic: "string",
    type: "topic",
  })

  uniqueTopics.forEach((topic) => {
    nodes.push({
      id: topic,
      username: topic,
      firstName: topic,
      description: topic,
      tags: [],
      topic: topic,
      type: "topic",
    })
  })

  const fgRef = React.useRef<
    ForceGraphMethods<{ id: string | number }, {}> | undefined
  >(undefined)
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

    const loadNodeImage = async (node: Node) => {
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
        loadNodeImage(node as Node)
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
        textOpacity,
      )

      if (!node.type) {
        ctx.fillText(
          node.firstName.toString(),
          node.x!,
          node.y! + imgSize / 4 + 1,
        )
      }

      ctx.font = `400 ${fontSizeSecond}px Sans-Serif`
      ctx.fillStyle = hexToRgba(
        getCssVariableValue("--tg-theme-link-color"),
        textOpacity * 0.8,
      )
      const lineHeight = fontSize * 1.2

      // if not a topic
      if (!node.type) {
        ctx.fillText(
          "@" + node.username!,
          node.x!,
          node.y! + imgSize / 4 + 1 + lineHeight,
        )
      }

      if (node.type) {
        const titleText = node.username

        // Circle as base
        const radius = 6
        ctx.beginPath()
        ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = hexToRgba("#0063cc", 1) // Fill color
        ctx.fill()
        ctx.lineWidth = 1.5
        ctx.strokeStyle = hexToRgba("#6ab2f2", 1) // Stroke color
        ctx.stroke()

        // Text on top of the circle
        ctx.font = `400 ${fontSizeSecond + 5}px Sans-Serif`
        const textOpacity = Math.min(globalScale / 3, 1)

        ctx.strokeStyle = hexToRgba("#ffffff", 0.2) // Text outline
        ctx.lineWidth = 0.5
        ctx.strokeText(titleText, node.x!, node.y! + 10)

        ctx.fillStyle = hexToRgba("#fff", textOpacity) // Text fill color
        ctx.fillText(titleText, node.x!, node.y! + 10)

        const imgSize = 12
        const img = new Image()
        img.src = topicIcon // Path to

        img.onload = () => {
          ctx.save()
          ctx.beginPath()
          ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false) // Define clipping area
          ctx.clip()
          ctx.drawImage(
            img,
            node.x! - imgSize / 2,
            node.y! - imgSize / 2,
            imgSize,
            imgSize,
          )
          ctx.restore()
        }

        img.onerror = () => {
          console.error("Image failed to load.")
        }

        return // Exit function after rendering
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
          imgSize / 2,
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
          imgSize / 2,
        )
      }
    },
    [imageCache, clickedNodeId],
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
          (link.source as { x: number; y: number }).y,
        )
        ctx.lineTo(
          (link.target as { x: number; y: number }).x,
          (link.target as { x: number; y: number }).y,
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