import { JazzContact } from "~/lib/jazz/schema"

export type GraphNodeImageCache = {
  [key: string]: HTMLImageElement
}

export interface GraphLink {
  source: string
  target: string
}

export enum GraphNodeType {
  SUPER_TAG = "super-tag",
  TAG = "tag",
  CONTACT = "contact",
}

export interface GraphNodeSuperTag {
  id: string
  title: string
  type: GraphNodeType.SUPER_TAG
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

export type GraphNode = GraphNodeContact | GraphNodeTag | GraphNodeSuperTag

export interface GraphData {
  links: GraphLink[]
  nodes: GraphNode[]
}
