import { Button, Input } from "@telegram-apps/telegram-ui"
import { useState } from "react"
import { $sendCode, $signIn } from "~/actions/telegram"

const TgSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneCode, setPhoneCode] = useState("")
  const [password, setPassword] = useState("")

  const sendCode = () => {
    $sendCode({ data: phoneNumber })
  }

  const signIn = async () => {
    const res = await $signIn({
      data: {
        phone: phoneNumber,
        phoneCode,
        password,
      },
    })
    console.log(res)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="space-y-4 min-w-48">
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: "white" }}
          type="text"
          header="Phone number"
          placeholder="123 456 789"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          before={<div>+</div>}
        />
        <Button stretched={true} onClick={sendCode}>
          Send code
        </Button>
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: "white" }}
          type="text"
          header="Recieved code"
          placeholder="12345"
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
        />
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: "white" }}
          type="password"
          header="Telegram password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="h-8"></div>
        <Button
          onClick={signIn}
          className="mt-8"
          disabled={phoneCode.length === 0}
          stretched={true}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default TgSignIn
