import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@telegram-apps/telegram-ui"
import WebApp from "@twa-dev/sdk"
import { useState } from "react"
import { getLocation } from "~/lib/telegram/get-location"

function RouteComponent() {
  // const { me } = useAccountOrGuest({})
  // console.log(me, "me")
  // const { me } = useAccount({
  //   root: { contacts: [{}] }] },
  // })

  return (
    <>
      <Button onClick={getLocation}>Open lOocation</Button>
    </>
  )
}

export const Route = createFileRoute("/app/try")({
  component: RouteComponent,
})
