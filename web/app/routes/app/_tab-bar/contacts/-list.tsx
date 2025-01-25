import TgWallpaper from "~/ui/tg-wallpaper"
import { Pencil } from "./-pencil"
import { JazzFolder } from "~/lib/jazz/schema"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { Suspense, useRef, useState } from "react"
import { AddFolder } from "./(dragables)/-add-folder"
import { useDragStore } from "~/lib/zustand-store/drag-store"
import {
  jazzAddDialogToFolder,
  jazzCreateNewFolder,
} from "~/lib/jazz/actions/jazz-folder"
import { Folder } from "./-folder"
import { useCoState } from "~/lib/jazz/jazz-provider"
import { ID } from "jazz-tools"

const ContactsList = () => {
  const jazzProfile = useJazzProfile()

  const { draggableItemType, draggableItem } = useDragStore()

  const [bg, setBg] = useState("bg-transparent")
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

  const jazzFolder = useCoState(JazzFolder, activeFolderId as ID<JazzFolder>)

  const addFolderDragBlock = useRef<HTMLDivElement | null>(null)
  const foldersRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (
      draggableItemType === "folder" &&
      isTouchOnBlockAndDragMode(addFolderDragBlock, touch)
    ) {
      setBg("bg-secondary")
    } else if (draggableItemType && isTouchOnAnyFolder(foldersRefs, touch)) {
      setActiveFolderId(isTouchOnAnyFolder(foldersRefs, touch))
    } else {
      setActiveFolderId(null)
      setBg("bg-transparent")
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (
      draggableItemType === "folder" &&
      isTouchOnBlockAndDragMode(addFolderDragBlock, touch)
    ) {
      createNewFolder("New folder")
    } else if (isTouchOnAnyFolder(foldersRefs, touch) && draggableItem) {
      if (jazzFolder) {
        jazzAddDialogToFolder(jazzProfile, jazzFolder, draggableItem)
        setActiveFolderId(null)
      }
    } else {
      setActiveFolderId(null)
      setBg("bg-transparent")
    }
  }

  const createNewFolder = (title: string) => {
    if (jazzProfile) {
      jazzCreateNewFolder(jazzProfile, title)
    }
  }

  console.log("render")

  return (
    <div onTouchMove={handleTouchMove} onTouchEnd={(e) => handleTouchEnd(e)}>
      <div className="overflow-y-auto overscroll-none pb-20">
        <AddFolder ref={addFolderDragBlock} bgColor={bg} />
        <Suspense fallback={<div>Loading...</div>}>
          {jazzProfile?.folders?.map((f) => (
            <div
              key={f && f.id}
              ref={(el) => f && (foldersRefs.current[f.id] = el)}
              className={
                f && activeFolderId === f.id
                  ? "bg-secondary bg-opacity-60"
                  : "bg-transparent"
              }
            >
              <Folder folder={f} />
            </div>
          ))}
        </Suspense>
      </div>
      <Pencil />
    </div>
  )
}

const isTouchOnBlockAndDragMode = (
  blockRef: React.RefObject<HTMLDivElement>,
  touchEvent: React.Touch,
) => {
  if (!blockRef.current) return false
  const rect = blockRef.current.getBoundingClientRect()
  return (
    touchEvent.clientX >= rect.left &&
    touchEvent.clientX <= rect.right &&
    touchEvent.clientY >= rect.top &&
    touchEvent.clientY <= rect.bottom
  )
}

const isTouchOnAnyFolder = (
  foldersRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>,
  touchEvent: React.Touch,
) => {
  for (const [folderId, folderRef] of Object.entries(foldersRefs.current)) {
    if (
      folderRef &&
      isTouchOnBlockAndDragMode({ current: folderRef }, touchEvent)
    ) {
      return folderId
    }
  }
  return null
}

export default ContactsList
