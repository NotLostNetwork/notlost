import { Button, Tappable } from "@telegram-apps/telegram-ui"
import Modal from "~/ui/modals/modal"

const ConfirmModal = ({
  isOpen,
  closeModal,
  action,
  title,
}: {
  isOpen: boolean
  action: () => void
  closeModal: () => void
  title: string
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      cancelable={false}
      title={title}
    >
      <div className="text-center text-xs mt-2">
        You cannot undo this action
      </div>
      <div className="flex items-center gap-2 mt-6">
        <Button stretched={true} mode="bezeled" onClick={closeModal}>
          Cancel
        </Button>
        <Tappable
          className="bg-red w-full rounded-[8px] h-[42px] text-center flex items-center justify-center"
          style={{ background: "#ff4059" }}
          onClick={() => {
            action()
            closeModal()
          }}
        >
          <div className="font-semibold">Remove</div>
        </Tappable>
      </div>
    </Modal>
  )
}

export default ConfirmModal
