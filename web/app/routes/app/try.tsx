import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@telegram-apps/telegram-ui"
import WebApp from "@twa-dev/sdk"
import { useState } from "react"

function RouteComponent() {
  // const { me } = useAccountOrGuest({})
  // console.log(me, "me")
  // const { me } = useAccount({
  //   root: { contacts: [{}] }] },
  // })

  const [locationManagerInited, setLocationManagerInited] = useState(false)

  const webApp = (window as any)?.Telegram?.WebApp

  webApp.LocationManager.init(() => setLocationManagerInited(true))

  const locationAccessSetting = () => {
    if (locationManagerInited) {
      webApp.LocationManager.openSettings()
    }
  }

  return (
    <>
      <Button onClick={locationAccessSetting}>Open location</Button>
    </>
  )
}

export const Route = createFileRoute("/app/try")({
  component: RouteComponent,
})
