import { AnimatePresence, motion } from 'framer-motion'

import utyaLoading from '~/shared/assets/utya-loading.gif'

import { Button } from '@telegram-apps/telegram-ui'
import { GraphIcon } from '~/shared/assets/icons/iconsAsComponent/graph-icon'
import React from 'react'

import TgWallpaper from '~/shared/ui/tg-wallpaper'
import Contact from './contact'
import { Pencil } from './pencil'
import { NodeBody } from '../page'


const ContactsList = ({
  filtersBlockHeight,
  data,
  toggleGraphMode,
}: {
  filtersBlockHeight: number
  data: NodeBody[]
  toggleGraphMode: () => void
}) => {
  let animationDelay = -0.05
  return (
    <div>
      <div className="h-screen absolute">
        <TgWallpaper opacity={0.1} withAccent={true} />
      </div>
      {filtersBlockHeight > 0 &&
        data.map((node) => {
          if (node.type === 'topic') return
          animationDelay += 0.05
          return (
            <AnimatePresence key={node.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  damping: 50,
                  stiffness: 500,
                  delay: animationDelay,
                }}
              >
                <Contact node={node} />
              </motion.div>
            </AnimatePresence>
          )
        })}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center pr-4 pl-4 absolute h-screen top-0 -mt-16">
          <img
            src={utyaLoading}
            alt={'Utya sticker'}
            height={150}
            width={150}
          />
          <div className="mt-2 text-2xl font-medium">Nobody found</div>
          <div className="text-center mt-2 opacity-60">
            It's seems you don't have that person in your network.
          </div>
        </div>
      )}

      <Pencil />
      <div className="fixed bottom-20 left-6">
        <Button
          size={'s'}
          className={'rounded-full'}
          style={{ borderRadius: '50% !important' }}
          onClick={toggleGraphMode}
        >
          <div className="h-6 w-6">
            <GraphIcon color={'#fff'} />
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ContactsList
