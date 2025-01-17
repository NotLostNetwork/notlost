import { createFileRoute } from "@tanstack/react-router"
import TgWallpaper from "~/ui/tg-wallpaper"
import tonkeeperBg from "@/assets/tonkeeper-bg-3.png"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzEvent,
  JazzListOfParticipants,
  JazzListOfParticipantTags,
  JazzParticipant,
} from "~/lib/jazz/schema"
import { Group, ID } from "jazz-tools"
import { AnimatePresence, motion } from "framer-motion"
import { Button, Input, Tappable } from "@telegram-apps/telegram-ui"
import { useLaunchParams } from "@telegram-apps/sdk-react"
import Modal from "~/ui/modals/modal"
import { useEffect, useRef, useState } from "react"
import Contact from "../graph/-contact"
import { AboveKeyboardModal } from "~/ui/modals/above-keyboard-modal"
import { Icon28AddCircle } from "@telegram-apps/telegram-ui/dist/icons/28/add_circle"

function RouteComponent() {
  const { me } = useAccount()
  const lp = useLaunchParams()

  const group = Group.create({ owner: me })
  group.addMember("everyone", "writer")

  const jazzEvent = useCoState(
    JazzEvent,
    "co_zCv49eqnJvGLHPyR6kizpMZ1stL" as ID<JazzEvent>,
  )

  const [signInModalOpen, setSignInModalOpen] = useState(false)

  /*   const createEvent = () => {
    const group = Group.create({ owner: me })
    group.addMember("everyone", "writer")
    const jazzEvent = JazzEvent.create(
      {
        participants: JazzListOfParticipants.create([], { owner: group }),
      },
      { owner: group },
    )
  } */

  const [inputValues, setInputValues] = useState({
    tag: "",
    description: "",
  })
  const [tags, setTags] = useState<string[]>([])
  const [description, setDescription] = useState("")

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [focused, setFocused] = useState(false)

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.relatedTarget === null) {
      window.scrollTo(0, 0)
      inputRef.current?.focus()
    }
  }

  const disableEditModeOnEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      setSignInModalOpen(false)
      setFocused(false)
    }
  }

  const removeParticipant = () => {
    if (jazzEvent) {
      const filteredParticipants = jazzEvent.participants!.filter(
        (p) => p?.username !== "test",
      )
      jazzEvent.participants! = JazzListOfParticipants.create(
        filteredParticipants,
        {
          owner: group,
        },
      )
    }
  }

  useEffect(() => {
    if (
      jazzEvent &&
      !jazzEvent.participants?.find(
        (p) => p?.username === lp.initData?.user?.username,
      )
    ) {
      setSignInModalOpen(true)
      setFocused(true)
    }
  }, [jazzEvent])

  if (!jazzEvent) return

  const addParticipant = () => {
    removeParticipant()
    if (jazzEvent) {
      jazzEvent.participants?.push(
        JazzParticipant.create(
          {
            username: lp.initData?.user?.username!,
            firstName: lp.initData?.user?.firstName!,
            tags: JazzListOfParticipantTags.create(tags, { owner: group }),
            description: inputValues.description,
          },
          { owner: group },
        ),
      )
    }
  }

  return (
    <div className="h-full">
      <div>
        <TgWallpaper opacity={0.5} />
      </div>
      <motion.div
        className="h-full p-2"
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "unset" }}
        exit={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-primary p-4 h-full border-[1px] border-primary rounded-xl">
          <img
            src={tonkeeperBg}
            className="w-full rounded-xl h-40 object-cover"
          />
          <div className="text-2xl text-center text-link font-semibold mt-6">
            Tonkeeper Native App
          </div>
          <div className="text-hint text-xs mt-4">
            The non-custodial TON wallet Tonkeeper is now available as native
            applications for iOS and Android. Using the wallet has become even
            faster, more convenient, and more secure.
          </div>
          {jazzEvent.participants?.map((p) => {
            if (!p) return
            return (
              <Contact
                username={p.username!}
                firstName={p.firstName!}
                selectedTags={p.tags?.map((tag) => tag.toString())}
                addContact={() => {}}
                topic={null}
                addButton={false}
                description={p.description}
              />
            )
          })}
        </div>
      </motion.div>

      {signInModalOpen && (
        <AboveKeyboardModal
          isOpen={signInModalOpen}
          onClose={() => setSignInModalOpen(false)}
          focused={focused}
          showGraph={false}
        >
          <div className="bg-secondary px-2 py-1 relative ">
            <div className="text-center mb-2">Create participant card</div>
            <div className="text-xs text-center text-hint">
              This information will help other people on the event to know more
              about you{" "}
            </div>
            <Contact
              username={lp.initData?.user?.username!}
              firstName={lp.initData?.user?.firstName!}
              selectedTags={tags}
              addContact={() => {}}
              topic={null}
              addButton={false}
              description={inputValues.description}
            />
            <div className="px-4">
              <Input
                ref={inputRef}
                autoFocus={true}
                className="text-white bg-primary flex-1 mb-4"
                style={{ color: "white" }}
                type="text"
                onFocus={() => {
                  setFocused(true)
                  window.scrollTo(0, 0)
                }}
                onBlur={handleBlur}
                onKeyDown={disableEditModeOnEnter}
                placeholder="Company, role, skill..."
                value={inputValues.tag}
                onChange={(e) =>
                  setInputValues((prev) => ({
                    ...prev,
                    tag: e.target.value,
                  }))
                }
                after={
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                    >
                      <Tappable
                        className="h-6 absolute w-6 -top-[2px] right-0 rounded-full"
                        onClick={() => {
                          setTags((prev) => [...prev, inputValues.tag])
                          setInputValues((prev) => ({ ...prev, tag: "" }))
                        }}
                      >
                        <Icon28AddCircle />
                      </Tappable>
                    </motion.div>
                  </AnimatePresence>
                }
              />
              <Input
                ref={inputRef}
                autoFocus={true}
                className="text-white bg-primary mb-8"
                style={{ color: "white" }}
                type="text"
                onFocus={() => {
                  setFocused(true)
                  window.scrollTo(0, 0)
                }}
                onBlur={handleBlur}
                onKeyDown={disableEditModeOnEnter}
                placeholder="Motivation for the event"
                value={inputValues.description}
                onChange={(e) =>
                  setInputValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <Button stretched={true} onClick={addParticipant}>
                Create
              </Button>
            </div>
          </div>
        </AboveKeyboardModal>
      )}
    </div>
  )
}

export const Route = createFileRoute("/app/_tab-bar/events/event")({
  component: RouteComponent,
})
