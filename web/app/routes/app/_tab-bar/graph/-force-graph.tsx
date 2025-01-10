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
import {
  GraphData,
  GraphLink,
  GraphNode,
  GraphNodeContact,
  GraphNodeTag,
  GraphNodeTopic,
  GraphNodeType,
} from "./-@interface"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { drawContactNode } from "./(nodes)/-draw-contact-node"
import { drawTopicNode, getTopicRadius } from "./(nodes)/-draw-topic-node"
import { useImageCache } from "./(nodes)/-use-image-cache"
import { drawTagNode } from "./(nodes)/-draw-tag-node"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { SelectedContact } from "./-selected-contact"
import { AnimatePresence } from "framer-motion"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { profile } from "console"

const ForceGraph = ({
  jazzProfile,
  linkMode,
}: {
  jazzProfile: RootUserProfile
  linkMode: boolean
}) => {
  const [selectedContact, setSelectedContact] = useState<null | GraphNode>(null)
  const [selectedContactTimestamp, setSelectedContactTimestamp] = useState<
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

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!]
      setGlobalScale(globalScale)

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

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(50)
    fgRef?.current?.centerAt(0, 0)
    fgRef?.current?.zoom(1)
  }, [])

  const [globalScale, setGlobalScale] = useState<number | null>(null)

  const [nodesToLink, setNodesToLink] = useState<GraphNode[]>([])

  useEffect(() => {
    if (linkMode && selectedContact) {
      console.log(1, nodesToLink)

      if (nodesToLink.length === 2) {
        console.log(2, nodesToLink)

        if (jazzProfile) {
          console.log(jazzProfile)
          jazzProfile.links?.push(
            JazzLink.create(
              {
                source: nodesToLink[0].id,
                target: nodesToLink[1].id,
              },
              { owner: jazzProfile._owner },
            ),
          )
        }
      } else {
        setNodesToLink((prev) => [...prev, selectedContact!])
      }
    }
  }, [selectedContact])

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
          fgRef?.current?.zoomToFit(
            500,
            // PADDING DEPENDS ON USER SCREEN RESOLUTION (small screens -> zoom more far a way; big screens -> zoom closer)
            175,
            (filterNode) => filterNode.id === node.id,
          )

          if (selectedContact !== node) {
            setSelectedContactTimestamp(Date.now())
            setSelectedContact(null)
            setTimeout(() => {
              setSelectedContact(node as GraphNode)
            }, 150)
          } else if (
            selectedContactTimestamp &&
            selectedContact.type === GraphNodeType.CONTACT &&
            Date.now() - selectedContactTimestamp < 500
          ) {
            window.open(`https://t.me/${selectedContact.username}`)
          }
          setSelectedContactTimestamp(Date.now())
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
          // clickable node zone
          let imgSize
          if (node.type === GraphNodeType.TOPIC) {
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

  jazzProfile?.topics?.forEach((topic) => {
    if (topic) {
      nodes.push({
        id: topic?.id,
        title: topic.title,
        type: GraphNodeType.TOPIC,
      })
    }
  })

  jazzProfile?.tags?.forEach((tag) => {
    if (tag) {
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
