import { create, get } from "ronin"
import { createServerFn } from "@tanstack/start"

export const $getUser = createServerFn({ method: "GET" })
  .validator((input: { telegramId: string }) => input)
  .handler(async ({ data }) => {
    const { telegramId } = data

    try {
      const user = await get.user.with({
        telegramId: telegramId,
      })
      console.log(user)
      return user
    } catch (e) {
      return null
    }
  })

export const $createUser = createServerFn({ method: "POST" })
  .validator((input: { telegramId: string }) => input)
  .handler(async ({ data }) => {
    const { telegramId } = data

    const user = await create.user.with({
      telegramId: telegramId,
    })
    console.log(user)
    return user
  })
