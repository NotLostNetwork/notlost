import { createServerFn } from "@tanstack/start"
import { setCookie } from "vinxi/http"
import TelegramApiClient from "~/shared/lib/telegram/api/telegram-api-client"
import { COOKIE, getAndDecodeCookie } from "~/shared/lib/utils/funcs/get-cookie"

const API_ID = Number(process.env.TELEGRAM_API_ID)
const API_HASH = process.env.TELEGRAM_API_HASH
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const STRING_SESSION = getAndDecodeCookie(COOKIE.TELEGRAM_STRING_SESSION)

const client = TelegramApiClient.getInstance(
  API_ID,
  API_HASH!,
  STRING_SESSION || "",
  BOT_TOKEN!
)

export const $getTelegramUser = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return await client.getUserByUsername(ctx.data)
  })

export const $sendCode = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const res = await client.sendSignInCode(ctx.data)
    return res
  })

export const $signIn = createServerFn({ method: "GET" })
  .validator((data: SignInData) => data)
  .handler(async (ctx) => {
    console.log(ctx.data)
    const res = await client.signIn(
      ctx.data.phone,
      ctx.data.password,
      ctx.data.phoneCode
    )
    setCookie(COOKIE.TELEGRAM_STRING_SESSION, client.getSession(), {
      path: "/",
      maxAge: 90 * 24 * 60 * 60,
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    })
    return res
  })

interface SignInData {
  phone: string
  phoneCode: string
  password: string
}
