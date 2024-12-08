import { createFileRoute, Outlet } from '@tanstack/react-router'
import '@/shared/styles/app.css'
import TelegramProvider from '~/shared/lib/telegram/telegram-provider'

export const Route = createFileRoute('/_pages')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TelegramProvider>
      <Outlet />
    </TelegramProvider>
  )
}
