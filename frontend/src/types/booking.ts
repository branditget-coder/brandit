export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface Booking {
  id: number
  userId: number
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName: string
  bookingDate: string
  bookingTime: string
  amount: number
  price?: string
  status: BookingStatus
  paymentMethod?: string
  paymentId?: string
  paymentScreenshot?: string
  notes?: string
  meetingLink?: string
  distributed?: boolean
  createdAt: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface CreateBookingPayload {
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceName: string
  bookingDate: string
  bookingTime: string
  notes?: string
  amount?: number
  price?: string
  paymentMethod?: string
  paymentId?: string
  paymentScreenshot?: string
}
