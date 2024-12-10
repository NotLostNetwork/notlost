import { createServerFn } from '@tanstack/start'
import { StringSession } from 'telegram/sessions'
import TelegramApiClient from '~/shared/lib/telegram/api/telegram-api-client'

const SESSION = new StringSession(process.env.TELEGRAM_SESSION)
const API_ID = Number(process.env.TELEGRAM_API_ID)
const API_HASH = process.env.TELEGRAM_API_HASH

const client = TelegramApiClient.getInstance(SESSION, API_ID, API_HASH!)

export const $getTelegramPhoto = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return await client.getPhoto(ctx.data)
  })

export const $getTelegramUser = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return await client.getUserByUsername(ctx.data)
  })
