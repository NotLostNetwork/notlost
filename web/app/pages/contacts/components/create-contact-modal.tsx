import { Button, Input, Tappable } from "@telegram-apps/telegram-ui"
import { useEffect, useState } from "react"
import { $getTelegramUser } from "~/actions/telegram"
import Modal from "~/shared/ui/modals/modal"
import Contact from "./contact"
import { User as TelegramUser } from "@telegram-apps/sdk-react"
import { Icon24QR } from "@telegram-apps/telegram-ui/dist/icons/24/qr"
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import { AnimatePresence, motion } from "framer-motion"
import { $getTelegramUserByUsername } from "~/shared/lib/telegram/api/telegram-api-server"


const CreateContactModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [step, setStep] = useState(0)

  const [telegramUserValue, setTelegramUserValue] = useState("")
  const [telegramUserInputFocused, setTelegramUserInputFocused] =
    useState(false)
  const [tagsValue, setTagsValue] = useState("")
  const [descriptionValue, setDescriptionValue] = useState("")
  const [topicValue, setTopicValue] = useState("")

  const [telegramUserSearch, setTelegramUserSearch] =
    useState<TelegramUser | null>(null)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)

  const telegramUserInputError = telegramUserValue.length > 0 && !telegramUserSearch && !telegramUser

  useEffect(() => {
    setTelegramUserSearch(null)
    $getTelegramUserByUsername({ data: telegramUserValue }).then(
      (res) => {
        if (res[0]) {
          setTelegramUserSearch(res[0] as TelegramUser)
        }
      }
    )
  }, [telegramUserValue])

  const StepButton = ({stepTitle, toStep} : {stepTitle: string, toStep: number}) => {
    return (
      <div className={`transition-all duration-300 ease-in-out text-xs text-center border-t-2 p-2 relative bottom-[4px] flex-grow ${step === toStep ? 'border-accent text-white' : 'border-transparent text-gray-500'}`} onClick={() => setStep(toStep)}>{stepTitle}</div>
    )
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
        {
          step === 0
          &&
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
            </div>
          )}
        </div>
        }
        
        {
          step === 1
          &&
          <Input
            autoFocus={true}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            placeholder="Description"
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
          />  
        }

        {
          step === 2
          &&
          <Input
            autoFocus={true}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            placeholder="Tags"
            value={tagsValue}
            onChange={(e) => setTagsValue(e.target.value)}
          />
        }
        
        {
          step === 3
          &&
          <Input
            autoFocus={true}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            placeholder="Topic"
            value={topicValue}
            onChange={(e) => setTopicValue(e.target.value)}
          />
        }
        {
          !telegramUser 
          &&
          <Button stretched={true} disabled={true}>Add from my dialogs</Button>
        }
        <div
          style={
            telegramUser ? {overflow: 'visible', height: '100%', paddingTop: 8}
            : {overflow: 'hidden', height: 0}
          }
          className="w-full px-2 transition-all duration-300 ease-in-out">
          <div className={" border-primary border-t-2 flex"}>
            <div className="flex w-full relative top-[2px]">
              <StepButton stepTitle="Username" toStep={0}/>
              <StepButton stepTitle="Description" toStep={1}/>
              <StepButton stepTitle="Tags" toStep={2}/>
              <StepButton stepTitle="Topic" toStep={3}/>
            </div>
          </div>
        </div>
        <div className="pt-2 space-y-2">
          <Button stretched={true} disabled={telegramUserInputError || telegramUserValue.length < 1 || telegramUserSearch !== null}>Create</Button>
        </div>
      </div>
    </Modal>
  )
}



export default CreateContactModal
