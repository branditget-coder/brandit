export type InvoiceStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Invoice {
  id: number
  userId: number
  bookingId?: number
  invoiceNumber: string
  amount: number
  status: InvoiceStatus
  paymentMethod?: string
  paymentId?: string
  serviceName?: string
  issueDate: string
  createdAt?: string
}
