import { CoMap, co, Account, Profile, CoList } from "jazz-tools"

// TODO: check if this is valid for jazz, maybe something is off
// here is how we see jazz working with NotLost
// user loads the mini app, we get their telegram id
// this telegram id is validated through initData verfication provided by telegram itself
// we then create jazz account for that user with that unique telegram id
// this root acccount starts with an empty contacts list and some default values
// then user can create contacts and add them to the root, more later

class ListOfTags extends CoList.Of(co.string) {}
class Contact extends CoMap {
  username = co.string
  firstName = co.string
  lastName = co.string
  topic = co.string
  tags = co.ref(ListOfTags)
}
class ListOfContacts extends CoList.Of(co.ref(Contact)) {}

// account root is an app-specific per-user private `CoMap`
// where you can store top-level objects for that user
export class JazzNotLostAccountRoot extends CoMap {
  telegramId = co.number // unique id for the user (how auth is done kind of)
  contacts = co.ref(ListOfContacts)

  username = co.string
  firstName = co.string
  lastName = co.string
  telegramSync = co.boolean // if true, app will use live tg contact to sync up
}

export class JazzNotLostAccount extends Account {
  profile = co.ref(Profile)
  root = co.ref(JazzNotLostAccountRoot)

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  migrate(this: JazzNotLostAccount, creationProps?: { name: string }) {
    super.migrate(creationProps)
    if (!this._refs.root) {
      this.root = JazzNotLostAccountRoot.create(
        {
          // TODO: looks off, not sure what these values should be, especially telegramId
          contacts: ListOfContacts.create([], { owner: this }),
          telegramId: 0,
          username: "",
          firstName: "",
          lastName: "",
          telegramSync: false,
        },
        { owner: this },
      )
    }
  }
}
