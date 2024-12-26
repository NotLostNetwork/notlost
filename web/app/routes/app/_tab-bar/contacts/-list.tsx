import { AnimatePresence, motion } from "framer-motion"

import utyaLoading from "~/assets/utya-loading.gif"

import { Button } from "@telegram-apps/telegram-ui"
import { GraphIcon } from "~/assets/icons/iconsAsComponent/graph-icon"

import TgWallpaper from "~/ui/tg-wallpaper"
import Contact from "./-contact"
import { Pencil } from "./-pencil"
import { JazzListOfContacts } from "~/lib/jazz/schema"

const ContactsList = ({
  filtersBlockHeight,
  data,
  toggleGraphMode,
}: {
  filtersBlockHeight: number
  data: JazzListOfContacts | undefined | null
  toggleGraphMode: () => void
}) => {
  let animationDelay = -0.05
  return (
    <div>
      <div className="h-screen absolute">
        <TgWallpaper opacity={0.1} withAccent={true} />
      </div>
      <div className="overflow-y-auto overscroll-none pb-20">
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

      {data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center pr-4 pl-4 top-0 mt-64">
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
      <div className="fixed bottom-20 left-6">
        <Button
          size={"s"}
          className={"rounded-full"}
          style={{ borderRadius: "50% !important" }}
          onClick={toggleGraphMode}
        >
          <div className="h-6 w-6">
            <GraphIcon color={"#fff"} />
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ContactsList
