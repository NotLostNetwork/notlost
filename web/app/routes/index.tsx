import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { $getContactsForUser, $getUser } from '~/actions';
import { useLaunchParams } from '@telegram-apps/sdk-react';


function RouteComponent() {

  const navigate = useNavigate()
  const lp = useLaunchParams()
  const telegramId = lp.initData!.user!.id.toString()

  console.log(telegramId);

  const { data, isError } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      const user = await $getUser({
        data: {
          telegramId,
        },
      })

      if (!user) {
        await navigate({to: '/onboarding'})
      } else {
        await navigate({to: '/contacts'})
      }

      return user
    },
  })

  console.log(data, "data")
  return <></>
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
