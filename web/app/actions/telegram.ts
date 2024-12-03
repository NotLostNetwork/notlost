import { createServerFn } from "@tanstack/start"

export const $runOnServer = createServerFn({ method: "GET" }).handler(
  async () => {
    // ....
    // const SESSION = new StringSession(process.env.TELEGRAM_SESSION)
    // const API_ID = Number(process.env.TELEGRAM_API_ID)
    // const API_HASH = process.env.TELEGRAM_API_HASH
    // const client = new TelegramClient(SESSION, API_ID, API_HASH)
    // await client.connect()
    // console.log("Telegram client connected.")
  },
)
