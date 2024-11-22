'use client';

import * as React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import utyaCool from '@/assets/utya-cool.gif';
import { Button } from '@telegram-apps/telegram-ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { $createUser, $getUser } from '~/actions';
import { useLaunchParams } from "@telegram-apps/sdk-react"

function Onboarding() {
  const navigate = useNavigate();

  const lp = useLaunchParams()
  const telegramId = lp.initData!.user!.id.toString()

  const {mutate: createUser, isError} = useMutation({
    mutationKey: ["/"],
    mutationFn: async () => {
      const user = await $createUser({
        data: {
          telegramId,
        },
      })

      navigate({to: '/contacts-list'})

      return user
    },
  })

  const handleOnClick = () => {
    createUser()
  }

  return (
    <div className="h-screen p-4 relative flex flex-col">
      <div className="flex flex-col items-center justify-center flex-1">
        <img src={utyaCool} alt={'Utya sticker'} height={180} width={180} />
        <div className="text-3xl mt-4 mb-4">Make your contacts NotLost</div>
        <div className="text-primary text-center mt-4">
          Let's get started to enhance your networking experience through
          telegram
        </div>
      </div>
      <Button className="mt-auto" onClick={handleOnClick}>
        Continue
      </Button>
    </div>
  );
}

export const Route = createFileRoute('/onboarding')({
  component: Onboarding,
  staleTime: Infinity,
});
