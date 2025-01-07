import React, { useEffect, useState, useCallback, useMemo } from "react"
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d"
import { JazzListOfContacts } from "~/lib/jazz/schema"
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
import { drawTopicNode } from "./(nodes)/-draw-topic-node"
import { useImageCache } from "./(nodes)/-use-image-cache"
import { drawTagNode } from "./(nodes)/-draw-tag-node"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { SelectedContact } from "./-selected-contact"
import { AnimatePresence } from "framer-motion"

const ForceGraph = ({ data }: { data: JazzListOfContacts }) => {
  const [selectedContact, setSelectedContact] = useState<null | GraphNode>(null)
  const [selectedContactTimestamp, setSelectedContactTimestamp] = useState<
    null | number
  >(null)

  const lp = useLaunchParams()

  const graphData = useMemo(() => initializeGraphData(data), [data])

  const { imageCache, fetchImages } = useImageCache(graphData.nodes)

  useEffect(() => {
    fetchImages()
  }, [graphData.nodes, imageCache])

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

const initializeGraphData = (contacts: JazzListOfContacts): GraphData => {
  let nodes: GraphNode[] = []
  let links: GraphLink[] = []

  let topicsWithTagsAndContacts: GraphNodeTopic[] = [] // topic: paris -> tag: dev -> contact
  let tagsWithContacts: GraphNodeTag[] = [] // tag: dev -> contact
  let topicsWithContacts: GraphNodeTopic[] = [] // topic: paris -> contact

  contacts
    .filter((contact) => contact !== undefined && contact !== null)
    .forEach((contact) => {
      const newNodeContact: GraphNodeContact = {
        ...contact,
        id: contact.username,
        tags: contact.tags?.map((tag) => tag && tag.toString()) || [],
        type: GraphNodeType.CONTACT,
      }

      if (contact.topic) {
        let contactTopic = topicsWithTagsAndContacts.find(
          (topic) => topic.title === contact.topic,
        ) as GraphNodeTopic

        if (!contactTopic) {
          contactTopic = {
            id: `${contact.topic}-topic`,
            title: contact.topic,
            targets: [],
            type: GraphNodeType.TOPIC,
          }
          topicsWithTagsAndContacts.push(contactTopic)
        }

        if (contact.tags?.length) {
          const primaryTag = contact.tags[0] // use first tag as link

          const existantTagInTopic = contactTopic.targets.find(
            (target) =>
              target.type === GraphNodeType.TAG && target.title === primaryTag,
          )

          if (!existantTagInTopic) {
            contactTopic.targets.push({
              id: `${contactTopic.title}-${primaryTag}-tag`,
              title: primaryTag,
              source: `${contactTopic.title}-topic`,
              targets: [newNodeContact],
              type: GraphNodeType.TAG,
            })
          } else if (existantTagInTopic.type !== GraphNodeType.CONTACT) {
            existantTagInTopic.targets.push(newNodeContact)
          }
        } else {
          contactTopic.targets.push(newNodeContact)
        }
      } else if (contact.tags?.length) {
        const primaryTag = contact.tags[0] // use first tag as link

        const existantTag = tagsWithContacts.find(
          (tag) => tag.title === primaryTag,
        )

        if (existantTag) {
          existantTag.targets.push(newNodeContact)
        } else {
          tagsWithContacts.push({
            id: `${primaryTag}-tag`,
            title: primaryTag,
            source: "",
            targets: [newNodeContact],
            type: GraphNodeType.TAG,
          })
        }
      } else {
        nodes.push(newNodeContact)
      }
    })

  // transform objects to nodes and links

  topicsWithTagsAndContacts.forEach((completeTopic) => {
    nodes.push(completeTopic)
    completeTopic.targets.forEach((tagOrContact) => {
      // tag with users -> link topic with tag, and tag with contacts
      if (tagOrContact.type === GraphNodeType.TAG) {
        nodes.push(tagOrContact) // tag
        links.push({ source: completeTopic.id, target: tagOrContact.id })

        tagOrContact.targets.forEach((contact) => {
          nodes.push(contact)
          links.push({ source: tagOrContact.id, target: contact.id })
        })
      } else {
        nodes.push(tagOrContact) // contact
        links.push({ source: completeTopic.id, target: tagOrContact.id })
      }
    })
  })

  topicsWithContacts.forEach((topic) => {
    nodes.push(topic)
    topic.targets.forEach((contact) => {
      nodes.push(contact)
      links.push({ source: topic.id, target: contact.id })
    })
  })

  tagsWithContacts.forEach((tag) => {
    nodes.push(tag)
    tag.targets.forEach((contact) => {
      nodes.push(contact)
      links.push({ source: tag.id, target: contact.id })
    })
  })

  return { nodes, links }
}

export default ForceGraph
