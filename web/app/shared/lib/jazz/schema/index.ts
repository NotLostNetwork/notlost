import { CoMap, co, Account, Profile, CoList } from "jazz-tools"

// TODO: check if this is valid for jazz, maybe something is off
// here is how we see jazz working with NotLost
// user loads the mini app, we get their telegram id
// we create jazz account with telegram id
// we create jazz account root with empty contacts (TODO: what is diff between root and just account?)
// then user can create contacts and add them to the root

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

// account root is an app-specific per-user private `CoMap`
// where you can store top-level objects for that user
export class JazzNotLostAccountRoot extends CoMap {}

// export class JazzNotLostAccount extends Account {
//   profile = co.ref(Profile)
//   // root = co.ref(TodoAccountRoot)

//   /** The account migration is run on account creation and on every log-in.
//    *  You can use it to set up the account root and any other initial CoValues you need.
//    */
//   migrate(this: TodoAccount, creationProps?: { name: string }) {
//     super.migrate(creationProps)
//     if (!this._refs.root) {
//       this.root = TodoAccountRoot.create(
//         {
//           projects: ListOfProjects.create([], { owner: this }),
//         },
//         { owner: this },
//       )
//     }
//   }
// }
