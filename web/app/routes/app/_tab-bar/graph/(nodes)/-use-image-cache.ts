import { useState } from "react"
import { GraphNode, GraphNodeImageCache, GraphNodeType } from "../-@interface"
import TelegramHelper from "~/lib/telegram/api/telegram-helper"
import { NodeObject } from "react-force-graph-2d"
import topicIcon from "@/assets/icons/graph/link.svg"
import tagIcon from "@/assets/icons/graph/tag.svg"

export const useImageCache = (nodes: GraphNode[]) => {
  const [imageCache, setImageCache] = useState<GraphNodeImageCache>({})

  const loadImage = (url: string) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve(img)
      img.onerror = (err) => reject(err)
    })

  const fetchImages = async () => {
    const imageLoadPromises = nodes.map(async (node) => {
      if (!imageCache[node.id]) {
        try {
          let img: HTMLImageElement | null = null

          switch (node.type) {
            case GraphNodeType.CONTACT:
              const avatarUrl = await TelegramHelper.getProfileAvatar(
                node.username,
              )
              img = (await loadImage(avatarUrl)) as HTMLImageElement
              break

            case GraphNodeType.TOPIC:
              img = (await loadImage(topicIcon)) as HTMLImageElement
              break

            case GraphNodeType.TAG:
              img = (await loadImage(tagIcon)) as HTMLImageElement
              break
          }

          if (img) {
            setImageCache((prev) => ({
              ...prev,
              [node.id]: img,
            }))
          }
        } catch (error) {
          console.error(`Error loading image for node ${node.id}:`, error)
        }
      }
    })

    await Promise.all(imageLoadPromises)
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
