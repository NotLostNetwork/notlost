import { createServerFn } from "@tanstack/start"
import { get } from "ronin"

export const $getContactsForUser = createServerFn({ method: "GET" })
  .validator((input: { telegramId: string }) => input)
  .handler(async ({ data }) => {
    const { telegramId } = data
    const user = await get.user.with({
      telegramId: telegramId,
    })
    if (!user) throw new Error("User not found")
    const contactsOfUser = await get.contacts.with({
      createdBy: user.id,
    })
    return contactsOfUser
  })
