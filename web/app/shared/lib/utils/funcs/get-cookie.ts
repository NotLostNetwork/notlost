import { getCookie } from "vinxi/http"

export const getAndDecodeCookie = (key: string): string | null => {
  try {
    const cookie = getCookie(key)

    if (!cookie) return null

    return decodeURIComponent(cookie).replace(/"/g, "")
    
  } catch (e) {
    console.log(e)
  }

  return null
}
