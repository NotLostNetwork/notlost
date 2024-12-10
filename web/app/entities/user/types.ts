import { UserContact } from "./user-contact/interface"

export interface User {
  username: string
  telegramId: number
  contacts: UserContact[]
}
