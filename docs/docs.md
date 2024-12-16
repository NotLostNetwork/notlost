- to update types of ronin after schema changes, do `bun update @ronin-types/notlost`
  - this will not be needed soon though

## how to do referential data in RONIN

```js
import { get, create } from "ronin";

async function main() {
  // const nikitaUser = await create.user.with({
  //   telegramId: "",
  //   username: "",
  // })
  // console.log(nikitaUser)

  const nikitaUser = await get.user.with({
    telegramId: "",
  });
  if (!nikitaUser) throw new Error("User not found");
  console.log(nikitaUser);

  // const newContact = await create.contact.with({
  //   name: "Andrei",
  //   note: "great dev",
  //   createdBy: nikitaUser.id,
  // })
  // console.log(newContact)

  const contacts = await get.contacts.with({
    createdBy: nikitaUser.id,
  });
  console.log(contacts);

  // const nikitaUser = await create.user.with({
  //   telegramId: "",
  //   username: "",
  // })
  // console.log(nikitaUser)
}

main();
```
