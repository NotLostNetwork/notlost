import { createFileRoute, Outlet } from '@tanstack/react-router'
import TelegramProvider from '~/shared/lib/telegram/telegram-provider'
import '@/shared/styles/app.css'

export const Route = createFileRoute('/_provider')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TelegramProvider>
      <Outlet/>
    </TelegramProvider>
  )
}
