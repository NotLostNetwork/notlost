import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { Button } from "@telegram-apps/telegram-ui"
import TgWallpaper from "~/ui/tg-wallpaper"
import { $validateInitData } from "~/actions/telegram"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzAccount,
  JazzListOfContacts,
  RootUserProfile,
} from "~/lib/jazz/schema"
import { Route as ContactsRoute } from "./_tab-bar/contacts/index"

function OnboardingPage() {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const lp = useLaunchParams()
  const navigate = useNavigate()

  if (process.env.NODE_ENV !== "development") {
    try {
      $validateInitData({ data: lp.initDataRaw! })
    } catch (e) {
      throw new Error()
    }
  }

  const handleOnClick = () => {
    if (profile) {
      profile.telegramId = lp.initData?.user?.id!
      profile.firstName = lp.initData?.user?.firstName!
      profile.lastName = lp.initData?.user?.lastName!
      profile.telegramSync = false
      profile.username = lp.initData?.user?.username!
      profile.contacts = JazzListOfContacts.create([], {
        owner: profile._owner,
      })
      navigate({ to: ContactsRoute.to })
    }
  }

  return (
    <div className="h-screen p-4 relative flex flex-col">
      <div className="h-screen absolute">
        <TgWallpaper />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-3xl mt-4 text-center">
          Make your contacts NOTLOST
        </div>
        <div className="text-primary text-center mt-4">
          Let's get started to enhance your networking experience through
          telegram
        </div>
      </div>
      <Button className="mt-auto" onClick={handleOnClick}>
        Continue
      </Button>
    </div>
  )
}

export const Route = createFileRoute("/app/onboarding")({
  component: OnboardingPage,
  staleTime: Infinity,
})
