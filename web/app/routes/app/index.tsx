import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { Route as ContactsRoute } from "./_tab-bar/dialogs"

function RouteComponent() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: ContactsRoute.to })
  }, [])

  return <></>
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
})
