import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button, Input } from "@telegram-apps/telegram-ui"
import { useState } from "react"
import Modal from "~/ui/modals/modal"
import TgWallpaper from "~/ui/tg-wallpaper"
import { Route as ContactsRoute } from "@/routes/app/_tab-bar/contacts"

export function BetaTest() {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  const [invalidPassword, setInvalidPassword] = useState(false)

  const navigate = useNavigate()

  const validate = async () => {
    const validated = true
    if (!validated) {
      setInvalidPassword(true)
    } else {
      localStorage.setItem("betaTestPassword", passwordValue)
      navigate({ to: ContactsRoute.to })
      // remove reload after finding a fix
      // window.location.reload()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen">
      <div className="h-screen absolute">
        <TgWallpaper />
      </div>
      <div className="text-2xl font-bold">Welcome to NotLost</div>
      <div className="text-center mt-8">
        Currently we are on closed beta test, come back soon 🙂
      </div>
      <div className="mt-8">Are you a beta tester?</div>
      <Button onClick={() => setPasswordModalOpen(true)} className="mt-4">
        Enter beta test password
      </Button>
      <div className="mt-8">Wanna participate in a beta test?</div>
      <Button
        className="mt-4"
        onClick={() => window.open("https://t.me/shestaya_liniya")}
      >
        Request beta test access
      </Button>

      <Modal
        isOpen={passwordModalOpen}
        title="Enter password"
        onClose={() => setPasswordModalOpen(false)}
      >
        <Input
          className="text-white mt-4"
          status={invalidPassword ? "error" : "default"}
          header={"Password"}
          style={{ color: "white" }}
          type="text"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <Button
          onClick={validate}
          stretched={true}
          disabled={passwordValue.length < 1}
          className="mt-4"
        >
          Enter
        </Button>
      </Modal>
    </div>
  )
}

export const Route = createFileRoute("/app/closed-beta")({
  component: BetaTest,
})
