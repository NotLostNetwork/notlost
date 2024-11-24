'use server'

import { useQuery } from '@tanstack/react-query'
import { getContactsForUserApi } from '~/routes/_layout/contacts/-$api'

const telegramId = '123'

const { data } = useQuery({
  queryKey: ['/'],
  queryFn: async () => {
    const contacts = await getContactsForUserApi({
      data: {
        telegramId,
      },
    })
    return contacts
  },
})

console.log(data)
