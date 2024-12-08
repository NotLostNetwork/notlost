import Modal from '~/shared/ui/modal'
import { useState } from 'react'
import { Button, Input } from '@telegram-apps/telegram-ui'
import searchIcon from '~/shared/assets/icons/search.svg'

export const FilterBySearch = ({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <Input
      className='bg-divider p-0 text-white'
      style={{color: 'white'}}
      type="text"
      placeholder='Search'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      after={<img className="h-6 w-6" src={searchIcon} alt="" />}
    />
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
  placeholder: string
  modalTitle: string
}) => {
  const [open, setOpen] = useState(false)
  const [buttonText, setButtonText] = useState(placeholder)
  const [buttonMode, setButtonMode] = useState('outline')

  const handleSet = (item: string) => {
    setSelected(item)
    setButtonText(item)
    setButtonMode('filled')
    setOpen(false)
  }

  const handleReset = () => {
    setSelected(null)
    setButtonText(placeholder)
    setOpen(false)
    setButtonMode('outline')
  }

  items = items.filter((item) => item)

  return (
    <div>
      <Button
        mode={buttonMode as 'outline'}
        onClick={() => setOpen(true)}
        className={'text-xs'}
      >
        {buttonText}
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={modalTitle}>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {items.map((item) => (
            <div style={{ marginTop: 'unset' }} key={item}>
              <Button
                mode={item === selected ? 'filled' : 'bezeled'}
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
      </Modal>
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
      <Button mode={enabled ? 'filled' : 'outline'} onClick={handleToggle}>
        Filter by latest
      </Button>
    </div>
  )
}
