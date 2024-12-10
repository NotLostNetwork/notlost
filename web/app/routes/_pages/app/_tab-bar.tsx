import { Outlet, createFileRoute } from '@tanstack/react-router'
import BottomBar from '~/shared/ui/bottom-bar'

function LayoutComponent() {
  return (
    <div className='h-screen flex flex-col'>
      <div className='flex-1 overflow-auto'>
        <Outlet />
      </div>
      <BottomBar />
    </div>
  )
}

export const Route = createFileRoute('/_pages/app/_tab-bar')({
  component: LayoutComponent,
})
