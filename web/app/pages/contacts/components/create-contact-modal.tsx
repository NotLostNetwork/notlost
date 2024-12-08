import { Button, Input } from "@telegram-apps/telegram-ui"
import { useEffect, useState } from "react"
import { $getTelegramUser } from "~/actions/telegram"
import Modal from "~/shared/ui/modals/modal"
import Contact from "./contact"

const CreateContactModal = ({isOpen, onClose} : {isOpen: boolean, onClose: () => void}) => {
  const [telegramUserValue, setTelegramValue] = useState('')
  const [telegramUser, setTelegramUser] = useState(null)
  const [showTelegramUserResult, setShowTelegramUserResult] = useState(false)

  const [descriptionValue, setDescriptionValue] = useState('')

  useEffect(() => {
    setTelegramUser(null)
    $getTelegramUser({data: telegramUserValue.replace(/@/g, "")}).then(res => {
      
      
      //@ts-ignore
      if (res[0]) {
        //@ts-ignore
        setTelegramUser(res[0])
      }
    })
  }, [telegramUserValue])

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={'New contact'}
      >
        <div className='space-y-2'>
          <div className="relative">
            <Input
            onFocus={() => setShowTelegramUserResult(true)}
            onBlur={() => setShowTelegramUserResult(false)}
              className=" p-0 text-white bg-gray-800"
              style={{ color: 'white' }}
              type="text"
              header='Telegram username'
              placeholder="@durov"
              value={telegramUserValue}
              onChange={(e) => setTelegramValue(e.target.value)}
            />
          </div>
          <div className={`transition-300 ease transition-all ${telegramUser ? 'h-[84px]' : 'h-6'}`}>
          {
                telegramUser ?
                <Contact node={{
                  //@ts-ignore
                  username: telegramUser.username,
                  //@ts-ignore
                  id: telegramUser.firstName,
                  group: 1,
                  createdAt: new Date()
                }}/>
                :
                <div className="flex items-center justify-center">No user found</div>
              }
          </div>
          
          <Input
            className=" p-0 text-white mt-6 bg-gray-800"
            style={{ color: 'white'}}
            type="text"
            header='Description'
            placeholder="CEO of Telegram"
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
          />
          <div className="pt-8 space-y-2">
            <Button stretched={true}>Create</Button>
          
          </div>
        </div>
      </Modal>
  )
}

export default CreateContactModal
