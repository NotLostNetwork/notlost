export interface UserContact {
  id: string
  group: number
  username: string
  description?: string
  tags?: {
    title: string
  }[]
  topic?: string
  type?: string
  createdAt: Date
}