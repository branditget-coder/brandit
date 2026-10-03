export interface AdminStats {
  totalUsers: number
  totalBookings: number
  confirmedBookings: number
  totalRevenue: number
  activeSubscribers: number
}

export interface UserActivityLog {
  id: number
  userEmail?: string
  userName?: string
  action: string
  metadataJson?: string
  createdAt: string
}
