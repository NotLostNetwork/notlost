import { createServerFn } from '@tanstack/start'
import { get, create } from 'ronin'

export const $getContactsForUser = createServerFn({ method: 'GET' })
  .validator((input: { telegramId: string }) => input)
  .handler(async ({ data }) => {
    const { telegramId } = data
    const user = await get.user.with({
      telegramId: telegramId,
    })
    if (!user) throw new Error('User not found')
    const contactsOfUser = await get.contacts.with({
      createdBy: user.id,
    })
    return contactsOfUser
  })

export const $getUser = createServerFn({ method: 'GET' })
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

export const $createUser = createServerFn({ method: 'POST' })
  .validator((input: { telegramId: string }) => input)
  .handler(async ({ data }) => {
    const { telegramId } = data

    const user = await create.user.with({
      telegramId: telegramId,
    })
    console.log(user)
    return user
  })
