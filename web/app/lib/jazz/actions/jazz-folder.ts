import { DialogData } from "~/actions/telegram"
import {
  JazzDialog,
  JazzFolder,
  JazzListOfDialogs,
  JazzListOfFolders,
  RootUserProfile,
} from "../schema"

export const jazzCreateNewFolder = (
  jazzProfile: RootUserProfile,
  title: string,
) => {
  jazzProfile.folders?.push(
    JazzFolder.create(
      {
        title,
        dialogs: JazzListOfDialogs.create([], { owner: jazzProfile._owner }),
      },
      { owner: jazzProfile._owner },
    ),
  )
}

export const jazzDeleteFolder = (
  jazzProfile: RootUserProfile,
  folder: JazzFolder,
) => {
  if (jazzProfile) {
    const filteredFolders = jazzProfile.folders?.filter(
      (f) => f?.id !== folder.id,
    )
    if (filteredFolders) {
      jazzProfile.folders = JazzListOfFolders.create(filteredFolders, {
        owner: jazzProfile._owner,
      })
    }
  }
}

export const jazzAddDialogToFolder = (
  jazzProfile: RootUserProfile | null | undefined,
  folder: JazzFolder,
  dialog: DialogData,
) => {
  if (jazzProfile) {
    folder.dialogs?.push(
      JazzDialog.create(
        { name: dialog.name, username: dialog.username || "No username" },
        { owner: jazzProfile._owner },
      ),
    )
  }
}
