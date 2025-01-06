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
  targets: (GraphNodeContact | GraphNodeTag)[] // as topic can links to tag or to contact
  type: GraphNodeType.TOPIC
}

export type GraphNodeTag = {
  id: string
  title: string
  source: string
  targets: (GraphNodeContact | GraphNodeTag)[] // as tag can be sub-tag (dev tag -> front tag -> contact)
  type: GraphNodeType.TAG
}

export interface GraphNodeContact {
  id: string
  username: string
  firstName: string
  topic: string
  tags: string[]
  type: GraphNodeType.CONTACT
}

export type GraphNode = GraphNodeContact | GraphNodeTag | GraphNodeTopic

export interface GraphData {
  links: GraphLink[]
  nodes: GraphNode[]
}
