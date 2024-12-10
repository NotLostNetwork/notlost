import { Api, TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"
import bigInt from "big-integer"
import Photo = Api.Photo
import { Buffer } from "buffer"

class TelegramApiClient {
  private static instance: TelegramApiClient

  private client: TelegramClient

  private avatarsQueue: (() => Promise<void>)[] = []
  private downloadedAvatars = 0
  private isProcessingInAvatarQueue = false
  private inFlightAvatarPromises: Map<string, Promise<Buffer>> = new Map()

  private constructor(
    session: StringSession,
    api_id: number,
    api_hash: string,
  ) {
    this.client = new TelegramClient(session, api_id, api_hash, {
      connectionRetries: 5,
    })
  }

  public async initialize(): Promise<void> {
    try {
      if (!this.client.connected) {
        await this.client.connect()
        console.log("Telegram client connected.")
      }
    } catch (error) {
      console.error("Failed to connect Telegram client:", error)
      throw error
    }
  }

  async getPhoto(username: string): Promise<Buffer> {
    if (this.inFlightAvatarPromises.has(username)) {
      return this.inFlightAvatarPromises.get(username)!
    }

    const avatarPromise = new Promise<Buffer>((resolve, reject) => {
      const task = async () => {
        try {
          await this.initialize()

          if (this.downloadedAvatars % 4 === 0 && this.downloadedAvatars !== 0)
            // TODO: sometime api return api rate limit exceed, catch time to wait before retry, 10 seconds is a default
            await new Promise((resolve) => setTimeout(resolve, 0))
          this.downloadedAvatars += 1

          const result = await this.client.invoke(
            new Api.photos.GetUserPhotos({
              userId: username,
            }),
          )

          const photo = result.photos[0] as Photo
          const fr = photo.fileReference

          const res = await this.client.downloadFile(
            new Api.InputPhotoFileLocation({
              id: photo.id,
              accessHash: photo.accessHash,
              fileReference: fr,
              thumbSize: "c",
            }),
            {
              dcId: photo.dcId,
              fileSize: bigInt(829542),
            },
          )

          if (Buffer.isBuffer(res)) {
            resolve(res)
          } else {
            throw new Error("Failed to download photo as a Buffer")
          }
        } catch (error) {
          reject(error)
        } finally {
          this.inFlightAvatarPromises.delete(username)
          this.processQueue()
        }
      }
      this.avatarsQueue.push(task)

      if (!this.isProcessingInAvatarQueue) {
        this.processQueue()
      }
    })

    this.inFlightAvatarPromises.set(username, avatarPromise)

    return avatarPromise
  }

  async getUserByUsername(username: string) {
    await this.initialize()
    const result = await this.client.invoke(
      new Api.users.GetUsers({
        id: [username],
      }),
    )
    return result
  }

  private async processQueue(): Promise<void> {
    if (this.avatarsQueue.length === 0) {
      this.isProcessingInAvatarQueue = false
      return
    }

    this.isProcessingInAvatarQueue = true
    const nextTask = this.avatarsQueue.shift()
    if (nextTask) {
      await nextTask()
    }
  }

  public static getInstance(
    session: StringSession,
    api_id: number,
    api_hash: string,
  ) {
    if (!TelegramApiClient.instance) {
      TelegramApiClient.instance = new TelegramApiClient(
        session,
        api_id,
        api_hash,
      )
    }
    return TelegramApiClient.instance
  }
}

export default TelegramApiClient
