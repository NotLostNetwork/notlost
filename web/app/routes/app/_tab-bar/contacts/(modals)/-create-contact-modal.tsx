import {
  Button,
  Input,
  Spinner,
  TabsList,
  Tappable,
} from "@telegram-apps/telegram-ui"
import { useEffect, useState } from "react"
import Modal from "~/ui/modals/modal"
import Contact from "../-contact"
import { User as TelegramUser } from "@telegram-apps/sdk-react"
import { Icon24QR } from "@telegram-apps/telegram-ui/dist/icons/24/qr"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { AnimatePresence, motion } from "framer-motion"
import { $getTelegramUser } from "~/actions/telegram"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"
import {
  JazzAccount,
  RootUserProfile,
  JazzContact,
  JazzListOfTags,
} from "~/lib/jazz/schema"
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem"
import TagIcon from "@/assets/icons/tag.svg?react"
import LinkIcon from "@/assets/icons/link.svg?react"

const CreateContactModal = ({
  isOpen,
  closeModal,
  onClose,
}: {
  isOpen: boolean
  closeModal: () => void
  onClose: () => void
}) => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [step, setStep] = useState(0)

  const [telegramUserValue, setTelegramUserValue] = useState("")
  const [telegramUserInputFocused, setTelegramUserInputFocused] =
    useState(false)
  const [tagsValue, setTagsValue] = useState("")
  const tags = tagsValue.split(" ").filter((tag) => tag.trim())

  const [descriptionValue, setDescriptionValue] = useState("")
  const [topicValue, setTopicValue] = useState("")

  const [telegramUserSearch, setTelegramUserSearch] =
    useState<TelegramUser | null>(null)
  const [telegramUserSearchLoading, setTelegramUserSearchLoading] =
    useState(false)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)

  const telegramUserInputError =
    telegramUserValue.length > 0 && !telegramUserSearch && !telegramUser

  useEffect(() => {
    setTelegramUserSearch(null)
    setTelegramUserSearchLoading(true)
    $getTelegramUser({ data: telegramUserValue })
      .then((res) => {
        if (res && res[0]) {
          setTelegramUserSearch(res[0] as TelegramUser)
        }
      })
      .finally(() => {
        setTelegramUserSearchLoading(false)
      })
  }, [telegramUserValue])

  const createNewContact = () => {
    if (profile) {
      profile.contacts!.push(
        JazzContact.create(
          {
            username: telegramUser!.username!,
            firstName: telegramUser?.firstName!,
            lastName: telegramUser?.lastName!,
            topic: topicValue,
            description: descriptionValue,
            tags: JazzListOfTags.create(tags, { owner: profile._owner }),
          },
          { owner: profile._owner },
        ),
      )
      setTelegramUser(null)
      setStep(0)
      setTelegramUserValue("")
      setTagsValue("")
      setDescriptionValue("")
      setTopicValue("")
      closeModal()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"New contact"}>
      <div className="space-y-2">
        <div
          className={`transition-all duration-500 ease-in-out mb-6 overflow-hidden -ml-4 -mr-4 ${
            telegramUser ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {telegramUser && (
            <Contact
              withActions={false}
              contact={
                {
                  username: telegramUser.username!,
                  topic: topicValue,
                  firstName: telegramUser.firstName,
                  tags: JazzListOfTags.create(tags, { owner: profile!._owner }),
                } as JazzContact
              }
            />
          )}
        </div>
        {step === 0 && (
          <div className="relative z-10">
            <Input
              autoFocus={isOpen}
              onFocus={() => setTelegramUserInputFocused(true)}
              onBlur={() => setTelegramUserInputFocused(false)}
              className=" p-0 text-white bg-gray-800"
              style={{ color: "white" }}
              status={
                telegramUserValue.length > 0 &&
                !telegramUserSearch &&
                !telegramUser
                  ? "error"
                  : telegramUserInputFocused
                    ? "focused"
                    : "default"
              }
              type="text"
              header="Telegram username"
              value={telegramUserValue}
              before={<div className="text-gray-500">@</div>}
              after={
                <AnimatePresence mode="wait">
                  {telegramUserValue ? (
                    <Tappable
                      key="cancel"
                      Component="div"
                      style={{
                        display: "flex",
                        opacity: telegramUserInputFocused ? "1" : "0",
                      }}
                      onClick={() => {
                        setTelegramUserValue("")
                        setTelegramUser(null)
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      >
                        <Icon16Cancel />
                      </motion.div>
                    </Tappable>
                  ) : (
                    <Tappable
                      key="qr"
                      Component="div"
                      style={{ display: "flex" }}
                      onClick={() => setTelegramUserValue("")}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      >
                        <Icon24QR />
                      </motion.div>
                    </Tappable>
                  )}
                </AnimatePresence>
              }
              onChange={(e) => setTelegramUserValue(e.target.value)}
            />
            {telegramUserSearch && (
              <div
                className="absolute -bottom-2  translate-y-full w-full z-20 backdrop-blur-xl rounded-xl border-primary border-2 shadow-2xl"
                onClick={() => {
                  setTelegramUser(telegramUserSearch)
                  setStep(1)
                  setTelegramUserSearch(null)
                }}
              >
                <div className="pointer-events-none border-b-[1px] border-primary">
                  <Contact
                    contact={
                      {
                        username: telegramUserSearch.username!,
                        firstName: telegramUserSearch.firstName,
                        tags: JazzListOfTags.create(tags, {
                          owner: profile!._owner,
                        }),
                        topic: topicValue,
                      } as JazzContact
                    }
                  />
                </div>
              </div>
            )}
            <div
              className={`absolute top-[9px] right-[12px] transition-all duration-100 ease-in-out bg-gray-800 pointer-events-none ${telegramUserSearchLoading ? "opacity-100 h-6" : "opacity-0 h-0"}`}
            >
              <Spinner size="s" />
            </div>
          </div>
        )}

        {step === 1 && (
          <Input
            autoFocus={true}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            header="Tags(s)"
            placeholder="Skill, job..."
            value={tagsValue}
            onChange={(e) => setTagsValue(e.target.value)}
          />
        )}

        {step === 2 && (
          <Input
            autoFocus={true}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            header="Topic"
            placeholder="Event, place, city..."
            value={topicValue}
            onChange={(e) => setTopicValue(e.target.value)}
          />
        )}
        {!telegramUser && (
          <div className="pt-2">
            <Button stretched={true} disabled={true}>
              Add from my dialogs
            </Button>
          </div>
        )}
        <div
          style={
            telegramUser
              ? { overflow: "visible", height: "100%" }
              : { overflow: "hidden", height: 0 }
          }
          className="w-full px-2 transition-all duration-300 ease-in-out"
        >
          <TabsList>
            <TabsItem onClick={() => setStep(0)} selected={step === 0}>
              @
            </TabsItem>
            <TabsItem onClick={() => setStep(1)} selected={step === 1}>
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 text-center">
                  <TagIcon />
                </div>
              </div>
            </TabsItem>
            <TabsItem onClick={() => setStep(2)} selected={step === 2}>
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 text-center">
                  <LinkIcon />
                </div>
              </div>
            </TabsItem>
          </TabsList>
        </div>

        <div className="pt-2 space-y-2">
          <Button
            stretched={true}
            onClick={createNewContact}
            disabled={
              telegramUserInputError ||
              telegramUserValue.length < 1 ||
              telegramUserSearch !== null
            }
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateContactModal
