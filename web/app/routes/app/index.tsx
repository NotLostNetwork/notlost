import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import { useEffect } from "react"
import { $getUser } from "~/entities/user/api"
import { Route as OnboardingRoute } from "./onboarding"
import { Route as ContactsRoute } from "./_tab-bar/contacts"

function RouteComponent() {
  const navigate = useNavigate()
  const lp = useLaunchParams()
  const telegramId = lp.initData!.user!.id.toString()

  console.log(telegramId)

  const {
    data: user,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await $getUser({
        data: {
          telegramId,
        },
      })

      return user || null
    },
  })

  useEffect(() => {
    if (isSuccess) {
      if (!user) {
        navigate({ to: OnboardingRoute.to })
      } else {
        navigate({ to: ContactsRoute.to })
      }
    }

    if (isLoading) {
      // TODO: add initial request loader
    }
  })

  return <></>
}

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
})
