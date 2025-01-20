import { AnimatePresence, motion } from "framer-motion"
import utyaLoading from "~/assets/utya-loading.gif"
import TgWallpaper from "~/ui/tg-wallpaper"
import Contact from "./-contact"
import { Pencil } from "./-pencil"
import { JazzListOfContacts, RootUserProfile } from "~/lib/jazz/schema"
import { useJazzProfile } from "~/lib/jazz/hooks/use-jazz-profile"
import { useEffect, useRef, useState } from "react"
import { AddFolder } from "./(dragables)/-add-folder"
import { useDragStore } from "~/lib/zustand-store/drag-store"
import { jazzCreateNewFolder } from "~/lib/jazz/actions/jazz-folder"
import { Folder } from "./-folder"
import { Cell, IconContainer } from "@telegram-apps/telegram-ui"
import FolderIcon from "@/assets/icons/folder.svg?react"

const ContactsList = ({
  filtersBlockHeight,
  data,
}: {
  filtersBlockHeight: number
  data: JazzListOfContacts | undefined | null
  toggleGraphMode: () => void
}) => {
  let animationDelay = -0.05

  const jazzProfile = useJazzProfile()

  const { draggableItem } = useDragStore()

  const [bg, setBg] = useState("bg-transparent")
  const addFolderDragBlock = useRef<HTMLDivElement | null>(null)

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (
      draggableItem === "folder" &&
      isTouchOnBlockAndDragMode(addFolderDragBlock, touch)
    ) {
      setBg("bg-secondary")
    } else {
      setBg("bg-transparent")
      setShowFolder(false)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (
      draggableItem === "folder" &&
      isTouchOnBlockAndDragMode(addFolderDragBlock, touch)
    ) {
      createNewFolder("New folder")
    } else {
      setBg("bg-transparent")
    }
  }

  const createNewFolder = (title: string) => {
    if (jazzProfile) {
      jazzCreateNewFolder(jazzProfile, title)
    }
  }

  useEffect(() => {
    console.log(jazzProfile?.folders)
  }, [jazzProfile])

  const [showFolder, setShowFolder] = useState(false)

  return (
    <div onTouchMove={handleTouchMove} onTouchEnd={(e) => handleTouchEnd(e)}>
      <div className="h-screen absolute">
        <TgWallpaper opacity={0.1} withAccent={true} />
      </div>
      <div className="overflow-y-auto overscroll-none pb-20">
        <AddFolder ref={addFolderDragBlock} bgColor={bg} />
        {jazzProfile?.folders?.map((f) => <Folder folder={f} />)}
        {filtersBlockHeight > 0 &&
          data &&
          data.map((contact) => {
            if (!contact) return
            animationDelay += 0.05
            return (
              <AnimatePresence key={contact.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    damping: 50,
                    stiffness: 500,
                    delay: animationDelay,
                  }}
                >
                  <Contact contact={contact} />
                </motion.div>
              </AnimatePresence>
            )
          })}
      </div>
      {jazzProfile?.contacts === null ||
        (jazzProfile?.contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center pr-4 pl-4 top-0">
            <div className="mt-2 text-2xl font-medium"></div>
          </div>
        ))}

      {data &&
        jazzProfile?.contacts &&
        jazzProfile?.contacts.length > 0 &&
        data.length === 0 && (
          <div className="flex flex-col items-center justify-center pr-4 pl-4 top-0">
            <img
              src={utyaLoading}
              alt={"Utya sticker"}
              height={150}
              width={150}
            />
            <div className="mt-2 text-2xl font-medium">Nobody found</div>
            <div className="text-center mt-2 opacity-60">
              It's seems you don't have that person in your network.
            </div>
          </div>
        )}

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

export default ContactsList
