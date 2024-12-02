import { createFileRoute } from '@tanstack/react-router'
import GraphPage from '~/pages/graph'

export const Route = createFileRoute('/_pages/(tab-bar)/_tab-bar/graph')({
  component: GraphPage,
})
