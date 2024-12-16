import { createFileRoute } from "@tanstack/react-router"
import TgSignIn from "~/pages/onboarding/tg-sign-in"

export const Route = createFileRoute("/app/tg-sign-in")({
  component: TgSignIn,
})
