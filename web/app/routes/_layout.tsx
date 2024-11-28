import { Outlet, createFileRoute } from '@tanstack/react-router'
import BottomBar from '~/components/bottom-bar'
import TelegramProvider from '~/lib/telegram/telegram-provider'
import '@/styles/app.css'

function LayoutComponent() {
  return (
    <>
      <TelegramProvider>
        <Outlet />
        <BottomBar />
      </TelegramProvider>
    </>
  )
}

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})
