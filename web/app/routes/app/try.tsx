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

  const [locationManagerInited, setLocationManagerInited] = useState(false)

  const locationAccessSetting = () => {
    if ((window as any)?.Telegram?.WebApp) {
      const webApp = (window as any)?.Telegram?.WebApp
      console.log(webApp.LocationManager.isInited())
      webApp.LocationManager.init(() => setLocationManagerInited(true))
    }
  }

  useEffect(() => {
    if ((window as any)?.Telegram?.WebApp && locationManagerInited) {
      const webApp = (window as any)?.Telegram?.WebApp
      console.log("before init")
      webApp.LocationManager.getLocation((res: null | any) => console.log(res))
    }
  }, [locationManagerInited])

  return (
    <>
      <Button onClick={locationAccessSetting}>Open lOocation</Button>
    </>
  )
}

export const Route = createFileRoute("/app/try")({
  component: RouteComponent,
})
