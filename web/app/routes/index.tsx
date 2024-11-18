import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { $getContactsForUser } from "~/actions"

function RouteComponent() {
  // assume we get it from tg init data
  const telegramId = "123"

  const { data } = useQuery({
    queryKey: ["/"],
    queryFn: async () => {
      const contacts = await $getContactsForUser({
        data: {
          telegramId,
        },
      })
      return contacts
    },
  })
  console.log(data, "data")
  return <></>
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
