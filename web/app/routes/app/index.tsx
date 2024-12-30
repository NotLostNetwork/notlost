import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { useEffect } from "react"
import { Route as ContactsRoute } from "./_tab-bar/contacts"

function RouteComponent() {
  const navigate = useNavigate()
  const lp = useLaunchParams()
  const telegramId = lp.initData!.user!.id.toString()

  useEffect(() => {
    navigate({ to: ContactsRoute.to })
  }, [])

  return <></>
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
})
