import React, { PropsWithChildren } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import '@telegram-apps/telegram-ui/dist/styles.css'
import { init } from './init';

import '@telegram-apps/telegram-ui/dist/styles.css';

// Mock the environment in case, we are outside Telegram.
import './mock-env.ts';
import { retrieveLaunchParams } from "@telegram-apps/sdk-react"

function TelegramProvider({ children }: PropsWithChildren) {
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);
  return (
    <AppRoot appearance={'dark'} platform={'base'}>
      {children}
    </AppRoot>
  )
}

export default TelegramProvider
