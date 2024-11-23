import { getCachedAvatar, setCachedAvatar } from '~/lib/utils/local-db'
import TelegramApiClient from '~/lib/telegram/telegram-api-client'

class TelegramHelper {
  private sessionAvatarBlobs = new Map<string, string>()

  getProfileAvatar = async (username: string): Promise<string> => {
    let avatarBlobUrl
    const sessionAvatarBlobUrl = this.getSessionBlob(username)

    if (sessionAvatarBlobUrl) {
      return sessionAvatarBlobUrl
    }

    const cachedAvatar = await getCachedAvatar(username)

    if (cachedAvatar) {
      avatarBlobUrl = URL.createObjectURL(cachedAvatar)
    } else {
      const avatarBuffer =
        await TelegramApiClient.getInstance().getPhoto(username)
      await setCachedAvatar(username, avatarBuffer)

      const avatarBlob = await getCachedAvatar(username)
      avatarBlobUrl = URL.createObjectURL(avatarBlob!)
    }

    this.setSessionBlob(username, avatarBlobUrl)

    return avatarBlobUrl
  }

  private setSessionBlob = (key: string, blobUrl: string) => {
    this.sessionAvatarBlobs.set(key, blobUrl)
  }

  private getSessionBlob = (key: string): string | undefined => {
    return this.sessionAvatarBlobs.get(key)
  }
}

export default new TelegramHelper()
