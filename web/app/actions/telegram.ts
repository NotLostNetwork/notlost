import { createServerFn } from "@tanstack/start"
import TelegramApiClient from "~/shared/lib/telegram/api/telegram-api-client"

const API_ID = Number(process.env.TELEGRAM_API_ID)
const API_HASH = process.env.TELEGRAM_API_HASH

const client = TelegramApiClient.getInstance(API_ID, API_HASH!)

export const $getTelegramPhoto = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return await client.getPhoto(ctx.data)
  })

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
    // TODO: need to store client.getSession()
    return res
  })

interface SignInData {
  phone: string
  phoneCode: string
  password: string
}
