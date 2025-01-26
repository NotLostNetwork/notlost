import { Button, Input, TabsList } from "@telegram-apps/telegram-ui"
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem"
import {
  JazzAccount,
  JazzContact,
  JazzListOfTags,
  RootUserProfile,
} from "~/lib/jazz/schema"
import Modal from "~/ui/modals/modal"
import TagIcon from "@/assets/icons/tag.svg?react"
import LinkIcon from "@/assets/icons/link.svg?react"
import { useEffect, useState } from "react"
import Contact from "../-contact"
import { useAccount, useCoState } from "~/lib/jazz/jazz-provider"

const ModifyContactModal = ({
  isOpen,
  closeModal,
  contact,
}: {
  isOpen: boolean
  closeModal: () => void
  contact: JazzContact
}) => {
  const { me } = useAccount()

  const user = useCoState(JazzAccount, me?.id)
  const profile = useCoState(RootUserProfile, user?.profile?.id)

  const [step, setStep] = useState(0)

  const [tags, setTags] = useState<string | null>(null)
  const [topic, setTopic] = useState(contact.topic)

  const resetForm = () => {
    setTags("")
    setTopic("")
    setStep(0)
  }

  useEffect(() => {
    if (isOpen) {
      setTags(contact.tags ? contact.tags.join(" ") : null)
      setTopic(contact.topic)
    } else {
      resetForm()
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Modify contact">
      <Contact
        withActions={false}
        contact={
          {
            username: contact.username!,
            topic: topic,
            firstName: contact.firstName,
            tags: tags ? tags.split(" ").filter((tag) => tag.trim()) : null,
          } as JazzContact
        }
      />

      <div className="mt-4 mb-2">
        {step === 0 && (
          <Input
            autoFocus={isOpen}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            header="Tags(s)"
            placeholder="Skill, job..."
            value={tags || ""}
            onChange={(e) => setTags(e.target.value)}
          />
        )}

        {step === 1 && (
          <Input
            autoFocus={true}
            className=" p-0 text-white bg-gray-800"
            style={{ color: "white" }}
            type="text"
            header="Topic"
            placeholder="Event, place, city..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        )}
      </div>

      <div className="px-2">
        <TabsList>
          <TabsItem onClick={() => setStep(0)} selected={step === 0}>
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 text-center">
                <TagIcon />
              </div>
            </div>
          </TabsItem>
          <TabsItem onClick={() => setStep(1)} selected={step === 1}>
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 text-center">
                <LinkIcon />
              </div>
            </div>
          </TabsItem>
        </TabsList>
      </div>

      <div className="mt-4 space-y-2">
        <Button
          stretched={true}
          onClick={() => {
            if (tags) {
              contact.tags = JazzListOfTags.create(tags.split(" "), {
                owner: profile!._owner,
              })
            }

            if (topic) {
              contact.topic = topic
            }

            resetForm()
            closeModal()
          }}
        >
          Save
        </Button>
        <Button
          stretched={true}
          mode="bezeled"
          onClick={() => {
            resetForm()
            closeModal()
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default ModifyContactModal
