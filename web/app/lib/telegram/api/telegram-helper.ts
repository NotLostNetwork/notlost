import { getCachedAvatar, setCachedAvatar } from "../../utils/local-db"
import shestayaLiniyaAvatar from "~/assets/trialAvatars/shestaya_liniya.jpeg"
import piraJokeAvatar from "~/assets/trialAvatars/pirajoke.jpeg"
import nikiviAvatar from "~/assets/trialAvatars/nikivi.jpeg"
import skywlkAvatar from "~/assets/trialAvatars/sky_wlk.jpeg"
import vladbyelikAvatar from "~/assets/trialAvatars/vladbyelik.jpeg"
import notLostBotAvatar from "~/assets/trialAvatars/not_lost_bot.jpeg"
import { $getTelegramPhoto } from "./telegram-api-server"

class TelegramHelper {
  private sessionAvatarBlobs = new Map<string, string>()
  private downloadQueue = new Set<string>()

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
      if (this.downloadQueue.has(username)) {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            const completedBlob = this.getSessionBlob(username)
            if (completedBlob) {
              clearInterval(interval)
              resolve(completedBlob)
            }
          }, 100)
        })
      }

      try {
        this.downloadQueue.add(username)

        const avatarBufferRes = await $getTelegramPhoto({ data: username })
        await setCachedAvatar(username, avatarBufferRes.data)
      } catch (e) {
        if (
          Object.values(TrialUsernames).includes(username as TrialUsernames)
        ) {
          this.downloadQueue.delete(username)
          return this.getTrialAvatar(username)
        }
      } finally {
        this.downloadQueue.delete(username)
      }

      const avatarBlob = await getCachedAvatar(username)
      avatarBlobUrl = URL.createObjectURL(avatarBlob!)
    }

    this.setSessionBlob(username, avatarBlobUrl)

    return avatarBlobUrl
  }

  private getTrialAvatar(username: string): string {
    switch (username) {
      case TrialUsernames.ShestayaLiniya:
        return shestayaLiniyaAvatar
      case TrialUsernames.PiraJoke:
        return piraJokeAvatar
      case TrialUsernames.VladByelik:
        return vladbyelikAvatar
      case TrialUsernames.Nikivi:
        return nikiviAvatar
      case TrialUsernames.SkywlK:
        return skywlkAvatar
      case TrialUsernames.NotLostBot:
        return notLostBotAvatar
      default:
        throw new Error(`Trial avatar not found for username: ${username}`)
    }
  }

  private setSessionBlob = (key: string, blobUrl: string) => {
    this.sessionAvatarBlobs.set(key, blobUrl)
  }

  private getSessionBlob = (key: string): string | undefined => {
    return this.sessionAvatarBlobs.get(key)
  }
}

enum TrialUsernames {
  ShestayaLiniya = "shestaya_liniya",
  PiraJoke = "PiraJoke",
  Nikivi = "nikivi",
  SkywlK = "skywl_k",
  VladByelik = "vladbyelik",
  NotLostBot = "not_lost_bot",
}

export default new TelegramHelper()
