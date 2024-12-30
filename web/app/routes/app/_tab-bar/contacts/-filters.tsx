import BottomModal from "~/ui/modals/bottom-modal"
import { useState } from "react"
import { Button, Input } from "@telegram-apps/telegram-ui"
import searchIcon from "~/assets/icons/search.svg"
import calendarIcon from "@/assets/icons/calendar.svg"

export const FilterBySearch = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <div className="pt-5 pb-4">
      <Input
        className="text-white"
        style={{ color: "white" }}
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        after={<img className="h-6 w-6" src={searchIcon} alt="" />}
      />
    </div>
  )
}

export const SingleSelectFilter = ({
  items,
  setSelected,
  selected,
  placeholder,
  modalTitle,
}: {
  items: string[]
  setSelected: (tag: string | null) => void
  selected: string | null
  placeholder: React.ReactElement
  modalTitle: string
}) => {
  const [open, setOpen] = useState(false)
  const [buttonText, setButtonText] = useState(<div>{placeholder}</div>)
  const [buttonMode, setButtonMode] = useState("outline")

  const handleSet = (item: string) => {
    setSelected(item)
    setButtonText(<div>{item}</div>)
    setButtonMode("filled")
    setOpen(false)
  }

  const handleReset = () => {
    setSelected(null)
    setButtonText(<div>{placeholder}</div>)
    setOpen(false)
    setButtonMode("outline")
  }

  items = items.filter((item) => item)

  return (
    <div>
      <Button
        mode={buttonMode as "outline"}
        onClick={() => setOpen(true)}
        className={"text-xs"}
      >
        {buttonText}
      </Button>
      <BottomModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={modalTitle}
      >
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {items.map((item) => (
            <div style={{ marginTop: "unset" }} key={item}>
              <Button
                mode={item === selected ? "filled" : "bezeled"}
                onClick={() => {
                  handleSet(item)
                }}
              >
                {item}
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={handleReset} stretched={true}>
          Reset
        </Button>
      </BottomModal>
    </div>
  )
}

export const FilterByLatest = ({
  enable,
  disable,
}: {
  enable: () => void
  disable: () => void
}) => {
  const [enabled, setEnabled] = useState(false)

  const handleToggle = () => {
    if (enabled) {
      disable()
      setEnabled(false)
    } else {
      enable()
      setEnabled(true)
    }
  }

  return (
    <div>
      <Button mode={enabled ? "filled" : "outline"} onClick={handleToggle}>
        <div className="flex w-full justify-between gap-2 items-center">
          <div className="w-6 h-6">
            <img src={calendarIcon} />
          </div>
          Date
        </div>
      </Button>
    </div>
  )
}
