import { openDB } from "idb"

const DB_NAME = "idb"
const DB_VERSION = 1
const STORE_NAME = "cache"

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
        console.log(`Object store '${STORE_NAME}' created.`)
      }
    },
  })
}

export const destroyLocalDB = async () => {
  const db = await openDB(DB_NAME, 1)
  await db.clear(STORE_NAME)
  console.log(`All data in the store '${STORE_NAME}' has been cleared.`)
}

export const getCachedAvatar = async (
  username: string
): Promise<Blob | null> => {
  const db = await initDB()
  const base64Avatar = await db.get(STORE_NAME, `telegramAvatar@${username}`)
  if (base64Avatar) {
    return base64ToBlob(base64Avatar, "image/jpeg")
  }

  return null
}

export const setCachedAvatar = async (
  username: string,
  avatarBuffer: Buffer
) => {
  const db = await initDB()
  const base64Avatar = arrayBufferToBase64(avatarBuffer)
  await db.put(STORE_NAME, base64Avatar, `telegramAvatar@${username}`)
}

const base64ToBlob = (base64: string, mimeType: any) => {
  const byteChars = atob(base64)
  const byteNumbers = Array.from(byteChars, (char) => char.charCodeAt(0))
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

function arrayBufferToBase64(buffer: Buffer): string {
  let binary = ""
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
