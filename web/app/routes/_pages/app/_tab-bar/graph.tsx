import { createFileRoute } from "@tanstack/react-router"
import GraphPage from "~/pages/graph"

export const Route = createFileRoute("/_pages/app/_tab-bar/graph")({
  component: GraphPage,
})
