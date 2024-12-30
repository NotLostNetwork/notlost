import { useState } from "react"
import { GraphNode, GraphNodeImageCache, GraphNodeType } from "../-@interface"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { NodeObject } from "react-force-graph-2d"
import topicIcon from "@/assets/icons/graph/link.svg"
import tagIcon from "@/assets/icons/graph/tag.svg"

export const useImageCache = (nodes: GraphNode[]) => {
  const [imageCache, setImageCache] = useState<GraphNodeImageCache>({})

  const loadImage = (url: string) =>
    new Promise((resolve) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve(img)
    })

  const fetchImages = async () => {
    for (const node of nodes) {
      if (!imageCache[node.id]) {
        switch (node.type) {
          case GraphNodeType.CONTACT:
            const avatarUrl = await TelegramHelper.getProfileAvatar(
              node.username,
            )
            const contactImg = await loadImage(avatarUrl)
            setImageCache((prev) => ({
              ...prev,
              [node.id]: contactImg as HTMLImageElement,
            }))
            break

          case GraphNodeType.TOPIC:
            const topicImg = await loadImage(topicIcon)
            setImageCache((prev) => ({
              ...prev,
              [node.id]: topicImg as HTMLImageElement,
            }))
            break

          case GraphNodeType.TAG:
            const tagImg = await loadImage(tagIcon)
            setImageCache((prev) => ({
              ...prev,
              [node.id]: tagImg as HTMLImageElement,
            }))
            break
        }
      }
    }
  }

  const addStaticImage = async (url: string, node: NodeObject) => {
    try {
      const img = await loadImage(url)
      setImageCache((prev) => ({
        ...prev,
        [node.id!]: img as HTMLImageElement,
      }))
    } catch (error) {
      console.error(`Error loading image for node ${node.id}:`, error)
    }
  }

  return {
    imageCache,
    fetchImages,
    addStaticImage,
  }
}
