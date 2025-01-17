import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { Route as ContactsRoute } from "@/routes/app/_tab-bar/contacts"
import { useLaunchParams } from "@telegram-apps/sdk-react"

type DemoAuthState = (
  | {
      state: "uninitialized"
    }
  | {
      state: "loading"
    }
  | {
      state: "ready"
      existingUsers: string[]
      signUp: (username: string) => void
      logInAs: (existingUser: string) => void
    }
  | {
      state: "signedIn"
      logOut: () => void
    }
) & {
  errors: string[]
}

export function AutoSignIn({ state }: { state: DemoAuthState }) {
  if (!state) return

  const navigate = useNavigate()
  const lp = useLaunchParams()

  useEffect(() => {
    if (state.state === "ready") {
      state.signUp(
        lp.initData?.user?.username! || lp.initData?.user?.id.toString()!,
      )
      navigate({ to: ContactsRoute.to })
    }
  }, [state])

  if (state.state === "loading") return <div>Loading</div>
}

export const Route = createFileRoute("/app/auto-sign-in-jazz")({
  component: AutoSignIn,
})
