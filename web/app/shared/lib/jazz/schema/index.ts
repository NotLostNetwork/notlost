import { CoMap, co, Account, Profile, CoList } from "jazz-tools"

class ListOfTags extends CoList.Of(co.string) {}
class Contact extends CoMap {
  username = co.string
  firstName = co.string
  lastName = co.string
  topic = co.string
  tags = co.ref(ListOfTags)
}
class ListOfContacts extends CoList.Of(co.ref(Contact)) {}

class UserProfile extends CoMap {
  telegramId = co.number
  username = co.string
  firstName = co.string
  lastName = co.string
  telegramSync = co.boolean // if true, app will use live tg contact to sync up
  contacts = co.ref(ListOfContacts)
}
