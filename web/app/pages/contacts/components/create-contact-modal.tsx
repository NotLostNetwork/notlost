import { Button, Input, Tappable } from "@telegram-apps/telegram-ui"
import { useEffect, useState } from "react"
import { $getTelegramUser } from "~/actions/telegram"
import Modal from "~/shared/ui/modals/modal"
import Contact from "./contact"
import { User as TelegramUser } from "@telegram-apps/sdk-react"
import { Icon24QR } from "@telegram-apps/telegram-ui/dist/icons/24/qr"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { AnimatePresence, motion } from "framer-motion"

const CreateContactModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [telegramUserValue, setTelegramValue] = useState("")
  const [telegramUserInputFocused, setTelegramUserInputFocused] =
    useState(false)
  const [tagsValue, setTagsValue] = useState("")
  const [descriptionValue, setDescriptionValue] = useState("")
  const [topicValue, setTopicValue] = useState("")

  const [telegramUserSearch, setTelegramUserSearch] =
    useState<TelegramUser | null>(null)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    setTelegramUserSearch(null)
    $getTelegramUser({ data: telegramUserValue.replace(/@/g, "") }).then(
      (res) => {
        if (res[0]) {
          setTelegramUserSearch(res[0] as TelegramUser)
        }
      }
    )
  }, [telegramUserValue])

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
              node={{
                username: telegramUser.username!,
                id: telegramUser.firstName,
                group: 1,
                tags: tagsValue
                  .split(" ")
                  .filter((tag) => tag.trim())
                  .map((tag) => ({ title: tag })),
                topic: topicValue,
                createdAt: new Date(),
              }}
            />
          )}
        </div>
        <div className="relative z-10">
          <Input
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
            placeholder="durov"
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
                      setTelegramValue("")
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
                    onClick={() => setTelegramValue("")}
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
            onChange={(e) => setTelegramValue(e.target.value)}
          />
          {telegramUserSearch && (
            <div
              className="absolute -bottom-2  translate-y-full w-full z-20 backdrop-blur-xl rounded-xl border-primary border-2 shadow-2xl"
              onClick={() => {
                setTelegramUser(telegramUserSearch)
                setTelegramUserSearch(null)
              }}
            >
              <Contact
                node={{
                  username: telegramUserSearch.username!,
                  id: telegramUserSearch.firstName,
                  group: 1,
                  tags: tagsValue
                    .split(" ")
                    .filter((tag) => tag.trim())
                    .map((tag) => ({ title: tag })),
                  topic: topicValue,
                  createdAt: new Date(),
                }}
              />
            </div>
          )}
        </div>

        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: "white" }}
          type="text"
          header="Description"
          placeholder="CEO of Telegram"
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.target.value)}
        />
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: "white" }}
          type="text"
          header="Tag(s)"
          placeholder="ceo telegram sport"
          value={tagsValue}
          onChange={(e) => setTagsValue(e.target.value)}
        />
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: "white" }}
          type="text"
          header="Topic"
          placeholder="Telegram contest 2024"
          value={topicValue}
          onChange={(e) => setTopicValue(e.target.value)}
        />
        <div className="pt-8 space-y-2">
          <Button stretched={true}>Create</Button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateContactModal
