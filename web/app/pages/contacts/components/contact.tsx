import { Button } from '@telegram-apps/telegram-ui'
import { memo, useEffect, useState } from 'react'
import TelegramHelper from '~/shared/lib/telegram/api/telegram-helper'
import { AnimatePresence, motion } from 'framer-motion'
import { UserContact } from '~/entities/user/user-contact/interface'

const Contact = ({ node }: { node: UserContact }) => {
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    TelegramHelper.getProfileAvatar(node.username).then((avatarBlobUrl) => {
      setAvatarUrl(avatarBlobUrl)
    })
  }, [node])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
        }}
      >
        <Button mode={'plain'} stretched={true} style={{ padding: 0 }}>
          <div className={`flex px-4 min-h-20 justify-center text-sm relative`}>
            <div className="h-20 flex items-center">
              {avatarUrl ? (
                <img
                  loading="lazy"
                  src={avatarUrl}
                  className="h-14 min-w-14 rounded-full"
                  decoding="async"
                  alt=""
                />
              ) : (
                <div className="h-14 min-w-14 rounded-full animate-pulse bg-skeleton"></div>
              )}
            </div>
            <div className="h-full ml-4 w-full ">
              <div className={'h-full flex items-center w-full py-2'}>
                <div className="w-full py-2">
                  <div className="flex w-full">
                    <div>
                      <div className="font-medium text-left">{node.id}</div>
                      <div className="font-medium text-link text-xs text-left">
                        @{node.username}
                      </div>
                    </div>
                    {node.topic && (
                      <div className="ml-auto text-link rounded-xl text-xs flex font-medium mt-[3px]">
                        <span>{node.topic}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 flex-wrap mt-4">
                    {node.tags &&
                      node.tags.map((tag) => (
                        <span
                          className={`px-2 py-[0.5px]  text-xs text-black font-normal bg-buttonBezeled text-link rounded-xl`}
                          key={tag.title}
                        >
                          {tag.title}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <div className="bg-divider h-[1px] absolute bottom-0 w-full"></div>
            </div>
          </div>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

export default memo(Contact)
