import { IDBCache } from '@instructure/idb-cache'
import { Buffer } from 'buffer'

const LocalDB = new IDBCache({
  cacheKey: import.meta.env.LOCAL_DB_CACHE_KEY,
  cacheBuster: 'unique-cache-buster', // Doubles as salt
  // debug?: boolean,
  // chunkSize?: number;
  // cleanupInterval?: number;
  // dbName?: string;
  // pbkdf2Iterations?: number;
  // gcTime?: number;
})

export const getCachedAvatar = async (
  username: string
): Promise<Blob | null> => {
  const base64Avatar = await LocalDB.getItem(`telegramAvatar${username}`)
  console.log(base64Avatar)
  if (base64Avatar) {
    return base64ToBlob(base64Avatar, 'image/jpeg')
  }

  return null
}

export const destroyLocalDB = () => {
  LocalDB.destroy()
}

export const removeItem = async (username: string): Promise<void> => {
  await LocalDB.removeItem(`telegramAvatar${username}`)
}

export const setCachedAvatar = async (
  username: string,
  avatarBuffer: Buffer
) => {
  console.log('SET AVATAR')
  const base64Avatar = arrayBufferToBase64(avatarBuffer)
  await LocalDB.setItem(`telegramAvatar${username}`, base64Avatar)
}

const base64ToBlob = (base64: string, mimeType: any) => {
  const byteChars = atob(base64)
  const byteNumbers = Array.from(byteChars, (char) => char.charCodeAt(0))
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

function arrayBufferToBase64(buffer: Buffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
