'use server'

import { useQuery } from '@tanstack/react-query';
import { $getContactsForUser } from '~/actions';

const telegramId = "123"

const { data } = useQuery({
  queryKey: ["/"],
  queryFn: async () => {
    const contacts = await $getContactsForUser({
      data: {
        telegramId,
      },
    })
    return contacts
  },
})

console.log(data);