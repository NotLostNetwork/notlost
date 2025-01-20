import {
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

export const jazzDeleteFolder = (jazzProfile: RootUserProfile, folder: JazzFolder) => {
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
