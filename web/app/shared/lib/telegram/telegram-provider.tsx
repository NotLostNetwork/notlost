import React, { PropsWithChildren, useEffect } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import '@telegram-apps/telegram-ui/dist/styles.css'

import '@telegram-apps/telegram-ui/dist/styles.css'

// Mock the environment in case, we are outside Telegram.
import './miniAppEnv/mock-env'
import {
  initData,
  postEvent,
  retrieveLaunchParams,
} from '@telegram-apps/sdk-react'
import { init } from './miniAppEnv/init'

function TelegramProvider({ children }: PropsWithChildren) {
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)
  useEffect(() => {
    try {
      if (initData) {
        postEvent('web_app_request_fullscreen')
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
