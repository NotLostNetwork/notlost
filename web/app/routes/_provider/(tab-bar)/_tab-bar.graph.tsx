import { createFileRoute } from '@tanstack/react-router'
import GraphPage from '~/pages/graph/page'

export const Route = createFileRoute('/_provider/(tab-bar)/_tab-bar/graph')({
  component: GraphPage,
})
