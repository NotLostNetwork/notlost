import { Outlet, createFileRoute } from '@tanstack/react-router'
import BottomBar from '~/shared/ui/bottom-bar'
import '@/styles/app.css'

function LayoutComponent() {
  return (
    <>
      <Outlet />
      <BottomBar />
    </>
  )
}

export const Route = createFileRoute('/_provider/(tab-bar)/_tab-bar')({
  component: LayoutComponent,
})
