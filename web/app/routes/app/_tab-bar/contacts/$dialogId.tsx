import { createFileRoute, useRouter } from "@tanstack/react-router"
import WebApp from "@twa-dev/sdk"
import { Route as ContactsRoute } from "@/routes/app/_tab-bar/contacts/index"
import { useCoState } from "~/lib/jazz/jazz-provider"
import { JazzDialog } from "~/lib/jazz/schema"
import { ID } from "jazz-tools"

function RouteComponent() {
  const { dialogId } = Route.useParams()
  const jazzDialog = useCoState(JazzDialog, dialogId as ID<JazzDialog>)

  const router = useRouter()

  const backButton = WebApp.BackButton
  backButton.show()
  backButton.onClick(() => {
    router.navigate({ to: ContactsRoute.to })
  })

  return <div>Post ID: {jazzDialog?.username}</div>
}

export const Route = createFileRoute("/app/_tab-bar/contacts/$dialogId")({
  component: RouteComponent,
})
