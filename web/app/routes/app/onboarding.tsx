import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { Button } from "@telegram-apps/telegram-ui"
import { $createUser } from "~/entities/user/api"
import utyaCool from "@/assets/utya-cool.gif"
import TgWallpaper from "~/ui/tg-wallpaper"
import { Route as ContactsRoute } from "~/routes/app/_tab-bar/contacts"
import { $validateInitData } from "~/actions/telegram"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import { JazzAccount, RootUserProfile } from "~/lib/jazz/schema"

function OnboardingPage() {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)
  console.log(profile)
  //profile?.telegramId = 1

  const navigate = useNavigate()

  const lp = useLaunchParams()
  const telegramId = lp.initData!.user!.id.toString()

  if (process.env.NODE_ENV !== "development") {
    try {
      $validateInitData({ data: lp.initDataRaw! })
    } catch (e) {
      throw new Error()
    }
  }

  const { mutate: mutateCreateUser, isError } = useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      const user = await $createUser({
        data: {
          telegramId,
        },
      })

      navigate({ to: ContactsRoute.to })

      return user
    },
  })

  const handleOnClick = () => {
    mutateCreateUser()
  }

  return (
    <div className="h-screen p-4 relative flex flex-col">
      <div className="h-screen absolute">
        <TgWallpaper />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <img src={utyaCool} alt={"Utya sticker"} height={180} width={180} />
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
