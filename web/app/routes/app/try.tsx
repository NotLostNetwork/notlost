import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@telegram-apps/telegram-ui"
import WebApp from "@twa-dev/sdk"
import { useEffect, useState } from "react"

function RouteComponent() {
  // const { me } = useAccountOrGuest({})
  // console.log(me, "me")
  // const { me } = useAccount({
  //   root: { contacts: [{}] }] },
  // })

  const locationAccessSetting = () => {
    if (!WebApp.LocationManager.isInited) {
      WebApp.LocationManager.init()
    } else {
      console.log("get location")
      WebApp.LocationManager.getLocation((res: null | any) => console.log(res))
    }
  }

  return (
    <>
      <Button onClick={locationAccessSetting}>Open lOocation</Button>
    </>
  )
}

export const Route = createFileRoute("/app/try")({
  component: RouteComponent,
})
