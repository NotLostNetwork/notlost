import { CoMap, co, Account, Profile, CoList } from "jazz-tools"

// User schema

// telegramId: number
// username: string
// firstName: string
// lastName: string
// telegramSync: boolean
// contacts: Contact[]

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

// export class Product extends CoMap {
//   name = co.string
//   description = co.string
//   priceInUsd = co.number
//   publishedAt = co.boolean
//   approved = co.boolean
//   featured = co.boolean
// }

// export class ListOfProducts extends CoList.Of(co.ref(Product)) {}

// export class MainAccountRoot extends CoMap {
//   products = co.ref(ListOfProducts)
// }

// export class MainAccount extends Account {
//   profile = co.ref(Profile)
//   root = co.ref(MainAccountRoot)

//   migrate(this: MainAccount, creationProps?: { name: string }) {
//     super.migrate(creationProps)
//     if (!this._refs.root) {
//       this.root = MainAccountRoot.create(
//         {
//           products: ListOfProducts.create([], { owner: this }),
//         },
//         { owner: this },
//       )
//     }
//   }
// }
