import React, { useEffect, useState, useCallback, useMemo } from "react"
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d"
import {
  JazzAccount,
  JazzContact,
  JazzLink,
  JazzListOfContacts,
  RootUserProfile,
} from "~/lib/jazz/schema"
import { GraphData, GraphLink, GraphNode, GraphNodeType } from "./-@interface"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { drawContactNode } from "./(nodes)/-draw-contact-node"
import { drawTopicNode, getTopicRadius } from "./(nodes)/-draw-topic-node"
import { useImageCache } from "./(nodes)/-use-image-cache"
import { drawTagNode } from "./(nodes)/-draw-tag-node"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { SelectedNode } from "./-selected-node"
import { AnimatePresence } from "framer-motion"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import useViewportSize from "./-window-height"
import useAppStore from "~/lib/app-store/app-store"

const ForceGraph = ({ jazzProfile }: { jazzProfile: RootUserProfile }) => {
  const [selectedNode, setSelectedNode] = useState<null | GraphNode>(null)
  const [selectedNodeTimestamp, setSelectedNodeTimestamp] = useState<
    null | number
  >(null)

  const lp = useLaunchParams()

  const graphData = useMemo(
    () => initializeGraphData(jazzProfile),
    [jazzProfile],
  )

  const { imageCache, fetchImages } = useImageCache(graphData.nodes)

  useEffect(() => {
    fetchImages()
  }, [graphData.nodes, imageCache])

  useEffect(() => {
    // case when promoting tag to super tag, need to refresh image cache as image changes
    fetchImages(true)
  }, [graphData.nodes])

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!]
      setGlobalScale(globalScale)

      switch (node.type) {
        case GraphNodeType.CONTACT:
          drawContactNode(node, ctx, globalScale, img)
          break
        case GraphNodeType.SUPER_TAG:
          drawTopicNode(node, ctx, globalScale, img, lp.platform)
          break
        case GraphNodeType.TAG:
          drawTagNode(node, ctx, globalScale, img, lp.platform)
      }
    },
    [imageCache],
  )

  const fgRef = React.useRef<
    ForceGraphMethods<{ id: string | number }, {}> | undefined
  >(undefined)

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(50)
    fgRef?.current?.centerAt(0, 0)
    fgRef?.current?.zoom(1)
  }, [])

  const [globalScale, setGlobalScale] = useState<number | null>(null)

  const { linkNodesModeEnabled, selectNodeToLink, editGraphModeEnabled } =
    useAppStore()
  useEffect(() => {
    if (linkNodesModeEnabled && selectedNode) {
      selectNodeToLink(selectedNode)
    }
  }, [selectedNode])

  const viewportHeight = useViewportSize()?.[1]

  return (
    <div className="">
      <AnimatePresence>
        {selectedNode && (
          <SelectedNode
            selectedNode={selectedNode}
            setSelectedNode={(value: GraphNode | null) =>
              setSelectedNode(value)
            }
          />
        )}
      </AnimatePresence>

      <ForceGraph2D
        ref={fgRef}
        height={viewportHeight}
        graphData={graphData}
        nodeAutoColorBy="group"
        onBackgroundClick={() => {
          setSelectedNode(null)
        }}
        minZoom={0.5}
        onNodeClick={(node) => {
          if (!editGraphModeEnabled) {
            fgRef?.current?.zoomToFit(
              500,
              // PADDING DEPENDS ON USER SCREEN RESOLUTION (small screens -> zoom more far a way; big screens -> zoom closer)
              175,
              (filterNode) => filterNode.id === node.id,
            )
          }

          if (selectedNode !== node) {
            setSelectedNodeTimestamp(Date.now())
            setSelectedNode(null)
            setTimeout(() => {
              setSelectedNode(node as GraphNode)
            }, 150)
          } else if (
            selectedNodeTimestamp &&
            selectedNode.type === GraphNodeType.CONTACT &&
            Date.now() - selectedNodeTimestamp < 500
          ) {
            window.open(`https://t.me/${selectedNode.username}`)
          }
          setSelectedNodeTimestamp(Date.now())
        }}
        onNodeDrag={(node) => {
          if (selectedNode !== node) {
            setSelectedNode(null)
            setTimeout(() => {
              setSelectedNode(node as GraphNode)
            }, 150)
          }
        }}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          // clickable node zone
          let imgSize
          if (node.type === GraphNodeType.SUPER_TAG) {
            imgSize = getTopicRadius(globalScale ? globalScale : 0)
          } else {
            imgSize = 20
          }
          console.log()
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

const initializeGraphData = (jazzProfile: RootUserProfile): GraphData => {
  let nodes: GraphNode[] = []
  let links: GraphLink[] = []

  jazzProfile?.contacts?.forEach((contact) => {
    if (contact) {
      nodes.push({
        id: contact?.username,
        username: contact?.username,
        firstName: contact?.firstName,
        type: GraphNodeType.CONTACT,
      })
    }
  })

  jazzProfile?.tags?.forEach((tag) => {
    if (tag && tag.superTag) {
      nodes.push({
        id: tag?.id,
        title: tag.title,
        type: GraphNodeType.SUPER_TAG,
      })
    }
  })

  jazzProfile?.tags?.forEach((tag) => {
    if (tag && !tag.superTag) {
      nodes.push({
        id: tag?.id,
        title: tag.title,
        type: GraphNodeType.TAG,
      })
    }
  })

  jazzProfile?.links?.forEach((link) => {
    if (link) {
      links.push({
        source: link.source,
        target: link.target,
      })
    }
  })

  return { nodes, links }
}

export default ForceGraph
