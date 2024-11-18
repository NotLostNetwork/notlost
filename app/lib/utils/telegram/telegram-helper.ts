import {getCachedAvatar, setCachedAvatar} from "@/lib/utils/local-db";
import TelegramApiClient from "@/lib/utils/telegram/telegram-api-client";

class TelegramHelper {

  getProfileAvatar = async (username: string): Promise<string> => {
    const cachedAvatar = await getCachedAvatar(username);

    if (cachedAvatar) {
      return URL.createObjectURL(cachedAvatar);
    } else {
      const avatarBuffer = await TelegramApiClient.getInstance().getPhoto(username)
      await setCachedAvatar(username, avatarBuffer);

      const avatarBlob = await getCachedAvatar(username)
      return URL.createObjectURL(avatarBlob!);
    }
  }

}

export default new TelegramHelper();