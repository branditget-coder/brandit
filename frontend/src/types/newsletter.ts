export interface SubscriberItem {
  id: number
  email: string
  active: boolean
  subscribedAt: string
}

export interface BroadcastResult {
  totalSubscribers: number
  sentCount: number
  statusMessage: string
  dispatchedAt: string
}

export interface WeeklyEdition {
  id: string
  title: string
  subject: string
  badge: string
  imageUrl: string
  imageAlt?: string
  summary: string
  contentHtml: string
  weekNumber?: number
}
