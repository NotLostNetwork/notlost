import { JazzContact } from "~/lib/jazz/schema"

export type GraphNodeImageCache = {
  [key: string]: HTMLImageElement
}

export interface GraphLink {
  source: string
  target: string
}

export enum GraphNodeType {
  TOPIC,
  CONTACT,
  TAG,
}

// For making graph working, node should have an id
export interface GraphNode {
  id: string
  username: string
  firstName: string
  topic: string
  tags: string[]
  type: GraphNodeType
}
