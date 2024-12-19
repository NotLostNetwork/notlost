import { $getTelegramPhoto } from "~/actions/telegram"
import { getCachedAvatar, setCachedAvatar } from "../../utils/local-db"
import shestayaLiniyaAvatar from "~/shared/assets/trialAvatars/shestaya_liniya.jpeg"
import piraJokeAvatar from "~/shared/assets/trialAvatars/pirajoke.jpeg"
import nikiviAvatar from "~/shared/assets/trialAvatars/nikivi.jpeg"
import skywlkAvatar from "~/shared/assets/trialAvatars/sky_wlk.jpeg"
import vladbyelikAvatar from "~/shared/assets/trialAvatars/vladbyelik.jpeg"
import notLostBotAvatar from "~/shared/assets/trialAvatars/not_lost_bot.jpeg"

class TelegramHelper {
  private trialUsernames = ['shestaya_liniya', 'PiraJoke', 'nikivi', 'skywl_k', 'vladbyelik']
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
      try {
        const avatarBufferRes = await $getTelegramPhoto({ data: username })
        await setCachedAvatar(username, avatarBufferRes.data)
      } catch(e) {
        if (Object.values(TrialUsernames).includes(username as TrialUsernames)) {
          switch(username) {
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
          }
        }
      }

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

enum TrialUsernames {
  ShestayaLiniya = "shestaya_liniya",
  PiraJoke = "PiraJoke",
  Nikivi = "nikivi",
  SkywlK = "skywl_k",
  VladByelik = "vladbyelik",
  NotLostBot = "not_lost_bot"
}

export default new TelegramHelper()
