import React, { PropsWithChildren, useEffect } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import '@telegram-apps/telegram-ui/dist/styles.css'
import { init } from './init'

import '@telegram-apps/telegram-ui/dist/styles.css'
import '@/styles/app.css'

// Mock the environment in case, we are outside Telegram.
import './mock-env'
import {
  initData,
  postEvent,
  retrieveLaunchParams,
} from '@telegram-apps/sdk-react'

function TelegramProvider({ children }: PropsWithChildren) {
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)
  useEffect(() => {
    try {
      if (initData) {
        postEvent('web_app_expand')
        postEvent('web_app_setup_swipe_behavior', {
          allow_vertical_swipe: false,
        })
      }
    } catch (e) {
      console.log('The app runs outside of the telegram')
    }
  }, [])
  return (
    <AppRoot appearance={'dark'} platform={'base'}>
      {children}
    </AppRoot>
  )
}

export default TelegramProvider
