// telegram.ts

import { createServerFn } from "@tanstack/start"
import TelegramApiClient from "@/lib/telegram/api/telegram-api-client"
import { validate } from "@telegram-apps/init-data-node"

const API_ID = Number(process.env.TELEGRAM_API_ID)
const API_HASH = process.env.TELEGRAM_API_HASH
const STRING_SESSION = process.env.TELEGRAM_SESSION

const client = TelegramApiClient.getInstance(
  API_ID,
  API_HASH!,
  STRING_SESSION || "",
)

export const $getTelegramPhoto = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return await client.getPhoto(ctx.data)
  })

export const $getTelegramUser = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    console.log("here")
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
      ctx.data.phoneCode,
    )
    return res
  })

export const $validateInitData = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    validate(ctx.data, process.env.TELEGRAM_API_KEY!)
  })

export const $getMyDialogs = createServerFn({
  method: "GET",
}).handler(async (): Promise<DialogData[]> => {
  const res = await client.getDialogs()
  console.log(res)
  return res.map((dialog) => {
    const { unreadMentionsCount, name, unreadCount, entity } = dialog

    return {
      unreadCount,
      name,
      //@ts-ignore
      username: entity.username,
    }
  })
})

interface SignInData {
  phone: string
  phoneCode: string
  password: string
}

export interface DialogData {
  unreadCount: number
  name: string
  username: null | string
}
