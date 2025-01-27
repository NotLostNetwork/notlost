import { JazzDialog, JazzListOfDialogs, RootUserProfile } from "../schema"

export const jazzRemoveDialog = (
  jazzProfile: RootUserProfile,
  dialog: JazzDialog,
) => {
  jazzProfile.folders?.forEach((folder) => {
    if (folder) {
      const filteredDialogs = folder.dialogs!.filter((d) => d?.id !== dialog.id)
      folder.dialogs! = JazzListOfDialogs.create(filteredDialogs, {
        owner: jazzProfile._owner,
      })
    }
  })
}
