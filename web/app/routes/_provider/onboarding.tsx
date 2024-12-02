'use client'

import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import utyaCool from '~/shared/assets/utya-cool.gif'
import { Button } from '@telegram-apps/telegram-ui'
import { useMutation } from '@tanstack/react-query'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import TWallpaper from '@twallpaper/react'
import { createUserApi } from '~/entities/user/api'

function Onboarding() {
  const navigate = useNavigate()

  const lp = useLaunchParams()
  const telegramId = lp.initData!.user!.id.toString()

  const { mutate: mutateCreateUser, isError } = useMutation({
    mutationKey: ['/'],
    mutationFn: async () => {
      const user = await createUserApi({
        data: {
          telegramId,
        },
      })

      navigate({ to: '/contacts' })

      return user
    },
  })

  const handleOnClick = () => {
    mutateCreateUser()
  }

  return (
    <div className="h-screen p-4 relative flex flex-col">
      <div className="h-screen absolute">
        <TWallpaper
          options={{
            fps: 120,
            tails: 90,
            animate: true,
            scrollAnimate: true,
            colors: ['#2F2F2F', '#5288c1', '#2F2F2F', '#5288c1'],
            pattern: {
              image: 'https://twallpaper.js.org/patterns/paris.svg',
              background: '#212121',
              blur: 0,
              size: '420px',
              opacity: 0.5,
              mask: true,
            },
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <img src={utyaCool} alt={'Utya sticker'} height={180} width={180} />
        <div className="text-3xl mt-4 text-center">
          Make your contacts NOTLOST
        </div>
        <div className="text-primary text-center mt-4">
          Let's get started to enhance your networking experience through
          telegram
        </div>
      </div>
      <Button className="mt-auto" onClick={handleOnClick}>
        Continue
      </Button>
    </div>
  )
}

export const Route = createFileRoute('/_provider/onboarding')({
  component: Onboarding,
  staleTime: Infinity,
})
