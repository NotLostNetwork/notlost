import { JazzContact } from "~/lib/jazz/schema"

export type GraphNodeImageCache = {
  [key: string]: HTMLImageElement
}

export interface GraphLink {
  source: string
  target: string
}

export enum GraphNodeType {
  TOPIC = "topic",
  TAG = "tag",
  CONTACT = "contact",
}

export interface GraphNodeTopic {
  id: string
  title: string
  type: GraphNodeType.TOPIC
}

export type GraphNodeTag = {
  id: string
  title: string
  type: GraphNodeType.TAG
}

export interface GraphNodeContact {
  id: string
  username: string
  firstName: string
  type: GraphNodeType.CONTACT
}

export type GraphNode = GraphNodeContact | GraphNodeTag | GraphNodeTopic

export interface GraphData {
  links: GraphLink[]
  nodes: GraphNode[]
}
