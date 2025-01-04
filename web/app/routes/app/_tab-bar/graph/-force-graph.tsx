import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react"
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d"
import { JazzListOfContacts } from "~/lib/jazz/schema"
import { GraphLink, GraphNode, GraphNodeType } from "./-@interface"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { drawContactNode } from "./(nodes)/-draw-contact-node"
import { drawTopicNode } from "./(nodes)/-draw-topic-node"
import { useImageCache } from "./(nodes)/-use-image-cache"
import { drawTagNode } from "./(nodes)/-draw-tag-node"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { SelectedContact } from "./-selected-contact"
import { AnimatePresence, motion } from "framer-motion"

const ForceGraph = ({
  data,
  uniqueTopics,
}: {
  data: JazzListOfContacts
  uniqueTopics: string[]
}) => {
  const [selectedContact, setSelectedContact] = useState<null | GraphNode>(null)

  const lp = useLaunchParams()

  const nodes = useMemo(
    () => initializeNodes(data, uniqueTopics),
    [data, uniqueTopics],
  )
  const links = useMemo(() => initializeLinks(nodes), [nodes])

  const { imageCache, fetchImages } = useImageCache(nodes)

  useEffect(() => {
    fetchImages()
  }, [nodes, imageCache])

  useEffect(() => {
    console.log(selectedContact)
  }, [selectedContact])

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!]

      switch (node.type) {
        case GraphNodeType.CONTACT:
          drawContactNode(node, ctx, globalScale, img)
          break
        case GraphNodeType.TOPIC:
          drawTopicNode(node, ctx, globalScale, img, lp.platform)
          break
        case GraphNodeType.TAG:
          drawTagNode(node, ctx, globalScale, img, lp.platform)
          break
      }
    },
    [imageCache],
  )

  const fgRef = React.useRef<
    ForceGraphMethods<{ id: string | number }, {}> | undefined
  >(undefined)

  const graphData = useMemo(() => ({ nodes, links }), [nodes, links])

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(50)
    fgRef?.current?.centerAt(0, 0)
    fgRef?.current?.zoom(1)
  }, [])

  return (
    <div>
      <AnimatePresence>
        {selectedContact && (
          <SelectedContact selectedContact={selectedContact} />
        )}
      </AnimatePresence>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="group"
        onBackgroundClick={() => {
          setSelectedContact(null)
        }}
        onNodeClick={(node) => {
          if (selectedContact !== node) {
            setSelectedContact(null)
            setTimeout(() => {
              setSelectedContact(node as GraphNode)
            }, 150)
          }
        }}
        onNodeDrag={(node) => {
          if (selectedContact !== node) {
            setSelectedContact(null)
            setTimeout(() => {
              setSelectedContact(node as GraphNode)
            }, 150)
          }
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
    </div>
  )
}

const initializeNodes = (
  data: JazzListOfContacts,
  uniqueTopics: string[],
): GraphNode[] => {
  const nodes: GraphNode[] = data
    .filter((item) => item !== undefined && item !== null)
    .map((item) => ({
      ...item,
      type: GraphNodeType.CONTACT,
      tags: item.tags?.map((tag) => tag.toString()),
      id: item.username,
    }))

  uniqueTopics.forEach((topic) => {
    nodes.push({
      id: topic,
      username: topic,
      firstName: topic,
      topic: topic,
      tags: [],
      type: GraphNodeType.TOPIC,
    })
  })

  const primaryTags = nodes
    .map((node) => {
      if (node.tags) {
        return node.tags[0]
      }
    })
    .filter((tag) => tag !== undefined)

  primaryTags.forEach((primaryTag) => {
    nodes.push({
      id: primaryTag,
      username: primaryTag,
      firstName: primaryTag,
      topic: primaryTag,
      tags: [],
      type: GraphNodeType.TAG,
    })
  })

  return nodes
}

const initializeLinks = (nodes: GraphNode[]) => {
  const links: GraphLink[] = []

  nodes.forEach((nodeBody) => {
    if (nodeBody.topic && nodes.some((node) => node.id === nodeBody.topic)) {
      if (nodeBody.tags && nodeBody.tags[0] !== undefined) {
        links.push({ source: nodeBody.topic, target: nodeBody.tags[0] })
        links.push({ source: nodeBody.tags[0], target: nodeBody.id })
      } else {
        links.push({ source: nodeBody.topic, target: nodeBody.id })
      }
    }
  })

  return links
}

export default ForceGraph
