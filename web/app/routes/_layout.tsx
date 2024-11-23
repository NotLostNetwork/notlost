import { Outlet, createFileRoute } from '@tanstack/react-router'
import BottomBar from '~/components/bottom-bar'

function LayoutComponent() {
  return (
    <>
      <Outlet />
      <BottomBar />
    </>
  )
}

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})
