import { Button, Input } from '@telegram-apps/telegram-ui'
import { useEffect, useState } from 'react'
import { $getTelegramUser } from '~/actions/telegram'
import Modal from '~/shared/ui/modals/modal'
import Contact from './contact'
import { User as TelegramUser } from '@telegram-apps/sdk-react'
import qrIcon from '@/shared/assets/icons/qr-code.svg'

const CreateContactModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [telegramUserValue, setTelegramValue] = useState('')
  const [tagsValue, setTagsValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [topicValue, setTopicValue] = useState('')

  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [showTelegramUserResult, setShowTelegramUserResult] = useState(false)

  useEffect(() => {
    setTelegramUser(null)
    $getTelegramUser({ data: telegramUserValue.replace(/@/g, '') }).then(
      (res) => {
        if (res[0]) {
          setTelegramUser(res[0] as TelegramUser)
        }
      }
    )
  }, [telegramUserValue])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'New contact'}>
      <div className="space-y-2">
        <div
          className={`transition-all duration-500 ease-in-out mb-6 overflow-hidden -ml-4 -mr-4 ${
            telegramUser ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {telegramUser && (
            <Contact
              node={{
                username: telegramUser.username!,
                id: telegramUser.firstName,
                group: 1,
                tags: tagsValue
                  .split(' ')
                  .filter((tag) => tag.trim())
                  .map((tag) => ({ title: tag })),
                topic: topicValue,
                createdAt: new Date(),
              }}
            />
          )}
        </div>

        <Input
          onFocus={() => setShowTelegramUserResult(true)}
          onBlur={() => setShowTelegramUserResult(false)}
          className=" p-0 text-white bg-gray-800"
          style={{ color: 'white' }}
          type="text"
          header="Telegram username"
          placeholder="@durov"
          value={telegramUserValue}
          onChange={(e) => setTelegramValue(e.target.value)}
        />

        {!telegramUser && (
          <div>
            <div className="flex gap-2">
              <Button mode={'gray'} disabled={true} stretched={true}>
                Add from my contacts
              </Button>
              <Button width={'3px'} className="w-12 relative">
                <img
                  src={qrIcon}
                  className="h-10 w-[36px] absolute top-[1px] left-1"
                  alt=""
                />
              </Button>
            </div>
          </div>
        )}

        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: 'white' }}
          type="text"
          header="Description"
          placeholder="CEO of Telegram"
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.target.value)}
        />
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: 'white' }}
          type="text"
          header="Tag(s)"
          placeholder="ceo telegram sport"
          value={tagsValue}
          onChange={(e) => setTagsValue(e.target.value)}
        />
        <Input
          className=" p-0 text-white mt-6 bg-gray-800"
          style={{ color: 'white' }}
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
