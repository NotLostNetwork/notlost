import { AnimatePresence, motion } from 'framer-motion'
import React, { Suspense } from 'react'
import { Button } from '@telegram-apps/telegram-ui'
import { GraphIcon } from '~/shared/assets/icons/iconsAsComponent/graph-icon'
import TgWallpaper from '~/shared/ui/tg-wallpaper'
import { getCssVariableValue } from '~/shared/lib/utils/funcs/get-css-variable-value'
import lazyWithPreload from 'react-lazy-with-preload'
import { NodeBody } from '../page'



const ContactsGraph = ({
  data,
  toggleGraphMode,
  selectTopic,
}: {
  data: NodeBody[]
  toggleGraphMode: () => void
  selectTopic: (topic: string) => void
}) => {
  const LazyForceGraph = lazyWithPreload(
    () => import('~/shared/ui/force-graph')
  )
  LazyForceGraph.preload()

  return (
    <div className='-mt-8 pt-4 h-screen'>
      <div className="h-screen absolute">
        <TgWallpaper opacity={0.3}/>
      </div>
      <div>
        <AnimatePresence>
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{opacity: 0, scale: 0.9}}
            transition={{
              type: 'spring',
              damping: 50,
              stiffness: 500,
              delay: 0.1,
            }}
          >
            <Suspense>
              <LazyForceGraph
                nodes={data}
                selectTopic={(topic) => selectTopic(topic)}
              />
            </Suspense>
          </motion.div>
        </AnimatePresence>
        <div className="fixed bottom-20 left-6">
          <Button
            size={'s'}
            mode={'outline'}
            className={'rounded-full'}
            style={{borderRadius: '50% !important'}}
            onClick={toggleGraphMode}
          >
            <div className="h-6 w-6">
              <GraphIcon color={getCssVariableValue('--tg-theme-button-color')}/>
            </div>
          </Button>
        </div>
      </div>

    </div>
  )
}

export default ContactsGraph
