import { CoMap, co, Account, Profile, CoList, ID } from "jazz-tools"

// TODO: check if this is valid for jazz, maybe something is off
// here is how we see jazz working with NotLost
// user loads the mini app, we get their telegram id
// this telegram id is validated through initData verfication provided by telegram itself
// we then create jazz account for that user with that unique telegram id
// this root acccount starts with an empty contacts list and some default values
// then user can create contacts and add them to the root, more later

export class JazzContact extends CoMap {
  username = co.string
  firstName = co.string
}
export class JazzTag extends CoMap {
  title = co.string
}
export class JazzTopic extends CoMap {
  title = co.string
}
export class JazzLink extends CoMap {
  source = co.string
  target = co.string
}
export class JazzListOfContacts extends CoList.Of(co.ref(JazzContact)) {}
export class JazzListOfTags extends CoList.Of(co.ref(JazzTag)) {}
export class JazzListOfTopics extends CoList.Of(co.ref(JazzTopic)) {}
export class JazzListOfLinks extends CoList.Of(co.ref(JazzLink)) {}

// account root is an app-specific per-user private `CoMap`
// where you can store top-level objects for that user
export class RootUserProfile extends Profile {
  telegramId = co.number // unique id for the user (how auth is done kind of)
  contacts = co.ref(JazzListOfContacts)
  tags = co.ref(JazzListOfTags)
  topics = co.ref(JazzListOfTopics)
  links = co.ref(JazzListOfLinks)

  username = co.string
  firstName = co.string
  lastName = co.string
  telegramSync = co.boolean // if true, app will use live tg contact to sync up
}

export class JazzAccount extends Account {
  profile = co.ref(RootUserProfile)

  /** The account migration is run on account creation and on every log-in.
   *  You can use it to set up the account root and any other initial CoValues you need.
   */
  async migrate(creationProps?: { name: string }) {
    super.migrate(creationProps)

    const profile = await RootUserProfile.load(
      this._refs.profile!.id as ID<RootUserProfile>,
      this,
      {},
    )

    if (!profile) {
      throw new Error("Account profile missing, not able to run the migration")
    }

    if (!profile._refs.contacts) {
      profile.contacts = JazzListOfContacts.create([], {
        owner: this.profile!._owner,
      })
    }

    if (!profile._refs.topics) {
      profile.topics = JazzListOfTopics.create([], {
        owner: this.profile!._owner,
      })
    }

    if (!profile._refs.tags) {
      profile.tags = JazzListOfTags.create([], {
        owner: this.profile!._owner,
      })
    }

    if (!profile._refs.links) {
      profile.links = JazzListOfLinks.create([], {
        owner: this.profile!._owner,
      })
    }
  }
}
